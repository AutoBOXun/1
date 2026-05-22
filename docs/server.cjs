var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express4 = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");

// server/routes/auth.ts
var import_express = require("express");
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);

// server/db/index.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);

// src/types.ts
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["CLIENT"] = "Client";
  UserRole2["ADMIN"] = "Admin";
  UserRole2["RECEPTION"] = "Receptie";
  UserRole2["MECHANIC"] = "Mecanic";
  UserRole2["ACCOUNTANT"] = "Contabil";
  UserRole2["OWNER"] = "Owner";
  UserRole2["HR"] = "HR";
  return UserRole2;
})(UserRole || {});
var JobStatus = /* @__PURE__ */ ((JobStatus2) => {
  JobStatus2["SCHEDULED"] = "Programat";
  JobStatus2["IN_RECEPTION"] = "\xCEn recep\u021Bie";
  JobStatus2["IN_PROGRESS"] = "\xCEn lucru";
  JobStatus2["AWAITING_PARTS"] = "A\u0219teapt\u0103 piese";
  JobStatus2["FINISHED"] = "Finalizat";
  JobStatus2["READY_FOR_DELIVERY"] = "Preg\u0103tit pentru livrare";
  return JobStatus2;
})(JobStatus || {});

// src/utils/avatarUtils.ts
var getRoleAvatar = (role) => {
  switch (role) {
    case "Admin" /* ADMIN */:
      return "/images/avatar_admin_1779391694663.png";
    case "HR" /* HR */:
      return "/images/avatar_hr_1779391678849.png";
    case "Contabil" /* ACCOUNTANT */:
      return "/images/avatar_accountant_1779391661361.png";
    case "Owner" /* OWNER */:
      return "/images/avatar_owner_1779391726901.png";
    case "Mecanic" /* MECHANIC */:
      return "/images/avatar_mechanic_1779391645210.png";
    case "Receptie" /* RECEPTION */:
      return "/images/avatar_reception_1779391742804.png";
    case "Client" /* CLIENT */:
      return "/images/avatar_client_1779391710003.png";
    default:
      return "/images/avatar_client_1779391710003.png";
  }
};

