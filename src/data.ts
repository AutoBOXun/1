/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  User,
  UserRole,
  Vehicle,
  ServiceType,
  Appointment,
  JobStatus,
  ServiceJob,
  Supplier,
  InventoryItem,
  Invoice,
  Timesheet,
  Notification,
  Expense,
  StockMovement
} from "./types";

import { getRoleAvatar } from "./utils/avatarUtils";

// User database
export const initialUsers: User[] = [
  { id: "u-1", name: "Mihail Goreanu", email: "mihai@goreanu.md", phone: "069111222", role: UserRole.CLIENT, avatarUrl: getRoleAvatar(UserRole.CLIENT), password: "parola123" },
  { id: "u-2", name: "Elena Vasiliu", email: "elena.v@gmail.md", phone: "068444555", role: UserRole.CLIENT, avatarUrl: getRoleAvatar(UserRole.CLIENT), password: "parola123" },
  { id: "u-3", name: "Radu Plămădeală", email: "radu.p@gmail.md", phone: "079555666", role: UserRole.CLIENT, avatarUrl: getRoleAvatar(UserRole.CLIENT), password: "parola123" },
  // staff
  { id: "u-4", name: "Lucian Avram", email: "lucian.avram@autoservice.md", phone: "060123456", role: UserRole.ADMIN, title: "Director de Service", avatarUrl: getRoleAvatar(UserRole.ADMIN), password: "parola123" },
  { id: "u-5", name: "Andrei Nistor", email: "andrei.nistor@autoservice.md", phone: "060789101", role: UserRole.MECHANIC, title: "Electrician Auto / Diagnostician", avatarUrl: getRoleAvatar(UserRole.MECHANIC), password: "parola123" },
  { id: "u-6", name: "Bogdan Marin", email: "bogdan.marin@autoservice.md", phone: "068112233", role: UserRole.MECHANIC, title: "Mecanic Auto (Universal)", avatarUrl: getRoleAvatar(UserRole.MECHANIC), password: "parola123" },
  { id: "u-7", name: "Simona Dumitrița", email: "simona.d@autoservice.md", phone: "079299887", role: UserRole.RECEPTION, title: "Maistru-Receptor / Consilier Service", avatarUrl: getRoleAvatar(UserRole.RECEPTION), password: "parola123" },
  { id: "u-8", name: "Corneliu Codreanu", email: "contabil@autoservice.md", phone: "068112234", role: UserRole.ACCOUNTANT, title: "Contabil / Economist", avatarUrl: getRoleAvatar(UserRole.ACCOUNTANT), password: "parola123" },
  { id: "u-9", name: "Cătălina Rusu", email: "hr@autoservice.md", phone: "068334455", role: UserRole.HR, title: "Manager Resurse Umane", avatarUrl: getRoleAvatar(UserRole.HR), password: "parola123" },
  { id: "u-owner", name: "Vasile Basile", email: "basile@autoservice.md", phone: "060999999", role: UserRole.OWNER, title: "Administrator / Proprietar", avatarUrl: getRoleAvatar(UserRole.OWNER), password: "parola123" }
];

export const initialVehicles: Vehicle[] = [
  { id: "v-1", clientId: "u-1", brand: "Dacia", model: "Duster", licensePlate: "UN-123-MG", vin: "UU1HSDDA123456789", year: 2021, engine: "1.5 dCi 115 HP", mileage: 48500 },
  { id: "v-2", clientId: "u-2", brand: "Volkswagen", model: "Golf 7", licensePlate: "UN-888-WE", vin: "WVWZZZAUZHW123456", year: 2018, engine: "2.0 TDI 150 HP", mileage: 124000 },
  { id: "v-3", clientId: "u-3", brand: "BMW", model: "Seria 3", licensePlate: "UN-045-RD", vin: "WBA8A51000K123456", year: 2019, engine: "2.0 LCI 190 HP", mileage: 98000 }
];

