import React, { useState } from "react";
import { 
  Copy, Check, Database, Network, HelpCircle,
  Download, Upload, Trash2, UserPlus, LogIn, ShieldAlert,
  FileJson, CheckCircle2, RefreshCw, KeyRound, Layers,
  Settings, Shield, Users, Car, Calendar, Wrench,
  Activity, ShieldCheck, BarChart3, Zap, Edit, X, Lock,
  Briefcase, ChevronLeft, Clock, Search, Terminal, Home
} from "lucide-react";
import { User, Vehicle, Appointment, ServiceJob, InventoryItem, Timesheet, Invoice, UserRole, ServiceType, Supplier, JobStatus } from "../types";
import { rolesCatalog } from "../data/roles";
import { RoleManagement } from "./RoleManagement";
import { getEquivalentProfile } from "../utils/rbac";

interface SchemaExplorerProps {
  onNotify?: (message: string, type: "success" | "info") => void;
  users?: User[];
  setUsers?: React.Dispatch<React.SetStateAction<User[]>>;
  vehicles?: Vehicle[];
  setVehicles?: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  appointments?: Appointment[];
  setAppointments?: React.Dispatch<React.SetStateAction<Appointment[]>>;
  serviceJobs?: ServiceJob[];
  setServiceJobs?: React.Dispatch<React.SetStateAction<ServiceJob[]>>;
  inventoryItems?: InventoryItem[];
  setInventoryItems?: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  serviceTypes?: ServiceType[];
  timesheets?: Timesheet[];
  setTimesheets?: React.Dispatch<React.SetStateAction<Timesheet[]>>;
  invoices?: Invoice[];
  setInvoices?: React.Dispatch<React.SetStateAction<Invoice[]>>;
  suppliers?: Supplier[];
  setSuppliers?: React.Dispatch<React.SetStateAction<Supplier[]>>;
  currentClientId?: string;
  setCurrentClientId?: (id: string) => void;
  setActiveView?: (view: "client" | "admin" | "schema" | "maintenance" | "clients-list" | "employees-list" | "services-list" | "inventory-list") => void;
  onBack?: () => void;
  setConfirm?: (confirm: { title: string; message: string; onConfirm: () => void } | null) => void;
}