// src/data.ts
var initialUsers = [
  { id: "u-1", name: "Mihail Goreanu", email: "mihai@goreanu.md", phone: "069111222", role: "Client" /* CLIENT */, avatarUrl: getRoleAvatar("Client" /* CLIENT */), password: "parola123" },
  { id: "u-2", name: "Elena Vasiliu", email: "elena.v@gmail.md", phone: "068444555", role: "Client" /* CLIENT */, avatarUrl: getRoleAvatar("Client" /* CLIENT */), password: "parola123" },
  { id: "u-3", name: "Radu Pl\u0103m\u0103deal\u0103", email: "radu.p@gmail.md", phone: "079555666", role: "Client" /* CLIENT */, avatarUrl: getRoleAvatar("Client" /* CLIENT */), password: "parola123" },
  // staff
  { id: "u-4", name: "Lucian Avram", email: "lucian.avram@autoservice.md", phone: "060123456", role: "Admin" /* ADMIN */, title: "Director de Service", avatarUrl: getRoleAvatar("Admin" /* ADMIN */), password: "parola123" },
  { id: "u-5", name: "Andrei Nistor", email: "andrei.nistor@autoservice.md", phone: "060789101", role: "Mecanic" /* MECHANIC */, title: "Electrician Auto / Diagnostician", avatarUrl: getRoleAvatar("Mecanic" /* MECHANIC */), password: "parola123" },
  { id: "u-6", name: "Bogdan Marin", email: "bogdan.marin@autoservice.md", phone: "068112233", role: "Mecanic" /* MECHANIC */, title: "Mecanic Auto (Universal)", avatarUrl: getRoleAvatar("Mecanic" /* MECHANIC */), password: "parola123" },
  { id: "u-7", name: "Simona Dumitri\u021Ba", email: "simona.d@autoservice.md", phone: "079299887", role: "Receptie" /* RECEPTION */, title: "Maistru-Receptor / Consilier Service", avatarUrl: getRoleAvatar("Receptie" /* RECEPTION */), password: "parola123" },
  { id: "u-8", name: "Corneliu Codreanu", email: "contabil@autoservice.md", phone: "068112234", role: "Contabil" /* ACCOUNTANT */, title: "Contabil / Economist", avatarUrl: getRoleAvatar("Contabil" /* ACCOUNTANT */), password: "parola123" },
  { id: "u-9", name: "C\u0103t\u0103lina Rusu", email: "hr@autoservice.md", phone: "068334455", role: "HR" /* HR */, title: "Manager Resurse Umane", avatarUrl: getRoleAvatar("HR" /* HR */), password: "parola123" },
  { id: "u-owner", name: "Vasile Basile", email: "basile@autoservice.md", phone: "060999999", role: "Owner" /* OWNER */, title: "Administrator / Proprietar", avatarUrl: getRoleAvatar("Owner" /* OWNER */), password: "parola123" }
];
var initialVehicles = [
  { id: "v-1", clientId: "u-1", brand: "Dacia", model: "Duster", licensePlate: "UN-123-MG", vin: "UU1HSDDA123456789", year: 2021, engine: "1.5 dCi 115 HP", mileage: 48500 },
  { id: "v-2", clientId: "u-2", brand: "Volkswagen", model: "Golf 7", licensePlate: "UN-888-WE", vin: "WVWZZZAUZHW123456", year: 2018, engine: "2.0 TDI 150 HP", mileage: 124e3 },
  { id: "v-3", clientId: "u-3", brand: "BMW", model: "Seria 3", licensePlate: "UN-045-RD", vin: "WBA8A51000K123456", year: 2019, engine: "2.0 LCI 190 HP", mileage: 98e3 }
];
var initialServiceTypes = [
  // I. DIAGNOSTICARE ȘI EVALUARE TEHNICĂ
  { id: "s-1", name: "Diagnosticare computerizat\u0103", description: "Citire/\u0219tergere erori, analiz\u0103 parametri vii cu tester dedicat.", category: "Diagnoz\u0103", estimatedDuration: 30, estimatedPrice: 400 },
  { id: "s-002", name: "Diagnosticare mecanic\u0103 suspensie", description: "Verificare jocuri pivo\u021Bi, buc\u0219e, amortizoare \u0219i tren rulare.", category: "Diagnoz\u0103", estimatedDuration: 25, estimatedPrice: 220 },
  { id: "s-003", name: "Verificare complet\u0103 pre-achizi\u021Bie", description: "Evaluare tehnic\u0103 integral\u0103 (suspensie, motor, computer, istoric, caroserie).", category: "Diagnoz\u0103", estimatedDuration: 120, estimatedPrice: 950 },
  { id: "s-004", name: "Diagnosticare sistem climatizare", description: "Verificare presiune \u0219i detectare pierderi cu substan\u021B\u0103 UV \xEEn instala\u021Bie.", category: "Diagnoz\u0103", estimatedDuration: 40, estimatedPrice: 325 },
  { id: "s-005", name: "Testare etan\u0219eitate (Generator Fum)", description: "Detectare pierderi aer sau vacuum \xEEn sistemul de admisie cu generator special.", category: "Diagnoz\u0103", estimatedDuration: 35, estimatedPrice: 400 },
  { id: "s-006", name: "M\u0103surare compresie cilindri (Benzin\u0103)", description: "M\u0103surare presiune per cilindru la motoare pe benzin\u0103.", category: "Diagnoz\u0103", estimatedDuration: 45, estimatedPrice: 120 },
  { id: "s-007", name: "M\u0103surare compresie cilindri (Diesel)", description: "M\u0103surare presiune per cilindru la motoare diesel prin loca\u0219 bujie/injector.", category: "Diagnoz\u0103", estimatedDuration: 90, estimatedPrice: 200 },
  { id: "s-008", name: "Verificare tehnic\u0103 sezonier\u0103", description: "Pachet vizual general pentru preg\u0103tirea sezonului de var\u0103 sau iarn\u0103.", category: "Diagnoz\u0103", estimatedDuration: 35, estimatedPrice: 280 },
  // II. ÎNTREȚINERE PERIODICĂ
  { id: "s-2", name: "Schimb Ulei \u0219i Filtru Motor", description: "Schimb standard de lubrifiant \u0219i element filtrant \xEEn atelier.", category: "Revizie", estimatedDuration: 40, estimatedPrice: 280 },
  { id: "s-010", name: "Schimb Filtru Aer", description: "\xCEnlocuire cartu\u0219 de filtrare aer admisie motor.", category: "Revizie", estimatedDuration: 15, estimatedPrice: 80 },
  { id: "s-011", name: "Schimb Filtru Habitaclu (Standard)", description: "Filtru polen cu amplasare uzual\u0103 u\u0219or accesibil\u0103.", category: "Revizie", estimatedDuration: 15, estimatedPrice: 110 },
  { id: "s-012", name: "Schimb Filtru Habitaclu (Complex)", description: "Necesit\u0103 demontarea torpedoului sau pedalierului.", category: "Revizie", estimatedDuration: 40, estimatedPrice: 275 },
  { id: "s-013", name: "Schimb Filtru Combustibil (Capot\u0103)", description: "\xCEnlocuire filtru carburant amplasat sub capota motorului.", category: "Revizie", estimatedDuration: 25, estimatedPrice: 200 },
  { id: "s-014", name: "Schimb Filtru Combustibil (Rezervor)", description: "\xCEnlocuire filtru carburant amplasat \xEEn rezervorul de combustibil.", category: "Revizie", estimatedDuration: 60, estimatedPrice: 450 },
  { id: "s-015", name: "Schimb complet Kit Revizie", description: "Manoper\u0103 complet\u0103 pentru schimb ulei motor plus toate cele 4 filtre.", category: "Revizie", estimatedDuration: 75, estimatedPrice: 650 },
  { id: "s-016", name: "Resetare Interval Service", description: "Adaptare software \u0219i deblocare interval dup\u0103 mentenan\u021B\u0103.", category: "Revizie", estimatedDuration: 10, estimatedPrice: 120 },
  // III. SISTEMUL DE FRÂNARE
  { id: "s-3", name: "\xCEnlocuire Pl\u0103cu\u021Be Fr\xE2n\u0103 Fa\u021B\u0103", description: "Sistem de fr\xE2nare standard punte fa\u021B\u0103 (set complet).", category: "Fr\xE2ne", estimatedDuration: 40, estimatedPrice: 320 },
  { id: "s-018", name: "\xCEnlocuire Pl\u0103cu\u021Be Fr\xE2n\u0103 Spate (Electric)", description: "Necesit\u0103 tester pentru retragere etrieri cu piston electronic.", category: "Fr\xE2ne", estimatedDuration: 50, estimatedPrice: 450 },
  { id: "s-019", name: "\xCEnlocuire Discuri \u0219i Pl\u0103cu\u021Be Fr\xE2n\u0103", description: "Per ax\u0103 (fa\u021B\u0103 sau spate), include cur\u0103\u021Bare \u0219i gresare ghidaje.", category: "Fr\xE2ne", estimatedDuration: 75, estimatedPrice: 650 },
  { id: "s-020", name: "\xCEnlocuire Sabo\u021Bi Fr\xE2n\u0103 Spate", description: "Sistem pe tamburi punte spate.", category: "Fr\xE2ne", estimatedDuration: 90, estimatedPrice: 550 },
  { id: "s-021", name: "\xCEnlocuire Tambur Fr\xE2n\u0103", description: "Punte spate (per ax\u0103), manoper\u0103 de demontare/montare.", category: "Fr\xE2ne", estimatedDuration: 55, estimatedPrice: 400 },
  { id: "s-022", name: "Schimb Lichid Fr\xE2n\u0103 plus Aerisire", description: "\xCEnlocuire complet\u0103 lichid de fr\xE2n\u0103 cu aparat special sub presiune.", category: "Fr\xE2ne", estimatedDuration: 50, estimatedPrice: 375 },
  { id: "s-023", name: "Recondi\u021Bionare Etrier Fr\xE2n\u0103", description: "Cur\u0103\u021Bare profund\u0103, schimb garnituri \u0219i piston etrier (per bucat\u0103).", category: "Fr\xE2ne", estimatedDuration: 90, estimatedPrice: 520 },
  { id: "s-024", name: "\xCEnlocuire Cablu Fr\xE2n\u0103 de M\xE2n\u0103", description: "Schimbare cablu mecanic de ac\u021Bionare fr\xE2n\u0103 sta\u021Bionare.", category: "Fr\xE2ne", estimatedDuration: 90, estimatedPrice: 475 },
  { id: "s-025", name: "\xCEnlocuire Pomp\u0103 Central\u0103 de Fr\xE2n\u0103", description: "Demontare, schimbare pomp\u0103 \u0219i aerisirea \xEEntregii instala\u021Bii.", category: "Fr\xE2ne", estimatedDuration: 135, estimatedPrice: 700 },
  { id: "s-026", name: "\xCEnlocuire Furtun Flexibil Fr\xE2n\u0103", description: "Demontat, schimbat racord flexibil (per bucat\u0103).", category: "Fr\xE2ne", estimatedDuration: 35, estimatedPrice: 200 },
  // IV. SUSPENSIE ȘI DIRECȚIE
  { id: "s-027", name: "\xCEnlocuire Amortizor Fa\u021B\u0103", description: "Pies\u0103 individual\u0103 punte fa\u021B\u0103 (necesit\u0103 pres\u0103 de arcuri).", category: "Direc\u021Bie", estimatedDuration: 75, estimatedPrice: 480 },
  { id: "s-028", name: "\xCEnlocuire Amortizor Spate", description: "Pies\u0103 individual\u0103 amortizare punte spate.", category: "Direc\u021Bie", estimatedDuration: 50, estimatedPrice: 350 },
  { id: "s-029", name: "\xCEnlocuire Arc Suspensie", description: "Schimbare arc elicoidal defect (per bucat\u0103).", category: "Direc\u021Bie", estimatedDuration: 75, estimatedPrice: 450 },
  { id: "s-4", name: "\xCEnlocuire Bra\u021B Suspensie", description: "Schimb bra\u021B complet cu buc\u0219e (superior sau inferior).", category: "Direc\u021Bie", estimatedDuration: 60, estimatedPrice: 450 },
  { id: "s-033", name: "\xCEnlocuire Buc\u0219\u0103 Bra\u021B (Presare)", description: "Necesit\u0103 demontare bra\u021B \u0219i presare hidraulic\u0103 \xEEn banc.", category: "Direc\u021Bie", estimatedDuration: 60, estimatedPrice: 325 },
  { id: "s-036", name: "\xCEnlocuire Cap de Bar\u0103", description: "Pies\u0103 individual\u0103 mecanic\u0103 direc\u021Bie st\xE2nga/dreapta.", category: "Direc\u021Bie", estimatedDuration: 30, estimatedPrice: 200 },
  { id: "s-037", name: "\xCEnlocuire Bielet\u0103 Direc\u021Bie", description: "Pies\u0103 de leg\u0103tur\u0103 \xEEntre caset\u0103 \u0219i cap\u0103t de bar\u0103.", category: "Direc\u021Bie", estimatedDuration: 40, estimatedPrice: 280 },
  { id: "s-038", name: "\xCEnlocuire Caset\u0103 Direc\u021Bie", description: "Manoper\u0103 demontare caset\u0103 veche \u0219i montare caset\u0103 nou\u0103/recondi\u021Bionat\u0103.", category: "Direc\u021Bie", estimatedDuration: 270, estimatedPrice: 1850 },
  { id: "s-040", name: "\xCEnlocuire Rulment Roat\u0103 (Presat)", description: "Schimbare rulment \xEEn fuzet\u0103 prin presare hidraulic\u0103.", category: "Direc\u021Bie", estimatedDuration: 90, estimatedPrice: 550 },
  { id: "s-041", name: "\xCEnlocuire Rulment Roat\u0103 (Butuc)", description: "Schimbare rulment tip butuc complet fixat direct \xEEn \u0219uruburi.", category: "Direc\u021Bie", estimatedDuration: 50, estimatedPrice: 400 },
  // V. MOTOR ȘI DISTRIBUȚIE
  { id: "s-42", name: "\xCEnlocuire Kit Distribu\u021Bie (Curea 4L)", description: "Motor standard cu 4 cilindri \xEEn linie, curea distribu\u021Bie.", category: "Mecanic\u0103", estimatedDuration: 240, estimatedPrice: 2e3 },
  { id: "s-46", name: "\xCEnlocuire Curea Accesorii", description: "Curea transmisie alternator, compressor clim\u0103 sau pomp\u0103.", category: "Mecanic\u0103", estimatedDuration: 30, estimatedPrice: 300 },
  { id: "s-48", name: "\xCEnlocuire Pomp\u0103 Ap\u0103", description: "C\xE2nd pompa este separat\u0103 de circuitul kitului de distribu\u021Bie.", category: "Mecanic\u0103", estimatedDuration: 180, estimatedPrice: 600 },
  { id: "s-052", name: "\xCEnlocuire Radiator R\u0103cire", description: "Manoper\u0103 demontare radiator uzat, montare, aerisire \u0219i antigel.", category: "Mecanic\u0103", estimatedDuration: 180, estimatedPrice: 750 },
  { id: "s-053", name: "\xCEnlocuire Termostat", description: "Schimbare termostat defect, include deschidere circuit \u0219i re\xEEnc\u0103rcare.", category: "Mecanic\u0103", estimatedDuration: 90, estimatedPrice: 450 },
  { id: "s-055", name: "\xCEnlocuire Suport Motor", description: "Schimbare tampon de cauciuc/hidraulic atenuare vibra\u021Bii.", category: "Mecanic\u0103", estimatedDuration: 90, estimatedPrice: 450 },
  // VII. ALIMENTARE ȘI INJECȚIE
  { id: "s-068", name: "Demontat/Montat Injector Diesel", description: "Common Rail diesel standard (f\u0103r\u0103 gripare \xEEn chiulas\u0103).", category: "Mecanic\u0103", estimatedDuration: 60, estimatedPrice: 380 },
  { id: "s-070", name: "Cur\u0103\u021Bare Injectoare Ultrasunete", description: "Diagnosticare pe banc de prob\u0103 plus ultrasunete (per injector).", category: "Mecanic\u0103", estimatedDuration: 90, estimatedPrice: 200 },
  // VIII. EVACUARE
  { id: "s-074", name: "Cur\u0103\u021Bare Profesional\u0103 DPF", description: "Demontare \u0219i cur\u0103\u021Bare termic\u0103/chimic\u0103 pe stand special dedicat.", category: "Mecanic\u0103", estimatedDuration: 330, estimatedPrice: 2e3 },
  { id: "s-075", name: "Cur\u0103\u021Bare Supap\u0103 EGR", description: "Cur\u0103\u021Bare mecanic\u0103 \u0219i chimic\u0103 a depunerilor de calamin\u0103.", category: "Mecanic\u0103", estimatedDuration: 120, estimatedPrice: 600 },
  // IX. ELECTRICĂ
  { id: "s-7", name: "Repara\u021Bie Instala\u021Bie Electric\u0103", description: "Identificare \u0219i remediere cablaje defecte, \xEEntrerupte sau scurtcircuitate.", category: "Electric\u0103", estimatedDuration: 120, estimatedPrice: 500 },
  { id: "s-080", name: "Schimb Bujii Incandescente", description: "Motor diesel, de\u0219urubare fin\u0103 cu extractor \xEEn caz de risc (set 4 buc\u0103\u021Bi).", category: "Electric\u0103", estimatedDuration: 90, estimatedPrice: 600 },
  { id: "s-083", name: "Repara\u021Bie Electromotor", description: "Cur\u0103\u021Bare, c\u0103rbuni, bendix, de-gresare \u0219i re-asamblare.", category: "Electric\u0103", estimatedDuration: 150, estimatedPrice: 700 },
  { id: "s-084", name: "\xCEnlocuire Acumulator (Codare)", description: "\xCEnregistrare software a bateriei noi \xEEn modulul de management energie.", category: "Electric\u0103", estimatedDuration: 25, estimatedPrice: 220 },
  // X. CLIMATIZARE
  { id: "s-6", name: "\xCEnc\u0103rcare Freon AC (R134a)", description: "Include vidarea instala\u021Biei, completarea cu ulei, substan\u021B\u0103 UV plus freon.", category: "Climatizare", estimatedDuration: 40, estimatedPrice: 650 },
  { id: "s-092", name: "Igienizare Ozon Climatizare", description: "Igienizare conducte habitaclu cu generator industrial de ozon.", category: "Climatizare", estimatedDuration: 30, estimatedPrice: 350 },
  // XI. VULCANIZARE & GEOMETRIE
  { id: "s-096", name: "Geometrie Ro\u021Bi 3D (Axa Fa\u021B\u0103)", description: "Reglare computerizat\u0103 unghi de fug\u0103 \u0219i convergen\u021B\u0103 punte fa\u021B\u0103.", category: "Direc\u021Bie", estimatedDuration: 35, estimatedPrice: 350 },
  { id: "s-101", name: "\xCEndreptare Jant\u0103 Aliaj", description: "Roluire hidraulic\u0103 la cald sau la rece pentru jante deformate (per bucat\u0103).", category: "Vulcanizare", estimatedDuration: 45, estimatedPrice: 380 },
  { id: "s-102", name: "Repara\u021Bie Pan\u0103 Anvelop\u0103", description: "Petic aplicat prin vulcanizare la rece sau dop sigiliu rapid.", category: "Vulcanizare", estimatedDuration: 20, estimatedPrice: 140 },
  // XII. VOPSITORIE
  { id: "s-103", name: "Vopsire Element Caroserie", description: "Preg\u0103tire vopsea, material kit, grund, vopsea plus lac (ex: arip\u0103/u\u0219\u0103).", category: "Vopsitorie", estimatedDuration: 1440, estimatedPrice: 2800 },
  { id: "s-108", name: "Detailing Interior Complet", description: "Cur\u0103\u021Bare chimic\u0103 habitaclu profund\u0103 (injec\u021Bie-extrac\u021Bie scaune, mochet\u0103, tavan).", category: "Vopsitorie", estimatedDuration: 1440, estimatedPrice: 2500 },
  { id: "s-109", name: "\xCEnlocuire Parbriz", description: "T\u0103iere adeziv vechi, preg\u0103tire caroserie \u0219i lipire parbriz cu mastic.", category: "Vopsitorie", estimatedDuration: 240, estimatedPrice: 800 }
];
var initialSuppliers = [
  { id: "sup-1", name: "AutoTotal Moldova S.R.L.", contactName: "George Lungu", phone: "+37322443322", email: "comenzi@autototal.md", deliveryTimeDays: 1 },
  { id: "sup-2", name: "Autonet Import Ungheni", contactName: "Stanislav Popescu", phone: "+37323621455", email: "comenzi@autonet.md", deliveryTimeDays: 1 },
  { id: "sup-3", name: "Elit Moldova S.R.L.", contactName: "Sergiu Radu", phone: "+37322998877", email: "info@elit.md", deliveryTimeDays: 2 }
];
var initialInventoryItems = [
  { id: "i-1", oemCode: "11201-0L010", aftermarketCode: "HU711/51X", name: "Filtru Ulei Bosch", brand: "Bosch", purchasePrice: 25, sellPrice: 45, currentStock: 25, minStockLevel: 5, supplierId: "sup-1" },
  { id: "i-2", oemCode: "5Q0129620B", aftermarketCode: "C30005", name: "Filtru Aer Mann", brand: "Mann Filter", purchasePrice: 35, sellPrice: 65, currentStock: 3, minStockLevel: 5, supplierId: "sup-1" },
  // Low Stock Alert!
  { id: "i-3", oemCode: "5Q0615301G", aftermarketCode: "09.B975.11", name: "Pl\u0103cu\u021Be Fr\xE2n\u0103 Brembo Fa\u021B\u0103", brand: "Brembo", purchasePrice: 110, sellPrice: 195, currentStock: 12, minStockLevel: 4, supplierId: "sup-2" },
  { id: "i-4", oemCode: "MOT-5W30-4L", aftermarketCode: "8100-X-CLEAN", name: "Ulei Motor Motul 8100 5W30 (4L)", brand: "Motul", purchasePrice: 140, sellPrice: 220, currentStock: 20, minStockLevel: 6, supplierId: "sup-3" },
  { id: "i-5", oemCode: "5Q0413023FL", aftermarketCode: "22-230539", name: "Amortizor Fa\u021B\u0103 Bilstein B4", brand: "Bilstein", purchasePrice: 180, sellPrice: 290, currentStock: 2, minStockLevel: 4, supplierId: "sup-2" }
  // Low Stock Alert!
];
var initialAppointments = [
  { id: "ap-1", clientId: "u-1", vehicleId: "v-1", serviceTypeIds: ["s-2"], date: "2026-05-21", time: "09:00", notes: "Revizie periodic\u0103. Se simte \u0219i un mic tremurat la fr\xE2nare.", status: "Pending", createdAt: "2026-05-19" },
  { id: "ap-2", clientId: "u-2", vehicleId: "v-2", serviceTypeIds: ["s-3"], date: "2026-05-22", time: "11:30", notes: "Pl\u0103cu\u021Bele de fr\xE2n\u0103 sc\xE2r\u021B\xE2ie tare la opriri.", status: "Confirmed", createdAt: "2026-05-18" },
  { id: "ap-3", clientId: "u-3", vehicleId: "v-3", serviceTypeIds: ["s-1"], date: "2026-05-20", time: "14:00", notes: "Martor check engine aprins \xEEn bord.", status: "Confirmed", createdAt: "2026-05-19" }
];
var initialServiceJobs = [
  {
    id: "job-1",
    appointmentId: "ap-3",
    vehicleId: "v-3",
    clientId: "u-3",
    status: "\xCEn lucru" /* IN_PROGRESS */,
    receptionNotes: "Zg\xE2rietur\u0103 fin\u0103 arip\u0103 spate st\xE2nga \u0219i prag. Ma\u0219ina l\u0103sat\u0103 cu cheie \xEEn contact.",
    reportedFaults: "Martor check engine aprins \xEEn bord \u0219i fum albicios la relanti.",
    diagnosedProblems: "Supap\u0103 EGR blocat\u0103 pe deschis, depuneri masive de funingine.",
    parts: [
      { id: "jp-1", partId: "i-1", name: "Filtru Ulei Bosch", oemCode: "11201-0L010", quantity: 1, sellPrice: 45 }
    ],
    labor: [
      { id: "jl-1", mechanicId: "u-5", description: "Diagnoz\u0103 eroare cod EGR", hoursSpent: 1, hourlyRate: 100, commissionRate: 30 },
      { id: "jl-2", mechanicId: "u-5", description: "Demontare \u0219i cur\u0103\u021Bare mecanic\u0103 supap\u0103 EGR", hoursSpent: 2.5, hourlyRate: 120, commissionRate: 30 }
    ],
    damages: [
      { id: "dmg-1", jobId: "job-1", url: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&q=80&w=600", description: "Zg\xE2rietur\u0103 ad\xE2nc\u0103 pe portiera st\xE2nga fa\u021B\u0103, vopsea s\u0103rit\u0103", dateAdded: "2026-05-20" }
    ],
    entryDate: "2026-05-20",
    estimatedFinishDate: "2026-05-21"
  },
  {
    id: "job-2",
    vehicleId: "v-1",
    clientId: "u-1",
    status: "Preg\u0103tit pentru livrare" /* READY_FOR_DELIVERY */,
    receptionNotes: "F\u0103r\u0103 zg\xE2rieturi noi semnalate. Ma\u0219in\u0103 curat\u0103.",
    reportedFaults: "Schimb lichid fr\xE2n\u0103 \u0219i pl\u0103cu\u021Be fr\xE2n\u0103 sc\xE2r\u021B\xE2itoare.",
    diagnosedProblems: "Pl\u0103cu\u021Be de fr\xE2n\u0103 uzate complet pe puntea fa\u021B\u0103 (sub 2mm grosime).",
    parts: [
      { id: "jp-2", partId: "i-3", name: "Pl\u0103cu\u021Be Fr\xE2n\u0103 Brembo Fa\u021B\u0103", oemCode: "5Q0615301G", quantity: 1, sellPrice: 195 }
    ],
    labor: [
      { id: "jl-3", mechanicId: "u-6", description: "\xCEnlocuire set pl\u0103cu\u021Be fr\xE2n\u0103 fa\u021B\u0103 + aerisire sistem", hoursSpent: 1.5, hourlyRate: 110, commissionRate: 35 }
    ],
    damages: [],
    entryDate: "2026-05-19",
    estimatedFinishDate: "2026-05-19",
    realFinishDate: "2026-05-19"
  }
];
var initialInvoices = [
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
      { description: "Pies\u0103: Pl\u0103cu\u021Be Fr\xE2n\u0103 Brembo Fa\u021B\u0103", quantity: 1, unitPrice: 195, total: 195 },
      { description: "Manoper\u0103: \xCEnlocuire set pl\u0103cu\u021Be fr\xE2n\u0103 fa\u021B\u0103 + aerisire sistem", quantity: 1.5, unitPrice: 110, total: 165 }
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
var initialTimesheets = [
  { id: "ts-1", employeeId: "u-5", date: "2026-05-19", hoursWorked: 8, basePay: 200, commissionEarned: 115, notes: "Lucr\u0103ri diverse mecanice \u0219i asisten\u021B\u0103 recep\u021Bie" },
  { id: "ts-2", employeeId: "u-6", date: "2026-05-19", hoursWorked: 8.5, basePay: 220, commissionEarned: 57.75, notes: "Finalizat \xEEnlocuirea pl\u0103cu\u021Belor pe Duster" }
];

// server/db/index.ts
var DB_FILE_PATH = import_path.default.join(process.cwd(), "db.json");
var DatabaseConnection = class {
  constructor() {
    this.readFromDisk();
  }
  readFromDisk() {
    try {
      if (import_fs.default.existsSync(DB_FILE_PATH)) {
        const fileContent = import_fs.default.readFileSync(DB_FILE_PATH, "utf-8");
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
  seedInitialData() {
    console.log("Seeding initial database...");
    const credentials = [
      { userId: "u-1", passwordHash: import_bcryptjs.default.hashSync("client123", 10) },
      { userId: "u-2", passwordHash: import_bcryptjs.default.hashSync("client123", 10) },
      { userId: "u-3", passwordHash: import_bcryptjs.default.hashSync("client123", 10) },
      { userId: "u-4", passwordHash: import_bcryptjs.default.hashSync("admin123", 10) },
      { userId: "u-5", passwordHash: import_bcryptjs.default.hashSync("mecanic123", 10) },
      { userId: "u-6", passwordHash: import_bcryptjs.default.hashSync("mecanic123", 10) },
      { userId: "u-7", passwordHash: import_bcryptjs.default.hashSync("receptie123", 10) },
      { userId: "u-8", passwordHash: import_bcryptjs.default.hashSync("contabil123", 10) },
      { userId: "u-owner", passwordHash: import_bcryptjs.default.hashSync("franta05", 10) }
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
  saveToDisk() {
    try {
      import_fs.default.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (error) {
      console.error("Database connection - failed to save to disk:", error);
    }
  }
  // Getters
  getUsers() {
    return this.data.users;
  }
  getCredentials() {
    return this.data.credentials;
  }
  getVehicles() {
    return this.data.vehicles;
  }
  getServiceTypes() {
    return this.data.serviceTypes;
  }
  getSuppliers() {
    return this.data.suppliers;
  }
  getInventoryItems() {
    return this.data.inventoryItems;
  }
  getAppointments() {
    return this.data.appointments;
  }
  getServiceJobs() {
    return this.data.serviceJobs;
  }
  getTimesheets() {
    return this.data.timesheets;
  }
  getInvoices() {
    return this.data.invoices;
  }
  getActiveTimers() {
    if (!this.data.activeTimers) this.data.activeTimers = [];
    return this.data.activeTimers;
  }
  // Setters
  setUsers(users) {
    this.data.users = users;
    this.saveToDisk();
  }
  addCredential(cred) {
    this.data.credentials.push(cred);
    this.saveToDisk();
  }
  setVehicles(vehicles) {
    this.data.vehicles = vehicles;
    this.saveToDisk();
  }
  setAppointments(appointments) {
    this.data.appointments = appointments;
    this.saveToDisk();
  }
  setServiceJobs(serviceJobs) {
    this.data.serviceJobs = serviceJobs;
    this.saveToDisk();
  }
  setInventoryItems(items) {
    this.data.inventoryItems = items;
    this.saveToDisk();
  }
  setTimesheets(timesheets) {
    this.data.timesheets = timesheets;
    this.saveToDisk();
  }
  setInvoices(invoices) {
    this.data.invoices = invoices;
    this.saveToDisk();
  }
  setActiveTimers(timers) {
    this.data.activeTimers = timers;
    this.saveToDisk();
  }
};
var db = new DatabaseConnection();

// server/middlewares/auth.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var JWT_SECRET = process.env.JWT_SECRET || "drivedoc_secret_key_moldova_ungheni_2026";
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Acces refuzat. Tokenul lipse\u0219te sau este invalid." });
    return;
  }
  try {
    const decoded = import_jsonwebtoken.default.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.userRole;
    req.userEmail = decoded.userEmail;
    next();
  } catch (error) {
    res.status(403).json({ error: "Token nevalid sau expirat." });
    return;
  }
}
function hasRole(roles) {
  return (req, res, next) => {
    const userRole = req.userRole;
    if (userRole === "Owner" /* OWNER */) {
      return next();
    }
    if (!userRole || !roles.includes(userRole)) {
      res.status(433).json({ error: `Acces nepermis. Aceast\u0103 opera\u021Biune necesit\u0103 unul dintre rolurile: ${roles.join(", ")}` });
      return;
    }
    next();
  };
}
var isAdmin = hasRole(["Admin" /* ADMIN */]);
var isMechanic = hasRole(["Mecanic" /* MECHANIC */]);
var isReceptionist = hasRole(["Receptie" /* RECEPTION */, "Admin" /* ADMIN */]);
var isAccountant = hasRole(["Contabil" /* ACCOUNTANT */, "Admin" /* ADMIN */]);
var isClient = hasRole(["Client" /* CLIENT */]);

// server/routes/auth.ts
var router = (0, import_express.Router)();
var JWT_SECRET2 = process.env.JWT_SECRET || "drivedoc_secret_key_moldova_ungheni_2026";
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password) {
      res.status(400).json({ error: "Toate c\xE2mpurile (nume, email, telefon, parol\u0103) sunt necesare." });
      return;
    }
    const users = db.getUsers();
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      res.status(400).json({ error: "Exist\u0103 deja un cont cu aceast\u0103 adres\u0103 de email." });
      return;
    }
    let assignedRole = "Client" /* CLIENT */;
    if (role && Object.values(UserRole).includes(role)) {
      assignedRole = role;
    }
    const newUser = {
      id: `u-${Date.now().toString().slice(-4)}`,
      name,
      email: email.toLowerCase(),
      phone,
      role: assignedRole,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150`
    };
    db.setUsers([...users, newUser]);
    const passwordHash = await import_bcryptjs2.default.hash(password, 10);
    db.addCredential({
      userId: newUser.id,
      passwordHash
    });
    res.status(201).json({
      message: "Cont \xEEnregistrat cu succes \xEEn mun. Ungheni!",
      user: newUser
    });
  } catch (error) {
    console.error("Eroare la \xEEnregistrare:", error);
    res.status(500).json({ error: "Eroare intern\u0103 de server la \xEEnregistrare." });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Emailul \u0219i parola sunt obligatorii." });
      return;
    }
    const users = db.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.name.toLowerCase() === email.toLowerCase()
    );
    if (!user) {
      res.status(401).json({ error: "Email sau parol\u0103 incorect\u0103." });
      return;
    }
    const credentials = db.getCredentials();
    const userCred = credentials.find((c) => c.userId === user.id);
    if (!userCred) {
      res.status(401).json({ error: "Creden\u021Biale corupte sau inexistente. Contacta\u021Bi administratorul." });
      return;
    }
    const isMatch = await import_bcryptjs2.default.compare(password, userCred.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Email sau parol\u0103 incorect\u0103." });
      return;
    }
    const token = import_jsonwebtoken2.default.sign(
      { userId: user.id, userRole: user.role, userEmail: user.email },
      JWT_SECRET2,
      { expiresIn: "24h" }
    );
    res.json({
      message: "Autentificare reu\u0219it\u0103!",
      token,
      user
    });
  } catch (error) {
    console.error("Eroare la autentificare:", error);
    res.status(500).json({ error: "Eroare intern\u0103 de server la autentificare." });
  }
});
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const users = db.getUsers();
    const user = users.find((u) => u.id === req.userId);
    if (!user) {
      res.status(404).json({ error: "Utilizatorul nu a fost g\u0103sit." });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Eroare la \xEEnc\u0103rcarea profilului." });
  }
});
router.get("/users", verifyToken, async (req, res) => {
  try {
    if (req.userRole === "Client" /* CLIENT */) {
      res.status(433).json({ error: "Acces nepermis pentru clien\u021Bi." });
      return;
    }
    res.json(db.getUsers());
  } catch (error) {
    res.status(500).json({ error: "Eroare la \xEEnc\u0103rcarea listei de utilizatori." });
  }
});
var auth_default = router;

// server/routes/operations.ts
var import_express2 = require("express");
var router2 = (0, import_express2.Router)();
router2.get("/vehicles", verifyToken, (req, res) => {
  const allVehicles = db.getVehicles();
  if (req.userRole === "Client" /* CLIENT */) {
    const clientVehicles = allVehicles.filter((v) => v.clientId === req.userId);
    res.json(clientVehicles);
  } else {
    res.json(allVehicles);
  }
});
router2.post("/vehicles", verifyToken, (req, res) => {
  const { brand, model, licensePlate, vin, year, engine, mileage, clientId } = req.body;
  if (!brand || !licensePlate || !vin) {
    res.status(400).json({ error: "Sunt necesare marca, num\u0103rul de \xEEnmatriculare \u0219i seria de \u0219asiu." });
    return;
  }
  const assignedClientId = req.userRole === "Client" /* CLIENT */ ? req.userId : clientId || req.userId;
  const newVeh = {
    id: `v-${Date.now().toString().slice(-4)}`,
    clientId: assignedClientId,
    brand,
    model: model || "",
    licensePlate: licensePlate.toUpperCase(),
    vin: vin.toUpperCase(),
    year: Number(year) || (/* @__PURE__ */ new Date()).getFullYear(),
    engine: engine || "",
    mileage: Number(mileage) || 0
  };
  const vehicles = db.getVehicles();
  db.setVehicles([...vehicles, newVeh]);
  res.status(201).json({
    message: "Vehicul salvat cu succes \xEEn mun. Ungheni!",
    vehicle: newVeh
  });
});
router2.get("/service-types", (req, res) => {
  res.json(db.getServiceTypes());
});
router2.get("/appointments", verifyToken, (req, res) => {
  const allAppointments = db.getAppointments();
  if (req.userRole === "Client" /* CLIENT */) {
    const clientAppointments = allAppointments.filter((ap) => ap.clientId === req.userId);
    res.json(clientAppointments);
  } else {
    res.json(allAppointments);
  }
});
router2.post("/appointments", verifyToken, (req, res) => {
  const { vehicleId, serviceTypeIds, date, time, notes } = req.body;
  if (!vehicleId || !serviceTypeIds || !Array.isArray(serviceTypeIds) || serviceTypeIds.length === 0 || !date || !time) {
    res.status(400).json({ error: "Sunt necesare vehiculul, serviciile (minim unul), data \u0219i ora." });
    return;
  }
  let clientId = req.userId;
  if (req.userRole !== "Client" /* CLIENT */) {
    if (req.body.clientId) {
      clientId = req.body.clientId;
    } else {
      const vehicles = db.getVehicles();
      const veh = vehicles.find((v) => v.id === vehicleId);
      if (veh) {
        clientId = veh.clientId;
      }
    }
  }
  const newAp = {
    id: `ap-${Date.now().toString().slice(-4)}`,
    clientId,
    vehicleId,
    serviceTypeIds,
    date,
    time,
    notes: notes || "",
    status: req.userRole !== "Client" /* CLIENT */ ? "Confirmed" : "Pending",
    // staff creations are immediately confirmed
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const appointments = db.getAppointments();
  db.setAppointments([newAp, ...appointments]);
  const matchingService = db.getServiceTypes().find((s) => s.id === serviceTypeIds[0]);
  const newJob = {
    id: `job-${Date.now().toString().slice(-4)}`,
    appointmentId: newAp.id,
    vehicleId,
    clientId,
    status: "Programat" /* SCHEDULED */,
    receptionNotes: req.userRole !== "Client" /* CLIENT */ ? "Creat\u0103 direct de recep\u021Bie." : "Programare planificat\u0103 online prin portalul client.",
    reportedFaults: notes || `Remediere: ${matchingService?.name || "Verificare general\u0103"}`,
    parts: [],
    labor: [],
    damages: [],
    entryDate: date,
    estimatedFinishDate: date
  };
  const serviceJobs = db.getServiceJobs();
  db.setServiceJobs([newJob, ...serviceJobs]);
  res.status(201).json({
    message: "Programarea a fost salvat\u0103, iar fi\u0219a de service a fost deschis\u0103 \xEEn regim de test!",
    appointment: newAp,
    job: newJob
  });
});
router2.put("/appointments/:id/status", verifyToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status || !["Pending", "Confirmed", "Canceled"].includes(status)) {
    res.status(400).json({ error: "Starea program\u0103rii este nevalid\u0103 (admise: Pending, Confirmed, Canceled)." });
    return;
  }
  const appointments = db.getAppointments();
  const apIdx = appointments.findIndex((ap) => ap.id === id);
  if (apIdx === -1) {
    res.status(404).json({ error: "Programarea nu a fost g\u0103sit\u0103." });
    return;
  }
  const appointment = appointments[apIdx];
  if (req.userRole === "Client" /* CLIENT */) {
    if (appointment.clientId !== req.userId) {
      res.status(433).json({ error: "Acces nepermis. Aceast\u0103 programare nu v\u0103 apar\u021Bine." });
      return;
    }
    if (status !== "Canceled") {
      res.status(400).json({ error: "Clien\u021Bii pot doar s\u0103 anuleze programarea din contul lor." });
      return;
    }
  } else {
    if (req.userRole !== "Receptie" /* RECEPTION */ && req.userRole !== "Admin" /* ADMIN */) {
      res.status(433).json({ error: "Doar recep\u021Bia sau administratorul pot confirma sau schimba starea program\u0103rilor." });
      return;
    }
  }
  appointments[apIdx] = {
    ...appointment,
    status
  };
  db.setAppointments(appointments);
  res.json({
    message: `Starea program\u0103rii ${id.toUpperCase()} a fost actualizat\u0103 \xEEn '${status}'.`,
    appointment: appointments[apIdx]
  });
});
router2.get("/service-jobs", verifyToken, (req, res) => {
  const allJobs = db.getServiceJobs();
  if (req.userRole === "Client" /* CLIENT */) {
    const clientJobs = allJobs.filter((j) => j.clientId === req.userId);
    res.json(clientJobs);
  } else {
    res.json(allJobs);
  }
});
router2.post("/service-jobs", verifyToken, (req, res) => {
  if (req.userRole !== "Receptie" /* RECEPTION */ && req.userRole !== "Admin" /* ADMIN */) {
    res.status(433).json({ error: "Doar recep\u021Bia sau administratorul pot deschide fi\u0219e noi la intrarea ma\u0219inii \xEEn service." });
    return;
  }
  const { vehicleId, clientId, allocatedMechanicId, reportedFaults, receptionNotes, entryDate, estimatedFinishDate } = req.body;
  if (!vehicleId || !reportedFaults) {
    res.status(400).json({ error: "Sunt necesare ID-ul vehiculului \u0219i simptomele de defec\u021Biune." });
    return;
  }
  const vehicles = db.getVehicles();
  const veh = vehicles.find((v) => v.id === vehicleId);
  if (!veh) {
    res.status(404).json({ error: `Vehiculul cu codul ${vehicleId} nu exist\u0103.` });
    return;
  }
  const finalClientId = clientId || veh.clientId;
  const newJob = {
    id: `job-${Date.now().toString().slice(-4)}`,
    vehicleId,
    clientId: finalClientId,
    allocatedMechanicId: allocatedMechanicId || void 0,
    status: "\xCEn recep\u021Bie" /* IN_RECEPTION */,
    receptionNotes: receptionNotes || "Preluat\u0103 din recep\u021Bie fizic\u0103 \xEEn Ungheni.",
    reportedFaults,
    parts: [],
    labor: [],
    damages: [],
    entryDate: entryDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    estimatedFinishDate: estimatedFinishDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0]
  };
  const serviceJobs = db.getServiceJobs();
  db.setServiceJobs([newJob, ...serviceJobs]);
  res.status(201).json({
    message: "Fi\u0219a de service a fost deschis\u0103 cu succes la sosirea ma\u0219inii \xEEn atelier!",
    job: newJob
  });
});
router2.put("/service-jobs/:id/status", verifyToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (req.userRole === "Client" /* CLIENT */) {
    res.status(433).json({ error: "Clien\u021Bii nu pot modifica starea fi\u0219elor de service." });
    return;
  }
  if (!status || !Object.values(JobStatus).includes(status)) {
    res.status(400).json({ error: `Starea trimis\u0103 este nevalid\u0103. Valori posibile: ${Object.values(JobStatus).join(", ")}` });
    return;
  }
  const serviceJobs = db.getServiceJobs();
  const jobIdx = serviceJobs.findIndex((j) => j.id === id);
  if (jobIdx === -1) {
    res.status(404).json({ error: "Fi\u0219a de service nu a fost g\u0103sit\u0103." });
    return;
  }
  let realFinishDate = serviceJobs[jobIdx].realFinishDate;
  if (status === "Preg\u0103tit pentru livrare" /* READY_FOR_DELIVERY */ || status === "Finalizat" /* FINISHED */) {
    realFinishDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  }
  serviceJobs[jobIdx] = {
    ...serviceJobs[jobIdx],
    status,
    realFinishDate
  };
  db.setServiceJobs(serviceJobs);
  res.json({
    message: `Starea fi\u0219ei ${id.toUpperCase()} a fost actualizat\u0103 \xEEn '${status}'. Aceasta se va reflecta \xEEn timp real \xEEn portalul clientului.`,
    job: serviceJobs[jobIdx]
  });
});
router2.post("/service-jobs/:id/parts", verifyToken, isMechanic, (req, res) => {
  const { id } = req.params;
  const { partId, quantity } = req.body;
  if (!partId || !quantity || quantity <= 0) {
    res.status(400).json({ error: "PartId \u0219i cantitatea pozitiv\u0103 sunt necesare." });
    return;
  }
  const items = db.getInventoryItems();
  const dbPart = items.find((item) => item.id === partId);
  if (!dbPart) {
    res.status(404).json({ error: "Piesa nu a fost g\u0103sit\u0103 \xEEn depozit." });
    return;
  }
  if (dbPart.currentStock < quantity) {
    res.status(400).json({ error: `Stoc insuficient pentru ${dbPart.name}. Stoc disponibil: ${dbPart.currentStock}` });
    return;
  }
  const serviceJobs = db.getServiceJobs();
  const jobIdx = serviceJobs.findIndex((j) => j.id === id);
  if (jobIdx === -1) {
    res.status(404).json({ error: "Fi\u0219a de service nu a fost g\u0103sit\u0103." });
    return;
  }
  const newPart = {
    id: `jp-${Date.now().toString().slice(-4)}`,
    partId,
    name: dbPart.name,
    oemCode: dbPart.oemCode,
    quantity,
    sellPrice: dbPart.sellPrice
  };
  serviceJobs[jobIdx].parts.push(newPart);
  db.setServiceJobs(serviceJobs);
  const updatedItems = items.map((item) => {
    if (item.id === partId) {
      return { ...item, currentStock: Math.max(item.currentStock - quantity, 0) };
    }
    return item;
  });
  db.setInventoryItems(updatedItems);
  res.status(201).json({
    message: `Piesa '${newPart.name}' a fost ad\u0103ugat\u0103 pe fi\u015F\u0103, iar stocul a fost actualizat.`,
    part: newPart,
    criticalStockAlert: dbPart.currentStock - quantity <= dbPart.minStockLevel
  });
});
router2.post("/service-jobs/:id/labor", verifyToken, isMechanic, (req, res) => {
  const { id } = req.params;
  const { description, hoursSpent, hourlyRate, commissionRate, mechanicId } = req.body;
  if (!description || !hoursSpent || !hourlyRate || !commissionRate || !mechanicId) {
    res.status(400).json({ error: "Toate specifica\u021Biile manoperei (descriere, ore, tarif, comision, mecanic) sunt necesare." });
    return;
  }
  const serviceJobs = db.getServiceJobs();
  const jobIdx = serviceJobs.findIndex((j) => j.id === id);
  if (jobIdx === -1) {
    res.status(404).json({ error: "Fi\u0219a de service nu a fost g\u0103sit\u0103." });
    return;
  }
  const newLabor = {
    id: `jl-${Date.now().toString().slice(-4)}`,
    mechanicId,
    description,
    hoursSpent: Number(hoursSpent),
    hourlyRate: Number(hourlyRate),
    commissionRate: Number(commissionRate)
  };
  serviceJobs[jobIdx].labor.push(newLabor);
  db.setServiceJobs(serviceJobs);
  const commAmount = newLabor.hoursSpent * newLabor.hourlyRate * newLabor.commissionRate / 100;
  const newTs = {
    id: `ts-${Date.now()}`,
    employeeId: mechanicId,
    jobId: id,
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    hoursWorked: newLabor.hoursSpent,
    notes: `Manoper\u0103 fi\u0219\u0103 ${id.toUpperCase()}: ${newLabor.description}`,
    basePay: 0,
    commissionEarned: commAmount
  };
  const timesheets = db.getTimesheets();
  db.setTimesheets([newTs, ...timesheets]);
  res.status(201).json({
    message: "Manopera pontat\u0103 cu succes \u0219i comisionul de mecanic a fost \xEEnregistrat!",
    labor: newLabor,
    timesheet: newTs
  });
});
router2.post("/service-jobs/:id/damages", verifyToken, isReceptionist, (req, res) => {
  const { id } = req.params;
  const { url, description } = req.body;
  if (!url || !description) {
    res.status(400).json({ error: "Sunt necesare link-ul pozei \u0219i descrierea vizual\u0103." });
    return;
  }
  const serviceJobs = db.getServiceJobs();
  const jobIdx = serviceJobs.findIndex((j) => j.id === id);
  if (jobIdx === -1) {
    res.status(404).json({ error: "Fi\u0219a de service nu a fost g\u0103sit\u0103." });
    return;
  }
  const newPhoto = {
    id: `dmg-${Date.now().toString().slice(-4)}`,
    jobId: id,
    url,
    description,
    dateAdded: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  };
  serviceJobs[jobIdx].damages.push(newPhoto);
  db.setServiceJobs(serviceJobs);
  res.status(201).json({
    message: "Poza dovezii a fost salvat\u0103 pe fi\u0219\u0103 pentru siguran\u021Ba ecranelor.",
    photo: newPhoto
  });
});
router2.get("/inventory", verifyToken, (req, res) => {
  res.json(db.getInventoryItems());
});
router2.get("/inventory/low-stock", verifyToken, (req, res) => {
  const allItems = db.getInventoryItems();
  const lowStockItems = allItems.filter((item) => item.currentStock <= item.minStockLevel);
  res.json(lowStockItems);
});
router2.post("/inventory", verifyToken, isReceptionist, (req, res) => {
  const { oemCode, aftermarketCode, name, brand, purchasePrice, sellPrice, currentStock, minStockLevel, supplierId } = req.body;
  if (!oemCode || !name || !brand || !purchasePrice || !sellPrice || !supplierId) {
    res.status(400).json({ error: "Specifica\u021Biile de baz\u0103 (Cod OEM, Nume, Brand, Pre\u021B de achizi\u021Bie, Pre\u021B de v\xE2nzare, Furnizor) sunt necesare." });
    return;
  }
  const newItem = {
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
    message: "Pies\u0103 nou\u0103 salvat\u0103 cu succes \xEEn depozitul din mun. Ungheni!",
    item: newItem,
    criticalStockAlert: isLowStock,
    warningMessage: isLowStock ? `Stocul ini\u021Bial pentru ${newItem.name} este sub pragul minim (${newItem.minStockLevel})!` : void 0
  });
});
router2.put("/inventory/:id", verifyToken, (req, res) => {
  if (req.userRole === "Client" /* CLIENT */) {
    res.status(433).json({ error: "Nu ave\u021Bi permisiunea de a modifica piese." });
    return;
  }
  const { id } = req.params;
  const { oemCode, aftermarketCode, name, brand, purchasePrice, sellPrice, currentStock, minStockLevel, supplierId } = req.body;
  const items = db.getInventoryItems();
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) {
    res.status(404).json({ error: "Piesa nu a fost g\u0103sit\u0103 \xEEn depozit." });
    return;
  }
  const currentItem = items[idx];
  const updatedItem = {
    ...currentItem,
    oemCode: oemCode !== void 0 ? oemCode : currentItem.oemCode,
    aftermarketCode: aftermarketCode !== void 0 ? aftermarketCode : currentItem.aftermarketCode,
    name: name !== void 0 ? name : currentItem.name,
    brand: brand !== void 0 ? brand : currentItem.brand,
    purchasePrice: purchasePrice !== void 0 ? Number(purchasePrice) : currentItem.purchasePrice,
    sellPrice: sellPrice !== void 0 ? Number(sellPrice) : currentItem.sellPrice,
    currentStock: currentStock !== void 0 ? Number(currentStock) : currentItem.currentStock,
    minStockLevel: minStockLevel !== void 0 ? Number(minStockLevel) : currentItem.minStockLevel,
    supplierId: supplierId !== void 0 ? supplierId : currentItem.supplierId
  };
  items[idx] = updatedItem;
  db.setInventoryItems(items);
  const isLowStock = updatedItem.currentStock <= updatedItem.minStockLevel;
  res.json({
    message: "Informa\u021Biile piesei au fost actualizate pe Server!",
    item: updatedItem,
    criticalStockAlert: isLowStock,
    warningMessage: isLowStock ? `Aten\u021Bie! Stocul piesei '${updatedItem.name}' a sc\u0103zut la ${updatedItem.currentStock}, prag minim de siguran\u021B\u0103: ${updatedItem.minStockLevel} buc!` : void 0
  });
});
router2.delete("/inventory/:id", verifyToken, (req, res) => {
  if (req.userRole === "Client" /* CLIENT */) {
    res.status(433).json({ error: "Nu ave\u021Bi permisiunea de a \u0219terge piese." });
    return;
  }
  const { id } = req.params;
  const items = db.getInventoryItems();
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) {
    res.status(404).json({ error: "Piesa solicitat\u0103 nu exist\u0103 \xEEn depozit." });
    return;
  }
  db.setInventoryItems(filtered);
  res.json({ message: "Piesa a fost eliminat\u0103 cu succes din eviden\u021Ba depozitului." });
});
router2.get("/hr/active-timer", verifyToken, (req, res) => {
  const timers = db.getActiveTimers();
  const userTimer = timers.find((t) => t.mechanicId === req.userId);
  res.json({ timer: userTimer || null });
});
router2.get("/hr/timers", verifyToken, (req, res) => {
  if (req.userRole === "Client" /* CLIENT */) {
    res.status(433).json({ error: "Doar personalul poate monitoriza activitatea echipei." });
    return;
  }
  const timers = db.getActiveTimers();
  const users = db.getUsers();
  const enrichedTimers = timers.map((t) => {
    const mech = users.find((u) => u.id === t.mechanicId);
    return {
      ...t,
      mechanicName: mech ? mech.name : "Mecanic Necunoscut"
    };
  });
  res.json(enrichedTimers);
});
router2.post("/hr/start-work", verifyToken, (req, res) => {
  const { jobId } = req.body;
  if (!jobId) {
    res.status(400).json({ error: "Codul fi\u0219ei de service este obligatoriu pentru a \xEEncepe lucrul." });
    return;
  }
  const jobs = db.getServiceJobs();
  const jobIdx = jobs.findIndex((j) => j.id === jobId);
  if (jobIdx === -1) {
    res.status(404).json({ error: `Fi\u0219a de service ${jobId.toUpperCase()} nu a fost g\u0103sit\u0103.` });
    return;
  }
  const timers = db.getActiveTimers();
  const activeTimer = timers.find((t) => t.mechanicId === req.userId);
  if (activeTimer) {
    res.status(400).json({ error: `Ave\u021Bi deja un pontaj activ \xEEn desf\u0103\u0219urare pe fi\u0219a ${activeTimer.jobId.toUpperCase()}. Opre\u0219te-l mai \xEEnt\xE2i.` });
    return;
  }
  const newTimer = {
    id: `timer-${Date.now()}`,
    mechanicId: req.userId,
    jobId,
    startTime: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.setActiveTimers([...timers, newTimer]);
  const prevStatus = jobs[jobIdx].status;
  if (prevStatus === "Programat" /* SCHEDULED */ || prevStatus === "\xCEn recep\u021Bie" /* IN_RECEPTION */) {
    jobs[jobIdx].status = "\xCEn lucru" /* IN_PROGRESS */;
    db.setServiceJobs(jobs);
  }
  res.status(201).json({
    message: `Lucrul/pontarea pe fi\u0219a ${jobId.toUpperCase()} a \xEEnceput cu succes \xEEn mun. Ungheni! Starea fi\u0219ei: ${jobs[jobIdx].status}.`,
    timer: newTimer,
    job: jobs[jobIdx]
  });
});
router2.post("/hr/stop-work", verifyToken, (req, res) => {
  const timers = db.getActiveTimers();
  const timerIdx = timers.findIndex((t) => t.mechanicId === req.userId);
  if (timerIdx === -1) {
    res.status(400).json({ error: "Nu ave\u021Bi nicio sesiune de pontaj activ\u0103 la care s\u0103 da\u021Bi Stop." });
    return;
  }
  const timer = timers[timerIdx];
  const startTime = new Date(timer.startTime).getTime();
  const now = Date.now();
  const actualHours = (now - startTime) / (1e3 * 60 * 60);
  let hoursToRecord = actualHours;
  if (req.body.hoursWorked !== void 0) {
    hoursToRecord = Number(req.body.hoursWorked);
  } else if (actualHours < 0.05) {
    hoursToRecord = 1.5;
  }
  hoursToRecord = Number(hoursToRecord.toFixed(2));
  const jobs = db.getServiceJobs();
  const jobIdx = jobs.findIndex((j) => j.id === timer.jobId);
  let newLabor = null;
  let comisionSum = 0;
  if (jobIdx !== -1) {
    const hourlyRate = 220;
    const commissionRate = 35;
    newLabor = {
      id: `jl-${Date.now().toString().slice(-4)}`,
      mechanicId: timer.mechanicId,
      description: req.body.notes || `Sesiune lucru - Diagnoz\u0103 \u0219i Repara\u021Bii (Pontat Automizat)`,
      hoursSpent: hoursToRecord,
      hourlyRate,
      commissionRate
    };
    jobs[jobIdx].labor.push(newLabor);
    if (jobs[jobIdx].status === "\xCEn lucru" /* IN_PROGRESS */ && req.body.targetStatus) {
      if (Object.values(JobStatus).includes(req.body.targetStatus)) {
        jobs[jobIdx].status = req.body.targetStatus;
      }
    }
    db.setServiceJobs(jobs);
    comisionSum = hoursToRecord * hourlyRate * commissionRate / 100;
  }
  const newTs = {
    id: `ts-${Date.now()}`,
    employeeId: timer.mechanicId,
    jobId: timer.jobId,
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    hoursWorked: hoursToRecord,
    notes: req.body.notes || `Pontat mecanic automatizat pentru fi\u0219a ${timer.jobId.toUpperCase()}`,
    basePay: 0,
    commissionEarned: Number(comisionSum.toFixed(2))
  };
  const timesheets = db.getTimesheets();
  db.setTimesheets([newTs, ...timesheets]);
  const updatedTimers = timers.filter((t) => t.id !== timer.id);
  db.setActiveTimers(updatedTimers);
  res.json({
    message: `Pontajul a fost oprit cu succes \xEEn mun. Ungheni! S-au \xEEnregistrat ${hoursToRecord} ore de manoper\u0103 pe fi\u0219\u0103.`,
    hoursWorked: hoursToRecord,
    commissionEarned: comisionSum,
    labor: newLabor,
    timesheet: newTs
  });
});
router2.get("/timesheets", verifyToken, (req, res) => {
  res.json(db.getTimesheets());
});
router2.post("/timesheets", verifyToken, isAccountant, (req, res) => {
  const { employeeId, hoursWorked, notes, basePay } = req.body;
  if (!employeeId || !hoursWorked) {
    res.status(400).json({ error: "Sunt necesare ID-ul angajatului \u0219i orele lucrate." });
    return;
  }
  const newTs = {
    id: `ts-${Date.now()}`,
    employeeId,
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    hoursWorked: Number(hoursWorked),
    notes: notes || "Pontaj manual",
    basePay: Number(basePay) || 150,
    // default rate basePay
    commissionEarned: 0
  };
  const timesheets = db.getTimesheets();
  db.setTimesheets([newTs, ...timesheets]);
  res.status(201).json({
    message: "Pontaj manual \xEEnscris cu succes de c\u0103tre Contabil!",
    timesheet: newTs
  });
});
router2.get("/invoices", verifyToken, (req, res) => {
  const allInvoices = db.getInvoices();
  if (req.userRole === "Client" /* CLIENT */) {
    const clientInvoices = allInvoices.filter((i) => i.clientId === req.userId);
    res.json(clientInvoices);
  } else {
    res.json(allInvoices);
  }
});
router2.post("/invoices/generate/:jobId", verifyToken, isAccountant, (req, res) => {
  const { jobId } = req.params;
  const allJobs = db.getServiceJobs();
  const job = allJobs.find((j) => j.id === jobId);
  if (!job) {
    res.status(404).json({ error: "Fi\u0219a de service nu a fost g\u0103sit\u0103." });
    return;
  }
  const invoices = db.getInvoices();
  const alreadyIssued = invoices.some((i) => i.jobId === jobId);
  if (alreadyIssued) {
    res.status(400).json({ error: "Aceast\u0103 fi\u0219\u0103 are deja o factur\u0103 emis\u0103." });
    return;
  }
  const vehicle = db.getVehicles().find((v) => v.id === job.vehicleId);
  const client = db.getUsers().find((u) => u.id === job.clientId);
  const partsValue = job.parts.reduce((acc, curr) => acc + curr.sellPrice * curr.quantity, 0);
  const laborValue = job.labor.reduce((acc, curr) => acc + curr.hourlyRate * curr.hoursSpent, 0);
  const subtotal = partsValue + laborValue;
  const vatRate = 20;
  const vatAmount = subtotal * vatRate / 100;
  const total = subtotal + vatAmount;
  const items = [
    ...job.parts.map((p) => ({
      description: `Pies\u0103: ${p.name} (OEM: ${p.oemCode})`,
      quantity: p.quantity,
      unitPrice: p.sellPrice,
      total: p.sellPrice * p.quantity
    })),
    ...job.labor.map((l) => ({
      description: `Manoper\u0103: ${l.description}`,
      quantity: l.hoursSpent,
      unitPrice: l.hourlyRate,
      total: l.hourlyRate * l.hoursSpent
    }))
  ];
  const newInvoice = {
    id: `inv-${Date.now()}`,
    jobId,
    invoiceNumber: `INV-2026-${Math.floor(1e3 + Math.random() * 9e3).toString()}`,
    issueDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
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
    message: "Factur\u0103 fiscal\u0103 \xEEn MDL a fost emis\u0103 cu succes!",
    invoice: newInvoice
  });
});
router2.put("/invoices/:id/payment", verifyToken, isAccountant, (req, res) => {
  const { id } = req.params;
  const { isPaid, paymentMethod } = req.body;
  const invoices = db.getInvoices();
  const invIdx = invoices.findIndex((i) => i.id === id);
  if (invIdx === -1) {
    res.status(404).json({ error: "Factura nu a fost g\u0103sit\u0103." });
    return;
  }
  invoices[invIdx] = {
    ...invoices[invIdx],
    isPaid: !!isPaid,
    paymentDate: isPaid ? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : void 0,
    paymentMethod: isPaid ? paymentMethod || "Card" : void 0
  };
  db.setInvoices(invoices);
  res.json({
    message: `Plata facturii ${invoices[invIdx].invoiceNumber} a fost \xEEnregistrat\u0103 \xEEn MDL!`,
    invoice: invoices[invIdx]
  });
});
router2.get("/suppliers", verifyToken, (req, res) => {
  res.json(db.getSuppliers());
});
var operations_default = router2;

// server/routes/chatbot.ts
var import_express3 = require("express");
var import_genai = require("@google/genai");
var router3 = (0, import_express3.Router)();
var ai = null;
var getAIClient = () => {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new import_genai.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return ai;
};
router3.post("/chat", async (req, res) => {
  const { messages, userId } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Mesajele sunt necesare \u0219i trebuie s\u0103 fie un array." });
  }
  try {
    const serviceCatalog = db.getServiceTypes();
    const appointments = db.getAppointments();
    const currentDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const catalogContext = serviceCatalog.map((s) => `- ${s.name}: ${s.estimatedDuration} min (${s.estimatedPrice} MDL)`).join("\n");
    const occupiedSlots = appointments.filter((ap) => ap.status !== "Canceled" && ap.date >= currentDate).map((ap) => `- ${ap.date} ${ap.time}`).join("\n");
    const systemInstruction = `
E\u0219ti asistentul AI oficial al unui service auto din Republica Moldova (mun. Ungheni), specializat \xEEn program\u0103ri inteligente.
Rolul t\u0103u principal este s\u0103 aju\u021Bi clien\u021Bii s\u0103 g\u0103seasc\u0103 \u0219i s\u0103 rezerve un slot orar disponibil pentru repara\u021Bia ma\u0219inii lor.
Numele t\u0103u este AutoBOX Assistant.

REGULI DE BUSINESS STRICTE (Program de lucru):
- Luni - Vineri: 08:00 - 18:00 (Ultima programare major\u0103 la 16:00, revizie simpl\u0103 la 17:00)
- S\xE2mb\u0103t\u0103: 08:00 - 14:00 (Doar servicii rapide: schimb ulei, diagnosticare, vulcanizare)
- Duminic\u0103: \xCENCHIS (Nu accepta nicio programare).

LOGICA DE CALCUL A DISPONIBILIT\u0102\u021AII:
1. Fiecare serviciu are o durat\u0103 estimat\u0103 (ex: Schimb ulei = 1 or\u0103, Schimb distribu\u021Bie = 4 ore). Trebuie s\u0103 te asiguri c\u0103 slotul ales de client acoper\u0103 integral durata serviciului \xEEn cadrul orelor de lucru.
2. Contextul de mai jos ofer\u0103 lista de "sloturi ocupate". Dac\u0103 un interval se suprapune cu un slot ocupat, acel interval este INVALIDEAZ\u0102.
3. Nu propune niciodat\u0103 intervale care sunt deja \xEEn lista de sloturi ocupate.

CONTEXT ACTUAL (Data curent\u0103: ${currentDate}):
CATALOG SERVICII:
${catalogContext}

PROGRAM\u0102RI DEJA OCUPATE:
${occupiedSlots}

FLUXUL CONVERSA\u021AIEI:
Pasul 1: Identific\u0103 problema sau serviciul dorit de client \u0219i ma\u0219ina (Marc\u0103/Model).
Pasul 2: Calculeaz\u0103 intern durata serviciului bazat pe catalog.
Pasul 3: Solicit\u0103 data \u0219i ora dorit\u0103. Verific\u0103 disponibilitatea \xEEn timp real folosind datele din context.
Pasul 4: Dac\u0103 slotul e ocupat sau \xEEn afara programului, propune politicos EXACT 2 alternative libere \xEEn cele mai apropiate intervale.
Pasul 5: Colecteaz\u0103 datele de contact (Nume, Num\u0103r de telefon).
Pasul 6: \xCEnainte de finalizare, prezint\u0103 un sumar clar \u0219i genereaz\u0103 codul JSON de confirmare:
{ "type": "APPOINTMENT_READY", "data": { "serviceId": "...", "date": "...", "time": "...", "notes": "..." } }

TONALITATE:
Profesionist, amabil, specific pie\u021Bei din Republica Moldova. R\u0103spunde \xEEn limba rom\xE2n\u0103 (Rom\xE2n\u0103). R\u0103spunde concis.

EXEMPLU FEW-SHOT:
USER: Salutare! Vreau o programare pentru m\xE2ine, vineri, pe la ora 10 diminea\u021Ba. Am nevoie de o diagnosticare computerizat\u0103 la un VW Golf 7.
MODEL: Salut! V\u0103 pot ajuta cu pl\u0103cere. Pentru m\xE2ine, vineri, la ora 10:00, slotul este disponibil pentru o diagnosticare computerizat\u0103 (durat\u0103 aprox. 30 min). V\u0103 rog s\u0103 \xEEmi l\u0103sa\u021Bi un nume \u0219i un num\u0103r de telefon pentru a confirma rezervarea pentru VW Golf 7.
`;
    const chatMessages = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
    const aiClient = getAIClient();
    if (!aiClient) {
      return res.status(503).json({ error: "Serviciul AI nu este configurat." });
    }
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatMessages,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });
    const text = response.text || "Ne cerem scuze, dar nu am putut genera un r\u0103spuns. V\u0103 rug\u0103m s\u0103 reveni\u021Bi.";
    let appointmentData = null;
    const jsonMatch = text.match(/\{[\s\S]*"type":\s*"APPOINTMENT_READY"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        appointmentData = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse AI appointment JSON", e);
      }
    }
    res.json({
      content: text.replace(/\{[\s\S]*"type":\s*"APPOINTMENT_READY"[\s\S]*\}/, "").trim(),
      appointmentData
    });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    if (error.status === 429 || error.message?.includes("429") || error.message?.includes("quota")) {
      return res.status(429).json({
        error: "Limita de utilizare a fost atins\u0103. V\u0103 rug\u0103m s\u0103 a\u0219tepta\u021Bi un minut \u0219i s\u0103 re\xEEncerca\u021Bi.",
        content: "Sunt pu\u021Bin ocupat chiar acum (limit\u0103 de vitez\u0103 atins\u0103). Te rog s\u0103 revii peste un minut sau s\u0103 ne contactezi telefonic pentru urgen\u021Be!"
      });
    }
    res.status(500).json({ error: "S-a produs o eroare la procesarea cererii AI." });
  }
});
var chatbot_default = router3;

// server.ts
async function startServer() {
  const app = (0, import_express4.default)();
  const PORT = 3e3;
  app.use(import_express4.default.json());
  app.use(import_express4.default.urlencoded({ extended: true }));
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      city: "Ungheni",
      country: "Republica Moldova",
      system: "AutoBOX-Un Autoservice ERP",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.use("/api/auth", auth_default);
  app.use("/api", operations_default);
  app.use("/api/ai", chatbot_default);
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting development server with Vite middleware mode...");
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static files from production dist path...");
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express4.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Critical error starting the server:", err);
});
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.cjs.map