export const initialServiceTypes: ServiceType[] = [
  // I. DIAGNOSTICARE ȘI EVALUARE TEHNICĂ
  { id: "s-1", name: "Diagnosticare computerizată", description: "Citire/ștergere erori, analiză parametri vii cu tester dedicat.", category: "Diagnoză", estimatedDuration: 30, estimatedPrice: 400 },
  { id: "s-002", name: "Diagnosticare mecanică suspensie", description: "Verificare jocuri pivoți, bucșe, amortizoare și tren rulare.", category: "Diagnoză", estimatedDuration: 25, estimatedPrice: 220 },
  { id: "s-003", name: "Verificare completă pre-achiziție", description: "Evaluare tehnică integrală (suspensie, motor, computer, istoric, caroserie).", category: "Diagnoză", estimatedDuration: 120, estimatedPrice: 950 },
  { id: "s-004", name: "Diagnosticare sistem climatizare", description: "Verificare presiune și detectare pierderi cu substanță UV în instalație.", category: "Diagnoză", estimatedDuration: 40, estimatedPrice: 325 },
  { id: "s-005", name: "Testare etanșeitate (Generator Fum)", description: "Detectare pierderi aer sau vacuum în sistemul de admisie cu generator special.", category: "Diagnoză", estimatedDuration: 35, estimatedPrice: 400 },
  { id: "s-006", name: "Măsurare compresie cilindri (Benzină)", description: "Măsurare presiune per cilindru la motoare pe benzină.", category: "Diagnoză", estimatedDuration: 45, estimatedPrice: 120 },
  { id: "s-007", name: "Măsurare compresie cilindri (Diesel)", description: "Măsurare presiune per cilindru la motoare diesel prin locaș bujie/injector.", category: "Diagnoză", estimatedDuration: 90, estimatedPrice: 200 },
  { id: "s-008", name: "Verificare tehnică sezonieră", description: "Pachet vizual general pentru pregătirea sezonului de vară sau iarnă.", category: "Diagnoză", estimatedDuration: 35, estimatedPrice: 280 },

  // II. ÎNTREȚINERE PERIODICĂ
  { id: "s-2", name: "Schimb Ulei și Filtru Motor", description: "Schimb standard de lubrifiant și element filtrant în atelier.", category: "Revizie", estimatedDuration: 40, estimatedPrice: 280 },
  { id: "s-010", name: "Schimb Filtru Aer", description: "Înlocuire cartuș de filtrare aer admisie motor.", category: "Revizie", estimatedDuration: 15, estimatedPrice: 80 },
  { id: "s-011", name: "Schimb Filtru Habitaclu (Standard)", description: "Filtru polen cu amplasare uzuală ușor accesibilă.", category: "Revizie", estimatedDuration: 15, estimatedPrice: 110 },
  { id: "s-012", name: "Schimb Filtru Habitaclu (Complex)", description: "Necesită demontarea torpedoului sau pedalierului.", category: "Revizie", estimatedDuration: 40, estimatedPrice: 275 },
  { id: "s-013", name: "Schimb Filtru Combustibil (Capotă)", description: "Înlocuire filtru carburant amplasat sub capota motorului.", category: "Revizie", estimatedDuration: 25, estimatedPrice: 200 },
  { id: "s-014", name: "Schimb Filtru Combustibil (Rezervor)", description: "Înlocuire filtru carburant amplasat în rezervorul de combustibil.", category: "Revizie", estimatedDuration: 60, estimatedPrice: 450 },
  { id: "s-015", name: "Schimb complet Kit Revizie", description: "Manoperă completă pentru schimb ulei motor plus toate cele 4 filtre.", category: "Revizie", estimatedDuration: 75, estimatedPrice: 650 },
  { id: "s-016", name: "Resetare Interval Service", description: "Adaptare software și deblocare interval după mentenanță.", category: "Revizie", estimatedDuration: 10, estimatedPrice: 120 },

  // III. SISTEMUL DE FRÂNARE
  { id: "s-3", name: "Înlocuire Plăcuțe Frână Față", description: "Sistem de frânare standard punte față (set complet).", category: "Frâne", estimatedDuration: 40, estimatedPrice: 320 },
  { id: "s-018", name: "Înlocuire Plăcuțe Frână Spate (Electric)", description: "Necesită tester pentru retragere etrieri cu piston electronic.", category: "Frâne", estimatedDuration: 50, estimatedPrice: 450 },
  { id: "s-019", name: "Înlocuire Discuri și Plăcuțe Frână", description: "Per axă (față sau spate), include curățare și gresare ghidaje.", category: "Frâne", estimatedDuration: 75, estimatedPrice: 650 },
  { id: "s-020", name: "Înlocuire Saboți Frână Spate", description: "Sistem pe tamburi punte spate.", category: "Frâne", estimatedDuration: 90, estimatedPrice: 550 },
  { id: "s-021", name: "Înlocuire Tambur Frână", description: "Punte spate (per axă), manoperă de demontare/montare.", category: "Frâne", estimatedDuration: 55, estimatedPrice: 400 },
  { id: "s-022", name: "Schimb Lichid Frână plus Aerisire", description: "Înlocuire completă lichid de frână cu aparat special sub presiune.", category: "Frâne", estimatedDuration: 50, estimatedPrice: 375 },
  { id: "s-023", name: "Recondiționare Etrier Frână", description: "Curățare profundă, schimb garnituri și piston etrier (per bucată).", category: "Frâne", estimatedDuration: 90, estimatedPrice: 520 },
  { id: "s-024", name: "Înlocuire Cablu Frână de Mână", description: "Schimbare cablu mecanic de acționare frână staționare.", category: "Frâne", estimatedDuration: 90, estimatedPrice: 475 },
  { id: "s-025", name: "Înlocuire Pompă Centrală de Frână", description: "Demontare, schimbare pompă și aerisirea întregii instalații.", category: "Frâne", estimatedDuration: 135, estimatedPrice: 700 },
  { id: "s-026", name: "Înlocuire Furtun Flexibil Frână", description: "Demontat, schimbat racord flexibil (per bucată).", category: "Frâne", estimatedDuration: 35, estimatedPrice: 200 },

  // IV. SUSPENSIE ȘI DIRECȚIE
  { id: "s-027", name: "Înlocuire Amortizor Față", description: "Piesă individuală punte față (necesită presă de arcuri).", category: "Direcție", estimatedDuration: 75, estimatedPrice: 480 },
  { id: "s-028", name: "Înlocuire Amortizor Spate", description: "Piesă individuală amortizare punte spate.", category: "Direcție", estimatedDuration: 50, estimatedPrice: 350 },
  { id: "s-029", name: "Înlocuire Arc Suspensie", description: "Schimbare arc elicoidal defect (per bucată).", category: "Direcție", estimatedDuration: 75, estimatedPrice: 450 },
  { id: "s-4", name: "Înlocuire Braț Suspensie", description: "Schimb braț complet cu bucșe (superior sau inferior).", category: "Direcție", estimatedDuration: 60, estimatedPrice: 450 },
  { id: "s-033", name: "Înlocuire Bucșă Braț (Presare)", description: "Necesită demontare braț și presare hidraulică în banc.", category: "Direcție", estimatedDuration: 60, estimatedPrice: 325 },
  { id: "s-036", name: "Înlocuire Cap de Bară", description: "Piesă individuală mecanică direcție stânga/dreapta.", category: "Direcție", estimatedDuration: 30, estimatedPrice: 200 },
  { id: "s-037", name: "Înlocuire Bieletă Direcție", description: "Piesă de legătură între casetă și capăt de bară.", category: "Direcție", estimatedDuration: 40, estimatedPrice: 280 },
  { id: "s-038", name: "Înlocuire Casetă Direcție", description: "Manoperă demontare casetă veche și montare casetă nouă/recondiționată.", category: "Direcție", estimatedDuration: 270, estimatedPrice: 1850 },
  { id: "s-040", name: "Înlocuire Rulment Roată (Presat)", description: "Schimbare rulment în fuzetă prin presare hidraulică.", category: "Direcție", estimatedDuration: 90, estimatedPrice: 550 },
  { id: "s-041", name: "Înlocuire Rulment Roată (Butuc)", description: "Schimbare rulment tip butuc complet fixat direct în șuruburi.", category: "Direcție", estimatedDuration: 50, estimatedPrice: 400 },

  // V. MOTOR ȘI DISTRIBUȚIE
  { id: "s-42", name: "Înlocuire Kit Distribuție (Curea 4L)", description: "Motor standard cu 4 cilindri în linie, curea distribuție.", category: "Mecanică", estimatedDuration: 240, estimatedPrice: 2000 },
  { id: "s-46", name: "Înlocuire Curea Accesorii", description: "Curea transmisie alternator, compressor climă sau pompă.", category: "Mecanică", estimatedDuration: 30, estimatedPrice: 300 },
  { id: "s-48", name: "Înlocuire Pompă Apă", description: "Când pompa este separată de circuitul kitului de distribuție.", category: "Mecanică", estimatedDuration: 180, estimatedPrice: 600 },
  { id: "s-052", name: "Înlocuire Radiator Răcire", description: "Manoperă demontare radiator uzat, montare, aerisire și antigel.", category: "Mecanică", estimatedDuration: 180, estimatedPrice: 750 },
  { id: "s-053", name: "Înlocuire Termostat", description: "Schimbare termostat defect, include deschidere circuit și reîncărcare.", category: "Mecanică", estimatedDuration: 90, estimatedPrice: 450 },
  { id: "s-055", name: "Înlocuire Suport Motor", description: "Schimbare tampon de cauciuc/hidraulic atenuare vibrații.", category: "Mecanică", estimatedDuration: 90, estimatedPrice: 450 },

  // VII. ALIMENTARE ȘI INJECȚIE
  { id: "s-068", name: "Demontat/Montat Injector Diesel", description: "Common Rail diesel standard (fără gripare în chiulasă).", category: "Mecanică", estimatedDuration: 60, estimatedPrice: 380 },
  { id: "s-070", name: "Curățare Injectoare Ultrasunete", description: "Diagnosticare pe banc de probă plus ultrasunete (per injector).", category: "Mecanică", estimatedDuration: 90, estimatedPrice: 200 },

  // VIII. EVACUARE
  { id: "s-074", name: "Curățare Profesională DPF", description: "Demontare și curățare termică/chimică pe stand special dedicat.", category: "Mecanică", estimatedDuration: 330, estimatedPrice: 2000 },
  { id: "s-075", name: "Curățare Supapă EGR", description: "Curățare mecanică și chimică a depunerilor de calamină.", category: "Mecanică", estimatedDuration: 120, estimatedPrice: 600 },

  // IX. ELECTRICĂ
  { id: "s-7", name: "Reparație Instalație Electrică", description: "Identificare și remediere cablaje defecte, întrerupte sau scurtcircuitate.", category: "Electrică", estimatedDuration: 120, estimatedPrice: 500 },
  { id: "s-080", name: "Schimb Bujii Incandescente", description: "Motor diesel, deșurubare fină cu extractor în caz de risc (set 4 bucăți).", category: "Electrică", estimatedDuration: 90, estimatedPrice: 600 },
  { id: "s-083", name: "Reparație Electromotor", description: "Curățare, cărbuni, bendix, de-gresare și re-asamblare.", category: "Electrică", estimatedDuration: 150, estimatedPrice: 700 },
  { id: "s-084", name: "Înlocuire Acumulator (Codare)", description: "Înregistrare software a bateriei noi în modulul de management energie.", category: "Electrică", estimatedDuration: 25, estimatedPrice: 220 },

  // X. CLIMATIZARE
  { id: "s-6", name: "Încărcare Freon AC (R134a)", description: "Include vidarea instalației, completarea cu ulei, substanță UV plus freon.", category: "Climatizare", estimatedDuration: 40, estimatedPrice: 650 },
  { id: "s-092", name: "Igienizare Ozon Climatizare", description: "Igienizare conducte habitaclu cu generator industrial de ozon.", category: "Climatizare", estimatedDuration: 30, estimatedPrice: 350 },

  // XI. VULCANIZARE & GEOMETRIE
  { id: "s-096", name: "Geometrie Roți 3D (Axa Față)", description: "Reglare computerizată unghi de fugă și convergență punte față.", category: "Direcție", estimatedDuration: 35, estimatedPrice: 350 },
  { id: "s-101", name: "Îndreptare Jantă Aliaj", description: "Roluire hidraulică la cald sau la rece pentru jante deformate (per bucată).", category: "Vulcanizare", estimatedDuration: 45, estimatedPrice: 380 },
  { id: "s-102", name: "Reparație Pană Anvelopă", description: "Petic aplicat prin vulcanizare la rece sau dop sigiliu rapid.", category: "Vulcanizare", estimatedDuration: 20, estimatedPrice: 140 },

  // XII. VOPSITORIE
  { id: "s-103", name: "Vopsire Element Caroserie", description: "Pregătire vopsea, material kit, grund, vopsea plus lac (ex: aripă/ușă).", category: "Vopsitorie", estimatedDuration: 1440, estimatedPrice: 2800 },
  { id: "s-108", name: "Detailing Interior Complet", description: "Curățare chimică habitaclu profundă (injecție-extracție scaune, mochetă, tavan).", category: "Vopsitorie", estimatedDuration: 1440, estimatedPrice: 2500 },
  { id: "s-109", name: "Înlocuire Parbriz", description: "Tăiere adeziv vechi, pregătire caroserie și lipire parbriz cu mastic.", category: "Vopsitorie", estimatedDuration: 240, estimatedPrice: 800 }
];

