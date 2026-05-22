import { Router, Response } from "express";
import { db } from "../db";
import { Appointment, ServiceJob, Vehicle, InventoryItem, Supplier, Timesheet, Invoice, UserRole, JobStatus, JobCardPart, JobCardLabor, DamagePhoto } from "../../src/types";
import { verifyToken, CustomRequest, isMechanic, isReceptionist, isAccountant } from "../middlewares/auth";

const router = Router();

// ==========================================
// VEHICLES ROUTES
// ==========================================
router.get("/vehicles", verifyToken, (req: CustomRequest, res: Response) => {
  const allVehicles = db.getVehicles();
  if (req.userRole === UserRole.CLIENT) {
    // Only return client's own vehicles
    const clientVehicles = allVehicles.filter(v => v.clientId === req.userId);
    res.json(clientVehicles);
  } else {
    res.json(allVehicles);
  }
});

router.post("/vehicles", verifyToken, (req: CustomRequest, res: Response): void => {
  const { brand, model, licensePlate, vin, year, engine, mileage, clientId } = req.body;

  if (!brand || !licensePlate || !vin) {
    res.status(400).json({ error: "Sunt necesare marca, numărul de înmatriculare și seria de șasiu." });
    return;
  }

  const assignedClientId = req.userRole === UserRole.CLIENT ? req.userId! : (clientId || req.userId!);
  const newVeh: Vehicle = {
    id: `v-${Date.now().toString().slice(-4)}`,
    clientId: assignedClientId,
    brand,
    model: model || "",
    licensePlate: licensePlate.toUpperCase(),
    vin: vin.toUpperCase(),
    year: Number(year) || new Date().getFullYear(),
    engine: engine || "",
    mileage: Number(mileage) || 0
  };

  const vehicles = db.getVehicles();
  db.setVehicles([...vehicles, newVeh]);

  res.status(201).json({
    message: "Vehicul salvat cu succes în mun. Ungheni!",
    vehicle: newVeh
  });
});

// ==========================================
// SERVICE TYPES ROUTES
// ==========================================
router.get("/service-types", (req, res) => {
  res.json(db.getServiceTypes());
});

// ==========================================
// APPOINTMENTS ROUTES
// ==========================================
router.get("/appointments", verifyToken, (req: CustomRequest, res: Response) => {
  const allAppointments = db.getAppointments();
  if (req.userRole === UserRole.CLIENT) {
    const clientAppointments = allAppointments.filter(ap => ap.clientId === req.userId);
    res.json(clientAppointments);
  } else {
    res.json(allAppointments);
  }
});

router.post("/appointments", verifyToken, (req: CustomRequest, res: Response): void => {
  const { vehicleId, serviceTypeIds, date, time, notes } = req.body;

  if (!vehicleId || !serviceTypeIds || !Array.isArray(serviceTypeIds) || serviceTypeIds.length === 0 || !date || !time) {
    res.status(400).json({ error: "Sunt necesare vehiculul, serviciile (minim unul), data și ora." });
    return;
  }

  // Resolve clientId
  let clientId = req.userId!;
  if (req.userRole !== UserRole.CLIENT) {
    if (req.body.clientId) {
      clientId = req.body.clientId;
    } else {
      const vehicles = db.getVehicles();
      const veh = vehicles.find(v => v.id === vehicleId);
      if (veh) {
        clientId = veh.clientId;
      }
    }
  }

  const newAp: Appointment = {
    id: `ap-${Date.now().toString().slice(-4)}`,
    clientId,
    vehicleId,
    serviceTypeIds,
    date,
    time,
    notes: notes || "",
    status: req.userRole !== UserRole.CLIENT ? "Confirmed" : "Pending", // staff creations are immediately confirmed
    createdAt: new Date().toISOString()
  };

  const appointments = db.getAppointments();
  db.setAppointments([newAp, ...appointments]);

  // AUTO-GENERATE Corresponding SERVICE JOB
  const matchingService = db.getServiceTypes().find(s => s.id === serviceTypeIds[0]);
  const newJob: ServiceJob = {
    id: `job-${Date.now().toString().slice(-4)}`,
    appointmentId: newAp.id,
    vehicleId,
    clientId,
    status: JobStatus.SCHEDULED,
    receptionNotes: req.userRole !== UserRole.CLIENT ? "Creată direct de recepție." : "Programare planificată online prin portalul client.",
    reportedFaults: notes || `Remediere: ${matchingService?.name || "Verificare generală"}`,
    parts: [],
    labor: [],
    damages: [],
    entryDate: date,
    estimatedFinishDate: date
  };

  const serviceJobs = db.getServiceJobs();
  db.setServiceJobs([newJob, ...serviceJobs]);

  res.status(201).json({
    message: "Programarea a fost salvată, iar fișa de service a fost deschisă în regim de test!",
    appointment: newAp,
    job: newJob
  });
});

