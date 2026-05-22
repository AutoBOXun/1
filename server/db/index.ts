import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { User, Vehicle, ServiceType, Appointment, ServiceJob, InventoryItem, Supplier, Timesheet, Invoice, UserRole } from "../../src/types";
import { 
  initialUsers, initialVehicles, initialServiceTypes, initialSuppliers, 
  initialInventoryItems, initialAppointments, initialServiceJobs, 
  initialInvoices, initialTimesheets 
} from "../../src/data";

interface UserCredential {
  userId: string;
  passwordHash: string;
}

export interface ActiveWorkTimer {
  id: string;
  mechanicId: string;
  jobId: string;
  startTime: string; // ISO string
}

interface DatabaseSchema {
  users: User[];
  credentials: UserCredential[];
  vehicles: Vehicle[];
  serviceTypes: ServiceType[];
  suppliers: Supplier[];
  inventoryItems: InventoryItem[];
  appointments: Appointment[];
  serviceJobs: ServiceJob[];
  timesheets: Timesheet[];
  invoices: Invoice[];
  activeTimers?: ActiveWorkTimer[];
}

const DB_FILE_PATH = path.join(process.cwd(), "db.json");

class DatabaseConnection {
  private data!: DatabaseSchema;

  constructor() {
    this.readFromDisk();
  }

  private readFromDisk() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, "utf-8");
        this.data = JSON.parse(fileContent);
        if (!this.data.activeTimers) {
          this.data.activeTimers = [];
        }
      } else {
        this.seedInitialData();
      }
    } catch (error) {
      console.error("Database connection - failed to read from disk. Falling back to seed data:", error);
      this.seedInitialData();
    }
  }

  private seedInitialData() {
    console.log("Seeding initial database...");
    
    // Hash default passwords
    // Client: u-1, u-2, u-3 -> password "client123"
    // Staff Admin: u-4 -> password "admin123"
    // Mechanic: u-5, u-6 -> password "mecanic123"
    // Reception: u-7 -> password "receptie123"
    // Accountant: u-8 -> password "contabil123"
    const credentials: UserCredential[] = [
      { userId: "u-1", passwordHash: bcrypt.hashSync("client123", 10) },
      { userId: "u-2", passwordHash: bcrypt.hashSync("client123", 10) },
      { userId: "u-3", passwordHash: bcrypt.hashSync("client123", 10) },
      { userId: "u-4", passwordHash: bcrypt.hashSync("admin123", 10) },
      { userId: "u-5", passwordHash: bcrypt.hashSync("mecanic123", 10) },
      { userId: "u-6", passwordHash: bcrypt.hashSync("mecanic123", 10) },
      { userId: "u-7", passwordHash: bcrypt.hashSync("receptie123", 10) },
      { userId: "u-8", passwordHash: bcrypt.hashSync("contabil123", 10) },
      { userId: "u-owner", passwordHash: bcrypt.hashSync("franta05", 10) }
    ];

    this.data = {
      users: initialUsers,
      credentials,
      vehicles: initialVehicles,
      serviceTypes: initialServiceTypes,
      suppliers: initialSuppliers,
      inventoryItems: initialInventoryItems,
      appointments: initialAppointments,
      serviceJobs: initialServiceJobs,
      timesheets: initialTimesheets,
      invoices: initialInvoices,
      activeTimers: []
    };

    this.saveToDisk();
  }

  public saveToDisk() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (error) {
      console.error("Database connection - failed to save to disk:", error);
    }
  }

  // Getters
  public getUsers(): User[] { return this.data.users; }
  public getCredentials(): UserCredential[] { return this.data.credentials; }
  public getVehicles(): Vehicle[] { return this.data.vehicles; }
  public getServiceTypes(): ServiceType[] { return this.data.serviceTypes; }
  public getSuppliers(): Supplier[] { return this.data.suppliers; }
  public getInventoryItems(): InventoryItem[] { return this.data.inventoryItems; }
  public getAppointments(): Appointment[] { return this.data.appointments; }
  public getServiceJobs(): ServiceJob[] { return this.data.serviceJobs; }
  public getTimesheets(): Timesheet[] { return this.data.timesheets; }
  public getInvoices(): Invoice[] { return this.data.invoices; }
  public getActiveTimers(): ActiveWorkTimer[] {
    if (!this.data.activeTimers) this.data.activeTimers = [];
    return this.data.activeTimers;
  }

  // Setters
  public setUsers(users: User[]) { this.data.users = users; this.saveToDisk(); }
  public addCredential(cred: UserCredential) { this.data.credentials.push(cred); this.saveToDisk(); }
  public setVehicles(vehicles: Vehicle[]) { this.data.vehicles = vehicles; this.saveToDisk(); }
  public setAppointments(appointments: Appointment[]) { this.data.appointments = appointments; this.saveToDisk(); }
  public setServiceJobs(serviceJobs: ServiceJob[]) { this.data.serviceJobs = serviceJobs; this.saveToDisk(); }
  public setInventoryItems(items: InventoryItem[]) { this.data.inventoryItems = items; this.saveToDisk(); }
  public setTimesheets(timesheets: Timesheet[]) { this.data.timesheets = timesheets; this.saveToDisk(); }
  public setInvoices(invoices: Invoice[]) { this.data.invoices = invoices; this.saveToDisk(); }
  public setActiveTimers(timers: ActiveWorkTimer[]) { this.data.activeTimers = timers; this.saveToDisk(); }
}

export const db = new DatabaseConnection();