export const initialSuppliers: Supplier[] = [
  { id: "sup-1", name: "AutoTotal Moldova S.R.L.", contactName: "George Lungu", phone: "+37322443322", email: "comenzi@autototal.md", deliveryTimeDays: 1 },
  { id: "sup-2", name: "Autonet Import Ungheni", contactName: "Stanislav Popescu", phone: "+37323621455", email: "comenzi@autonet.md", deliveryTimeDays: 1 },
  { id: "sup-3", name: "Elit Moldova S.R.L.", contactName: "Sergiu Radu", phone: "+37322998877", email: "info@elit.md", deliveryTimeDays: 2 }
];

export const initialInventoryItems: InventoryItem[] = [
  { id: "i-1", oemCode: "11201-0L010", aftermarketCode: "HU711/51X", name: "Filtru Ulei Bosch", brand: "Bosch", purchasePrice: 25, sellPrice: 45, currentStock: 25, minStockLevel: 5, supplierId: "sup-1" },
  { id: "i-2", oemCode: "5Q0129620B", aftermarketCode: "C30005", name: "Filtru Aer Mann", brand: "Mann Filter", purchasePrice: 35, sellPrice: 65, currentStock: 3, minStockLevel: 5, supplierId: "sup-1" }, // Low Stock Alert!
  { id: "i-3", oemCode: "5Q0615301G", aftermarketCode: "09.B975.11", name: "Plăcuțe Frână Brembo Față", brand: "Brembo", purchasePrice: 110, sellPrice: 195, currentStock: 12, minStockLevel: 4, supplierId: "sup-2" },
  { id: "i-4", oemCode: "MOT-5W30-4L", aftermarketCode: "8100-X-CLEAN", name: "Ulei Motor Motul 8100 5W30 (4L)", brand: "Motul", purchasePrice: 140, sellPrice: 220, currentStock: 20, minStockLevel: 6, supplierId: "sup-3" },
  { id: "i-5", oemCode: "5Q0413023FL", aftermarketCode: "22-230539", name: "Amortizor Față Bilstein B4", brand: "Bilstein", purchasePrice: 180, sellPrice: 290, currentStock: 2, minStockLevel: 4, supplierId: "sup-2" } // Low Stock Alert!
];