// Update Appointment Status (e.g. Confirm or Cancel)
router.put("/appointments/:id/status", verifyToken, (req: CustomRequest, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["Pending", "Confirmed", "Canceled"].includes(status)) {
    res.status(400).json({ error: "Starea programării este nevalidă (admise: Pending, Confirmed, Canceled)." });
    return;
  }

  const appointments = db.getAppointments();
  const apIdx = appointments.findIndex(ap => ap.id === id);

  if (apIdx === -1) {
    res.status(404).json({ error: "Programarea nu a fost găsită." });
    return;
  }

  const appointment = appointments[apIdx];

  // RBAC validation:
  if (req.userRole === UserRole.CLIENT) {
    if (appointment.clientId !== req.userId) {
      res.status(433).json({ error: "Acces nepermis. Această programare nu vă aparține." });
      return;
    }
    if (status !== "Canceled") {
      res.status(400).json({ error: "Clienții pot doar să anuleze programarea din contul lor." });
      return;
    }
  } else {
    // Only Receptionist and Admin can confirm/manage others
    if (req.userRole !== UserRole.RECEPTION && req.userRole !== UserRole.ADMIN) {
      res.status(433).json({ error: "Doar recepția sau administratorul pot confirma sau schimba starea programărilor." });
      return;
    }
  }

  appointments[apIdx] = {
    ...appointment,
    status: status as "Pending" | "Confirmed" | "Canceled"
  };

  db.setAppointments(appointments);

  res.json({
    message: `Starea programării ${id.toUpperCase()} a fost actualizată în '${status}'.`,
    appointment: appointments[apIdx]
  });
});

// ==========================================
// SERVICE JOBS (JOB CARDS) ROUTES
// ==========================================
router.get("/service-jobs", verifyToken, (req: CustomRequest, res: Response) => {
  const allJobs = db.getServiceJobs();
  if (req.userRole === UserRole.CLIENT) {
    const clientJobs = allJobs.filter(j => j.clientId === req.userId);
    res.json(clientJobs);
  } else {
    res.json(allJobs);
  }
});

