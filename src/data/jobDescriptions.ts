
export interface JobDescription {
  title: string;
  role: string;
  responsibilities: string[];
  salaryStructure: string;
  schedule: string;
}

export const jobDescriptions: Record<string, JobDescription> = {
  OWNER: {
    title: "DIRECTOR DE SERVICE / ADMINISTRATOR",
    role: "Conducerea strategică, financiară și operațională a întregii unități.",
    responsibilities: [
      "Gestionarea bugetelor de venituri și cheltuieli, plata taxelor și salariilor.",
      "Negocierea contractelor mari cu flotele corporative și societățile de asigurări.",
      "Reprezentarea firmei în fața organelor de control (ANTA, FISC, Inspecția Muncii).",
      "Monitorizarea KPI-urilor de performanță ale echipei tehnice."
    ],
    salaryStructure: "Salariu Fix + Dividend / Bonus Performanță",
    schedule: "Luni - Vineri: 08:00 - 17:00"
  },
  RECEPTION: {
    title: "MAISTRU-RECEPTOR / CONSILIER SERVICE",
    role: "Interfața principală între client și echipa tehnică din atelier.",
    responsibilities: [
      "Primirea clientului și completarea Comenzii-Beneficiar.",
      "Inspectarea vizuală inițială a vehiculului și identificarea daunelor existente.",
      "Distribuirea sarcinilor către mecanici în funcție de încărcare.",
      "Întocmirea devizului estimativ și obținerea acordului scris.",
      "Predarea mașinii către client și explicarea facturilor."
    ],
    salaryStructure: "Salariu Fix + Bonus din normele facturate",
    schedule: "Luni - Sâmbătă (Prin rotație): 08:00 - 18:00"
  },
  ACCOUNTANT: {
    title: "CONTABIL / ECONOMIST",
    role: "Evidența financiar-contabilă strictă a afacerii.",
    responsibilities: [
      "Introducerea facturilor de la furnizori și emiterea facturilor fiscale.",
      "Calcularea salariilor (inclusiv procente din manoperă).",
      "Întocmirea dărilor de seamă către Serviciul Fiscal de Stat.",
      "Monitorizarea plăților către furnizori și a creanțelor de la clienți."
    ],
    salaryStructure: "Salariu Fix Lunar",
    schedule: "Luni - Vineri: 09:00 - 18:00"
  },
  MECHANIC: {
    title: "MECANIC AUTO (UNIVERSAL)",
    role: "Executarea lucrărilor de mecanică generală și întreținere periodică.",
    responsibilities: [
      "Diagnosticarea uzurii și înlocuirea elementelor suspensiei.",
      "Repararea sistemului de direcție și a celui de frânare.",
      "Efectuarea reviziilor periodice (schimb ulei, filtre).",
      "Înlocuirea kiturilor de distribuție și a sistemelor auxiliare."
    ],
    salaryStructure: "Salariu de Bază + % din manopera facturată",
    schedule: "Luni - Vineri: 08:00 - 17:00 / Sâmbătă Juma de zi"
  },
  ELECTRICIAN: {
    title: "ELECTRICIAN AUTO / DIAGNOSTICIAN",
    role: "Identificarea defecțiunilor de natură electrică și electronică.",
    responsibilities: [
      "Scanarea computerizată folosind testere dedicate (Launch, Autel).",
      "Citirea și interpretarea codurilor de eroare (DTC).",
      "Remedierea cablajelor și schimbarea senzorilor defecți.",
      "Resetarea intervalelor de service și adaptarea modulelor noi."
    ],
    salaryStructure: "Salariu Fix + Bonusuri de calificare",
    schedule: "Luni - Vineri: 08:00 - 17:00"
  },
  MOTORIST: {
    title: "MOTORIST (EXPERT MOTOARE)",
    role: "Repararea capitală a motoarelor cu ardere internă și a transmisiilor.",
    responsibilities: [
      "Dezasamblarea completă a motoarelor și măsurarea uzurii cilindrilor.",
      "Înlocuirea garniturilor, segmenților și recondiționarea chiulaselor.",
      "Diagnosticarea și repararea cutiilor de viteze manuale și automate.",
      "Asigurarea etanșeității și performanței post-reparație motor."
    ],
    salaryStructure: "Salariu Înalt + % manoperă complexă",
    schedule: "Luni - Vineri: 08:00 - 18:00"
  },
  PURCHASING: {
    title: "MANAGER ACHIZIȚII PIESE (ACHIZITOR)",
    role: "Identificarea și aprovizionarea cu piese și consumabile folosind EPC.",
    responsibilities: [
      "Utilizarea programelor de identificare piese pe baza codului VIN.",
      "Interacțiunea cu distribuitorii (Autodoctor, Euro07, Automall) pentru prețuri optime.",
      "Gestionarea stocului intern și a retururilor către furnizori.",
      "Monitorizarea termenelor de livrare pentru piesele comandate pe deviz."
    ],
    salaryStructure: "Salariu Fix + Bonus Target Achiziții",
    schedule: "Luni - Vineri: 08:30 - 17:30"
  },
  GEOMETRY: {
    title: "SPECIALIST GEOMETRIE ROȚI (3D)",
    role: "Reglarea corectă a suspensiei folosind standul computerizat 3D.",
    responsibilities: [
      "Fixarea țintelor optice și operarea standului computerizat.",
      "Reglarea unghiului de fugă, de cădere și a convergenței.",
      "Verificarea prealabilă a componentelor suspensiei (jocuri pivoți).",
      "Calibrarea senzorului de unghi volan (SAS)."
    ],
    salaryStructure: "Salariu Bază + Comision la lucrare",
    schedule: "Luni - Vineri: 08:00 - 17:00"
  },
  BODYWORK: {
    title: "TINICHIGIU AUTO (CAROSIER)",
    role: "Îndreptarea elementelor de tablă și sudură MIG/MAG.",
    responsibilities: [
      "Utilizarea bancei de redresare pentru deformări ale șasiului.",
      "Demontarea/montarea elementelor de interior și exterior.",
      "Executarea lucrărilor de sudură în mediu de gaz protector.",
      "Recondiționarea elementelor metalice corodate."
    ],
    salaryStructure: "Salariu Bază + % manoperă tinichigerie",
    schedule: "Luni - Vineri: 08:00 - 18:00"
  },
  PAINTER: {
    title: "PREGĂTITOR / VOPSITOR AUTO",
    role: "Vopsirea și lăcuirea elementelor în cabină specializată.",
    responsibilities: [
      "Curățarea ruginii, aplicarea chitului și șlefuirea suprafețelor.",
      "Aplicarea grundului și prepararea vopselei conform codului de culoare.",
      "Vopsirea elementelor în cabina de vopsit la temperatură controlată.",
      "Polisharea finală pentru eliminarea imperfecțiunilor."
    ],
    salaryStructure: "Salariu Bază + % manoperă vopsitorie",
    schedule: "Luni - Vineri: 08:00 - 18:00"
  },
  DETAILING: {
    title: "SPECIALIST DETAILING / POLISHATOR",
    role: "Polișarea caroseriei și curățarea chimică a habitaclului.",
    responsibilities: [
      "Curățarea detaliată a interiorului (aspirator injecție-extracție).",
      "Aplicarea protecțiilor ceramice și a tratamentelor hidrofobe.",
      "Restaurarea farurilor mătuite și a elementelor din plastic.",
      "Polișarea în mai mulți pași pentru luciu de oglindă."
    ],
    salaryStructure: "Comision din manoperă facturată",
    schedule: "Luni - Vineri: 09:00 - 18:00"
  },
  VULCANIZER: {
    title: "VULCANIZATOR (TEHNICIAN ANVELOPE)",
    role: "Demontarea, montarea și echilibrarea anvelopelor.",
    responsibilities: [
      "Repararea penelor de cauciuc și gestionarea hotelului de anvelope.",
      "Verificarea presiunii și a uzurii benzii de rulare.",
      "Operarea mașinilor de dejantat și de echilibrat roți.",
      "Gestionarea fluxului ridicat în perioadele de sezon."
    ],
    salaryStructure: "Salariu Fix + Bonus Volum",
    schedule: "Program Flexibil / Sezonier"
  },
  WASHER: {
    title: "SPĂLĂTOR AUTO",
    role: "Spălarea tehnologică și cosmetică a vehiculelor.",
    responsibilities: [
      "Spălarea exterioară și curățarea interioară standard.",
      "Degresarea compartimentului motor când este solicitat.",
      "Spălarea de predare (finaling) înainte de livrarea către client.",
      "Menținerea curățeniei în zona boxelor de spălare."
    ],
    salaryStructure: "Salariu Fix + % din spălările plătite",
    schedule: "Luni - Sâmbătă: 08:00 - 18:00"
  },
  AUXILIARY: {
    title: "MUNCITOR AUXILIAR / OM DE SERVICIU",
    role: "Menținerea curățeniei și gestionarea deșeurilor.",
    responsibilities: [
      "Păstrarea curățeniei în ateliere și zonele de birouri.",
      "Colectarea și sortarea deșeurilor (filtre vechi, ulei uzat).",
      "Pregătirea uleiului uzat pentru firmele de reciclare.",
      "Asistență la descărcarea pieselor de schimb grele."
    ],
    salaryStructure: "Salariu Fix Lunar",
    schedule: "Luni - Vineri: 07:30 - 16:30"
  },
  HR: {
    title: "MANAGER RESURSE UMANE (HR)",
    role: "Gestionarea strategică a capitalului uman și conformitatea cu legislația muncii.",
    responsibilities: [
      "Coordonarea procesului de recrutare și selecție a personalului tehnic.",
      "Gestionarea dosarelor personale și monitorizarea valabilității CIM-urilor.",
      "Elaborarea și actualizarea fișelor de post conform CORM Moldova.",
      "Asigurarea instruirii periodice privind Protecția Muncii și SSM."
    ],
    salaryStructure: "Salariu Fix + Bonus de Reținere Personal",
    schedule: "Luni - Vineri: 08:30 - 17:30"
  },
  GENERIC: {
    title: "ANGAJAT OPERATIV AUTOBOX",
    role: "Asigurarea bunei funcționări a activităților zilnice în cadrul service-ului.",
    responsibilities: [
      "Respectarea regulamentului intern și a normelor de conduită.",
      "Utilizarea rațională a echipamentelor și a consumabilelor.",
      "Raportarea oricăror anomalii către superiorul direct.",
      "Menținerea curățeniei și ordinii la locul de muncii."
    ],
    salaryStructure: "Conform grilei de salarizare stabilite",
    schedule: "Program Standard 40h/săptămână"
  }
};