export const initialAppointments: Appointment[] = [
  { id: "ap-1", clientId: "u-1", vehicleId: "v-1", serviceTypeIds: ["s-2"], date: "2026-05-21", time: "09:00", notes: "Revizie periodică. Se simte și un mic tremurat la frânare.", status: "Pending", createdAt: "2026-05-19" },
  { id: "ap-2", clientId: "u-2", vehicleId: "v-2", serviceTypeIds: ["s-3"], date: "2026-05-22", time: "11:30", notes: "Plăcuțele de frână scârțâie tare la opriri.", status: "Confirmed", createdAt: "2026-05-18" },
  { id: "ap-3", clientId: "u-3", vehicleId: "v-3", serviceTypeIds: ["s-1"], date: "2026-05-20", time: "14:00", notes: "Martor check engine aprins în bord.", status: "Confirmed", createdAt: "2026-05-19" }
];

export const initialServiceJobs: ServiceJob[] = [
  {
    id: "job-1",
    appointmentId: "ap-3",
    vehicleId: "v-3",
    clientId: "u-3",
    status: JobStatus.IN_PROGRESS,
    receptionNotes: "Zgârietură fină aripă spate stânga și prag. Mașina lăsată cu cheie în contact.",
    reportedFaults: "Martor check engine aprins în bord și fum albicios la relanti.",
    diagnosedProblems: "Supapă EGR blocată pe deschis, depuneri masive de funingine.",
    parts: [
      { id: "jp-1", partId: "i-1", name: "Filtru Ulei Bosch", oemCode: "11201-0L010", quantity: 1, sellPrice: 45 }
    ],
    labor: [
      { id: "jl-1", mechanicId: "u-5", description: "Diagnoză eroare cod EGR", hoursSpent: 1, hourlyRate: 100, commissionRate: 30 },
      { id: "jl-2", mechanicId: "u-5", description: "Demontare și curățare mecanică supapă EGR", hoursSpent: 2.5, hourlyRate: 120, commissionRate: 30 }
    ],
    damages: [
      { id: "dmg-1", jobId: "job-1", url: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&q=80&w=600", description: "Zgârietură adâncă pe portiera stânga față, vopsea sărită", dateAdded: "2026-05-20" }
    ],
    entryDate: "2026-05-20",
    estimatedFinishDate: "2026-05-21"
  },
  {
    id: "job-2",
    vehicleId: "v-1",
    clientId: "u-1",
    status: JobStatus.READY_FOR_DELIVERY,
    receptionNotes: "Fără zgârieturi noi semnalate. Mașină curată.",
    reportedFaults: "Schimb lichid frână și plăcuțe frână scârțâitoare.",
    diagnosedProblems: "Plăcuțe de frână uzate complet pe puntea față (sub 2mm grosime).",
    parts: [
      { id: "jp-2", partId: "i-3", name: "Plăcuțe Frână Brembo Față", oemCode: "5Q0615301G", quantity: 1, sellPrice: 195 }
    ],
    labor: [
      { id: "jl-3", mechanicId: "u-6", description: "Înlocuire set plăcuțe frână față + aerisire sistem", hoursSpent: 1.5, hourlyRate: 110, commissionRate: 35 }
    ],
    damages: [],
    entryDate: "2026-05-19",
    estimatedFinishDate: "2026-05-19",
    realFinishDate: "2026-05-19"
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: "inv-1",
    jobId: "job-2",
    invoiceNumber: "INV-2026-0124",
    issueDate: "2026-05-19",
    dueDate: "2026-06-02",
    clientId: "u-1",
    clientName: "Mihail Goreanu",
    clientPhone: "069111222",
    vehicleDetails: "Dacia Duster (UN-123-MG)",
    items: [
      { description: "Piesă: Plăcuțe Frână Brembo Față", quantity: 1, unitPrice: 195, total: 195 },
      { description: "Manoperă: Înlocuire set plăcuțe frână față + aerisire sistem", quantity: 1.5, unitPrice: 110, total: 165 }
    ],
    subtotal: 360,
    vatRate: 19,
    vatAmount: 68.4,
    total: 428.4,
    isPaid: true,
    paymentDate: "2026-05-19",
    paymentMethod: "Card"
  }
];

export const initialTimesheets: Timesheet[] = [
  { id: "ts-1", employeeId: "u-5", date: "2026-05-19", hoursWorked: 8, basePay: 200, commissionEarned: 115, notes: "Lucrări diverse mecanice și asistență recepție" },
  { id: "ts-2", employeeId: "u-6", date: "2026-05-19", hoursWorked: 8.5, basePay: 220, commissionEarned: 57.75, notes: "Finalizat înlocuirea plăcuțelor pe Duster" }
];

export const initialNotifications: Notification[] = [
  {
    id: "nt-1",
    userId: "u-1",
    title: "Programare Confirmată",
    message: "Programarea dumneavoastră pentru Revizie periodică din data de 2026-05-21 a fost confirmată.",
    date: "2026-05-19T10:00:00Z",
    isRead: false,
    type: "success"
  },
  {
    id: "nt-2",
    userId: "u-1",
    title: "Mașină Gata de Livrare",
    message: "Vehiculul Dacia Duster (UN-123-MG) este gata pentru a fi ridicat din service.",
    date: "2026-05-19T14:30:00Z",
    isRead: false,
    type: "info"
  },
  {
    id: "nt-3",
    userId: "u-owner",
    title: "Alertă Stoc Scăzut",
    message: "Filtru Aer Mann a scăzut sub nivelul minim de stoc.",
    date: "2026-05-20T08:15:00Z",
    isRead: false,
    type: "warning"
  }
];

export const initialExpenses: Expense[] = [
  { id: "exp-1", category: "Utilități", description: "Factură Energie Electrică - Aprilie", amount: 4500, date: "2026-05-02", paymentStatus: "Paid" },
  { id: "exp-2", category: "Chirie", description: "Chirie Spațiu Atelier Ungheni", amount: 12000, date: "2026-05-01", paymentStatus: "Paid" },
  { id: "exp-3", category: "Piese", description: "Achiziție Stoc Filtre Mann (Lot 50 buc)", amount: 8500, date: "2026-05-15", paymentStatus: "Paid", supplierId: "sup-1" },
  { id: "exp-4", category: "Marketing", description: "Campanie Facebook Ads - Revizii de Primăvară", amount: 1500, date: "2026-05-10", paymentStatus: "Paid" },
  { id: "exp-5", category: "Utilități", description: "Servicii Internet și Telefonie Orange", amount: 450, date: "2026-05-05", paymentStatus: "Paid" }
];

export const initialStockMovements: StockMovement[] = [
  { id: "mov-1", itemId: "i-1", type: "IN", quantity: 50, reason: "Achiziție lot nou furnizor", date: "2026-05-15", userId: "u-4" },
  { id: "mov-2", itemId: "i-1", type: "OUT", quantity: 1, reason: "Folosit la job-2", date: "2026-05-19", userId: "u-6" }
];


// EXPORT ULTIMATE SCHEMA STRINGS AS REQUESTED FOR THE STEP 1 COMPLIANCE
export const prismaSchemaString = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CLIENT
  ADMIN
  RECEPTION
  MECHANIC
  CONTABIL
}

