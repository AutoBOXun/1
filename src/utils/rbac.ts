import { UserRole } from "../types";

export type StaffCategory = "administrativ" | "tehnic" | "auxiliar";

export interface RBACPermissions {
  viewFinancials: boolean;
  editInventory: boolean;
  manageClients: boolean;
  manageWorkorders: boolean;
  logLaborHours: boolean;
  viewAllEmployeeSheets: boolean;
  approveVacations: boolean;
  editCatalogAndServices: boolean;
}

export interface RoleAccessProfile {
  id: string; // Ex: admin, purchaser, mechanic, washer
  title: string; // Ex: Manager Achiziții Piese
  category: StaffCategory;
  systemRole: UserRole;
  permissions: RBACPermissions;
  annualLeaveDays: number;
  baseSalaryMDL: number;
}

// Maparea inteligentă și stabilirea rolurilor de acces fundamentale ale sistemului (RBAC)
export const roleAccessProfiles: RoleAccessProfile[] = [
  {
    id: "owner",
    title: "Proprietar",
    category: "administrativ",
    systemRole: UserRole.OWNER,
    annualLeaveDays: 30,
    baseSalaryMDL: 15000,
    permissions: {
      viewFinancials: true,
      editInventory: true,
      manageClients: true,
      manageWorkorders: true,
      logLaborHours: true,
      viewAllEmployeeSheets: true,
      approveVacations: true,
      editCatalogAndServices: true
    }
  },
  {
    id: "admin",
    title: "Director Service / Administrator",
    category: "administrativ",
    systemRole: UserRole.ADMIN,
    annualLeaveDays: 28,
    baseSalaryMDL: 12000,
    permissions: {
      viewFinancials: true,
      editInventory: true,
      manageClients: true,
      manageWorkorders: true,
      logLaborHours: true,
      viewAllEmployeeSheets: true,
      approveVacations: true,
      editCatalogAndServices: true
    }
  },
  {
    id: "reception",
    title: "Maistru-Receptor / Consilier Service",
    category: "administrativ",
    systemRole: UserRole.RECEPTION,
    annualLeaveDays: 28,
    baseSalaryMDL: 8000,
    permissions: {
      viewFinancials: false,
      editInventory: true,
      manageClients: true,
      manageWorkorders: true,
      logLaborHours: true,
      viewAllEmployeeSheets: false,
      approveVacations: false,
      editCatalogAndServices: false
    }
  },
  {
    id: "purchaser",
    title: "Manager Achiziții Piese",
    category: "administrativ",
    systemRole: UserRole.RECEPTION, // Sistem echivalent
    annualLeaveDays: 28,
    baseSalaryMDL: 7500,
    permissions: {
      viewFinancials: false,
      editInventory: true,
      manageClients: false,
      manageWorkorders: true, // pentru piese pe devize
      logLaborHours: false,
      viewAllEmployeeSheets: false,
      approveVacations: false,
      editCatalogAndServices: false
    }
  },
  {
    id: "accountant",
    title: "Contabil / Economist",
    category: "administrativ",
    systemRole: UserRole.ACCOUNTANT,
    annualLeaveDays: 28,
    baseSalaryMDL: 9000,
    permissions: {
      viewFinancials: true,
      editInventory: true,
      manageClients: false,
      manageWorkorders: false,
      logLaborHours: false,
      viewAllEmployeeSheets: true,
      approveVacations: false,
      editCatalogAndServices: false
    }
  },
  {
    id: "hr",
    title: "Specialist Resurse Umane",
    category: "administrativ",
    systemRole: UserRole.HR,
    annualLeaveDays: 28,
    baseSalaryMDL: 8500,
    permissions: {
      viewFinancials: false,
      editInventory: false,
      manageClients: false,
      manageWorkorders: false,
      logLaborHours: false,
      viewAllEmployeeSheets: true,
      approveVacations: true,
      editCatalogAndServices: false
    }
  },
  // --- Personal Tehnic ---
  {
    id: "mechanic",
    title: "Mecanic Auto (Universal)",
    category: "tehnic",
    systemRole: UserRole.MECHANIC,
    annualLeaveDays: 28,
    baseSalaryMDL: 6000,
    permissions: {
      viewFinancials: false,
      editInventory: false,
      manageClients: false,
      manageWorkorders: false,
      logLaborHours: true,
      viewAllEmployeeSheets: false,
      approveVacations: false,
      editCatalogAndServices: false
    }
  },
  {
    id: "electrician",
    title: "Electrician Auto / Diagnostician",
    category: "tehnic",
    systemRole: UserRole.MECHANIC,
    annualLeaveDays: 28,
    baseSalaryMDL: 6500,
    permissions: {
      viewFinancials: false,
      editInventory: false,
      manageClients: false,
      manageWorkorders: false,
      logLaborHours: true,
      viewAllEmployeeSheets: false,
      approveVacations: false,
      editCatalogAndServices: false
    }
  },
  {
    id: "motorist",
    title: "Motorist",
    category: "tehnic",
    systemRole: UserRole.MECHANIC,
    annualLeaveDays: 28,
    baseSalaryMDL: 7000,
    permissions: {
      viewFinancials: false,
      editInventory: false,
      manageClients: false,
      manageWorkorders: false,
      logLaborHours: true,
      viewAllEmployeeSheets: false,
      approveVacations: false,
      editCatalogAndServices: false
    }
  },
  {
    id: "geometry",
    title: "Specialist Geometrie Roți",
    category: "tehnic",
    systemRole: UserRole.MECHANIC,
    annualLeaveDays: 28,
    baseSalaryMDL: 5500,
    permissions: {
      viewFinancials: false,
      editInventory: false,
      manageClients: false,
      manageWorkorders: false,
      logLaborHours: true,
      viewAllEmployeeSheets: false,
      approveVacations: false,
      editCatalogAndServices: false
    }
  },
  {
    id: "bodywork",
    title: "Tinichigiu Auto",
    category: "tehnic",
    systemRole: UserRole.MECHANIC,
    annualLeaveDays: 28,
    baseSalaryMDL: 5800,
    permissions: {
      viewFinancials: false,
      editInventory: false,
      manageClients: false,
      manageWorkorders: false,
      logLaborHours: true,
      viewAllEmployeeSheets: false,
      approveVacations: false,
      editCatalogAndServices: false
    }
  },
  {
    id: "painter",
    title: "Pregătitor / Vopsitor Auto",
    category: "tehnic",
    systemRole: UserRole.MECHANIC,
    annualLeaveDays: 28,
    baseSalaryMDL: 5800,
    permissions: {
      viewFinancials: false,
      editInventory: false,
      manageClients: false,
      manageWorkorders: false,
      logLaborHours: true,
      viewAllEmployeeSheets: false,
      approveVacations: false,
      editCatalogAndServices: false
    }
  },
  {
    id: "detailing",
    title: "Specialist Detailing / Polishator",
    category: "tehnic",
    systemRole: UserRole.MECHANIC,
    annualLeaveDays: 28,
    baseSalaryMDL: 5500,
    permissions: {
      viewFinancials: false,
      editInventory: false,
      manageClients: false,
      manageWorkorders: false,
      logLaborHours: true,
      viewAllEmployeeSheets: false,
      approveVacations: false,
      editCatalogAndServices: false
    }
  },
  {
    id: "tire",
    title: "Vulcanizator",
    category: "tehnic",
    systemRole: UserRole.MECHANIC,
    annualLeaveDays: 28,
    baseSalaryMDL: 5000,
    permissions: {
      viewFinancials: false,
      editInventory: false,
      manageClients: false,
      manageWorkorders: false,
      logLaborHours: true,
      viewAllEmployeeSheets: false,
      approveVacations: false,
      editCatalogAndServices: false
    }
  },
  // --- Personal Auxiliar ---
  {
    id: "washer",
    title: "Spălător Auto",
    category: "auxiliar",
    systemRole: UserRole.MECHANIC, // Functional ca mecanic pt pontaje/lucrari
    annualLeaveDays: 28,
    baseSalaryMDL: 4500,
    permissions: {
      viewFinancials: false,
      editInventory: false,
      manageClients: false,
      manageWorkorders: false,
      logLaborHours: true,
      viewAllEmployeeSheets: false,
      approveVacations: false,
      editCatalogAndServices: false
    }
  },
  {
    id: "auxiliary",
    title: "Muncitor Auxiliar",
    category: "auxiliar",
    systemRole: UserRole.MECHANIC,
    annualLeaveDays: 28,
    baseSalaryMDL: 4500,
    permissions: {
      viewFinancials: false,
      editInventory: false,
      manageClients: false,
      manageWorkorders: false,
      logLaborHours: true,
      viewAllEmployeeSheets: false,
      approveVacations: false,
      editCatalogAndServices: false
    }
  }
];