// Create brand-new Service Job when mechanic or receptionist registers a vehicle entering the shop
router.post("/service-jobs", verifyToken, (req: CustomRequest, res: Response): void => {
  if (req.userRole !== UserRole.RECEPTION && req.userRole !== UserRole.ADMIN) {
    res.status(433).json({ error: "Doar recepția sau administratorul pot deschide fișe noi la intrarea mașinii în service." });
    return;
  }

  const { vehicleId, clientId, allocatedMechanicId, reportedFaults, receptionNotes, entryDate, estimatedFinishDate } = req.body;

  if (!vehicleId || !reportedFaults) {
    res.status(400).json({ error: "Sunt necesare ID-ul vehiculului și simptomele de defecțiune." });
    return;
  }

  // Find vehicle
  const vehicles = db.getVehicles();
  const veh = vehicles.find(v => v.id === vehicleId);

  if (!veh) {
    res.status(404).json({ error: `Vehiculul cu codul ${vehicleId} nu există.` });
    return;
  }

  // Use provided clientId or resolve directly from vehicle relations
  const finalClientId = clientId || veh.clientId;

  const newJob: ServiceJob = {
    id: `job-${Date.now().toString().slice(-4)}`,
    vehicleId,
    clientId: finalClientId,
    allocatedMechanicId: allocatedMechanicId || undefined,
    status: JobStatus.IN_RECEPTION,
    receptionNotes: receptionNotes || "Preluată din recepție fizică în Ungheni.",
    reportedFaults,
    parts: [],
    labor: [],
    damages: [],
    entryDate: entryDate || new Date().toISOString().split("T")[0],
    estimatedFinishDate: estimatedFinishDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  };

  const serviceJobs = db.getServiceJobs();
  db.setServiceJobs([newJob, ...serviceJobs]);

  res.status(201).json({
    message: "Fișa de service a fost deschisă cu succes la sosirea mașinii în atelier!",
    job: newJob
  });
});

// Update Service Job State (accessible to both Mechanic and Receptionists/Admins!)
router.put("/service-jobs/:id/status", verifyToken, (req: CustomRequest, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;

  if (req.userRole === UserRole.CLIENT) {
    res.status(433).json({ error: "Clienții nu pot modifica starea fișelor de service." });
    return;
  }

  if (!status || !Object.values(JobStatus).includes(status as JobStatus)) {
    res.status(400).json({ error: `Starea trimisă este nevalidă. Valori posibile: ${Object.values(JobStatus).join(", ")}` });
    return;
  }

  const serviceJobs = db.getServiceJobs();
  const jobIdx = serviceJobs.findIndex(j => j.id === id);

  if (jobIdx === -1) {
    res.status(404).json({ error: "Fișa de service nu a fost găsită." });
    return;
  }

  let realFinishDate = serviceJobs[jobIdx].realFinishDate;
  if (status === JobStatus.READY_FOR_DELIVERY || status === JobStatus.FINISHED) {
    realFinishDate = new Date().toISOString().split("T")[0];
  }

  serviceJobs[jobIdx] = {
    ...serviceJobs[jobIdx],
    status: status as JobStatus,
    realFinishDate
  };

  db.setServiceJobs(serviceJobs);

  res.json({
    message: `Starea fișei ${id.toUpperCase()} a fost actualizată în '${status}'. Aceasta se va reflecta în timp real în portalul clientului.`,
    job: serviceJobs[jobIdx]
  });
});

// Add Part to Job Card
router.post("/service-jobs/:id/parts", verifyToken, isMechanic, (req, res): void => {
  const { id } = req.params;
  const { partId, quantity } = req.body;

  if (!partId || !quantity || quantity <= 0) {
    res.status(400).json({ error: "PartId și cantitatea pozitivă sunt necesare." });
    return;
  }

  const items = db.getInventoryItems();
  const dbPart = items.find(item => item.id === partId);

  if (!dbPart) {
    res.status(404).json({ error: "Piesa nu a fost găsită în depozit." });
    return;
  }

  if (dbPart.currentStock < quantity) {
    res.status(400).json({ error: `Stoc insuficient pentru ${dbPart.name}. Stoc disponibil: ${dbPart.currentStock}` });
    return;
  }

  const serviceJobs = db.getServiceJobs();
  const jobIdx = serviceJobs.findIndex(j => j.id === id);

  if (jobIdx === -1) {
    res.status(404).json({ error: "Fișa de service nu a fost găsită." });
    return;
  }

  const newPart: JobCardPart = {
    id: `jp-${Date.now().toString().slice(-4)}`,
    partId,
    name: dbPart.name,
    oemCode: dbPart.oemCode,
    quantity,
    sellPrice: dbPart.sellPrice
  };

  // Update job parts
  serviceJobs[jobIdx].parts.push(newPart);
  db.setServiceJobs(serviceJobs);

  // Decrement current stock
  const updatedItems = items.map(item => {
    if (item.id === partId) {
      return { ...item, currentStock: Math.max(item.currentStock - quantity, 0) };
    }
    return item;
  });
  db.setInventoryItems(updatedItems);

  res.status(201).json({
    message: `Piesa '${newPart.name}' a fost adăugată pe fişă, iar stocul a fost actualizat.`,
    part: newPart,
    criticalStockAlert: dbPart.currentStock - quantity <= dbPart.minStockLevel
  });
});