enum JobStatus {
  SCHEDULED       // Programat
  IN_RECEPTION    // În recepție
  IN_PROGRESS     // În lucru
  AWAITING_PARTS  // Așteaptă piese
  FINISHED        // Finalizat
  READY_FOR_DELIVERY // Pregătit pentru livrare
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  CANCELED
}

enum PaymentMethod {
  CASH
  CARD
  BANK_TRANSFER
}

model User {
  id           String        @id @default(uuid())
  email        String        @unique
  name         String
  phone        String
  passwordHash String
  role         Role          @default(CLIENT)
  avatarUrl    String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  // Relații
  vehicles     Vehicle[]     // Un client poate avea mai multe mașini
  appointments Appointment[] // Un client poate face programări
  jobs         ServiceJob[]  @relation("ClientJobs")
  laborWorked  JobCardLabor[] // Un mecanic are manopere lucrate
  timesheets   Timesheet[]   // Pontaj angajați
}

model Vehicle {
  id           String        @id @default(uuid())
  clientId     String
  client       User          @relation(fields: [clientId], references: [id], onDelete: Cascade)
  brand        String
  model        String
  licensePlate String        @unique // Nr. înmatriculare
  vin          String        @unique // Seria de sasiu (17 caractere)
  year         Int
  engine       String        // Ex: 2.0 TDI
  mileage      Int?          // Kilometraj actual
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  appointments Appointment[]
  serviceJobs  ServiceJob[]
}

