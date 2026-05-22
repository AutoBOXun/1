/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  CLIENT = "Client",
  ADMIN = "Admin",
  RECEPTION = "Receptie",
  MECHANIC = "Mecanic",
  ACCOUNTANT = "Contabil",
  OWNER = "Owner",
  HR = "HR"
}

export enum JobStatus {
  SCHEDULED = "Programat",
  IN_RECEPTION = "În recepție",
  IN_PROGRESS = "În lucru",
  AWAITING_PARTS = "Așteaptă piese",
  FINISHED = "Finalizat",
  READY_FOR_DELIVERY = "Pregătit pentru livrare"
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  title?: string; // Specific job title (e.g. "Electrician-Diagnostician")
  avatarUrl?: string;
  password?: string;
}

export interface Vehicle {
  id: string;
  clientId: string; // Relatia cu User (Client)
  brand: string;
  model: string;
  licensePlate: string; // Nr. Înmatriculare
  vin: string; // Seria de sasiu (17 caractere)
  year: number;
  engine: string; // Ex: 2.0 TDI
  engineDisplacement?: string; // Ex: 1968 cmc
  fuelType?: "Benzină" | "Diesel" | "Hibrid" | "Electric" | "GPL";
  powerHP?: number; // Cai putere
  transmission?: "Manuală" | "Automată";
  color?: string;
  mileage?: number; // Kilometraj actual
}

export interface ServiceType {
  id: string;
  name: string;
  description?: string;
  category: "Mecanică" | "Electrică" | "Diagnoză" | "Revizie" | "Climatizare" | "Frâne" | "Direcție" | "Vulcanizare" | "Vopsitorie";
  estimatedDuration: number; // in minute
  estimatedPrice: number; // pret estimativ in MDL
  warrantyMonths?: number; // Luni garantie (default 12)
}

export interface Appointment {
  id: string;
  clientId: string;
  vehicleId: string;
  serviceTypeIds: string[]; // Suport pentru servicii multiple
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes?: string;
  status: "Pending" | "Confirmed" | "Canceled";
  createdAt: string;
}

export interface DamagePhoto {
  id: string;
  jobId: string;
  url: string;
  description: string;
  dateAdded: string;
}

export interface JobCardPart {
  id: string;
  partId: string;
  name: string;
  oemCode: string;
  quantity: number;
  sellPrice: number; // Pretul cu care se vinde clientului
}

export interface JobCardLabor {
  id: string;
  mechanicId: string;
  description: string;
  hoursSpent: number;
  hourlyRate: number; // Pret manopera/ora
  commissionRate: number; // Procent comision mecanic (ex: 30%)
}

export interface ServiceJob {
  id: string;
  appointmentId?: string;
  vehicleId: string;
  clientId: string;
  allocatedMechanicId?: string; // Mecanicul alocat direct fisei
  status: JobStatus;
  receptionNotes?: string;
  reportedFaults: string; // Probleme reclamate
  diagnosedProblems?: string; // Diagnostic constatat
  parts: JobCardPart[];
  labor: JobCardLabor[];
  damages: DamagePhoto[];
  entryDate: string; // Data primire
  estimatedFinishDate?: string; // Data estimata finalizare
  realFinishDate?: string; // Data reala finalizare
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  deliveryTimeDays: number;
}

export interface InventoryItem {
  id: string;
  oemCode: string; // Cod OEM original
  aftermarketCode?: string; // Cod aftermarket
  name: string;
  brand: string; // Producator
  purchasePrice: number; // Pret achizitie
  sellPrice: number; // Pret vanzare recomandat
  currentStock: number;
  minStockLevel: number; // Alertele de stoc minim
  supplierId: string;
}

export interface Timesheet {
  id: string;
  employeeId: string; // Relatie cu User (Mecanic / Receptie)
  jobId?: string; // Daca este relationat direct cu o fisa de service
  date: string;
  hoursWorked: number;
  notes?: string;
  basePay: number; // Plata de baza pe zi sau ora
  commissionEarned: number; // Comisioane acumulate
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  jobId: string;
  invoiceNumber: string; // Serie / Numar ex: RO-AUTO-0023
  issueDate: string;
  dueDate: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  vehicleDetails: string; // Brand, model, nr inmatriculare
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number; // Ex: 19%
  vatAmount: number;
  total: number;
  isPaid: boolean;
  paymentDate?: string;
  paymentMethod?: "Cash" | "Card" | "OP";
}

export interface Expense {
  id: string;
  category: "Piese" | "Utilități" | "Chirie" | "Salarii" | "Marketing" | "Diverse";
  description: string;
  amount: number;
  date: string;
  paymentStatus: "Pending" | "Paid";
  supplierId?: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: "IN" | "OUT";
  quantity: number;
  reason: string;
  date: string;
  userId: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: "info" | "success" | "warning" | "alert";
  link?: string;
}