// Add Labor Row to Job Card
router.post("/service-jobs/:id/labor", verifyToken, isMechanic, (req, res): void => {
  const { id } = req.params;
  const { description, hoursSpent, hourlyRate, commissionRate, mechanicId } = req.body;

  if (!description || !hoursSpent || !hourlyRate || !commissionRate || !mechanicId) {
    res.status(400).json({ error: "Toate specificațiile manoperei (descriere, ore, tarif, comision, mecanic) sunt necesare." });
    return;
  }

  const serviceJobs = db.getServiceJobs();
  const jobIdx = serviceJobs.findIndex(j => j.id === id);

  if (jobIdx === -1) {
    res.status(404).json({ error: "Fișa de service nu a fost găsită." });
    return;
  }

  const newLabor: JobCardLabor = {
    id: `jl-${Date.now().toString().slice(-4)}`,
    mechanicId,
    description,
    hoursSpent: Number(hoursSpent),
    hourlyRate: Number(hourlyRate),
    commissionRate: Number(commissionRate)
  };

  serviceJobs[jobIdx].labor.push(newLabor);
  db.setServiceJobs(serviceJobs);

  // Auto-generate Timesheet Log
  const commAmount = (newLabor.hoursSpent * newLabor.hourlyRate * newLabor.commissionRate) / 100;
  const newTs: Timesheet = {
    id: `ts-${Date.now()}`,
    employeeId: mechanicId,
    jobId: id,
    date: new Date().toISOString().split("T")[0],
    hoursWorked: newLabor.hoursSpent,
    notes: `Manoperă fișă ${id.toUpperCase()}: ${newLabor.description}`,
    basePay: 0,
    commissionEarned: commAmount
  };

  const timesheets = db.getTimesheets();
  db.setTimesheets([newTs, ...timesheets]);

  res.status(201).json({
    message: "Manopera pontată cu succes și comisionul de mecanic a fost înregistrat!",
    labor: newLabor,
    timesheet: newTs
  });
});

// Add Damage Photo to Job Card
router.post("/service-jobs/:id/damages", verifyToken, isReceptionist, (req, res): void => {
  const { id } = req.params;
  const { url, description } = req.body;

  if (!url || !description) {
    res.status(400).json({ error: "Sunt necesare link-ul pozei și descrierea vizuală." });
    return;
  }

  const serviceJobs = db.getServiceJobs();
  const jobIdx = serviceJobs.findIndex(j => j.id === id);

  if (jobIdx === -1) {
    res.status(404).json({ error: "Fișa de service nu a fost găsită." });
    return;
  }

  const newPhoto: DamagePhoto = {
    id: `dmg-${Date.now().toString().slice(-4)}`,
    jobId: id,
    url,
    description,
    dateAdded: new Date().toISOString().split("T")[0]
  };

  serviceJobs[jobIdx].damages.push(newPhoto);
  db.setServiceJobs(serviceJobs);

  res.status(201).json({
    message: "Poza dovezii a fost salvată pe fișă pentru siguranța ecranelor.",
    photo: newPhoto
  });
});

// ==========================================
// INVENTORY ROUTES
// ==========================================
router.get("/inventory", verifyToken, (req, res) => {
  res.json(db.getInventoryItems());
});