model ServiceType {
  id                String        @id @default(uuid())
  name              String        @unique
  category          String        // Ex: Diagnoză, Mecanică, Frâne
  estimatedDuration Int           // Minute estimative
  estimatedPrice    Decimal       // Preț mediu estimativ sau bază (MDL)
  createdAt         DateTime      @default(now())

  appointments      Appointment[]
}

model Appointment {
  id            String            @id @default(uuid())
  clientId      String
  client        User              @relation(fields: [clientId], references: [id], onDelete: Cascade)
  vehicleId     String
  vehicle       Vehicle           @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  serviceTypeIds String[]
  date          DateTime          // Ziua programării
  time          String            // Ora (HH:MM)
  notes         String?
  status        AppointmentStatus @default(PENDING)
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  serviceJobs   ServiceJob[]      // O programare se transformă într-o fișă de service
}

model ServiceJob {
  id                  String         @id @default(uuid())
  appointmentId       String?
  appointment         Appointment?   @relation(fields: [appointmentId], references: [id])
  vehicleId           String
  vehicle             Vehicle        @relation(fields: [vehicleId], references: [id], onDelete: Restrict)
  clientId            String
  client              User           @relation("ClientJobs", fields: [clientId], references: [id], onDelete: Restrict)
  status              JobStatus      @default(SCHEDULED)
  receptionNotes      String?        // Constatări recepție (daune vizibile inițial, cheie lăsată etc)
  reportedFaults      String         // Probleme declarate de client
  diagnosedProblems   String?        // Ce a diagnosticat mecanicul după inspecție
  entryDate           DateTime       @default(now())
  estimatedFinishDate DateTime?
  realFinishDate      DateTime?
  createdAt           DateTime       @default(now())
  updatedAt           DateTime       @updatedAt

  // Relații de legătura
  parts               JobCardPart[]  // Piesele folosite la lucrare
  labor               JobCardLabor[] // Manoperele aplicate
  damages             DamagePhoto[]  // Poze daune constatate la intrarea în service
  invoices            Invoice[]      // Facturi emise pe baza fișei
}

model DamagePhoto {
  id          String     @id @default(uuid())
  jobId       String
  serviceJob  ServiceJob @relation(fields: [jobId], references: [id], onDelete: Cascade)
  url         String     // URL către stocarea pozei
  description String     // Ex: "Zgârietură aripă dreapta față"
  createdAt   DateTime   @default(now())
}

model JobCardPart {
  id         String     @id @default(uuid())
  jobId      String
  serviceJob ServiceJob @relation(fields: [jobId], references: [id], onDelete: Cascade)
  partId     String
  part       InventoryItem @relation(fields: [partId], references: [id], onDelete: Restrict)
  quantity   Float
  sellPrice  Decimal    // Preț efectiv vândut (poate diferi de cel standard)
}