// Mapare inteligenta bazata pe titlu sau id-ul rolului
export function getEquivalentProfile(titleOrIdOrRole: string): RoleAccessProfile {
  const norm = titleOrIdOrRole.toLowerCase();

  // 1. Căutare directă după ID-ul profilului
  const exactById = roleAccessProfiles.find(p => p.id === norm);
  if (exactById) return exactById;

  // 2. Căutare după titlul funcției (clauză parțială sau exactă)
  const byTitle = roleAccessProfiles.find(p => p.title.toLowerCase().includes(norm) || norm.includes(p.title.toLowerCase()));
  if (byTitle) return byTitle;

  // 3. Fallback inteligente în funcție de cuvinte cheie
  if (norm.includes("director") || norm.includes("proprietar") || norm.includes("owner") || norm.includes("admin")) {
    return roleAccessProfiles.find(p => p.id === "admin") || roleAccessProfiles[0];
  }
  if (norm.includes("achizit") || norm.includes("piese") || norm.includes("purchas")) {
    return roleAccessProfiles.find(p => p.id === "purchaser") || roleAccessProfiles[2];
  }
  if (norm.includes("recept") || norm.includes("consilier") || norm.includes("maistru")) {
    return roleAccessProfiles.find(p => p.id === "reception") || roleAccessProfiles[2];
  }
  if (norm.includes("contabil") || norm.includes("economist") || norm.includes("fiscal")) {
    return roleAccessProfiles.find(p => p.id === "accountant") || roleAccessProfiles[4];
  }
  if (norm.includes("hr") || norm.includes("resurse umane") || norm.includes("personal")) {
    return roleAccessProfiles.find(p => p.id === "hr") || roleAccessProfiles[5];
  }
  if (norm.includes("mecanic") || norm.includes("inginer")) {
    return roleAccessProfiles.find(p => p.id === "mechanic") || roleAccessProfiles[6];
  }
  if (norm.includes("electric") || norm.includes("diagnost")) {
    return roleAccessProfiles.find(p => p.id === "electrician") || roleAccessProfiles[6];
  }
  if (norm.includes("motor")) {
    return roleAccessProfiles.find(p => p.id === "motorist") || roleAccessProfiles[6];
  }
  if (norm.includes("spălător") || norm.includes("spalator")) {
    return roleAccessProfiles.find(p => p.id === "washer") || roleAccessProfiles[roleAccessProfiles.length - 2];
  }
  if (norm.includes("auxiliar") || norm.includes("serviciu") || norm.includes("curat")) {
    return roleAccessProfiles.find(p => p.id === "auxiliary") || roleAccessProfiles[roleAccessProfiles.length - 1];
  }

  // Fallback direct pentru echipe mecanice generale
  return roleAccessProfiles.find(p => p.id === "mechanic") || roleAccessProfiles[6];
}