// GET low-stock pieces that cross min level rules
router.get("/inventory/low-stock", verifyToken, (req, res) => {
  const allItems = db.getInventoryItems();
  const lowStockItems = allItems.filter(item => item.currentStock <= item.minStockLevel);
  res.json(lowStockItems);
});

router.post("/inventory", verifyToken, isReceptionist, (req, res): void => {
  const { oemCode, aftermarketCode, name, brand, purchasePrice, sellPrice, currentStock, minStockLevel, supplierId } = req.body;

  if (!oemCode || !name || !brand || !purchasePrice || !sellPrice || !supplierId) {
    res.status(400).json({ error: "Specificațiile de bază (Cod OEM, Nume, Brand, Preț de achiziție, Preț de vânzare, Furnizor) sunt necesare." });
    return;
  }

  const newItem: InventoryItem = {
    id: `i-${Date.now().toString().slice(-4)}`,
    oemCode,
    aftermarketCode: aftermarketCode || "",
    name,
    brand,
    purchasePrice: Number(purchasePrice),
    sellPrice: Number(sellPrice),
    currentStock: Number(currentStock) || 0,
    minStockLevel: Number(minStockLevel) || 1,
    supplierId
  };

  const inventory = db.getInventoryItems();
  db.setInventoryItems([newItem, ...inventory]);

  const isLowStock = newItem.currentStock <= newItem.minStockLevel;

  res.status(201).json({
    message: "Piesă nouă salvată cu succes în depozitul din mun. Ungheni!",
    item: newItem,
    criticalStockAlert: isLowStock,
    warningMessage: isLowStock ? `Stocul inițial pentru ${newItem.name} este sub pragul minim (${newItem.minStockLevel})!` : undefined
  });
});

// PUT Inventory (Edit part details or manually adjust stock level)
router.put("/inventory/:id", verifyToken, (req: CustomRequest, res: Response): void => {
  if (req.userRole === UserRole.CLIENT) {
    res.status(433).json({ error: "Nu aveți permisiunea de a modifica piese." });
    return;
  }

  const { id } = req.params;
  const { oemCode, aftermarketCode, name, brand, purchasePrice, sellPrice, currentStock, minStockLevel, supplierId } = req.body;

  const items = db.getInventoryItems();
  const idx = items.findIndex(item => item.id === id);

  if (idx === -1) {
    res.status(404).json({ error: "Piesa nu a fost găsită în depozit." });
    return;
  }

  const currentItem = items[idx];
  const updatedItem: InventoryItem = {
    ...currentItem,
    oemCode: oemCode !== undefined ? oemCode : currentItem.oemCode,
    aftermarketCode: aftermarketCode !== undefined ? aftermarketCode : currentItem.aftermarketCode,
    name: name !== undefined ? name : currentItem.name,
    brand: brand !== undefined ? brand : currentItem.brand,
    purchasePrice: purchasePrice !== undefined ? Number(purchasePrice) : currentItem.purchasePrice,
    sellPrice: sellPrice !== undefined ? Number(sellPrice) : currentItem.sellPrice,
    currentStock: currentStock !== undefined ? Number(currentStock) : currentItem.currentStock,
    minStockLevel: minStockLevel !== undefined ? Number(minStockLevel) : currentItem.minStockLevel,
    supplierId: supplierId !== undefined ? supplierId : currentItem.supplierId,
  };

  items[idx] = updatedItem;
  db.setInventoryItems(items);

  const isLowStock = updatedItem.currentStock <= updatedItem.minStockLevel;

  res.json({
    message: "Informațiile piesei au fost actualizate pe Server!",
    item: updatedItem,
    criticalStockAlert: isLowStock,
    warningMessage: isLowStock ? `Atenție! Stocul piesei '${updatedItem.name}' a scăzut la ${updatedItem.currentStock}, prag minim de siguranță: ${updatedItem.minStockLevel} buc!` : undefined
  });
});