model JobCardLabor {
  id             String     @id @default(uuid())
  jobId          String
  serviceJob     ServiceJob @relation(fields: [jobId], references: [id], onDelete: Cascade)
  mechanicId     String
  mechanic       User       @relation(fields: [mechanicId], references: [id], onDelete: Restrict)
  description    String     // Denumirea operațiunii
  hoursSpent     Float
  hourlyRate     Decimal    // Tariful orar aplicat
  commissionRate Float      // Procentajul de comision alocat mecanic (ex: 30.0%)
}

model Supplier {
  id               String          @id @default(uuid())
  name             String          @unique
  contactName      String
  phone            String
  email            String
  deliveryTimeDays Int             @default(1)
  createdAt        DateTime        @default(now())

  inventoryItems   InventoryItem[]
}

model InventoryItem {
  id              String         @id @default(uuid())
  oemCode         String         @unique // Cod OEM original piesa
  aftermarketCode String?        // Cod aftermarket echivalent
  name            String
  brand           String         // Producător (ex: Bosch, Brembo, Mann)
  purchasePrice   Decimal        // Preț achiziție de la furnizor
  sellPrice       Decimal        // Preț standard de vânzare la client
  currentStock    Float          @default(0)
  minStockLevel   Float          @default(2) // Alarmă stoc critic
  supplierId      String
  supplier        Supplier       @relation(fields: [supplierId], references: [id])
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  jobUsages       JobCardPart[]  // Pe ce fișe s-a aplicat piesa
}

model Timesheet {
  id               String   @id @default(uuid())
  employeeId       String
  employee         User     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  date             DateTime @db.Date
  hoursWorked      Float
  basePay          Decimal  // Salariul minim pe zi
  commissionEarned Decimal  // Comisioanele câștigate în acea zi din manopere
  notes            String?
  createdAt        DateTime @default(now())
}

model Invoice {
  id             String        @id @default(uuid())
  jobId          String
  serviceJob     ServiceJob    @relation(fields: [jobId], references: [id], onDelete: Restrict)
  invoiceNumber  String        @unique // Serie + Număr unic (ex: MD-UNG-10023)
  issueDate      DateTime      @default(now())
  dueDate        DateTime
  clientId       String
  clientName     String
  clientPhone    String
  vehicleDetails String        // Text fix la facturare: "Dacia Duster UN-123-MG"
  subtotal       Decimal       // Sumă manopere + piese (Fără TVA)
  vatRate        Float         @default(19.0) // Procent TVA
  vatAmount      Decimal
  total          Decimal       // Sumă totală de plată
  isPaid         Boolean       @default(false)
  paymentDate    DateTime?
  paymentMethod  PaymentMethod?
}
`;

export const postgresSqlString = `-- ==========================================
-- SCRIPT DDL CREARE BAZĂ DE DATE AUTOSERVICE (POSTGRESQL)
-- ==========================================

-- 1. Enumerări (ENUM)
CREATE TYPE "Role" AS ENUM ('CLIENT', 'ADMIN', 'RECEPTION', 'MECHANIC', 'CONTABIL');
CREATE TYPE "JobStatus" AS ENUM ('SCHEDULED', 'IN_RECEPTION', 'IN_PROGRESS', 'AWAITING_PARTS', 'FINISHED', 'READY_FOR_DELIVERY');
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'BANK_TRANSFER');