export default function SchemaExplorer({ 
  onNotify,
  users = [],
  setUsers,
  vehicles = [],
  setVehicles,
  appointments = [],
  setAppointments,
  serviceJobs = [],
  setServiceJobs,
  inventoryItems = [],
  setInventoryItems,
  serviceTypes = [],
  timesheets = [],
  setTimesheets,
  invoices = [],
  setInvoices,
  suppliers = [],
  setSuppliers,
  currentClientId,
  setCurrentClientId,
  setActiveView,
  onBack,
  setConfirm
}: SchemaExplorerProps) {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<"acasa" | "diagram" | "sql_sandbox" | "seed" | "json_live" | "admin" | "hr" | "performance" | "migrations">("acasa");
  const [selectedEntity, setSelectedEntity] = useState<string>("ServiceJob");
  
  // Performance Simulation Data
  const [dbHealth, setDbHealth] = useState({
    latency: 12,
    cpu: 8,
    memory: 24,
    connections: 14,
    uptime: "214 zile",
    region: "Europe-West (Ungheni Node)"
  });

  const [auditLogs, setAuditLogs] = useState<{ id: string; timestamp: string; action: string; status: "success" | "warning"; details: string }[]>([
    { id: "log-1", timestamp: new Date().toISOString(), action: "QUERY", status: "success", details: "SELECT * FROM User WHERE role = 'CLIENT'" },
    { id: "log-2", timestamp: new Date(Date.now() - 50000).toISOString(), action: "INSERT", status: "success", details: "INSERT INTO Vehicle (id, brand, model) VALUES (...)" },
    { id: "log-3", timestamp: new Date(Date.now() - 120000).toISOString(), action: "AUTH", status: "success", details: "RBAC Token Validation for admin_user" }
  ]);

  const [migrations, setMigrations] = useState<{ id: string; name: string; timestamp: string; status: "applied" | "pending" }[]>([
    { id: "mig-1", name: "20260501_init", timestamp: "2026-05-01 09:00", status: "applied" },
    { id: "mig-2", name: "20260515_add_inventory_oem", timestamp: "2026-05-15 14:30", status: "applied" },
    { id: "mig-3", name: "20260521_rbac_extensions", timestamp: "în curs", status: "pending" }
  ]);

  // Registration & RBAC state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<UserRole | string>(UserRole.CLIENT);
  const [newRoleName, setNewRoleName] = useState("");
  const [dynamicRoles, setDynamicRoles] = useState<string[]>(["Manager Logistică", "Auditor Financiar"]);
  
  // Entity Edit states
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);
  const [tempEditValue, setTempEditValue] = useState("");

  // Complete User accounts creation & editing states
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRole, setAddRole] = useState<string>("client");
  const [addTitle, setAddTitle] = useState("");

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState<string>("client");
  const [editTitle, setEditTitle] = useState("");

  // Search and Filter states for detailed admin dashboard
  const [adminUserSearch, setAdminUserSearch] = useState("");
  const [adminRoleFilter, setAdminRoleFilter] = useState("all");

  // Query Simulator States
  const [queryPreset, setQueryPreset] = useState<string>("top_parts");
  const [sqlSearchField, setSqlSearchField] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);
  
  // Raw JSON LIVE state
  const [rawJsonText, setRawJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [rawClipboardCopied, setRawClipboardCopied] = useState(false);

  // Verification state
  const [isSeedingInProgress, setIsSeedingInProgress] = useState(false);
  const [selectedRole, setSelectedRole] = useState(rolesCatalog[0]);
  const [employeeData, setEmployeeData] = useState({ name: '', idnp: '' });

  // Detailed Relational Docs
  const entityDocs: Record<string, {
    description: string;
    fields: { name: string; type: string; constraints: string; description: string }[];
    relations: { targetEntity: string; type: string; description: string }[];
  }> = {
    User: {
      description: "Reprezintă toți utilizatorii din sistem: clienți, administratori, recepționari și mecanici.",
      fields: [
        { name: "id", type: "String", constraints: "PRIMARY KEY (UUID)", description: "Identificator unic al utilizatorului" },
        { name: "email", type: "String", constraints: "UNIQUE, NOT NULL", description: "Adresa de email pentru autenticare" },
        { name: "name", type: "String", constraints: "NOT NULL", description: "Numele complet al utilizatorului" },
        { name: "phone", type: "String", constraints: "NOT NULL", description: "Număr de telefon" },
        { name: "role", type: "Enum", constraints: "DEFAULT 'CLIENT'", description: "Roluri disponibile: CLIENT, OWNER, ADMIN, RECEPTION, MECHANIC, ACCOUNTANT" },
        { name: "avatarUrl", type: "String", constraints: "NULLABLE", description: "Imagine de profil opțională" }
      ],
      relations: [
        { targetEntity: "Vehicle", type: "One-to-Many", description: "Un client poate deține și asocia mai multe autovehicule în sistem." },
        { targetEntity: "Appointment", type: "One-to-Many", description: "Un client deține programări plasate în sistem." },
        { targetEntity: "ServiceJob", type: "One-to-Many", description: "Urmărește fișele de reparații deschise pe numele clientului." },
        { targetEntity: "Timesheet", type: "One-to-Many", description: "Mecanicul sau recepționistul deține pontaj activ de ore." }
      ]
    },
    Vehicle: {
      description: "Deține caracteristicile tehnice ale vehiculelor clienților. Corelat strâns cu istoricul de service.",
      fields: [
        { name: "id", type: "String", constraints: "PRIMARY KEY", description: "Identificator autovehicul" },
        { name: "clientId", type: "String", constraints: "FOREIGN KEY, NOT NULL (User.id)", description: "Indică proprietarul mașinii" },
        { name: "brand", type: "String", constraints: "NOT NULL", description: "Marca auto (ex: Dacia, BMW)" },
        { name: "model", type: "String", constraints: "NOT NULL", description: "Modelul autoturismului (ex: Duster, Seria 3)" },
        { name: "licensePlate", type: "String", constraints: "UNIQUE, NOT NULL", description: "Numărul de înmatriculare (ex: C-RM-044)" },
        { name: "vin", type: "String", constraints: "UNIQUE, NOT NULL", description: "Seria de șasiu (exact 17 caractere)" },
        { name: "year", type: "Int", constraints: "NOT NULL", description: "Anul fabricației vehiculului" },
        { name: "engine", type: "String", constraints: "NOT NULL", description: "Detalii motorizare (ex: 1.5 dCi, 115 HP)" },
        { name: "mileage", type: "Int", constraints: "NULLABLE", description: "Kilometrajul înregistrat în timp" }
      ],
      relations: [
        { targetEntity: "User", type: "Many-to-One", description: "Fiecare mașină aparține unui singur client înregistrat." },
        { targetEntity: "ServiceJob", type: "One-to-Many", description: "Istoricul complet de reparații în service pe baza fișelor." },
        { targetEntity: "Appointment", type: "One-to-Many", description: "Programări asociate acestui autovehicul specific." }
      ]
    },
    Appointment: {
      description: "Programări plasate online sau telefonic de către clienți, ce pot fi convertite direct în fișe service.",
      fields: [
        { name: "id", type: "String", constraints: "PRIMARY KEY", description: "Identificator programare" },
        { name: "clientId", type: "String", constraints: "FOREIGN KEY, NOT NULL (User.id)", description: "Identificator client" },
        { name: "vehicleId", type: "String", constraints: "FOREIGN KEY, NOT NULL (Vehicle.id)", description: "Mașina vizată" },
        { name: "dateTime", type: "String", constraints: "NOT NULL", description: "Data și ora stabilită" },
        { name: "serviceType", type: "String", constraints: "NOT NULL", description: "Serviciul solicitat (ex: Revizie, Schimb plăcuțe)" },
        { name: "notes", type: "String", constraints: "NULLABLE", description: "Observații din partea clientului" },
        { name: "status", type: "String", constraints: "DEFAULT 'PENDING'", description: "Status: PENDING, CONFIRMED, COMPLETED, CANCELLED" }
      ],
      relations: [
        { targetEntity: "User", type: "Many-to-One", description: "Programarea este realizată de un client înregistrat." },
        { targetEntity: "Vehicle", type: "Many-to-One", description: "Programarea este asociată unui vehicul din garaj." },
        { targetEntity: "ServiceJob", type: "One-to-One", description: "La recepție, programarea poate genera o fișă de service auto activă." }
      ]
    },
    ServiceJob: {
      description: "Nucleul operațional. Reprezintă fișa de service (Job Card) deschisă la intrarea mașinii în service, înregistrând fluxurile operaționale.",
      fields: [
        { name: "id", type: "String", constraints: "PRIMARY KEY", description: "Identificator unic al fișei" },
        { name: "appointmentId", type: "String", constraints: "FOREIGN KEY, NULLABLE", description: "Referință către programarea de origine" },
        { name: "vehicleId", type: "String", constraints: "FOREIGN KEY, NOT NULL", description: "Mașina aflată în reparație" },
        { name: "clientId", type: "String", constraints: "FOREIGN KEY, NOT NULL", description: "Clientul plătitor" },
        { name: "status", type: "Enum", constraints: "DEFAULT 'SCHEDULED'", description: "Stări: SCHEDULED, CHECKED_IN, IN_PROGRESS, WAITING_FOR_PARTS, COMPLETED, READY" },
        { name: "receptionNotes", type: "String", constraints: "NULLABLE", description: "Mențiuni la recepția vehiculului" },
        { name: "reportedFaults", type: "String", constraints: "NOT NULL", description: "Simptome reclamate de client la workshop" },
        { name: "diagnosedProblems", type: "String", constraints: "NULLABLE", description: "Constatarea tehnică a echipei de mecanici" }
      ],
      relations: [
        { targetEntity: "JobCardPart", type: "One-to-Many", description: "Piesele de schimb utilizate din depozit." },
        { targetEntity: "JobCardLabor", type: "One-to-Many", description: "Orele de manoperă prestate de mecanici." },
        { targetEntity: "Invoice", type: "One-to-Many", description: "Facturile fiscale emise pe baza sumei dintre piese și manoperă." }
      ]
    },
    InventoryItem: {
      description: "Fiecare piesă de schimb aflată în stoc, crucială pentru planificarea lucrărilor și notificările automate.",
      fields: [
        { name: "id", type: "String", constraints: "PRIMARY KEY", description: "Identificator piesă" },
        { name: "oemCode", type: "String", constraints: "UNIQUE, NOT NULL", description: "Codul original de producător auto" },
        { name: "aftermarketCode", type: "String", constraints: "NULLABLE", description: "Cod echivalent aftermarket" },
        { name: "name", type: "String", constraints: "NOT NULL", description: "Denumirea piesei (ex: Filtru ulei)" },
        { name: "brand", type: "String", constraints: "NOT NULL", description: "Producătorul piesei (ex: Bosch, Brembo, Mann)" },
        { name: "purchasePrice", type: "Decimal", constraints: "NOT NULL", description: "Prețul de achiziție de la furnizor (profitabilitate)" },
        { name: "sellPrice", type: "Decimal", constraints: "NOT NULL", description: "Prețul standard de vânzare către client" },
        { name: "currentStock", type: "Float", constraints: "DEFAULT 0", description: "Stocul fizic actual din depozit" },
        { name: "minStockLevel", type: "Float", constraints: "DEFAULT 2", description: "Limita sub care se generează alerte automate" }
      ],
      relations: [
        { targetEntity: "Supplier", type: "Many-to-One", description: "Piesa este comandată și livrată de un Furnizor preferat." },
        { targetEntity: "JobCardPart", type: "One-to-Many", description: "Asociere cu fișele de reparații unde piesa a fost integrată." }
      ]
    },
    Timesheet: {
      description: "Foaie de pontaj electronică pentru calculul orelor lucrate de mecanici, personal administrativ sau recepție.",
      fields: [
        { name: "id", type: "String", constraints: "PRIMARY KEY", description: "Identificator pontaj" },
        { name: "userId", type: "String", constraints: "FOREIGN KEY, NOT NULL (User.id)", description: "Angajatul pontat" },
        { name: "date", type: "String", constraints: "NOT NULL", description: "Data pontării (YYYY-MM-DD)" },
        { name: "clockIn", type: "String", constraints: "NOT NULL", description: "Ora de începere a activității" },
        { name: "clockOut", type: "String", constraints: "NULLABLE", description: "Ora de finalizare" },
        { name: "totalHours", type: "Float", constraints: "DEFAULT 0.0", description: "Timpul calculat în ore lucrate în acea zi" }
      ],
      relations: [
        { targetEntity: "User", type: "Many-to-One", description: "Asociat angajatului pontat în tabela de utilizatori." }
      ]
    },
    Invoice: {
      description: "Documentul financiar emis pe baza pieselor și manoperelor din fișa de service.",
      fields: [
        { name: "id", type: "String", constraints: "PRIMARY KEY", description: "Identificator factură" },
        { name: "jobId", type: "String", constraints: "FOREIGN KEY, NOT NULL", description: "Fișa de service de referință" },
        { name: "invoiceNumber", type: "String", constraints: "UNIQUE, NOT NULL", description: "Număr unic fiscal auto-generat" },
        { name: "subtotal", type: "Decimal", constraints: "NOT NULL", description: "Suma totală a pieselor și manoperei fără TVA" },
        { name: "vatRate", type: "Float", constraints: "DEFAULT 20.00", description: "Cota standard de TVA" },
        { name: "total", type: "Decimal", constraints: "NOT NULL", description: "Suma finală de plată cu TVA" },
        { name: "isPaid", type: "Boolean", constraints: "DEFAULT false", description: "Status de plată" }
      ],
      relations: [
        { targetEntity: "ServiceJob", type: "Many-to-One", description: "Asociat direct cu fișa tehnică finalizată." },
        { targetEntity: "User (Client)", type: "Many-to-One", description: "Indică clientul responsabil pentru achitarea facturii." }
      ]
    }
  };

  // Seed Data Generator function
  const handleGenerateSeedData = () => {
    setIsSeedingInProgress(true);
    try {
      // 1. Seed Users (Keeping owner)
      const existingOwner = users.find(u => u.role === UserRole.OWNER) || {
        id: "u-owner",
        name: "Vasile Proprietar Autobox",
        email: "basile@autoservice.md",
        phone: "060999999",
        role: UserRole.OWNER,
        password: "owner",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
      };

      const seedUsers: User[] = [
        existingOwner,
        {
          id: "u-seed-1",
          name: "Mihai Moraru",
          email: "mihai.moraru@autobox.md",
          phone: "060124567",
          role: UserRole.CLIENT,
          password: "test",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
        },
        {
          id: "u-seed-2",
          name: "Dumitru Cernei",
          email: "d.cernei@gmail.com",
          phone: "079456789",
          role: UserRole.CLIENT,
          password: "test",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
        },
        {
          id: "u-seed-3",
          name: "Elena Cojocaru",
          email: "elena.cojo@gmail.com",
          phone: "068889900",
          role: UserRole.CLIENT,
          password: "test",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
        },
        {
          id: "u-seed-4",
          name: "Andrei Nistor",
          email: "andrei.n@autobox.md",
          phone: "060775533",
          role: UserRole.MECHANIC,
          password: "test",
          avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"
        },
        {
          id: "u-seed-5",
          name: "Vadim Gîscă",
          email: "vadim.g@autobox.md",
          phone: "069334455",
          role: UserRole.MECHANIC,
          password: "test",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
        }
      ];

      // 2. Seed Vehicles
      const seedVehicles: Vehicle[] = [
        {
          id: "v-seed-1",
          brand: "Dacia",
          model: "Duster Prestige",
          licensePlate: "C-RM-044",
          vin: "UU1HSDG44H1234567",
          year: 2021,
          engine: "1.5 dCi 4WD 115 CP",
          clientId: "u-seed-1",
          mileage: 65400
        },
        {
          id: "v-seed-2",
          brand: "BMW",
          model: "X5 xDrive40d",
          licensePlate: "K-BX-145",
          vin: "WBAKS410X0L789123",
          year: 2019,
          engine: "3.0 M-MildHybrid 340 CP",
          clientId: "u-seed-2",
          mileage: 148900
        },
        {
          id: "v-seed-3",
          brand: "Toyota",
          model: "Prius Sol",
          licensePlate: "GE-AB-777",
          vin: "JTDKN3DU0C1236547",
          year: 2018,
          engine: "1.8 HSD VVT-i 122 CP",
          clientId: "u-seed-3",
          mileage: 215000
        }
      ];

      // 3. Seed Inventory
      const seedInventory: InventoryItem[] = [
        {
          id: "i-seed-1",
          oemCode: "MA8590K",
          aftermarketCode: "HU711/51X",
          name: "Filtru Ulei Carbune",
          brand: "Mann-Filter",
          purchasePrice: 120,
          sellPrice: 190,
          currentStock: 14,
          minStockLevel: 5,
          supplierId: "s-1"
        },
        {
          id: "i-seed-2",
          oemCode: "34116852253",
          aftermarketCode: "P06087",
          name: "Plăcuțe Frână Față (Set)",
          brand: "Brembo",
          purchasePrice: 450,
          sellPrice: 650,
          currentStock: 3,
          minStockLevel: 2,
          supplierId: "s-1"
        },
        {
          id: "i-seed-3",
          oemCode: "5W30-LL-4L",
          aftermarketCode: "EDGE-5W30",
          name: "Ulei Motor Sintetic Edge Professional 4L",
          brand: "Castrol",
          purchasePrice: 320,
          sellPrice: 485,
          currentStock: 25,
          minStockLevel: 6,
          supplierId: "s-1"
        },
        {
          id: "i-seed-4",
          oemCode: "BOS850A2",
          aftermarketCode: "S5008",
          name: "Acumulator Auto 12V 77Ah",
          brand: "Bosch S5",
          purchasePrice: 1100,
          sellPrice: 1450,
          currentStock: 1,
          minStockLevel: 2,
          supplierId: "s-2"
        }
      ];

      // 4. Seed Appointments
      const seedAppointments: Appointment[] = [
        {
          id: "ap-seed-1",
          clientId: "u-seed-1",
          vehicleId: "v-seed-1",
          serviceTypeIds: ["st-1"],
          date: "2026-05-24",
          time: "10:00",
          notes: "Se dorește verificare amănunțită pe puntea față. Sistem Directie & Revizie",
          status: "Confirmed",
          createdAt: "2026-05-21T12:00:00Z"
        },
        {
          id: "ap-seed-2",
          clientId: "u-seed-2",
          vehicleId: "v-seed-2",
          serviceTypeIds: ["st-2"],
          date: "2026-05-25",
          time: "14:30",
          notes: "Apare avertizare martor frână în bord de ieri. Schimb Plăcuțe Frână",
          status: "Pending",
          createdAt: "2026-05-21T12:00:00Z"
        },
        {
          id: "ap-seed-3",
          clientId: "u-seed-3",
          vehicleId: "v-seed-3",
          serviceTypeIds: ["st-3"],
          date: "2026-05-28",
          time: "09:00",
          notes: "Revizie standard de 215k kilometri. Reconfigurare Hibrid & Motor",
          status: "Pending",
          createdAt: "2026-05-21T12:00:00Z"
        }
      ];

      // 5. Seed Timesheets
      const seedTimesheets: Timesheet[] = [
        {
          id: "t-seed-1",
          employeeId: "u-seed-4",
          date: "2026-05-20",
          hoursWorked: 9.0,
          basePay: 450,
          commissionEarned: 200,
          notes: "Tura completă diagnostic suspensii."
        },
        {
          id: "t-seed-2",
          employeeId: "u-seed-5",
          date: "2026-05-20",
          hoursWorked: 8.5,
          basePay: 450,
          commissionEarned: 150,
          notes: "Tura standard revizii periodice."
        }
      ];

      // 6. Seed Service Jobs (Job cards)
      const seedServiceJobs: ServiceJob[] = [
        {
          id: "j-seed-1",
          appointmentId: "ap-seed-1",
          vehicleId: "v-seed-1",
          clientId: "u-seed-1",
          status: JobStatus.IN_PROGRESS,
          receptionNotes: "Zgârietură ușoară pe aripa stânga spate. Fără alte daune.",
          reportedFaults: "Revizie periodică / Filtre și ulei, zgomot metalic la bracare",
          diagnosedProblems: "Bieletă antiruliu stânga uzată excesiv (necesită înlocuire)",
          parts: [],
          labor: [],
          damages: [],
          entryDate: "2026-05-21"
        }
      ];

      // 7. Seed Invoices
      const seedInvoices: Invoice[] = [
        {
          id: "inv-seed-1",
          jobId: "j-seed-1",
          invoiceNumber: "FF-2026-0158",
          issueDate: "2026-05-21",
          dueDate: "2026-05-28",
          clientId: "u-seed-1",
          clientName: "Mihai Moraru",
          clientPhone: "060124567",
          vehicleDetails: "Dacia Duster Prestige (C-RM-044)",
          items: [
            {
              description: "Filtru Ulei și manoperă",
              quantity: 1,
              unitPrice: 1150.00,
              total: 1150.00
            }
          ],
          subtotal: 1150.00,
          vatRate: 20,
          vatAmount: 230.00,
          total: 1380.00,
          isPaid: false
        }
      ];

      // Apply changes across hooks safely
      if (setUsers) setUsers(seedUsers);
      if (setVehicles) setVehicles(seedVehicles);
      if (setInventoryItems) setInventoryItems(seedInventory);
      if (setAppointments) setAppointments(seedAppointments);
      if (setTimesheets) setTimesheets(seedTimesheets);
      if (setServiceJobs) setServiceJobs(seedServiceJobs);
      if (setInvoices) setInvoices(seedInvoices);

      // Force-update JSON viewer raw text too
      const liveData = {
        users: seedUsers,
        vehicles: seedVehicles,
        appointments: seedAppointments,
        serviceJobs: seedServiceJobs,
        inventoryItems: seedInventory,
        timesheets: seedTimesheets,
        invoices: seedInvoices
      };
      setRawJsonText(JSON.stringify(liveData, null, 2));

      if (onNotify) onNotify("Datele de test standardizate (Seed AutoBOX CRM/ERP) au fost asimilate în sistem!", "success");
      
      // Add to Audit Logs
      setAuditLogs(prev => [
        { id: `log-${Date.now()}`, timestamp: new Date().toISOString(), action: "SEED", status: "success", details: "SUCCESSFUL MASS DATA SEED: 6 users, 3 vehicles, 4 parts, 3 appointments, 1 job card simulated." },
        ...prev
      ]);
    } catch (e: any) {
      if (onNotify) onNotify(`Eroare la popularea datelor: ${e.message}`, "info");
    } finally {
      setIsSeedingInProgress(false);
    }
  };

  // Safe manual JSON save / sync
  const handleSyncRawJson = () => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(rawJsonText);
      
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Datele structurate transmise nu reprezintă un obiect JSON valid.");
      }

      // Check fields and map carefully
      if (parsed.users && Array.isArray(parsed.users) && setUsers) {
        setUsers(parsed.users);
      }
      if (parsed.vehicles && Array.isArray(parsed.vehicles) && setVehicles) {
        setVehicles(parsed.vehicles);
      }
      if (parsed.appointments && Array.isArray(parsed.appointments) && setAppointments) {
        setAppointments(parsed.appointments);
      }
      if (parsed.serviceJobs && Array.isArray(parsed.serviceJobs) && setServiceJobs) {
        setServiceJobs(parsed.serviceJobs);
      }
      if (parsed.inventoryItems && Array.isArray(parsed.inventoryItems) && setInventoryItems) {
        setInventoryItems(parsed.inventoryItems);
      }
      if (parsed.timesheets && Array.isArray(parsed.timesheets) && setTimesheets) {
        setTimesheets(parsed.timesheets);
      }
      if (parsed.invoices && Array.isArray(parsed.invoices) && setInvoices) {
        setInvoices(parsed.invoices);
      }

      if (onNotify) onNotify("Baza de date a fost editată manual direct prin JSON și sincronizată cu succes!", "success");
      
      // Add to Audit Logs
      setAuditLogs(prev => [
        { id: `log-${Date.now()}`, timestamp: new Date().toISOString(), action: "SYNC", status: "success", details: "DATABASE RE-SYNCHRONIZED: Manual JSON merge completed." },
        ...prev
      ]);
    } catch (e: any) {
      setJsonError(e.message || "Eroare detaliu parse sintaxă JSON.");
      if (onNotify) onNotify("Eroare la parsarea JSON-ului introdus manual. Vă rugăm să verificați sintaxa.", "info");
    }
  };

  // Copy structured JSON Live backup
  const handleCopyJsonToClipboard = () => {
    const liveData = {
      users,
      vehicles,
      appointments,
      serviceJobs,
      inventoryItems,
      timesheets,
      invoices
    };
    const code = JSON.stringify(liveData, null, 2);
    setRawJsonText(code);
    navigator.clipboard.writeText(code);
    setRawClipboardCopied(true);
    if (onNotify) onNotify("JSON Backup copiat în clipboard!", "success");
    setTimeout(() => {
      setRawClipboardCopied(false);
    }, 2000);
  };

  // Export File Backup
  const handleExportBackup = () => {
    try {
      const backupData = {
        users,
        vehicles,
        appointments,
        serviceJobs,
        inventoryItems,
        timesheets,
        invoices
      };
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `autobox_database_backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      if (onNotify) onNotify("Backup-ul bazei de date (fișier JSON) a fost salvat local!", "success");
    } catch (e) {
      if (onNotify) onNotify("A apărut o eroare la exportarea datelor structurate.", "info");
    }
  };

  // Import Backup from JSON File
  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backup = JSON.parse(content);

        if (!backup || typeof backup !== "object") {
          throw new Error("Datele din fișier nu reprezintă un obiect valid.");
        }

        if (!Array.isArray(backup.users)) {
          throw new Error("Formatul backup-ului este necorespunzător (tabela 'users' lipsește).");
        }

        // Keep owner account if not included in import file
        if (setUsers && backup.users) {
          const hasOwner = backup.users.some((u: User) => u.role === UserRole.OWNER);
          if (!hasOwner) {
            const existingOwner = users.find(u => u.role === UserRole.OWNER);
            if (existingOwner) {
              backup.users.push(existingOwner);
            }
          }
          setUsers(backup.users);
        }
        if (setVehicles && backup.vehicles) setVehicles(backup.vehicles);
        if (setAppointments && backup.appointments) setAppointments(backup.appointments);
        if (setServiceJobs && backup.serviceJobs) setServiceJobs(backup.serviceJobs);
        if (setInventoryItems && backup.inventoryItems) setInventoryItems(backup.inventoryItems);
        if (setTimesheets && backup.timesheets) setTimesheets(backup.timesheets);
        if (setInvoices && backup.invoices) setInvoices(backup.invoices);

        setRawJsonText(JSON.stringify(backup, null, 2));

        if (onNotify) onNotify("Restaurare completă! Datele locale au fost înlocuite cu cele din backup.", "success");
      } catch (err: any) {
        if (onNotify) onNotify(`Eroare import: ${err.message || "Fișier JSON corupt"}`, "info");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  // Pure Purge baze date local
  const handleDeleteDatabase = () => {
    setConfirm({
      title: "Confirmă Ștergerea Bazei de Date",
      message: "CRITICAL: Sunteți absolut sigur că doriți să ȘTERGEȚI COMPLET baza de date? Toate datele clienților, programările, fișele service și facturile vor fi înlăturate permanent. Doar contul principal de supervizor administrativ va fi păstrat.",
      onConfirm: () => {
        const currentOwner = users.find(u => u.role === UserRole.OWNER) || {
          id: "u-owner",
          name: "Vasile Proprietar Autobox",
          email: "basile@autoservice.md",
          phone: "060999999",
          role: UserRole.OWNER,
          password: "owner",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
        };
        if (setUsers) setUsers([currentOwner]);
        if (setVehicles) setVehicles([]);
        if (setAppointments) setAppointments([]);
        if (setServiceJobs) setServiceJobs([]);
        if (setInventoryItems) setInventoryItems([]);
        if (setTimesheets) setTimesheets([]);
        if (setInvoices) setInvoices([]);
        setRawJsonText("");

        if (onNotify) onNotify("Baza de date a fost ștearsă complet! Toate tabelele sunt acum libere.", "success");
        
        setAuditLogs(prev => [
          { id: `log-${Date.now()}`, timestamp: new Date().toISOString(), action: "PURGE", status: "warning", details: "TOTAL DATABASE PURGE INITIATED: All tables truncated except system owner." },
          ...prev
        ]);
      }
    });
  };

  // Helper global pentru maparea rolurilor sistem echivalente conform Catalogului de Funcții HR
  const getEquivalentSystemRole = (idOrTitle: string): UserRole => {
    const norm = idOrTitle.toLowerCase();
    if (norm === "client") return UserRole.CLIENT;
    return getEquivalentProfile(idOrTitle).systemRole;
  };

  const handleApplyGlobalRbacSettings = () => {
    if (!setUsers) return;
    
    setUsers(prev => prev.map(user => {
      if (user.role === UserRole.OWNER) return user; // Nu modificam proprietarul
      
      const functionTitle = user.title || user.role;
      const targetRbac = getEquivalentSystemRole(functionTitle);
      
      return {
        ...user,
        role: targetRbac
      };
    }));
    
    if (onNotify) {
      onNotify("Setările globale de echivalență (RBAC) s-au aplicat și s-au salvat cu succes pentru toate conturile active!", "success");
    }
  };

  const handleRegisterUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      if (onNotify) onNotify("Vă rugăm să introduceți numele și adresa de email.", "info");
      return;
    }

    const emailMatch = users.some(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (emailMatch) {
      if (onNotify) onNotify("Această adresă de email este deja utilizată de un alt cont!", "info");
      return;
    }

    const newUser: User = {
      id: `u-${Date.now().toString().slice(-4)}`,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim() || "Nespecificat",
      password: regPassword.trim() || "parola123",
      role: regRole as UserRole,
      avatarUrl: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 500000)}?auto=format&fit=crop&q=80&w=200`
    };

    if (setUsers) {
      setUsers(prev => [...prev, newUser]);
      if (onNotify) onNotify(`Utilizatorul ${regName} a fost înregistrat cu succes cu rolul ${regRole}!`, "success");
      setRegName("");
      setRegEmail("");
      setRegPhone("");
      setRegPassword("");
    }
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.role === UserRole.OWNER) {
      if (onNotify) onNotify("Proprietarul sistemului nu poate fi șters!", "info");
      return;
    }
    setConfirm({
      title: "Confirmă Ștergerea Utilizatorului",
      message: `Sigur doriți să ștergeți contul lui ${user?.name}?`,
      onConfirm: () => {
        if (setUsers) setUsers(prev => prev.filter(u => u.id !== userId));
        if (onNotify) onNotify("Utilizator eliminat.", "success");
      }
    });
  };

  const handleCreateUser = () => {
    if (!addName.trim() || !addEmail.trim() || !addPhone.trim()) {
      if (onNotify) onNotify("Te rog completează numele, email-ul și numărul de telefon!", "info");
      return;
    }
    
    // Check duplication
    const emailExists = users.some(u => u.email.toLowerCase() === addEmail.trim().toLowerCase());
    if (emailExists) {
      if (onNotify) onNotify("Acest email este deja înregistrat!", "info");
      return;
    }

    const finalRbac = addRole === "client" ? UserRole.CLIENT : getEquivalentSystemRole(addRole);

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: addName.trim(),
      email: addEmail.trim(),
      phone: addPhone.trim(),
      role: finalRbac,
      title: addTitle.trim() || undefined,
      password: addPassword.trim(),
      avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(addName.trim())}`
    };

    if (setUsers) {
      setUsers(prev => [...prev, newUser]);
      if (onNotify) onNotify(`Contul lui ${newUser.name} a fost înregistrat cu succes!`, "success");
    }

    // Reset fields
    setAddName("");
    setAddEmail("");
    setAddPhone("");
    setAddPassword("");
    setAddRole("client");
    setAddTitle("");
    setShowAddUserForm(false);
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    if (setUsers) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
      if (onNotify) onNotify("Informațiile utilizatorului au fost actualizate.", "success");
    }
    setEditingUserId(null);
  };

  const handleAddCustomRole = () => {
    if (!newRoleName.trim()) return;
    if (dynamicRoles.includes(newRoleName.trim())) {
      if (onNotify) onNotify("Acest rol există deja!", "info");
      return;
    }
    setDynamicRoles(prev => [...prev, newRoleName.trim()]);
    if (onNotify) onNotify(`Rolul "${newRoleName}" a fost adăugat în sistem.`, "success");
    setNewRoleName("");
  };

  const handleDeleteRole = (index: number) => {
    const roleToDelete = dynamicRoles[index];
    if (users.some(u => u.role === roleToDelete)) {
      if (onNotify) onNotify(`Nu se poate șterge rolul "${roleToDelete}" deoarece este atribuit unor utilizatori!`, "info");
      return;
    }
    setDynamicRoles(prev => prev.filter((_, i) => i !== index));
    if (onNotify) onNotify(`Rolul "${roleToDelete}" a fost eliminat.`, "success");
  };

  const handleUpdateRole = (index: number) => {
    if (!tempEditValue.trim()) return;
    const oldRole = dynamicRoles[index];
    const newRole = tempEditValue.trim();
    
    setDynamicRoles(prev => prev.map((r, i) => i === index ? newRole : r));
    
    if (setUsers) {
      setUsers(prev => prev.map(u => u.role === oldRole ? { ...u, role: newRole as any } : u));
    }
    
    if (onNotify) onNotify(`Rolul a fost redenumit în "${newRole}".`, "success");
    setEditingRoleIndex(null);
  };

  // Preset SQL Queries Simulator Engine
  const getPresetQueryDataAndSql = () => {
    switch (queryPreset) {
      case "top_parts":
        return {
          sql: "SELECT id, oemCode, name, currentStock, minStockLevel FROM InventoryItem WHERE currentStock <= minStockLevel ORDER BY currentStock ASC;",
          results: inventoryItems.filter(item => item.currentStock <= item.minStockLevel)
        };
      case "unpaid_invoices":
        return {
          sql: "SELECT id, invoiceNumber, subtotal, total, isPaid FROM Invoice WHERE isPaid = false ORDER BY total DESC;",
          results: invoices.filter(inv => !inv.isPaid)
        };
      case "recent_timesheets":
        return {
          sql: "SELECT t.id, u.name as Mechanic, t.date, t.hoursWorked FROM Timesheet t JOIN User u ON t.employeeId = u.id ORDER BY t.date DESC;",
          results: timesheets.map(t => {
            const user = users.find(u => u.id === t.employeeId);
            return {
              id: t.id,
              pontator: user ? user.name : "Mecanic Necunoscut",
              data: t.date,
              oreLucrate: `${t.hoursWorked} ore`
            };
          })
        };
      case "recent_cars":
        return {
          sql: "SELECT id, brand, model, licensePlate, year, mileage FROM Vehicle WHERE year >= 2018 ORDER BY mileage ASC;",
          results: vehicles.filter(v => v.year >= 2018)
        };
      default:
        return {
          sql: "SELECT * FROM User ORDER BY role ASC;",
          results: users
        };
    }
  };

  const currentQueryData = getPresetQueryDataAndSql();

  // Instant global search filter logic
  const getGlobalSearchResults = () => {
    if (!sqlSearchField.trim()) return null;
    const term = sqlSearchField.toLowerCase();
    
    const matchedUsers = users.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.role.toLowerCase().includes(term));
    const matchedVehicles = vehicles.filter(v => v.brand.toLowerCase().includes(term) || v.model.toLowerCase().includes(term) || v.licensePlate.toLowerCase().includes(term) || v.vin.toLowerCase().includes(term));
    const matchedParts = inventoryItems.filter(i => i.name.toLowerCase().includes(term) || i.oemCode.toLowerCase().includes(term) || i.brand.toLowerCase().includes(term));
    
    return {
      users: matchedUsers,
      vehicles: matchedVehicles,
      parts: matchedParts
    };
  };

  const searchResultsObj = getGlobalSearchResults();

  // Filter users for the admin unified dashboard
  const filteredUsers = users.filter(user => {
    if (adminRoleFilter !== "all" && user.role !== adminRoleFilter) {
      return false;
    }
    if (adminUserSearch.trim() !== "") {
      const q = adminUserSearch.toLowerCase();
      const nameMatch = user.name?.toLowerCase().includes(q);
      const emailMatch = user.email?.toLowerCase().includes(q);
      const phoneMatch = user.phone?.toLowerCase().includes(q);
      const titleMatch = user.title?.toLowerCase().includes(q);
      return nameMatch || emailMatch || phoneMatch || titleMatch;
    }
    return true;
  });

  // General counts
  const totalClients = users.filter(u => u.role === UserRole.CLIENT).length;
  const totalEmployees = users.filter(u => u.role !== UserRole.CLIENT).length;
  const totalServices = serviceTypes.length;
  const totalInventory = inventoryItems.length;

  return (
    <div id="schema-explorer-root" className="space-y-4 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 lg:px-6">
      
      {/* 1. Header principal rafinat One UI 8 cu buton înapoi standard exact ca pe notificări */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#eef1f6] p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-3 bg-[#F2F2F7] hover:bg-[#E9E9EB] rounded-xl text-[#1D1D1F] transition-all cursor-pointer active:scale-95 border-none shadow-sm flex items-center justify-center shrink-0"
                title="Înapoi"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#034EA2]/10 text-[#034EA2] rounded-2xl flex items-center justify-center shadow-inner">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">
                    Arhitectură & Schemă Date
                  </h2>
                  <p className="text-xs text-[#86868B] font-semibold mt-0.5">
                    Modul administrativ avansat de inginerie a structurii de tabele relaționale AutoBOX.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#E8F0FE] px-5 py-3 rounded-xl self-start md:self-auto shrink-0 border border-transparent">
            <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
            <div className="text-left leading-none">
              <p className="text-xs text-[#034EA2] font-bold uppercase tracking-normal">Status Bază Date</p>
              <p className="text-xs font-bold text-[#1D1D1F] mt-1">Sincronizat Local (7 Tabele)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Columns layout that integrates everything on the horizontal plane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Navigation Sidebar Panel (Column 1-3) */}
        <div className="lg:col-span-3 bg-white border border-[#eef1f6] rounded-2xl p-6 shadow-sm space-y-6 md:w-full">
          <div className="px-2">
            <h4 className="font-extrabold text-xs text-[#1D1D1F] uppercase tracking-normal mb-1">Meniu de Control</h4>
            <p className="text-xs text-[#86868B] font-medium leading-tight">Navigați instantaneu prin paginile de arhitectură fără reîncărcare sau meniuri ascunse.</p>
          </div>
          
          {/* Subtabs rendered either as vertical list (on large screens) or wrap grid (on mobile/tablet) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
            <button
              onClick={() => setActiveTab("acasa")}
              className={`p-4 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between h-24 lg:h-auto lg:flex-row lg:items-center gap-3 w-full border-none outline-none col-span-2 sm:col-span-1 lg:col-span-1 ${
                activeTab === "acasa" 
                  ? "bg-[#034EA2] text-white shadow-md font-bold" 
                  : "bg-[#F2F2F7] text-[#1D1D1F] hover:bg-[#E9E9EB]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${activeTab === "acasa" ? "bg-white/15 text-white" : "bg-white text-[#034EA2] shadow-sm"}`}>
                  <Home className="w-4.5 h-4.5" />
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <h5 className="text-sm font-bold tracking-tight">Acasă Ghid</h5>
                  <p className={`text-[9.5px] font-medium leading-none mt-1 ${activeTab === "acasa" ? "text-white/70" : "text-[#86868B]"}`}>Ghid & Arhitectură tehnică</p>
                </div>
                <div className="text-left leading-none lg:hidden">
                  <h5 className="text-sm font-bold tracking-tight">Acasă</h5>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-normal self-start lg:self-auto ${activeTab === "acasa" ? "bg-white/20 text-white" : "bg-[#034EA2]/10 text-[#034EA2]"}`}>HOME</span>
            </button>

            <button
              onClick={() => setActiveTab("admin")}
              className={`p-4 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between h-24 lg:h-auto lg:flex-row lg:items-center gap-3 w-full border-none outline-none col-span-2 sm:col-span-1 lg:col-span-1 ${
                activeTab === "admin" 
                  ? "bg-[#034EA2] text-white shadow-md font-bold" 
                  : "bg-[#F2F2F7] text-[#1D1D1F] hover:bg-[#E9E9EB]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${activeTab === "admin" ? "bg-white/15 text-white" : "bg-white text-[#034EA2] shadow-sm"}`}>
                  <Settings className="w-4.5 h-4.5" />
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <h5 className="text-sm font-bold tracking-tight">Roluri & RBAC</h5>
                  <p className={`text-[9.5px] font-medium leading-none mt-1 ${activeTab === "admin" ? "text-white/70" : "text-[#86868B]"}`}>Gestiune securitate & drepturi</p>
                </div>
                <div className="text-left leading-none lg:hidden">
                  <h5 className="text-sm font-bold tracking-tight">Roluri & RBAC</h5>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-normal self-start lg:self-auto ${activeTab === "admin" ? "bg-white/20 text-white" : "bg-[#034EA2]/10 text-[#034EA2]"}`}>RBAC</span>
            </button>
            <button
              onClick={() => setActiveTab("hr")}
              className={`p-4 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between h-24 lg:h-auto lg:flex-row lg:items-center gap-3 w-full border-none outline-none col-span-2 sm:col-span-1 lg:col-span-1 ${
                activeTab === "hr" 
                  ? "bg-[#034EA2] text-white shadow-md font-bold" 
                  : "bg-[#F2F2F7] text-[#1D1D1F] hover:bg-[#E9E9EB]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${activeTab === "hr" ? "bg-white/15 text-white" : "bg-white text-[#034EA2] shadow-sm"}`}>
                  <Briefcase className="w-4.5 h-4.5" />
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <h5 className="text-sm font-bold tracking-tight">HR & CIM</h5>
                  <p className={`text-[9.5px] font-medium leading-none mt-1 ${activeTab === "hr" ? "text-white/70" : "text-[#86868B]"}`}>Management HR</p>
                </div>
                <div className="text-left leading-none lg:hidden">
                  <h5 className="text-sm font-bold tracking-tight">HR</h5>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-normal self-start lg:self-auto ${activeTab === "hr" ? "bg-white/20 text-white" : "bg-[#034EA2]/10 text-[#034EA2]"}`}>CIM</span>
            </button>
            <button
              onClick={() => setActiveTab("migrations")}
              className={`p-4 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between h-24 lg:h-auto lg:flex-row lg:items-center gap-3 w-full border-none outline-none ${
                activeTab === "migrations" 
                  ? "bg-[#034EA2] text-white shadow-md font-bold" 
                  : "bg-[#F2F2F7] text-[#1D1D1F] hover:bg-[#E9E9EB]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${activeTab === "migrations" ? "bg-white/15 text-white" : "bg-white text-[#034EA2] shadow-sm"}`}>
                  <RefreshCw className="w-4.5 h-4.5" />
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <h5 className="text-sm font-bold tracking-tight">Migrări & Schema</h5>
                  <p className={`text-[9.5px] font-medium leading-none mt-1 ${activeTab === "migrations" ? "text-white/70" : "text-[#86868B]"}`}>Istoric versiuni DB</p>
                </div>
                <div className="text-left leading-none lg:hidden">
                  <h5 className="text-sm font-bold tracking-tight">Migrări</h5>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-normal self-start lg:self-auto ${activeTab === "migrations" ? "bg-white/20 text-white" : "bg-[#034EA2]/10 text-[#034EA2]"}`}>PRISMA</span>
            </button>

            <button
              onClick={() => setActiveTab("performance")}
              className={`p-4 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between h-24 lg:h-auto lg:flex-row lg:items-center gap-3 w-full border-none outline-none ${
                activeTab === "performance" 
                  ? "bg-[#034EA2] text-white shadow-md font-bold" 
                  : "bg-[#F2F2F7] text-[#1D1D1F] hover:bg-[#E9E9EB]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${activeTab === "performance" ? "bg-white/15 text-white" : "bg-white text-[#034EA2] shadow-sm"}`}>
                  <Activity className="w-4.5 h-4.5" />
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <h5 className="text-sm font-bold tracking-tight">Performanță DB</h5>
                  <p className={`text-[9.5px] font-medium leading-none mt-1 ${activeTab === "performance" ? "text-white/70" : "text-[#86868B]"}`}>Monitorizare & Sanatate</p>
                </div>
                <div className="text-left leading-none lg:hidden">
                  <h5 className="text-sm font-bold tracking-tight">Performanță</h5>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-normal self-start lg:self-auto ${activeTab === "performance" ? "bg-white/20 text-white" : "bg-[#034EA2]/10 text-[#034EA2]"}`}>LIVE</span>
            </button>

            <button
              onClick={() => setActiveTab("diagram")}
              className={`p-4 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between h-24 lg:h-auto lg:flex-row lg:items-center gap-3 w-full border-none outline-none ${
                activeTab === "diagram" 
                  ? "bg-[#034EA2] text-white shadow-md font-bold" 
                  : "bg-[#F2F2F7] text-[#1D1D1F] hover:bg-[#E9E9EB]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${activeTab === "diagram" ? "bg-white/15 text-white" : "bg-white text-[#034EA2] shadow-sm"}`}>
                  <Network className="w-4.5 h-4.5" />
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <h5 className="text-sm font-bold tracking-tight">Erd & Modele</h5>
                  <p className={`text-[9.5px] font-medium leading-none mt-1 ${activeTab === "diagram" ? "text-white/70" : "text-[#86868B]"}`}>Diagramă & Dicționar</p>
                </div>
                <div className="text-left leading-none lg:hidden">
                  <h5 className="text-sm font-bold tracking-tight">Erd & Modele</h5>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-normal self-start lg:self-auto ${activeTab === "diagram" ? "bg-white/20 text-white" : "bg-[#034EA2]/10 text-[#034EA2]"}`}>ERD</span>
            </button>

            <button
              onClick={() => setActiveTab("sql_sandbox")}
              className={`p-4 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between h-24 lg:h-auto lg:flex-row lg:items-center gap-3 w-full border-none outline-none ${
                activeTab === "sql_sandbox" 
                  ? "bg-[#034EA2] text-white shadow-md font-bold" 
                  : "bg-[#F2F2F7] text-[#1D1D1F] hover:bg-[#E9E9EB]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${activeTab === "sql_sandbox" ? "bg-white/15 text-white" : "bg-white text-[#034EA2] shadow-sm"}`}>
                  <Terminal className="w-4.5 h-4.5" />
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <h5 className="text-sm font-bold tracking-tight">Simulator SQL</h5>
                  <p className={`text-[9.5px] font-medium leading-none mt-1 ${activeTab === "sql_sandbox" ? "text-white/70" : "text-[#86868B]"}`}>Sandbox de interogare</p>
                </div>
                <div className="text-left leading-none lg:hidden">
                  <h5 className="text-sm font-bold tracking-tight">Simulator SQL</h5>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-normal self-start lg:self-auto ${activeTab === "sql_sandbox" ? "bg-white/20 text-white" : "bg-[#034EA2]/10 text-[#034EA2]"}`}>SQL</span>
            </button>
            <button
              onClick={() => setActiveTab("seed")}
              className={`p-4 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between h-24 lg:h-auto lg:flex-row lg:items-center gap-3 w-full border-none outline-none ${
                activeTab === "seed" 
                  ? "bg-[#034EA2] text-white shadow-md font-bold" 
                  : "bg-[#F2F2F7] text-[#1D1D1F] hover:bg-[#E9E9EB]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${activeTab === "seed" ? "bg-white/15 text-white" : "bg-white text-[#034EA2] shadow-sm"}`}>
                  <Zap className="w-4.5 h-4.5" />
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <h5 className="text-sm font-bold tracking-tight">Populare Seed</h5>
                  <p className={`text-[9.5px] font-medium leading-none mt-1 ${activeTab === "seed" ? "text-white/70" : "text-[#86868B]"}`}>Generator date fictive</p>
                </div>
                <div className="text-left leading-none lg:hidden">
                  <h5 className="text-sm font-bold tracking-tight">Populare Seed</h5>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-normal self-start lg:self-auto ${activeTab === "seed" ? "bg-white/20 text-white" : "bg-[#034EA2]/10 text-[#034EA2]"}`}>SEED</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("json_live");
                setRawJsonText(JSON.stringify({ users, vehicles, appointments, serviceJobs, inventoryItems, timesheets, invoices }, null, 2));
                setJsonError(null);
              }}
              className={`p-4 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between h-24 lg:h-auto lg:flex-row lg:items-center gap-3 w-full border-none outline-none ${
                activeTab === "json_live" 
                  ? "bg-[#034EA2] text-white shadow-md font-bold" 
                  : "bg-[#F2F2F7] text-[#1D1D1F] hover:bg-[#E9E9EB]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${activeTab === "json_live" ? "bg-white/15 text-white" : "bg-white text-[#034EA2] shadow-sm"}`}>
                  <FileJson className="w-4.5 h-4.5" />
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <h5 className="text-sm font-bold tracking-tight">Backup JSON</h5>
                  <p className={`text-[9.5px] font-medium leading-none mt-1 ${activeTab === "json_live" ? "text-white/70" : "text-[#86868B]"}`}>Direct JSON edit</p>
                </div>
                <div className="text-left leading-none lg:hidden">
                  <h5 className="text-sm font-bold tracking-tight">Backup JSON</h5>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-normal self-start lg:self-auto ${activeTab === "json_live" ? "bg-white/20 text-white" : "bg-[#034EA2]/10 text-[#034EA2]"}`}>RAW</span>
            </button>
          </div>
          
          {/* Quick Stats sidebar footer indicator block */}
          <div className="pt-4 border-t border-[#F2F2F7] hidden lg:block text-left space-y-3">
            <span className="text-xs font-bold text-[#5C5C5C] uppercase tracking-normal px-1">Verificări de Sistem</span>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center bg-[#F2F2F7] p-3 rounded-[16px]">
                <span className="text-xs font-bold text-[#86868B]">Relational Integrity</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg uppercase tracking-normal">Pass</span>
              </div>
              <div className="flex justify-between items-center bg-[#F2F2F7] p-3 rounded-[16px]">
                <span className="text-xs font-bold text-[#86868B]">Prisma Client Auth</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg uppercase tracking-normal">Active</span>
              </div>
              <div className="flex justify-between items-center bg-[#F2F2F7] p-3 rounded-[16px]">
                <span className="text-xs font-bold text-[#86868B]">RBAC Strict Check</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg uppercase tracking-normal">OUI 8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Panel Box (Column 4-12) */}
        <div className="lg:col-span-9 w-full space-y-4">
        
        {/* SUBPAGINA 0.0: ACASĂ GHID & METRICI LIVE */}
        {activeTab === "acasa" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            
            {/* Elegant Welcome Banner */}
            <div className="bg-[#E8F0FE]/40 border border-[#034EA2]/10 rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#034EA2]/5 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-extrabold text-[#034EA2] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Inginerie de Sistem • Arhitectură
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-[#1D1D1F] tracking-tight">
                  Sistemul de Baze de Date AutoBOX Ungheni
                </h3>
                <p className="text-xs md:text-sm text-[#86868B] font-bold max-w-2xl leading-relaxed">
                  Bun venit în panoul de control ingineresc al platformei ERP AutoBOX. Acest modul îți permite să editezi direct datele, să controlezi regulile de acces RBAC, să simulezi interogări SQL și să inspectezi corelațiile fizice și logice ale tabelelor în timp real.
                </p>
              </div>
            </div>

            {/* Metrici Live Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#E9E9EB] p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <p className="text-[10px] font-extrabold text-[#86868B] uppercase tracking-normal">Conturi Utilizator</p>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-2xl font-black text-[#1D1D1F]">{users.length}</span>
                  <span className="text-[10px] font-bold text-emerald-600">active</span>
                </div>
                <p className="text-[10px] text-[#86868B] font-semibold mt-1">Gestiune RBAC integrată</p>
              </div>

              <div className="bg-white border border-[#E9E9EB] p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <p className="text-[10px] font-extrabold text-[#86868B] uppercase tracking-normal">Garaaj Auto (Mașini)</p>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-2xl font-black text-[#1D1D1F]">{vehicles.length}</span>
                  <span className="text-[10px] font-bold text-blue-600">înmatriculate</span>
                </div>
                <p className="text-[10px] text-[#86868B] font-semibold mt-1">Corelate prin VIN unic</p>
              </div>

              <div className="bg-white border border-[#E9E9EB] p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <p className="text-[10px] font-extrabold text-[#86868B] uppercase tracking-normal">Fișe Service (Atelier)</p>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-2xl font-black text-[#1D1D1F]">{serviceJobs.length}</span>
                  <span className="text-[10px] font-bold text-amber-600">lucrări</span>
                </div>
                <p className="text-[10px] text-[#86868B] font-semibold mt-1">Gestionate pe 5 rampe</p>
              </div>

              <div className="bg-white border border-[#E9E9EB] p-4 rounded-2xl shadow-sm hover:shadow-md transition-all col-span-2 sm:col-span-1">
                <p className="text-[10px] font-extrabold text-[#86868B] uppercase tracking-normal">Facturi Live</p>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-2xl font-black text-[#1D1D1F]">{invoices.length}</span>
                  <span className="text-[10px] font-bold text-[#034EA2]">emise</span>
                </div>
                <p className="text-[10px] text-[#86868B] font-semibold mt-1">Calcul automat devize</p>
              </div>
            </div>

            {/* Relational Flow & One UI Standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Architecture specs card */}
              <div className="bg-white border border-[#E9E9EB] rounded-3xl p-6 space-y-4 shadow-sm">
                <h4 className="font-extrabold text-sm text-[#1D1D1F] uppercase tracking-normal border-b border-[#F2F2F7] pb-3">
                  🔗 Scheme Relaționale & Tranzacții
                </h4>
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="p-1 rounded bg-[#E8F0FE] text-[#034EA2] font-bold text-[10px]">1</span>
                    <div>
                      <h5 className="font-bold text-[#1D1D1F]">User (Unul-la-Mulți) Vehicle</h5>
                      <p className="text-[#86868B] font-semibold mt-0.5">Un cont de client poate asocia multiple masini in garaj, pastrand istoricul unitar de deviz.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="p-1 rounded bg-[#E8F0FE] text-[#034EA2] font-bold text-[10px]">2</span>
                    <div>
                      <h5 className="font-bold text-[#1D1D1F]">Vehicle (Unul-la-Mulți) ServiceJob</h5>
                      <p className="text-[#86868B] font-semibold mt-0.5">La fiecare intrare in service pe o rampa, se genereaza o fisa noua legata de codul VIN auto.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="p-1 rounded bg-[#E8F0FE] text-[#034EA2] font-bold text-[10px]">3</span>
                    <div>
                      <h5 className="font-bold text-[#1D1D1F]">ServiceJob (Unul-la-Mulți) Invoice</h5>
                      <p className="text-[#86868B] font-semibold mt-0.5">Fiecare fisa incheiata calculeaza piesele din depozit si manopera, emitand facturi fiscale corelate.</p>
                    </div>
                  </div>
                </div>

                {/* Direct quick action */}
                <button
                  onClick={() => setActiveTab("diagram")}
                  className="w-full bg-[#1D1D1F] hover:bg-[#034EA2] text-white font-bold py-3.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm uppercase tracking-wider"
                >
                  Vezi Diagrama ERD & Modelele complete
                </button>
              </div>

              {/* Samsung One UI 8 Guidelines Application */}
              <div className="bg-[#1D1D1F] text-white rounded-3xl p-6 space-y-4 shadow-md flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm uppercase tracking-normal text-amber-400 border-b border-white/5 pb-3">
                    🎨 Standard Visual Samsung One UI 8
                  </h4>
                  <p className="text-xs text-[#86868B] font-medium leading-relaxed">
                    Aplicația a fost proiectată conform filozofiei One UI 8, orientată spre curbe confortabile, lizibilitate maximă și interacțiuni centrate pe deget:
                  </p>
                  
                  <ul className="space-y-2.5 text-xs text-white/90">
                    <li className="flex items-center gap-2">
                      <span className="text-[#034EA2]">●</span> 
                      <span><strong>Raza coltului</strong> rotunjită la maximum pe elemente (rounded-2xl și rounded-3xl).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#034EA2]">●</span> 
                      <span><strong>Butoane si Inputs generoase</strong> (min 44px inaltime pe touch targets).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#034EA2]">●</span> 
                      <span><strong>Accente soft</strong>: nuante de albastru pastel (#E8F0FE) si fundal alb curat.</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button 
                    onClick={() => setActiveTab("sql_sandbox")}
                    className="bg-white/5 hover:bg-white/10 text-white rounded-xl py-2.5 text-[11px] font-bold border border-white/10"
                  >
                    Simulator SQL
                  </button>
                  <button 
                    onClick={() => setActiveTab("json_live")}
                    className="bg-white/5 hover:bg-white/10 text-white rounded-xl py-2.5 text-[11px] font-bold border border-white/10"
                  >
                    Backup RAW
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {activeTab === "hr" && <RoleManagement users={users} />}

        {/* SUBPAGINA 0.1: MIGRĂRI & VERSIONARE SCHEMĂ */}
        {activeTab === "migrations" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Migration Toolbox */}
                <div className="bg-white border border-[#E9E9EB] rounded-2xl p-4 lg:p-6 shadow-sm space-y-4 text-left">
                  <div className="flex items-center gap-4 border-b border-[#F2F2F7] pb-6">
                    <div className="w-12 h-12 bg-indigo-50 text-[#034EA2] rounded-xl flex items-center justify-center shadow-sm">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-[#1D1D1F] tracking-tight">Prisma Migration Engine</h4>
                      <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal leading-none mt-1">Managementul versiunilor fizice</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                     <div className="p-6 bg-[#F2F2F7] rounded-2xl border border-transparent space-y-4">
                        <div className="flex items-center gap-2">
                           <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                           <span className="text-xs font-bold text-[#1D1D1F] uppercase tracking-normal">Sincronizare Schemă shadow_db</span>
                        </div>
                        <p className="text-xs text-[#86868B] font-medium leading-relaxed italic">
                          Sistemul detectează automat divergențele dintre modelele TypeScript de interfață și schema fizică SQL.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                           <div className="px-3 py-1.5 bg-white border border-[#E9E9EB] rounded-xl text-xs font-bold text-[#1D1D1F] uppercase tracking-normal">
                             Last Check: Acum 4 min
                           </div>
                           <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-semibold uppercase tracking-normal">
                             În Sincron
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        <button 
                          onClick={() => {
                             if (onNotify) onNotify("Alerte schema shadow detectate. Se inițiază 'npx prisma migrate dev'...", "info");
                             setTimeout(() => {
                                setMigrations(prev => [
                                  { id: `mig-${Date.now()}`, name: `${new Date().toISOString().split('T')[0].replace(/-/g, '')}_ui_v2`, timestamp: "Just now", status: "applied" },
                                  ...prev
                                ]);
                                if (onNotify) onNotify("Migrarea a fost aplicată cu succes pe cluster-ul principal!", "success");
                             }, 2000);
                          }}
                          className="w-full bg-[#1D1D1F] text-white font-bold py-5 rounded-[22px] text-xs uppercase tracking-normal hover:bg-[#034EA2] transition-colors shadow-xl shadow-slate-100 flex items-center justify-center gap-3 cursor-pointer"
                        >
                           <Zap className="w-4 h-4" /> Aplicați modificările (Migrate)
                        </button>
                        <button className="w-full bg-white border border-[#E9E9EB] text-[#86868B] font-bold py-5 rounded-[22px] text-xs uppercase tracking-normal hover:bg-[#F2F2F7] transition-all flex items-center justify-center gap-3 cursor-pointer">
                           <RefreshCw className="w-4 h-4" /> Re-generare Prisma Client
                        </button>
                     </div>
                  </div>
                </div>

                {/* Migration History */}
                <div className="bg-[#1D1D1F] rounded-2xl p-4 lg:p-6 border border-white/5 shadow-2xl flex flex-col space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-white/5 pb-6">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-white uppercase tracking-tight flex items-center gap-3">
                        <Database className="w-5 h-5 text-[#034EA2]" />
                        Istoric Migrări
                      </h4>
                      <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal">Registru neschimbabil (Immortal Log)</p>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                     {migrations.map((mig) => (
                       <div key={mig.id} className="p-5 bg-black/40 border border-white/5 rounded-2xl flex justify-between items-center group hover:border-[#034EA2]/50 transition-all">
                          <div className="space-y-1">
                             <p className="font-mono text-xs text-blue-400 font-bold">{mig.name}</p>
                             <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-[#5C5C5C]" />
                                <span className="text-xs font-bold text-[#5C5C5C] uppercase tracking-normal">{mig.timestamp}</span>
                             </div>
                          </div>
                          <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-normal ${mig.status === "applied" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400 animate-pulse"}`}>
                             {mig.status}
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="pt-6 mt-auto">
                     <p className="text-xs text-[#5C5C5C] font-bold uppercase tracking-normal leading-relaxed">
                        Toate migrarea sunt stocate în tabela <span className="text-[#034EA2]">_prisma_migrations</span> și sunt verificate la fiecare boot al serverului Node.js.
                     </p>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* SUBPAGINA 0: PERFORMANȚĂ & SĂNĂTATE BAZĂ DATE */}
        {activeTab === "performance" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Status Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Query Latency", value: `${dbHealth.latency}ms`, icon: <Zap className="w-5 h-5" />, color: "bg-blue-50 text-[#034EA2]", trend: "-2ms vs yesterday" },
                { label: "Active Connections", value: dbHealth.connections, icon: <Users className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600", trend: "+3 connections active" },
                { label: "Database Uptime", value: dbHealth.uptime, icon: <Activity className="w-5 h-5" />, color: "bg-amber-50 text-amber-600", trend: "Stability: 99.9%" },
                { label: "Memory Usage", value: `${dbHealth.memory}%`, icon: <Layers className="w-5 h-5" />, color: "bg-rose-50 text-rose-600", trend: "Balanced cache" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white border border-[#E9E9EB] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-4">
                   <div className="flex justify-between items-start">
                      <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                        {stat.icon}
                      </div>
                      <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal">{stat.trend}</span>
                   </div>
                   <div>
                      <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">{stat.label}</p>
                      <p className="text-xl font-bold text-[#1D1D1F] tracking-tight">{stat.value}</p>
                   </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              {/* Infrastructure Visualization (Left Column) */}
              <div className="xl:col-span-8 bg-white border border-[#E9E9EB] rounded-2xl p-4 lg:p-6 shadow-sm space-y-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#F2F2F7] pb-8">
                  <div className="space-y-1">
                    <h4 className="font-bold text-xl text-[#1D1D1F] uppercase tracking-tight flex items-center gap-3">
                      <Network className="w-6 h-6 text-[#034EA2]" />
                      Infrastructură Cluster
                    </h4>
                    <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal ml-9">Topologie logică a instanței PostgreSQL</p>
                  </div>
                  <div className="bg-[#E8F0FE] text-[#034EA2] px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-normal">{dbHealth.region}</span>
                  </div>
                </div>

                <div className="relative h-[300px] flex items-center justify-center bg-[#F2F2F7]/50 rounded-2xl border-2 border-dashed border-[#E9E9EB] overflow-hidden">
                   {/* Connection lines simulator */}
                   <div className="absolute inset-x-20 h-px bg-gradient-to-r from-transparent via-[#034EA2]/20 to-transparent"></div>
                   <div className="absolute inset-y-10 w-px bg-gradient-to-b from-transparent via-[#034EA2]/20 to-transparent"></div>
                   
                   <div className="relative flex flex-col items-center gap-6 z-10 w-full px-6">
                      {/* Master Node */}
                      <div className="flex flex-col items-center space-y-3 group cursor-help">
                        <div className="w-10 h-10 bg-[#1D1D1F] text-white rounded-xl flex items-center justify-center shadow-2xl relative">
                           <Database className="w-8 h-8" />
                           <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-normal text-[#1D1D1F]">Master Instanță (RW)</p>
                      </div>

                      <div className="grid grid-cols-3 gap-6 w-full">
                         <div className="flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-white border border-[#E9E9EB] text-[#86868B] rounded-xl flex items-center justify-center shadow-sm">
                               <RefreshCw className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold uppercase text-[#86868B]">Replica 1</span>
                         </div>
                         <div className="flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-white border border-[#E9E9EB] text-[#86868B] rounded-xl flex items-center justify-center shadow-sm">
                               <ShieldAlert className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold uppercase text-[#86868B]">Quorum Filter</span>
                         </div>
                         <div className="flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-white border border-[#E9E9EB] text-[#86868B] rounded-xl flex items-center justify-center shadow-sm">
                               <BarChart3 className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold uppercase text-[#86868B]">Audit Node</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 bg-[#F2F2F7] rounded-xl border border-[#E9E9EB] space-y-4">
                      <div className="flex items-center gap-2">
                         <Lock className="w-4 h-4 text-[#034EA2]" />
                         <span className="text-xs font-bold text-[#1D1D1F] uppercase tracking-normal">Enclave de Securitate</span>
                      </div>
                      <p className="text-xs text-[#86868B] font-medium leading-relaxed">Criptare end-to-end activă pentru toate PII (Personally Identifiable Information). Cheile sunt procesate TLS 1.3.</p>
                   </div>
                   <div className="p-6 border border-[#E9E9EB] rounded-xl space-y-4">
                      <div className="flex items-center gap-2">
                         <Search className="w-4 h-4 text-amber-500" />
                         <span className="text-xs font-bold text-[#1D1D1F] uppercase tracking-normal">Analiză Indexare</span>
                      </div>
                      <p className="text-xs text-[#86868B] font-medium leading-relaxed">Toate tabelele sunt optimizate cu indecși B-Tree pe câmpurile ID și Email pentru viteză maximă.</p>
                   </div>
                </div>
              </div>

              {/* Audit Trail Terminal (Right Column) */}
              <div className="xl:col-span-4 space-y-6">
                <div className="bg-[#1D1D1F] rounded-2xl p-4 border border-white/5 shadow-2xl flex flex-col h-full min-h-[450px]">
                   <div className="flex justify-between items-center border-b border-white/5 pb-6 mb-6">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-white uppercase tracking-tight flex items-center gap-3">
                          <Terminal className="w-5 h-5 text-emerald-400" />
                          Audit Terminal
                        </h4>
                        <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal">Stream de evenimente SQL</p>
                      </div>
                      <button 
                        onClick={() => setAuditLogs([])}
                        className="p-2 text-[#86868B] hover:text-white transition-colors"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>

                   <div className="flex-1 space-y-4 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="space-y-1.5 animate-in slide-in-from-right-4 duration-300">
                           <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${log.action === "INSERT" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"}`}>
                                {log.action}
                              </span>
                              <span className="text-xs font-mono text-[#5C5C5C]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                           </div>
                           <div className="bg-black/40 border border-white/5 p-3 rounded-xl">
                              <p className="text-xs font-mono text-emerald-400 leading-relaxed break-all">{log.details}</p>
                           </div>
                        </div>
                      ))}
                      {auditLogs.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-[#5C5C5C] space-y-3">
                           <Database className="w-8 h-8 opacity-20" />
                           <p className="text-xs font-semibold uppercase tracking-normal">Buffer de loguri gol</p>
                        </div>
                      )}
                   </div>

                   <div className="mt-8 pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between text-[#86868B]">
                        <span className="text-xs font-semibold uppercase tracking-normal">Monitor Status</span>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-xs font-bold text-emerald-400 uppercase tracking-normal">Listening...</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBPAGINA 1: DIAGRAMĂ INTERACTIVĂ ERD & DICȚIONAR DATE */}
        {activeTab === "diagram" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button 
                onClick={() => setActiveView?.("clients-list")}
                className="bg-white rounded-2xl p-6 border border-[#eef1f6] shadow-sm flex items-center gap-4 hover:shadow-xl hover:border-[#034EA2]/30 transition-all cursor-pointer text-left group active:scale-98"
              >
                <div className="w-12 h-12 bg-blue-50 text-[#034EA2] rounded-2xl flex items-center justify-center group-hover:bg-[#034EA2] group-hover:text-white transition-all shadow-inner">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal leading-none mb-1">Clienți garaj</p>
                  <p className="text-base font-bold text-[#1D1D1F]">{totalClients} Înregistrați</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveView?.("employees-list")}
                className="bg-white rounded-2xl p-6 border border-[#eef1f6] shadow-sm flex items-center gap-4 hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer text-left group active:scale-98"
              >
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal leading-none mb-1">Membri personal</p>
                  <p className="text-base font-bold text-[#1D1D1F]">{totalEmployees} Angajați activi</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveView?.("services-list")}
                className="bg-white rounded-2xl p-6 border border-[#eef1f6] shadow-sm flex items-center gap-4 hover:shadow-xl hover:border-amber-200 transition-all cursor-pointer text-left group active:scale-98"
              >
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all shadow-inner">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal leading-none mb-1">Catalog servicii</p>
                  <p className="text-base font-bold text-[#1D1D1F]">{totalServices} Tipuri operații</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveView?.("inventory-list")}
                className="bg-white rounded-2xl p-6 border border-[#eef1f6] shadow-sm flex items-center gap-4 hover:shadow-xl hover:border-rose-200 transition-all cursor-pointer text-left group active:scale-98"
              >
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all shadow-inner">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal leading-none mb-1">Piese în depozit</p>
                  <p className="text-base font-bold text-[#1D1D1F]">{totalInventory} Repere unice</p>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              {/* ERD Connections Simulator Box */}
              <div className="xl:col-span-7 bg-white border border-[#eef1f6] rounded-2xl p-4 shadow-sm flex flex-col space-y-6 relative overflow-hidden min-h-[400px]">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#1D1D1F] uppercase tracking-tight flex items-center gap-2">
                    <Network className="w-4.5 h-4.5 text-[#034EA2]" /> ERD Diagramă Relații & Modele Prisma
                  </h4>
                  <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal leading-relaxed">
                    Apasă pe o entitate pentru a încărca structura fizică a bazei de date.
                  </p>
                </div>

                <div className="flex-1 border-[3px] border-[#F2F2F7] border-dashed rounded-2xl bg-[#F2F2F7]/50 relative p-6">
                  <div className="absolute inset-0 flex items-center justify-center text-[#86868B]">
                    <Network className="w-36 h-36 opacity-[0.02] rotate-12" />
                  </div>

                  {/* Schema Physical Cards columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full relative z-10">
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal px-1">Tabel Proprietar (1)</p>
                      {["User", "Vehicle", "Appointment"].map(entity => (
                        <div 
                          key={entity}
                          onClick={() => setSelectedEntity(entity)}
                          className={`p-4 rounded-[22px] border-2 transition-all cursor-pointer group ${
                            selectedEntity === entity 
                              ? "bg-white border-[#034EA2] shadow-lg -translate-y-0.5" 
                              : "bg-white border-[#E9E9EB] hover:border-[#034EA2]/30"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                             <div className="flex items-center gap-2.5">
                               <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${selectedEntity === entity ? "bg-[#034EA2] text-white" : "bg-[#F2F2F7] text-[#86868B]"}`}>
                                 {entity === "User" && <Users className="w-4 h-4" />}
                                 {entity === "Vehicle" && <Car className="w-4 h-4" />}
                                 {entity === "Appointment" && <Calendar className="w-4 h-4" />}
                               </div>
                               <span className="font-bold text-xs text-[#1D1D1F]">{entity}</span>
                             </div>
                             <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold">1_ relation</span>
                          </div>
                          <p className="text-xs text-[#86868B] font-medium leading-relaxed line-clamp-2">{entityDocs[entity]?.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal px-1">Tabele Fii (Multiplu - ∞)</p>
                      {["ServiceJob", "InventoryItem", "Timesheet", "Invoice"].map(entity => (
                        <div 
                          key={entity}
                          onClick={() => setSelectedEntity(entity)}
                          className={`p-4 rounded-[22px] border-2 transition-all cursor-pointer group ${
                            selectedEntity === entity 
                              ? "bg-white border-[#034EA2] shadow-lg -translate-y-0.5" 
                              : "bg-white border-[#E9E9EB] hover:border-[#034EA2]/30"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                             <div className="flex items-center gap-2.5">
                               <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${selectedEntity === entity ? "bg-[#034EA2] text-white" : "bg-[#F2F2F7] text-[#86868B]"}`}>
                                 {entity === "ServiceJob" && <Wrench className="w-4 h-4" />}
                                 {entity === "InventoryItem" && <Layers className="w-4 h-4" />}
                                 {entity === "Timesheet" && <Clock className="w-4 h-4" />}
                                 {entity === "Invoice" && <FileJson className="w-4 h-4" />}
                               </div>
                               <span className="font-bold text-xs text-[#1D1D1F]">{entity}</span>
                             </div>
                             <span className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md font-bold">many_ (∞)</span>
                          </div>
                          <p className="text-xs text-[#86868B] font-medium leading-relaxed line-clamp-2">{entityDocs[entity]?.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Entity Schema Details Sidebar */}
              <div className="xl:col-span-5 bg-white border border-[#eef1f6] rounded-2xl p-4 shadow-sm flex flex-col min-h-[400px]">
                {selectedEntity && entityDocs[selectedEntity] ? (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-4">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#034EA2] bg-[#034EA2]/10 px-2.5 py-1 rounded-lg uppercase tracking-normal">
                            PRISMA SCHEMADECLN • ACTIVE
                          </span>
                          <h4 className="text-lg font-bold text-[#1D1D1F] tracking-tight">{selectedEntity} Model</h4>
                        </div>
                        <div className="w-10 h-10 bg-[#F2F2F7] text-[#86868B] rounded-xl flex items-center justify-center">
                          <Database className="w-4 h-4" />
                        </div>
                      </div>

                      <p className="text-xs text-[#86868B] font-semibold italic leading-relaxed">
                        &ldquo;{entityDocs[selectedEntity].description}&rdquo;
                      </p>

                      <div className="space-y-2.5">
                        <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal px-1 block">Structură Câmpuri (Fields):</span>
                        <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                          {entityDocs[selectedEntity].fields.map(f => (
                            <div key={f.name} className="p-3 bg-[#F2F2F7] rounded-xl border border-[#F2F2F7] hover:border-[#E9E9EB] hover:bg-white transition-all text-left">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-mono text-xs font-bold text-[#1D1D1F]">{f.name}</span>
                                <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">{f.type}</span>
                              </div>
                              <p className="text-xs text-[#86868B] font-medium leading-normal mb-1">{f.description}</p>
                              {f.constraints && (
                                <span className="text-xs font-mono font-bold text-[#86868B] uppercase tracking-tight block">
                                  Config: <span className="text-[#034EA2]">{f.constraints}</span>
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal px-1 block">Corelări & Relații SQL:</span>
                        <div className="space-y-2">
                          {entityDocs[selectedEntity].relations.map(r => (
                            <div key={r.targetEntity} className="p-3 bg-blue-50/40 rounded-xl border border-blue-50/50 text-left">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-xs text-[#034EA2] flex items-center gap-1">➔ {r.targetEntity}</span>
                                <span className="text-xs font-bold text-[#034EA2]/80 bg-white border border-[#034EA2]/20 px-1.5 py-0.5 rounded uppercase tracking-normal">{r.type}</span>
                              </div>
                              <p className="text-xs text-[#86868B] font-medium leading-normal">{r.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#F2F2F7] flex justify-between items-center">
                      <div className="text-left">
                        <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Metode acces direct</p>
                        <p className="text-xs font-mono font-bold text-emerald-600">prisma.{selectedEntity.toLowerCase()}.findMany()</p>
                      </div>
                      <button 
                        onClick={() => {
                          const code = `model ${selectedEntity} {\n` + 
                            entityDocs[selectedEntity].fields.map(f => `  ${f.name}  ${f.type}`).join('\n') + 
                            `\n}`;
                          navigator.clipboard.writeText(code);
                          if (onNotify) onNotify(`Modelul Prisma ${selectedEntity} a fost copiat ca snippet!`, "success");
                        }}
                        className="px-4 py-2 bg-[#F2F2F7] text-[#1D1D1F] hover:bg-[#034EA2] hover:text-white rounded-xl text-xs font-semibold uppercase tracking-normal transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copiază Schema Prisma
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-[#86868B] text-center p-6">
                    <Database className="w-12 h-12 mb-3 opacity-40 animate-pulse" />
                    <p className="text-xs font-semibold uppercase tracking-normal">Nicio entitate selectată</p>
                    <p className="text-xs text-[#86868B] mt-1">Alegeți o masă din diagrama din stânga.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUBPAGINA 2: SIMULATOR SQL & EXPLORATOR INTEROGĂRI */}
        {activeTab === "sql_sandbox" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header subtab specific */}
            <div className="bg-[#1D1D1F] text-white rounded-2xl p-4 border border-white/5 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div className="space-y-2">
                  <span className="bg-[#034EA2] text-white px-3 py-1 rounded-full text-xs font-bold tracking-normal uppercase shadow-lg">
                    SQL SIMULATOR CONSOLE v2
                  </span>
                  <h3 className="text-xl font-bold tracking-tight mt-1">Instrument de Diagnostic & Management Interogări</h3>
                  <p className="text-xs text-[#86868B] font-medium max-w-xl">
                    Rulați preseturi complexe destinate echipei dumneavoastră tehnice sau inspectați tabelele sandbox prin căutare extinsă.
                  </p>
                </div>
                <div className="flex bg-white/5 px-4 py-3 rounded-2xl border border-white/5 items-center gap-3">
                  <Terminal className="w-5 h-5 text-blue-400" />
                  <div className="text-left">
                     <p className="text-xs text-[#86868B] font-bold uppercase">Interogare curentă</p>
                     <p className="text-xs font-mono font-bold text-emerald-400">ACTIVE EMULATOR</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              {/* Presets options */}
              <div className="xl:col-span-5 space-y-6">
                <div className="bg-white border border-[#eef1f6] rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-[#034EA2]" />
                    <h5 className="font-bold text-xs text-[#1D1D1F] uppercase tracking-normal">Alegeți un Scenariu SQL:</h5>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: "top_parts", name: "Piese cu stoc sub limita minimă", desc: "Verificare stocuri deficitare pentru comenzi noi." },
                      { id: "unpaid_invoices", name: "Facturi neachitate sortate valoric", desc: "Urmărire flux financiar & plăți restante clienți." },
                      { id: "recent_timesheets", name: "Fișe de pontaje angajați (Joined)", desc: "Pontaj ore mecanici legate cu User.name." },
                      { id: "recent_cars", name: "Vehicule moderne fabricate din 2018", desc: "Filtrare flotă mașini moderne în service." }
                    ].map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => setQueryPreset(preset.id)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                          queryPreset === preset.id 
                            ? "bg-blue-50/50 border-[#034EA2] shadow-sm -translate-y-0.5" 
                            : "bg-white border-[#E9E9EB] hover:bg-[#F2F2F7] hover:border-slate-300"
                        }`}
                      >
                        <span className={`text-xs font-bold ${queryPreset === preset.id ? "text-[#034EA2]" : "text-[#1D1D1F]"}`}>
                          {preset.name}
                        </span>
                        <span className="text-xs text-[#86868B] font-medium mt-1">{preset.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instant Search Bar Global Sandbox */}
                <div className="bg-white border border-[#eef1f6] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-[#034EA2]" />
                    <h5 className="font-bold text-xs text-[#1D1D1F] uppercase tracking-normal">Căutare Globală Rapidă în Sandbox:</h5>
                  </div>
                  <p className="text-xs text-[#86868B] font-medium leading-relaxed">
                     Introduceți orice frază (ex: "Dacia", "Andrei", "Ulei", "Brembo") pentru a scana automat tabelele CRM în timp real.
                  </p>
                  <input
                    type="text"
                    value={sqlSearchField}
                    onChange={(e) => setSqlSearchField(e.target.value)}
                    placeholder="Tastați pentru căutare directă..."
                    className="w-full bg-[#F2F2F7] p-4 rounded-2xl border border-[#eef1f6] focus:border-[#034EA2] focus:bg-white outline-none text-xs font-bold transition-all"
                  />
                  {sqlSearchField && (
                    <button 
                      onClick={() => setSqlSearchField("")}
                      className="text-xs font-bold text-[#034EA2] hover:underline cursor-pointer"
                    >
                      Resetează căutarea
                    </button>
                  )}
                </div>
              </div>

              {/* Console & Results Code representation */}
              <div className="xl:col-span-7 space-y-6">
                
                {/* Visualizer Code SQL block */}
                {!sqlSearchField && (
                  <div className="bg-[#1D1D1F] rounded-2xl p-6 shadow-md border border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-[#86868B] text-xs font-bold tracking-normal uppercase">
                      <span>SQL Console Output (Simulated)</span>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setIsExplaining(!isExplaining)}
                          className={`text-xs font-bold px-2 py-1 rounded transition-colors ${isExplaining ? "bg-amber-500 text-white" : "text-[#86868B] hover:text-white border border-white/10"}`}
                        >
                           {isExplaining ? "HIDE EXPLAIN" : "QUERY EXPLAIN (ANALYZE)"}
                        </button>
                        <span className="text-emerald-400 font-mono">SQLite / PG Compatibility</span>
                      </div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 overflow-x-auto">
                      <code className="font-mono text-xs text-sky-400 font-bold leading-relaxed whitespace-pre-wrap">
                        {currentQueryData.sql}
                      </code>
                    </div>

                    {isExplaining && (
                      <div className="p-5 bg-white/5 border border-amber-500/20 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-300">
                         <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-normal">
                            <Search className="w-3.5 h-3.5" />
                            Plan de Execuție Detaliat
                         </div>
                         <div className="space-y-2 font-mono text-[9.5px]">
                            <div className="p-2 border-l-2 border-emerald-500 bg-white/5">
                               <p className="text-emerald-400">→ Seq Scan on <span className="text-white">inventoryitem</span> (cost=0.00..15.40 rows=2 width=142)</p>
                               <p className="text-[#86868B] ml-4">Filter: (currentstock &lt;= minstocklevel)</p>
                            </div>
                            <div className="p-2 border-l-2 border-[#034EA2] bg-white/5">
                               <p className="text-[#034EA2]">→ Sort Method: quicksort  Memory: 25kB</p>
                            </div>
                            <p className="text-[#5C5C5C] pt-2">Execution Time: 0.144 ms | Planning Time: 0.082 ms</p>
                         </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Table containing rows or Search list */}
                <div className="bg-white border border-[#eef1f6] rounded-2xl p-6 shadow-sm min-h-[300px]">
                  <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-4 mb-4">
                    <h5 className="font-bold text-xs text-[#1D1D1F] uppercase tracking-normal">
                      {sqlSearchField ? "Rezultate Căutare Globală" : "Rânduri Returnate"}
                    </h5>
                    <span className="text-xs font-mono text-[#86868B] bg-[#F2F2F7] px-2.5 py-1 rounded-lg font-bold">
                      {sqlSearchField 
                        ? `Afișate potrivirile`
                        : `Total: ${currentQueryData.results.length} rânduri`
                      }
                    </span>
                  </div>

                  {/* Standard table structure or searched list */}
                  {sqlSearchField ? (
                    <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                      {searchResultsObj && (searchResultsObj.users.length > 0 || searchResultsObj.vehicles.length > 0 || searchResultsObj.parts.length > 0) ? (
                        <div className="space-y-4">
                          {/* Match Users */}
                          {searchResultsObj.users.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-blue-600 uppercase tracking-normal">Utilizatori matching ({searchResultsObj.users.length})</p>
                              {searchResultsObj.users.map(u => (
                                <div key={u.id} className="p-3 bg-[#F2F2F7] rounded-xl text-xs font-bold flex justify-between items-center">
                                  <span>{u.name} ({u.email})</span>
                                  <span className="text-[9.5px] font-bold text-blue-600 bg-white border border-blue-100 px-2 py-0.5 rounded uppercase">{u.role}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Match Vehicles */}
                          {searchResultsObj.vehicles.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-[#034EA2] uppercase tracking-normal">Vehicule matching ({searchResultsObj.vehicles.length})</p>
                              {searchResultsObj.vehicles.map(v => (
                                <div key={v.id} className="p-3 bg-[#F2F2F7] rounded-xl text-xs font-bold flex justify-between items-center">
                                  <span>{v.brand} {v.model} ({v.licensePlate})</span>
                                  <span className="text-[9.5px] font-mono font-bold text-slate-500 bg-white border px-2 py-0.5 rounded">{v.vin}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Match Parts */}
                          {searchResultsObj.parts.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-rose-600 uppercase tracking-normal">Inventar matching ({searchResultsObj.parts.length})</p>
                              {searchResultsObj.parts.map(p => (
                                <div key={p.id} className="p-3 bg-[#F2F2F7] rounded-xl text-xs font-bold flex justify-between items-center">
                                  <span>{p.name} ({p.brand})</span>
                                  <span className="text-[9.5px] font-mono font-bold text-rose-600 bg-white border px-2 py-0.5 rounded">Stoc: {p.currentStock}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-[#86868B]">
                          <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="text-xs font-semibold uppercase">Niciun rând găsit</p>
                          <p className="text-xs text-[#86868B] mt-0.5">Modificați termenul sau textul de filtrare.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="max-h-[350px] overflow-y-auto pr-1 custom-scrollbar text-left text-xs">
                      {currentQueryData.results.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-[#F2F2F7]">
                              {Object.keys(currentQueryData.results[0]).slice(0, 5).map(key => (
                                <th key={key} className="py-2.5 px-3 text-xs font-bold text-[#86868B] uppercase tracking-normal">{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentQueryData.results.map((row: any, idx: number) => (
                              <tr key={row.id || idx} className="border-b border-[#F2F2F7]/40 hover:bg-[#F2F2F7]/50 transition-colors">
                                {Object.values(row).slice(0, 5).map((val: any, sIdx: number) => (
                                  <td key={sIdx} className="py-3 px-3 font-medium text-[#1D1D1F] truncate max-w-[150px]">
                                    {typeof val === 'boolean' ? (val ? "Da" : "Nu") : String(val)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-center py-6 text-[#86868B]">
                          <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="text-xs font-semibold uppercase">Fără rânduri în starea locală</p>
                          <p className="text-xs text-[#86868B] mt-0.5">Vă recomandăm să folosiți Generatorul de Date Seed.</p>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-[#86868B] font-bold italic mt-4 text-left">
                    * Notă: Emulatorul de cod rulează interogări locale pe baza structurii live a bazei de date din stările aplicației (stocate temporar în memorie).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBPAGINA 3: GENERATORUL DE DATE FICTIVE (SEED DATA) */}
        {activeTab === "seed" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="bg-white border border-[#eef1f6] rounded-2xl p-6 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between border-b border-[#F2F2F7] pb-6">
                <div className="space-y-1 text-left">
                  <span className="text-xs font-bold text-[#034EA2] bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-normal">
                     UNELTĂ INGINER DE DATE • REABILITARE DEMO
                  </span>
                  <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight mt-1">Sistem de seed (populare automată)</h3>
                  <p className="text-xs text-[#86868B] font-medium leading-relaxed">
                     Dezvoltați și rulați teste fără efort: dintr-un singur click puteți popula garajul, tabelele de pontaje, programările, utilizatorii și depozitul de piese cu date specifice.
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-[#034EA2] rounded-2xl flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
              </div>

              {/* Warnings and Info card */}
              <div className="p-6 bg-[#F2F2F7] rounded-2xl border border-transparent space-y-3 text-left">
                <div className="flex items-center gap-2.5">
                   <ShieldCheck className="w-4.5 h-4.5 text-[#034EA2]" />
                   <span className="font-bold text-xs text-[#1G2G3G] uppercase tracking-wide">Informații funcționale:</span>
                </div>
                <ul className="text-xs text-[#86868B] font-semibold space-y-2 list-disc pl-4 italic leading-relaxed">
                   <li>Procesul va genera automat utilizatori moldoveni fictivi cu roluri diversificate (Mecanici, Clienți, etc.).</li>
                   <li>Vehiculele vor avea numere de înmatriculare și serii de șasiu VIN conform directivelor europene exacte.</li>
                   <li>Uleiurile și elementele de stoc vor fi create din branduri consacrate (Mann-Filter, Castrol Edge, Brembo).</li>
                   <li><strong>Important:</strong> Datele anterioare vor fi înlocuite pentru a menține consistența și legăturile logic relaționale dintr-un singur bloc de seed.</li>
                </ul>
              </div>

              {/* Seed actions row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <button
                  type="button"
                  disabled={isSeedingInProgress}
                  onClick={handleGenerateSeedData}
                  className="bg-[#034EA2] text-white font-bold py-5 px-6 rounded-[22px] text-xs shadow-xl shadow-blue-100 hover:bg-[#1D1D1F] hover:shadow-none transition-all active:scale-[0.98] cursor-pointer uppercase tracking-normal flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isSeedingInProgress ? "animate-spin" : ""}`} />
                  {isSeedingInProgress ? "Se populează datele..." : "Populează date standardizate"}
                </button>

                <button
                  type="button"
                  onClick={handleDeleteDatabase}
                  className="bg-white border border-[#E9E9EB] text-rose-600 font-bold py-5 px-6 rounded-[22px] text-xs hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-[0.98] cursor-pointer uppercase tracking-normal flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Curăță tabelele (Purge static)
                </button>
              </div>

              <div className="pt-6 border-t border-[#F2F2F7] text-center">
                 <p className="text-xs text-[#86868B] font-bold">
                   După rularea seed-ului, puteți trece în tabul "SIMULATOR SQL" sau naviga în modulul de gestiune principal pentru a inspecta noile date adăugate automat.
                 </p>
              </div>
            </div>
          </div>
        )}

        {/* SUBPAGINA 4: LIVE JSON VIEW & COPIERE/EDITARE BACKUP */}
        {activeTab === "json_live" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              
              {/* Instructions and Controls */}
              <div className="xl:col-span-5 space-y-6">
                <div className="bg-white border border-[#eef1f6] rounded-2xl p-6 shadow-sm space-y-6 text-left">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg uppercase tracking-normal">
                      MOD EDITARE DIRECT BAZĂ DE DATE
                    </span>
                    <h5 className="font-bold text-base text-[#1D1D1F] tracking-tight mt-1">Editează inline structura JSON</h5>
                  </div>
                  <p className="text-xs text-[#86868B] font-semibold leading-relaxed leading-relaxed">
                     JSON-ul din dreapta reprezintă imaginea bazei de date memorate local în browser pentru ecosistemul dumneavoastră AutoBOX ERP. 
                     Puteți edita manual orice câmp, asocia noi chei externe, iar apoi să apăsați pe "Sincronizează date brute" pentru actualizare.
                  </p>

                  <div className="h-px bg-[#F2F2F7]"></div>

                  {/* Errors block if any */}
                  {jsonError && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-1">
                      <div className="flex items-center gap-2 text-rose-700">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span className="font-bold text-xs uppercase tracking-normal">Eroare Validare Sintaxă:</span>
                      </div>
                      <p className="text-xs font-mono text-rose-600 leading-tight break-words">{jsonError}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={handleCopyJsonToClipboard}
                      className="w-full bg-[#1D1D1F] text-white font-bold py-4 px-5 rounded-xl text-xs uppercase tracking-normal hover:bg-[#034EA2] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      {rawClipboardCopied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Copiat cu Succes!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiază codul JSON</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleSyncRawJson}
                      className="w-full bg-[#034EA2] text-white font-bold py-4 px-5 rounded-xl text-xs uppercase tracking-normal hover:bg-[#1D1D1F] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Sincronizează date brute</span>
                    </button>

                    <div className="h-px bg-[#F2F2F7] my-3"></div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleExportBackup}
                        className="flex-1 bg-white border border-[#E9E9EB] text-[#1D1D1F] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-normal hover:bg-[#F2F2F7] flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Descărcare .json
                      </button>

                      <label className="flex-1 bg-white border border-[#E9E9EB] text-[#1D1D1F] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-normal hover:bg-[#F2F2F7] flex items-center justify-center gap-1.5 cursor-pointer text-center">
                        <Upload className="w-3.5 h-3.5" /> Importă fișier
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportBackup}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Textarea representation JSON */}
              <div className="xl:col-span-7 space-y-4">
                <div className="bg-[#1D1D1F] rounded-2xl p-6 shadow-md border border-white/5 flex flex-col h-[520px]">
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5 mb-3 text-[#86868B] font-bold uppercase tracking-normal">
                     <span>LIVE BACKUP BRUT (Sandbox Database)</span>
                     <span className="text-emerald-400 font-mono">Editable Struct JSON</span>
                  </div>
                  <textarea
                    value={rawJsonText}
                    onChange={(e) => {
                      setRawJsonText(e.target.value);
                      if (jsonError) setJsonError(null);
                    }}
                    placeholder="Sistemul nu conține date locale dinamice în acest moment..."
                    className="flex-1 bg-black text-sky-400 font-mono text-xs p-5 rounded-2xl border border-white/5 outline-none resize-none focus:border-[#034EA2]/50 whitespace-pre scrollbar-thin overflow-y-auto leading-relaxed custom-scrollbar"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GESTIUNE UTILIZATORI & ROLURI PERSONALIZATE – CONTURI & RBAC UNIFICAT */}
        {activeTab === "admin" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            
            {/* Elegant Welcome Banner */}
            <div className="bg-[#E8F0FE]/40 border border-[#034EA2]/10 rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#034EA2]/5 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-extrabold text-[#034EA2] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Securitate • Administrare RBAC Unificat
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-[#1D1D1F] tracking-tight">
                  Roluri & Management Personal AutoBOX
                </h3>
                <p className="text-xs md:text-sm text-[#86868B] font-medium max-w-3xl leading-relaxed">
                  Gestiunea centralizată a conturilor de acces în platformă, unificată cu departamentul de Resurse Umane (HR). 
                  Fiecare utilizator primește un <strong>Rol de Sistem (RBAC)</strong> pentru accesul la ecrane și o <strong>Funcție Specifică (Fisă Post)</strong> conform catalogului de roluri din atelier.
                </p>
              </div>
            </div>

            {/* CASETA PRINCIPALĂ: ADMINISTRARE CONTURI UTILIZATORI - REFORMATATĂ DETALIAT */}
            <div className="bg-white border border-[#E9E9EB] rounded-[32px] p-6 shadow-sm space-y-6">
              
              {/* Header section with Stats & Add Button */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-[#F2F2F7] pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#034EA2]" />
                    <h4 className="text-base font-black text-[#1D1D1F] uppercase tracking-normal">
                      Registrul Unic de Conturi și Credențiale
                    </h4>
                  </div>
                  <p className="text-xs text-[#86868B] font-bold">
                    Configurează credențialele, modifică rolul sistem și mapează funcția din atelier pentru angajați și clienți.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-xs font-semibold bg-[#F2F2F7] border border-[#E9E9EB] px-3.5 py-1.5 rounded-xl text-[#5C5C5C]">
                    Total: <strong className="text-[#1D1D1F]">{users.length} utilizatori</strong> • 
                    Membri staff: <strong className="text-[#034EA2]">{users.filter(u => u.role !== UserRole.CLIENT).length}</strong>
                  </div>
                  
                  <button
                    onClick={() => setShowAddUserForm(!showAddUserForm)}
                    className="bg-[#034EA2] hover:bg-[#034EA2]/90 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{showAddUserForm ? "Închide Formular" : "Înregistrează Cont Nou"}</span>
                  </button>
                </div>
              </div>

              {/* Formular Adăugare Cont Nou */}
              {showAddUserForm && (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs animate-in fade-in duration-300">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <h5 className="font-extrabold text-[#1D1D1F] uppercase tracking-normal flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-[#034EA2]" />
                      Creare cont de acces nou
                    </h5>
                    <span className="text-[10px] text-amber-600 font-bold uppercase">Securizat prin SHA256</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-[#5C5C5C]">Nume complet:</label>
                      <input 
                        type="text" 
                        placeholder="ex: Mihai Popescu" 
                        value={addName} 
                        onChange={(e) => setAddName(e.target.value)}
                        className="w-full bg-white border border-[#E9E9EB] p-3 rounded-xl outline-none focus:border-[#034EA2] text-xs font-bold text-[#1D1D1F]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-[#5C5C5C]">Adresă Email (Conectare):</label>
                      <input 
                        type="email" 
                        placeholder="ex: m.popescu@autobox.md" 
                        value={addEmail} 
                        onChange={(e) => setAddEmail(e.target.value)}
                        className="w-full bg-white border border-[#E9E9EB] p-3 rounded-xl outline-none focus:border-[#034EA2] text-xs font-bold text-[#1D1D1F]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-[#5C5C5C]">Telefon Mobil:</label>
                      <input 
                        type="text" 
                        placeholder="ex: +373 68 123456" 
                        value={addPhone} 
                        onChange={(e) => setAddPhone(e.target.value)}
                        className="w-full bg-white border border-[#E9E9EB] p-3 rounded-xl outline-none focus:border-[#034EA2] text-xs font-bold text-[#1D1D1F]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-[#5C5C5C]">Rol Sistem (DREPTURI ACCES - RBAC):</label>
                      <select 
                        value={addRole} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setAddRole(val);
                          if (val === "client") {
                            setAddTitle("");
                          } else {
                            const found = rolesCatalog.find(r => r.id === val);
                            if (found) {
                              setAddTitle(found.title);
                            }
                          }
                        }}
                        className="w-full bg-white border border-[#E9E9EB] p-3 rounded-xl outline-none focus:border-[#034EA2] text-xs font-bold text-[#1D1D1F]"
                      >
                        <option value="client">Client (Membru/Proprietar auto)</option>
                        {rolesCatalog.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.title} ({role.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-[#5C5C5C]">Parolă Cont:</label>
                      <input 
                        type="password" 
                        placeholder="******" 
                        value={addPassword} 
                        onChange={(e) => setAddPassword(e.target.value)}
                        className="w-full bg-white border border-[#E9E9EB] p-3 rounded-xl outline-none focus:border-[#034EA2] text-xs font-bold text-[#1D1D1F]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#5C5C5C]">Mapează Funcție din Atelier (Fisă Post):</label>
                      <input 
                        type="text" 
                        placeholder="ex: Electrician Auto, Motorist, Vulcanizator" 
                        value={addTitle} 
                        onChange={(e) => setAddTitle(e.target.value)}
                        className="w-full bg-white border border-[#E9E9EB] p-3 rounded-xl outline-none focus:border-[#034EA2] text-xs font-bold text-[#1D1D1F]"
                      />
                    </div>

                    <div className="space-y-1 flex items-end">
                      <div className="w-full bg-blue-50 border border-blue-100 p-3 rounded-xl text-[10px] text-blue-700 font-semibold">
                        💡 Rolul selectat acordă automat setul corect de permisiuni logice pe ecranele ERP.
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      onClick={() => setShowAddUserForm(false)}
                      className="px-4 py-2.5 bg-white border border-[#E9E9EB] hover:bg-slate-100 rounded-xl text-[#86868B] font-bold cursor-pointer"
                    >
                      Anulează
                    </button>
                    <button
                      onClick={handleCreateUser}
                      className="px-5 py-2.5 bg-[#034EA2] hover:bg-blue-600 text-white rounded-xl font-bold cursor-pointer"
                    >
                      Crează Cont în Sistem
                    </button>
                  </div>
                </div>
              )}

              {/* Căutare & Filtrare Interactivă */}
              <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-[#E9E9EB] grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                <div className="lg:col-span-4 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Search className="h-4 w-4 text-[#86868B]" />
                  </span>
                  <input
                    type="text"
                    placeholder="Caută după nume, email, telefon sau funcție..."
                    value={adminUserSearch}
                    onChange={(e) => setAdminUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#E9E9EB] rounded-xl text-xs font-bold text-[#1D1D1F] outline-none focus:border-[#034EA2]"
                  />
                  {adminUserSearch && (
                    <button 
                      onClick={() => setAdminUserSearch("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="lg:col-span-8 flex flex-wrap gap-1.5 justify-start lg:justify-end">
                  <span className="text-[10px] uppercase font-black text-[#86868B] mr-2 self-center">Filtrează Rol:</span>
                  {[
                    { id: "all", label: "Toți" },
                    { id: "owner", label: "Owner" },
                    { id: "admin", label: "Admin" },
                    { id: "reception", label: "Recepție" },
                    { id: "mechanic", label: "Mecanici" },
                    { id: "accountant", label: "Contabili" },
                    { id: "hr", label: "HR" },
                    { id: "client", label: "Clienți" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setAdminRoleFilter(tab.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        adminRoleFilter === tab.id
                          ? "bg-[#1D1D1F] text-white"
                          : "bg-white border border-[#E9E9EB] text-[#5C5C5C] hover:bg-slate-50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout principal: Listă utilizatori + Detalii Permisiuni Rol */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Coloana Stângă: Listă utilizatori filtrați (Col-span 7) */}
                <div className="lg:col-span-7 space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredUsers.length === 0 ? (
                    <div className="p-10 text-center border-2 border-dashed border-[#E9E9EB] rounded-2xl text-slate-400 font-bold">
                      Nu s-au găsit utilizatori conform criteriilor de căutare.
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div 
                        key={user.id} 
                        className={`p-4 bg-[#F2F2F7] rounded-2xl border transition-all group ${
                          editingUserId === user.id ? "bg-white border-[#034EA2]" : "border-[#F2F2F7] hover:bg-white hover:border-[#034EA2]/30"
                        }`}
                      >
                        {editingUserId === user.id ? (
                          // Formular complet de editare pe rând
                          <div className="space-y-3.5 text-xs text-left p-2">
                            <div className="flex justify-between items-center border-b border-[#E9E9EB] pb-2">
                              <h6 className="font-extrabold text-[#034EA2] text-[10.5px] uppercase tracking-normal">
                                Modificare directă profil: {user.name}
                              </h6>
                              <span className="text-[9px] text-[#86868B] font-mono">ID: {user.id}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              <div className="space-y-1">
                                <label className="font-bold text-[#5C5C5C]">Nume complet:</label>
                                <input 
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="w-full bg-white border border-[#E9E9EB] p-2.5 rounded-xl outline-none font-bold text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-bold text-[#5C5C5C]">Email:</label>
                                <input 
                                  value={editEmail}
                                  onChange={(e) => setEditEmail(e.target.value)}
                                  className="w-full bg-white border border-[#E9E9EB] p-2.5 rounded-xl outline-none font-bold text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-bold text-[#5C5C5C]">Telefon mobil:</label>
                                <input 
                                  value={editPhone}
                                  onChange={(e) => setEditPhone(e.target.value)}
                                  className="w-full bg-white border border-[#E9E9EB] p-2.5 rounded-xl outline-none font-bold text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-bold text-[#5C5C5C]">Titlu/Funcție:</label>
                                <input 
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  placeholder="N nespecificat"
                                  className="w-full bg-white border border-[#E9E9EB] p-2.5 rounded-xl outline-none font-bold text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-bold text-[#5C5C5C]">Parolă Cont:</label>
                                <input 
                                  type="password"
                                  value={editPassword}
                                  onChange={(e) => setEditPassword(e.target.value)}
                                  placeholder="******"
                                  className="w-full bg-white border border-[#E9E9EB] p-2.5 rounded-xl outline-none font-bold text-xs"
                                />
                              </div>
                              <div className="space-y-1 sm:col-span-2">
                                <label className="font-bold text-[#5C5C5C]">Rol Acces Sistem (RBAC unificat):</label>
                                <select 
                                  value={editRole}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEditRole(val);
                                    if (val === "client") {
                                      setEditTitle("");
                                    } else {
                                      const found = rolesCatalog.find(r => r.id === val);
                                      if (found) {
                                        setEditTitle(found.title);
                                      }
                                    }
                                  }}
                                  className="w-full bg-white border border-[#E9E9EB] p-2.5 rounded-xl outline-none font-bold text-xs"
                                >
                                  <option value="client">Client (Doar acces Portal)</option>
                                  {rolesCatalog.map((role) => (
                                    <option key={role.id} value={role.id}>
                                      {role.title} ({role.role})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-2.5 border-t border-[#E9E9EB] mt-3">
                              <button
                                onClick={() => setEditingUserId(null)}
                                className="px-3.5 py-2 bg-white border border-[#E9E9EB] hover:bg-slate-50 rounded-xl font-bold text-[#86868B] cursor-pointer"
                              >
                                Anulează
                              </button>
                              <button
                                onClick={() => handleUpdateUser(user.id, { 
                                  name: editName, 
                                  email: editEmail, 
                                  phone: editPhone, 
                                  password: editPassword,
                                  role: editRole === "client" ? UserRole.CLIENT : getEquivalentSystemRole(editRole),
                                  title: editTitle || undefined
                                })}
                                className="px-4 py-2 bg-[#034EA2] hover:opacity-95 text-white rounded-xl font-bold cursor-pointer"
                              >
                                Salvează Modificări
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Format Vizualizare Standard
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img 
                                  src={user.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.id}`} 
                                  alt={user.name} 
                                  className="w-11 h-11 rounded-xl object-cover shadow-sm bg-slate-200"
                                />
                                <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                  user.role === UserRole.CLIENT ? "bg-emerald-500" : "bg-[#034EA2]"
                                }`} />
                              </div>
                              <div className="text-left">
                                <h6 className="font-bold text-xs text-[#1D1D1F] flex items-center gap-1.5 flex-wrap">
                                  <span>{user.name}</span>
                                  {user.title && (
                                    <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
                                      {user.title}
                                    </span>
                                  )}
                                </h6>
                                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-[#86868B] text-[10.5px]">
                                  <span className="font-extrabold text-[#034EA2] uppercase tracking-normal">
                                    {user.role}
                                  </span>
                                  <span>•</span>
                                  <span className="font-semibold">{user.email}</span>
                                  {user.phone && (
                                    <>
                                      <span>•</span>
                                      <span className="font-mono">{user.phone}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions buttons */}
                            <div className="flex items-center gap-1.5 self-end sm:self-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => { 
                                  setEditName(user.name); 
                                  setEditEmail(user.email); 
                                  setEditPhone(user.phone || ""); 
                                  setEditPassword(user.password || "");
                                  const catalogRole = rolesCatalog.find(r => r.title === user.title || (user.title && r.title.toLowerCase().includes(user.title.toLowerCase())));
                                  let matchedRole = "client";
                                  if (catalogRole) {
                                    matchedRole = catalogRole.id;
                                  } else {
                                    if (user.role === UserRole.ADMIN || user.role === UserRole.OWNER) matchedRole = "admin";
                                    else if (user.role === UserRole.ACCOUNTANT) matchedRole = "accountant";
                                    else if (user.role === UserRole.HR) matchedRole = "admin";
                                    else if (user.role === UserRole.MECHANIC) matchedRole = "mechanic";
                                    else if (user.role === UserRole.RECEPTION) matchedRole = "reception";
                                  }
                                  setEditRole(matchedRole); 
                                  setEditTitle(user.title || "");
                                  setEditingUserId(user.id); 
                                }}
                                className="p-2 bg-white text-[#034EA2] border border-[#E9E9EB] hover:bg-[#034EA2] hover:text-white rounded-xl transition-all cursor-pointer shadow-xs"
                                title="Editează cont credențiale"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              
                              {user.role !== UserRole.OWNER && (
                                <button 
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-2 bg-white text-rose-600 border border-[#E9E9EB] hover:bg-rose-600 hover:text-white rounded-xl transition-all cursor-pointer shadow-xs"
                                  title="Șterge definitiv contul"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Coloana Dreaptă: Matrice Drepturi & Explicație Permisiuni (Col-span 5) */}
                <div className="lg:col-span-5 bg-slate-50 border border-[#E9E9EB] rounded-2xl p-5 space-y-4 text-xs font-medium text-[#5C5C5C]">
                  <div className="border-b border-[#E9E9EB] pb-3">
                    <h5 className="font-black text-sm text-[#1D1D1F] uppercase tracking-normal flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-amber-500" />
                      Matrice Drepturi Active
                    </h5>
                    <p className="text-[10px] text-[#86868B] font-bold mt-0.5">
                      Fiecare cont are drepturi generate automat din rolul atribuit.
                    </p>
                  </div>

                  {/* Descriere permisiuni pe rol selectat în listă sau filtre */}
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-[#E9E9EB] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase text-[#034EA2]">Nivel Securitate</span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#034EA2] font-mono text-[9px] uppercase font-bold">
                          {adminRoleFilter !== "all" ? adminRoleFilter : "Multi-Rol"}
                        </span>
                      </div>
                      
                      <h6 className="font-bold text-[#1D1D1F]">
                        {adminRoleFilter === "all" ? "Membru înregistrat" : `Rol selectat: ${adminRoleFilter.toUpperCase()}`}
                      </h6>

                      <div className="space-y-2 text-[11px] font-bold">
                        <div className="flex items-center justify-between">
                          <span>Acces Portal Clienți</span>
                          <span className="text-emerald-600">ACTIV</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                          <span>Salvare/Restaurare DB JSON</span>
                          <span className={["owner", "admin"].includes(adminRoleFilter) ? "text-emerald-500" : "text-amber-500"}>
                            {["owner", "admin", "all"].includes(adminRoleFilter) ? "CONFIRMAT" : "RESTRÂNS"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                          <span>Editare Manoperă și Piese</span>
                          <span className={["owner", "admin", "reception", "accountant"].includes(adminRoleFilter) ? "text-emerald-500" : "text-[#86868B]"}>
                            {["owner", "admin", "reception", "accountant"].includes(adminRoleFilter) ? "AUTORIZAT" : "CITIRE DOAR"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                          <span>Management Dosare Personal/CIM</span>
                          <span className={["owner", "hr", "admin"].includes(adminRoleFilter) ? "text-blue-600" : "text-[#86868B]"}>
                            {["owner", "hr", "admin"].includes(adminRoleFilter) ? "DREPT CONSFIND" : "BLOCAT"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RBAC Alignment Notice to satisfy linking of HR and Admin page */}
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 space-y-2 leading-relaxed">
                      <p className="font-extrabold uppercase tracking-wide flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        Compatibilitate Fișe HR
                      </p>
                      <p className="font-bold">
                        Modificările aduse în acest panou actualizează automat profilele afișate în ecranele <strong>Resurse Umane (HR)</strong>, <strong>Atelier Service</strong> și <strong>Financiar/Facturare</strong>.
                      </p>
                      <p className="font-medium text-[10px]">
                        Asigurați-vă că atribuiți rolul de <code className="bg-amber-100 px-1 py-0.5 rounded">Mecanic</code> utilizatorilor care trebuie să pontaze în atelier sau <code className="bg-amber-100 px-1 py-0.5 rounded">HR</code> pentru cei ce gestionează dosarele.
                      </p>
                    </div>

                    {/* SETARI GLOBALE ECHIVALENTE - Samsung One UI 8 Inspired Design */}
                    <div className="bg-[#F2F2F7] border border-[#E9E9EB] p-5 rounded-2xl space-y-4 text-[11px] text-left">
                      <div className="space-y-1">
                        <p className="font-extrabold uppercase tracking-wide flex items-center gap-1.5 text-[#034EA2]">
                          <Settings className="w-4 h-4 text-[#034EA2]" />
                          Banchetă Echivalențe Globale (RBAC)
                        </p>
                        <p className="text-[10px] text-[#86868B] font-bold">
                          Corelare directă automată între Catalogul Funcțiilor HR și Rolurile Sistem de securitate active:
                        </p>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#E9E9EB] space-y-2 text-[#5C5C5C] font-semibold leading-relaxed">
                        <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                          <span className="text-[#1D1D1F]">Dir. Service / Admin</span>
                          <span className="font-mono text-[9px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded uppercase font-bold">💎 ADMIN/OWNER</span>
                        </div>
                        <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                          <span className="text-[#1D1D1F]">Contabil / Economist</span>
                           <span className="font-mono text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase font-bold">📈 CONTABIL</span>
                        </div>
                        <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                          <span className="text-[#1D1D1F]">Specialist Resurse Umane</span>
                          <span className="font-mono text-[9px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded uppercase font-bold">💼 HR</span>
                        </div>
                        <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                          <span className="text-[#1D1D1F]">Mecanici & Specialiști Atelier</span>
                          <span className="font-mono text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded uppercase font-bold">🛠️ MECANIC</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#1D1D1F]">Recepționer / Achizitor / Alții</span>
                          <span className="font-mono text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded uppercase font-bold">👥 RECEPTIE / USER</span>
                        </div>
                      </div>

                      <button
                        onClick={handleApplyGlobalRbacSettings}
                        className="w-full py-3 bg-[#034EA2] hover:bg-blue-600 active:scale-95 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-100 uppercase tracking-wider text-[10px] cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Aplica și Salvează Setări Globale
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* SECTIUNE SECUNDARA PENTRU STATISTICI GENERALE SI MENTENANTĂ BAZĂ DATE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Statistici Tabele */}
              <div className="bg-white rounded-3xl p-6 border border-[#E9E9EB] shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-[#F2F2F7] pb-3 mb-2">
                  <Layers className="w-5 h-5 text-[#034EA2]" />
                  <h4 className="font-black text-xs text-[#1D1D1F] uppercase tracking-normal">
                    Structură Volume Date
                  </h4>
                </div>
                
                <div className="space-y-2">
                  {[
                    { name: "Utilizatori înregistrați", count: users.length, icon: <Users className="w-4 h-4" /> },
                    { name: "Clasa Vehicule", count: vehicles.length, icon: <Car className="w-4 h-4" /> },
                    { name: "Sarcini Service (Atelier)", count: serviceJobs.length, icon: <Wrench className="w-4 h-4" /> },
                    { name: "Pontaje personal tehnic", count: timesheets.length, icon: <Clock className="w-4 h-4" /> },
                    { name: "Facturi fiscale emise", count: invoices.length, icon: <FileJson className="w-4 h-4" /> }
                  ].map((tbl) => (
                    <div key={tbl.name} className="flex justify-between items-center py-2 px-3.5 bg-[#F8F9FA] rounded-[16px] border border-[#E9E9EB]">
                      <div className="flex items-center gap-3">
                        <div className="text-[#86868B]">{tbl.icon}</div>
                        <span className="font-bold text-[10.5px] text-[#464646] uppercase tracking-normal">{tbl.name}</span>
                      </div>
                      <span className="text-[11px] font-black text-[#1D1D1F] bg-white px-2.5 py-0.5 rounded-lg border border-[#E9E9EB]">
                        {tbl.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentenanță și resetare */}
              <div className="bg-white border border-[#E9E9EB] rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#F2F2F7] pb-3 mb-2">
                    <Settings className="w-5 h-5 text-[#034EA2]" />
                    <h4 className="font-black text-xs text-[#1D1D1F] uppercase tracking-wide">Panou Mentenanță Bază Date</h4>
                  </div>
                  <p className="text-xs text-[#86868B] font-bold leading-relaxed">
                    Salvați sau încărcați tabelele direct din calculatorul dumneavoastră personal ca document structurat JSON pentru protecția datelor.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => setActiveView?.("maintenance")}
                    className="bg-[#034EA2] text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-[#1D1D1F] cursor-pointer text-xs uppercase tracking-normal"
                  >
                    <Database className="w-4 h-4" /> Modul Mentenanță
                  </button>
                  <button
                    onClick={handleDeleteDatabase}
                    className="bg-white border border-rose-200 text-rose-600 font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-rose-50 cursor-pointer text-xs uppercase tracking-normal"
                  >
                    <Trash2 className="w-4 h-4" /> Resetare completă
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        </div>
      </div>
    </div>
  );
}