// DELETE Inventory
router.delete("/inventory/:id", verifyToken, (req: CustomRequest, res: Response): void => {
  if (req.userRole === UserRole.CLIENT) {
    res.status(433).json({ error: "Nu aveți permisiunea de a șterge piese." });
    return;
  }

  const { id } = req.params;
  const items = db.getInventoryItems();
  const filtered = items.filter(item => item.id !== id);

  if (filtered.length === items.length) {
    res.status(404).json({ error: "Piesa solicitată nu există în depozit." });
    return;
  }

  db.setInventoryItems(filtered);
  res.json({ message: "Piesa a fost eliminată cu succes din evidența depozitului." });
});

// ==========================================
// ACTIVE WORK TIMERS (REAL-TIME PONTAJ)
// ==========================================

// Get logged-in mechanic's current active timer
router.get("/hr/active-timer", verifyToken, (req: CustomRequest, res: Response) => {
  const timers = db.getActiveTimers();
  const userTimer = timers.find(t => t.mechanicId === req.userId);
  res.json({ timer: userTimer || null });
});

// Get all active timers (Admin, Receptionist, Accountant tracking team status)
router.get("/hr/timers", verifyToken, (req: CustomRequest, res: Response): void => {
  if (req.userRole === UserRole.CLIENT) {
    res.status(433).json({ error: "Doar personalul poate monitoriza activitatea echipei." });
    return;
  }
  
  const timers = db.getActiveTimers();
  const users = db.getUsers();
  
  const enrichedTimers = timers.map(t => {
    const mech = users.find(u => u.id === t.mechanicId);
    return {
      ...t,
      mechanicName: mech ? mech.name : "Mecanic Necunoscut"
    };
  });
  
  res.json(enrichedTimers);
});

// START work on a Service Job
router.post("/hr/start-work", verifyToken, (req: CustomRequest, res: Response): void => {
  const { jobId } = req.body;

  if (!jobId) {
    res.status(400).json({ error: "Codul fișei de service este obligatoriu pentru a începe lucrul." });
    return;
  }

  // Verify ServiceJob existence
  const jobs = db.getServiceJobs();
  const jobIdx = jobs.findIndex(j => j.id === jobId);
  if (jobIdx === -1) {
    res.status(404).json({ error: `Fișa de service ${jobId.toUpperCase()} nu a fost găsită.` });
    return;
  }

  // Check if this employee already has an active timer
  const timers = db.getActiveTimers();
  const activeTimer = timers.find(t => t.mechanicId === req.userId);
  if (activeTimer) {
    res.status(400).json({ error: `Aveți deja un pontaj activ în desfășurare pe fișa ${activeTimer.jobId.toUpperCase()}. Oprește-l mai întâi.` });
    return;
  }

  const newTimer = {
    id: `timer-${Date.now()}`,
    mechanicId: req.userId!,
    jobId,
    startTime: new Date().toISOString()
  };

  db.setActiveTimers([...timers, newTimer]);

  // Update Service Job Status to IN_PROGRESS automatically
  const prevStatus = jobs[jobIdx].status;
  if (prevStatus === JobStatus.SCHEDULED || prevStatus === JobStatus.IN_RECEPTION) {
    jobs[jobIdx].status = JobStatus.IN_PROGRESS;
    db.setServiceJobs(jobs);
  }

  res.status(201).json({
    message: `Lucrul/pontarea pe fișa ${jobId.toUpperCase()} a început cu succes în mun. Ungheni! Starea fișei: ${jobs[jobIdx].status}.`,
    timer: newTimer,
    job: jobs[jobIdx]
  });
});