-- 2. Tabela Utilizatori
CREATE TABLE "User" (
    "id" VARCHAR(128) PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela Vehicule
CREATE TABLE "Vehicle" (
    "id" VARCHAR(128) PRIMARY KEY,
    "clientId" VARCHAR(128) NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "brand" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "licensePlate" VARCHAR(30) UNIQUE NOT NULL,
    "vin" VARCHAR(30) UNIQUE NOT NULL,
    "year" INT NOT NULL,
    "engine" VARCHAR(100) NOT NULL,
    "mileage" INT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela Tipuri Servicii
CREATE TABLE "ServiceType" (
    "id" VARCHAR(128) PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "estimatedDuration" INT NOT NULL, -- în minute
    "estimatedPrice" DECIMAL(10,2) NOT NULL, -- în MDL
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela Programări
CREATE TABLE "Appointment" (
    "id" VARCHAR(128) PRIMARY KEY,
    "clientId" VARCHAR(128) NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "vehicleId" VARCHAR(128) NOT NULL REFERENCES "Vehicle"("id") ON DELETE CASCADE,
    "serviceTypeIds" TEXT[] NOT NULL,
    "date" DATE NOT NULL,
    "time" VARCHAR(10) NOT NULL, -- ex: "09:30"
    "notes" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela Fișe de Service (Service Jobs)
CREATE TABLE "ServiceJob" (
    "id" VARCHAR(128) PRIMARY KEY,
    "appointmentId" VARCHAR(128) REFERENCES "Appointment"("id") ON DELETE SET NULL,
    "vehicleId" VARCHAR(128) NOT NULL REFERENCES "Vehicle"("id") ON DELETE RESTRICT,
    "clientId" VARCHAR(128) NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
    "status" "JobStatus" NOT NULL DEFAULT 'SCHEDULED',
    "receptionNotes" TEXT,
    "reportedFaults" TEXT NOT NULL,
    "diagnosedProblems" TEXT,
    "entryDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedFinishDate" TIMESTAMP,
    "realFinishDate" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabela Poze Daune
CREATE TABLE "DamagePhoto" (
    "id" VARCHAR(128) PRIMARY KEY,
    "jobId" VARCHAR(128) NOT NULL REFERENCES "ServiceJob"("id") ON DELETE CASCADE,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabela Furnizori
CREATE TABLE "Supplier" (
    "id" VARCHAR(128) PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "contactName" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "deliveryTimeDays" INT NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabela Produse Inventar (Piese de Schimb)
CREATE TABLE "InventoryItem" (
    "id" VARCHAR(128) PRIMARY KEY,
    "oemCode" VARCHAR(100) UNIQUE NOT NULL,
    "aftermarketCode" VARCHAR(100),
    "name" VARCHAR(255) NOT NULL,
    "brand" VARCHAR(100) NOT NULL,
    "purchasePrice" DECIMAL(10,2) NOT NULL,
    "sellPrice" DECIMAL(10,2) NOT NULL,
    "currentStock" NUMERIC(10,2) NOT NULL DEFAULT 0,
    "minStockLevel" NUMERIC(10,2) NOT NULL DEFAULT 2, -- pentru alerta de stoc minim
    "supplierId" VARCHAR(128) NOT NULL REFERENCES "Supplier"("id") ON DELETE RESTRICT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Tabela de Legătură Fise de Service - Piese Folosite
CREATE TABLE "JobCardPart" (
    "id" VARCHAR(128) PRIMARY KEY,
    "jobId" VARCHAR(128) NOT NULL REFERENCES "ServiceJob"("id") ON DELETE CASCADE,
    "partId" VARCHAR(128) NOT NULL REFERENCES "InventoryItem"("id") ON DELETE RESTRICT,
    "quantity" NUMERIC(10,2) NOT NULL DEFAULT 1,
    "sellPrice" DECIMAL(10,2) NOT NULL
);

-- 11. Tabela de Legătură Fise de Service - Manoperă/Mecanici
CREATE TABLE "JobCardLabor" (
    "id" VARCHAR(128) PRIMARY KEY,
    "jobId" VARCHAR(128) NOT NULL REFERENCES "ServiceJob"("id") ON DELETE CASCADE,
    "mechanicId" VARCHAR(128) NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
    "description" VARCHAR(255) NOT NULL,
    "hoursSpent" NUMERIC(10,2) NOT NULL,
    "hourlyRate" DECIMAL(10,2) NOT NULL,
    "commissionRate" NUMERIC(5,2) NOT NULL -- ex: 30.00 pentru 30%
);

-- 12. Tabela de Pontaj Personal (Timesheets)
CREATE TABLE "Timesheet" (
    "id" VARCHAR(128) PRIMARY KEY,
    "employeeId" VARCHAR(128) NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "date" DATE NOT NULL,
    "hoursWorked" NUMERIC(5,2) NOT NULL,
    "basePay" DECIMAL(10,2) NOT NULL,
    "commissionEarned" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "notes" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. Tabela Facturi (Invoices)
CREATE TABLE "Invoice" (
    "id" VARCHAR(128) PRIMARY KEY,
    "jobId" VARCHAR(128) NOT NULL REFERENCES "ServiceJob"("id") ON DELETE RESTRICT,
    "invoiceNumber" VARCHAR(100) UNIQUE NOT NULL,
    "issueDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP NOT NULL,
    "clientId" VARCHAR(128) NOT NULL,
    "clientName" VARCHAR(255) NOT NULL,
    "clientPhone" VARCHAR(50) NOT NULL,
    "vehicleDetails" VARCHAR(255) NOT NULL, -- "Dacia Duster (UN-123-MG)"
    "subtotal" DECIMAL(10,2) NOT NULL, -- fara TVA
    "vatRate" NUMERIC(5,2) NOT NULL DEFAULT 19.00, -- 19%
    "vatAmount" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL, -- pret cu TVA
    "isPaid" BOOLEAN NOT NULL DEFAULT FALSE,
    "paymentDate" TIMESTAMP,
    "paymentMethod" "PaymentMethod"
);

-- INDEXURI PENTRU PERFORMANȚĂ PE RELAȚII COMBINATE
CREATE INDEX "idx_vehicle_client" ON "Vehicle"("clientId");
CREATE INDEX "idx_appointment_client" ON "Appointment"("clientId");
CREATE INDEX "idx_appointment_vehicle" ON "Appointment"("vehicleId");
CREATE INDEX "idx_servicejob_vehicle" ON "ServiceJob"("vehicleId");
CREATE INDEX "idx_servicejob_client" ON "ServiceJob"("clientId");
CREATE INDEX "idx_damagephoto_job" ON "DamagePhoto"("jobId");
CREATE INDEX "idx_inventoryitem_supplier" ON "InventoryItem"("supplierId");
CREATE INDEX "idx_jobcardpart_job" ON "JobCardPart"("jobId");
CREATE INDEX "idx_jobcardlabor_job" ON "JobCardLabor"("jobId");
CREATE INDEX "idx_timesheet_employee" ON "Timesheet"("employeeId");
CREATE INDEX "idx_invoice_job" ON "Invoice"("jobId");
`;