// STOP work on Service Job (produces automatic labor rows and timesheet records)
router.post("/hr/stop-work", verifyToken, (req: CustomRequest, res: Response): void => {
  const timers = db.getActiveTimers();
  const timerIdx = timers.findIndex(t => t.mechanicId === req.userId);

  if (timerIdx === -1) {
    res.status(400).json({ error: "Nu aveți nicio sesiune de pontaj activă la care să dați Stop." });
    return;
  }

  const timer = timers[timerIdx];
  const startTime = new Date(timer.startTime).getTime();
  const now = Date.now();
  
  // Calculate hours
  const actualHours = (now - startTime) / (1000 * 60 * 60);
  
  // Allow custom override via request body (for easy user testing so they don't wait hours for a result)
  let hoursToRecord = actualHours;
  if (req.body.hoursWorked !== undefined) {
    hoursToRecord = Number(req.body.hoursWorked);
  } else if (actualHours < 0.05) {
    // If they clicked stop immediately, log 1.5 hours to be helpful for demo
    hoursToRecord = 1.5;
  }
  
  // Format decimal
  hoursToRecord = Number(hoursToRecord.toFixed(2));

  // Find job to append to JobCard
  const jobs = db.getServiceJobs();
  const jobIdx = jobs.findIndex(j => j.id === timer.jobId);

  let newLabor: JobCardLabor | null = null;
  let comisionSum = 0;
  
  if (jobIdx !== -1) {
    // Default hourly rate in MDL
    const hourlyRate = 220; 
    const commissionRate = 35; // 35% standard mecanic commission
    
    newLabor = {
      id: `jl-${Date.now().toString().slice(-4)}`,
      mechanicId: timer.mechanicId,
      description: req.body.notes || `Sesiune lucru - Diagnoză și Reparații (Pontat Automizat)`,
      hoursSpent: hoursToRecord,
      hourlyRate,
      commissionRate
    };
    
    jobs[jobIdx].labor.push(newLabor);
    // Optionally change the status to show it is waiting or diagnostic done
    if (jobs[jobIdx].status === JobStatus.IN_PROGRESS && req.body.targetStatus) {
      if (Object.values(JobStatus).includes(req.body.targetStatus as JobStatus)) {
        jobs[jobIdx].status = req.body.targetStatus as JobStatus;
      }
    }
    db.setServiceJobs(jobs);

    comisionSum = (hoursToRecord * hourlyRate * commissionRate) / 100;
  }

  // Create Timesheet record
  const newTs: Timesheet = {
    id: `ts-${Date.now()}`,
    employeeId: timer.mechanicId,
    jobId: timer.jobId,
    date: new Date().toISOString().split("T")[0],
    hoursWorked: hoursToRecord,
    notes: req.body.notes || `Pontat mecanic automatizat pentru fișa ${timer.jobId.toUpperCase()}`,
    basePay: 0,
    commissionEarned: Number(comisionSum.toFixed(2))
  };

  const timesheets = db.getTimesheets();
  db.setTimesheets([newTs, ...timesheets]);

  // Remove active timer
  const updatedTimers = timers.filter(t => t.id !== timer.id);
  db.setActiveTimers(updatedTimers);

  res.json({
    message: `Pontajul a fost oprit cu succes în mun. Ungheni! S-au înregistrat ${hoursToRecord} ore de manoperă pe fișă.`,
    hoursWorked: hoursToRecord,
    commissionEarned: comisionSum,
    labor: newLabor,
    timesheet: newTs
  });
});

// ==========================================
// TIMESHEET ROUTES
// ==========================================
router.get("/timesheets", verifyToken, (req, res) => {
  res.json(db.getTimesheets());
});

router.post("/timesheets", verifyToken, isAccountant, (req, res): void => {
  const { employeeId, hoursWorked, notes, basePay } = req.body;

  if (!employeeId || !hoursWorked) {
    res.status(400).json({ error: "Sunt necesare ID-ul angajatului și orele lucrate." });
    return;
  }

  const newTs: Timesheet = {
    id: `ts-${Date.now()}`,
    employeeId,
    date: new Date().toISOString().split("T")[0],
    hoursWorked: Number(hoursWorked),
    notes: notes || "Pontaj manual",
    basePay: Number(basePay) || 150, // default rate basePay
    commissionEarned: 0
  };

  const timesheets = db.getTimesheets();
  db.setTimesheets([newTs, ...timesheets]);

  res.status(201).json({
    message: "Pontaj manual înscris cu succes de către Contabil!",
    timesheet: newTs
  });
});

// ==========================================
// INVOICES ROUTES
// ==========================================
router.get("/invoices", verifyToken, (req: CustomRequest, res: Response) => {
  const allInvoices = db.getInvoices();
  if (req.userRole === UserRole.CLIENT) {
    const clientInvoices = allInvoices.filter(i => i.clientId === req.userId);
    res.json(clientInvoices);
  } else {
    res.json(allInvoices);
  }
});

router.post("/invoices/generate/:jobId", verifyToken, isAccountant, (req, res): void => {
  const { jobId } = req.params;

  const allJobs = db.getServiceJobs();
  const job = allJobs.find(j => j.id === jobId);

  if (!job) {
    res.status(404).json({ error: "Fișa de service nu a fost găsită." });
    return;
  }

  const invoices = db.getInvoices();
  const alreadyIssued = invoices.some(i => i.jobId === jobId);

  if (alreadyIssued) {
    res.status(400).json({ error: "Această fișă are deja o factură emisă." });
    return;
  }

  const vehicle = db.getVehicles().find(v => v.id === job.vehicleId);
  const client = db.getUsers().find(u => u.id === job.clientId);

  const partsValue = job.parts.reduce((acc, curr) => acc + (curr.sellPrice * curr.quantity), 0);
  const laborValue = job.labor.reduce((acc, curr) => acc + (curr.hourlyRate * curr.hoursSpent), 0);
  const subtotal = partsValue + laborValue;

  const vatRate = 20; // 20% TVA Ungheni, MD
  const vatAmount = (subtotal * vatRate) / 100;
  const total = subtotal + vatAmount;

  const items = [
    ...job.parts.map(p => ({
      description: `Piesă: ${p.name} (OEM: ${p.oemCode})`,
      quantity: p.quantity,
      unitPrice: p.sellPrice,
      total: p.sellPrice * p.quantity
    })),
    ...job.labor.map(l => ({
      description: `Manoperă: ${l.description}`,
      quantity: l.hoursSpent,
      unitPrice: l.hourlyRate,
      total: l.hourlyRate * l.hoursSpent
    }))
  ];

  const newInvoice: Invoice = {
    id: `inv-${Date.now()}`,
    jobId,
    invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000).toString()}`,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    clientId: job.clientId,
    clientName: client?.name || "Client autoservice",
    clientPhone: client?.phone || "",
    vehicleDetails: vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})` : "General",
    items,
    subtotal,
    vatRate,
    vatAmount,
    total,
    isPaid: false
  };

  db.setInvoices([newInvoice, ...invoices]);
  res.status(201).json({
    message: "Factură fiscală în MDL a fost emisă cu succes!",
    invoice: newInvoice
  });
});

router.put("/invoices/:id/payment", verifyToken, isAccountant, (req, res): void => {
  const { id } = req.params;
  const { isPaid, paymentMethod } = req.body;

  const invoices = db.getInvoices();
  const invIdx = invoices.findIndex(i => i.id === id);

  if (invIdx === -1) {
    res.status(404).json({ error: "Factura nu a fost găsită." });
    return;
  }

  invoices[invIdx] = {
    ...invoices[invIdx],
    isPaid: !!isPaid,
    paymentDate: isPaid ? new Date().toISOString().split("T")[0] : undefined,
    paymentMethod: isPaid ? (paymentMethod || "Card") : undefined
  };

  db.setInvoices(invoices);
  res.json({
    message: `Plata facturii ${invoices[invIdx].invoiceNumber} a fost înregistrată în MDL!`,
    invoice: invoices[invIdx]
  });
});

// ==========================================
// SUPPLIERS ROUTES
// ==========================================
router.get("/suppliers", verifyToken, (req, res) => {
  res.json(db.getSuppliers());
});

export default router;
