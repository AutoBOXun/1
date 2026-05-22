export interface RoleJobDescription {
  id: string;
  title: string;
  role: string;
  responsibilities: string[];
  contractTemplate: string;
  isOccupied: boolean;
  totalUnits: number;
  occupiedUnits: number;
}

/**
 * Generează un model de Contract Individual de Muncă (CIM) oficial și complet,
 * adaptat modelului din Republica Moldova, conform Codului Muncii al RM (Legea nr. 154/2003)
 * și legislației de protecție a muncii (SSM Legea nr. 186/2008).
 */
export function generateProfessionalCIMTemplate(
  title: string,
  cormCode: string,
  responsibilities: string[],
  baseSalaryMDL: string,
  specificClauses: string
): string {
  const bulletResponsibilities = responsibilities
    .map((resp, i) => `   ${i + 1}. ${resp}`)
    .join("\n");

  return `================================================================================
       CONTRACT INDIVIDUAL DE MUNCĂ (CONFORM CODULUI MUNCII AL RM)
================================================================================
Nr. [CIM_NUMER] din [CIM_DATE]                mun. Chișinău

Încheiat și înregistrat în registrul de evidență a contractelor sub nr. REG-[CIM_NUMER]

1. PĂRȚILE CONTRACTANTE
--------------------------------------------------------------------------------
1.1. ANGAJATORUL: S.C. AUTOPRO SERVICE S.R.L.,
     Sediul social și operațional: mun. Chișinău, str. Pietrăriei 12, MD-2000,
     IDNO / Cod Fiscal: 1003600045618,
     Reprezentat legal prin: Administrator Lucian Avram, în baza Statutului, pe de o parte,
     și
1.2. SALARIATUL: [Salariat Nume Prenume],
     IDNP: [IDNP],
     Domiciliat în: Republica Moldova,
     posesor al actului de identitate seria / numărul _________________, eliberat de ____________, pe de altă parte,

au convenit reciproc asupra încheierii prezentului contract individual de muncă (CIM) conform următoarelor clauze contractuale:

2. OBIECTUL CONTRACTULUI ȘI LOCUL DE MUNCĂ
--------------------------------------------------------------------------------
2.1. Locul de muncă: Secția de Reparații și Mentenanță Auto, str. Pietrăriei 12, Chișinău.
2.2. Salariatul este angajat în muncă în baza liberei înțelegeri în conformitate cu:
     Funcția / Ocupația: ${title.toUpperCase()}
     Codul Ocupațional conform CORM (Moldova): ${cormCode}
2.3. Activitatea de muncă se prestează în condiții normale de muncă, cu excepția riscurilor specifice de atelier atestate.

3. DURATA CONTRACTULUI ȘI PERIOADA DE PROBĂ
--------------------------------------------------------------------------------
3.1. Tipul contractului: Contract de muncă pe durată NEDETERMINATĂ.
3.2. Data începerii activității de muncă este stabilită pentru: [DATA_INCEPERE] (sau prima zi lucrătoare asumată prin pontaj).
3.3. Pentru verificarea aptitudinilor profesionale se stabilește o perioadă de probă de 3 luni calendaristice (sau 0 luni conform excepțiilor codului muncii RM).

4. DREPTURILE ȘI OBLIGAȚIILE SALARIATULUI
--------------------------------------------------------------------------------
4.1. Salariatul are toate drepturile stabilite în art. 9 din Codul Muncii al RM, inclusiv:
     - Dreptul la condiții sigure SSM, achitarea deplină a salariului la termenele legale și repaus săptămânal.
4.2. Salariatul se obligă:
     - Să îndeplinească cu onestitate și maximă seriozitate responsabilitățile de serviciu;
     - Să respecte disciplina tehnologică de reparație, standardele de siguranță AutoBOX și Regulamentul Intern;
     - Să păstreze secretul comercial, datele de securitate ale clienților și sistemelor interne;
     - Să poarte echipamentul de protecție individuală gratuit oferit de angajator;
     - Să asigure integritatea fizică a automobilelor clienților aflate în proces de reparație.

5. DREPTURILE ȘI OBLIGAȚIILE ANGAJATORULUI
--------------------------------------------------------------------------------
5.1. Angajatorul are dreptul de a emite dispoziții cu caracter obligatoriu, de a controla calitatea lucrărilor și de a aplica măsuri disciplinare sau stimulente.
5.2. Angajatorul se obligă:
     - Să pună la dispoziția salariatului un post de lucru echipat cu utilaje calitativ omologate, scule adecvate și flux permanent de piese de schimb;
     - Să asigure instruirea periodică SSM conform Legii 186/2008 a RM;
     - Să achite integral salariile și comisioanele consemnate în prezentul contract, precum și plățile de asigurări sociale și medicale corespunzătoare.

6. ATRIBUȚIILE ȘI RESPONSABILITĂȚILE POSTULUI
--------------------------------------------------------------------------------
Salariatul va executa următoarele obligații și procese profesionale:
${bulletResponsibilities}

7. CONDIȚIILE DE RETRIBUIRE A MUNCII
--------------------------------------------------------------------------------
7.1. Salariul brut de funcție (tarif lunar fix) este de: [Salariu de Bază] MDL/lună brut.
7.2. Suplimentar, salariatul poate beneficia de sporuri din manoperă, premii de performanță tehnologică sau comisioane lunare specifice normelor de timp facturate.
7.3. Plata salariului se efectuează în lei moldovenești, în două tranșe lunare:
     - Avans (lichidare intermediară) la data de 25 a lunii în curs;
     - Salariul final (lichidare totală) la data de 10 a lunii următoare.

8. REGIMUL DE MUNCĂ ȘI DE ODIHNĂ
--------------------------------------------------------------------------------
8.1. Durata timpului de muncă este de 40 de ore pe săptămână, 8 ore pe zi lucrătoare.
8.2. Programul de lucru standard: 09:00 - 18:00, cu pauză de masă de la 13:00 la 14:00.
8.3. Zilele de repaus săptămânal: sâmbăta și duminica (sau conform unui grafic flexibil decizional de ture agreat în prealabil).
8.4. Concediul de odihnă anual plătit se acordă pe o durată minimă de 28 de zile calendaristice.

9. CLAUZA SPECIALĂ PRIVIND SECURITATEA, CONFIDENȚIALITATEA ȘI RĂSPUNDEREA MATERIALĂ
--------------------------------------------------------------------------------
9.1. Clauză de funcție realizabilă: ${specificClauses}
9.2. Salariatul poartă răspundere materială civilă deplină pentru eventuale pagube provocate din neglijență tehnologică directă utilajelor scumpe din atelier sau vehiculelor clienților.
9.3. Toate daunele produse voit conduc la acțiuni pe cale legală.

10. ASIGURĂRILE SOCIALE ȘI MEDICALE OBLIGATORII
--------------------------------------------------------------------------------
10.1. Angajatorul garantează plata contribuțiilor obligatorii CNAS și asigurării CNAM conform legislației Republicii Moldova, oferind stagiu de cotizare complet.

11. LITIGII ȘI DISPOZIȚII FINALE
--------------------------------------------------------------------------------
11.1. Modificările prezentului contract se realizează prin Acord Adițional semnat de ambele părți.
11.2. Disputele nerezolvate amiabil se transmit spre soluționare instanțelor de judecată din Republica Moldova.
11.3. Contractul este întocmit în 2 exemplare semnate fizic sau electronic, având aceeași putere legală.

SEMNĂTURILE PĂRȚILOR ANGAJATE:

ANGAJATOR: S.R.L. AUTOPRO SERVICE                      SALARIAT:
Director: Lucian Avram                                 Nume Prenume: [Salariat Nume Prenume]
Semnătura: ________________________                     IDNP: [IDNP]
                                                       Semnătura: ________________________`;
}

export const rolesCatalog: RoleJobDescription[] = [
  {
    id: "admin",
    title: "Director Service / Administrator",
    role: "Administrator",
    isOccupied: true,
    totalUnits: 1,
    occupiedUnits: 1,
    responsibilities: [
      "Conducerea strategică, financiară și operațională a întregii unități.",
      "Gestionarea bugetelor de venituri și cheltuieli, plata taxelor și salariilor.",
      "Negocierea contractelor mari cu flotele corporative și cu societățile de asigurări.",
      "Reprezentarea firmei în fața organelor de control."
    ],
    contractTemplate: generateProfessionalCIMTemplate(
      "Director Service / Administrator",
      "121205",
      [
        "Conducerea strategică, financiară și operațională a întregii unități.",
        "Gestionarea bugetelor de venituri și cheltuieli, plata taxelor și salariilor.",
        "Negocierea contractelor mari cu flotele corporative (firme de distribuție, companii de taxi) și cu societățile de asigurări din Moldova (pentru reparații pe CASCO/RCA).",
        "Reprezentarea firmei în fața organelor de control (ANTA, Serviciul Fiscal de Stat, Inspecția Muncii, Protecția Consumatorului)."
      ],
      "12000",
      "Salariatul poartă răspundere civilă, materială și penală deplină pentru integritatea activelor companiei, deciziile administrative și financiare luate și organizarea generală a securității SSM la nivel de unitate."
    )
  },
  {
    id: "reception",
    title: "Maistru-Receptor / Consilier Service",
    role: "Receptor",
    isOccupied: true,
    totalUnits: 1,
    occupiedUnits: 1,
    responsibilities: [
      "Interfața principală între client și echipa tehnică din atelier.",
      "Primirea clientului, ascultarea simptomelor și completarea 'Comenzii-Beneficiar'.",
      "Inspectarea vizuală inițială a vehiculului.",
      "Distribuirea sarcinilor către mecanici.",
      "Întocmirea devizului de plată estimativ."
    ],
    contractTemplate: generateProfessionalCIMTemplate(
      "Maistru-Receptor / Consilier Service",
      "311518",
      [
        "Interfața principală între client și echipa tehnică din atelier.",
        "Primirea clientului, ascultarea simptomelor și completarea 'Comenzii-Beneficiar'.",
        "Inspectarea vizuală inițială a vehiculului (identificarea din timp a tuturor daunelor preexistente pentru a proteja service-ul de litigii).",
        "Distribuirea sarcinilor către mecanici în funcție de încărcarea atelierului.",
        "Întocmirea devizului de plată estimativ și obținerea acordului scris al clientului.",
        "Predarea mașinii către client la finalul reparației și explicarea lucrărilor efectuate."
      ],
      "8000",
      "Salariatul este direct răspunzător de păstrarea secretului comercial, completarea exactă a fișelor de primire-predare auto și calculul corect al orelor tehnice normate."
    )
  },
  {
    id: "purchaser",
    title: "Manager Achiziții Piese",
    role: "Achizitor",
    isOccupied: true,
    totalUnits: 1,
    occupiedUnits: 1,
    responsibilities: [
      "Identificarea rapidă și aprovizionarea cu piesele și consumabilele necesare.",
      "Utilizarea programelor dedicate (EPC) pe baza codului VIN.",
      "Interacțiunea zilnică cu distribuitorii de piese.",
      "Gestionarea stocului intern al service-ului."
    ],
    contractTemplate: generateProfessionalCIMTemplate(
      "Manager Achiziții Piese de Schimb",
      "332301",
      [
        "Identificarea rapidă și aprovizionarea cu piesele și consumabilele necesare.",
        "Utilizarea programelor dedicate de identificare (Electronic Parts Catalog - EPC) pe baza seriei de șasiu (codului VIN).",
        "Interacțiunea zilnică cu marii distribuitori auto din RM (Autodoctor, Euro07, Automall, Elit etc.) pentru obținerea celor mai bune prețuri și termene rapide de livrare.",
        "Gestionarea stocului intern al service-ului auto."
      ],
      "7500",
      "Salariatul are obligația să verifice riguros originalitatea pieselor achiziționate, să asigure returnarea pieselor neconforme în termenele stabilite și răspunde direct de gestiunea stocului din depozit."
    )
  },
  {
    id: "accountant",
    title: "Contabil / Economist",
    role: "Contabil",
    isOccupied: false,
    totalUnits: 1,
    occupiedUnits: 0,
    responsibilities: [
      "Evidența financiar-contabilă strictă a afacerii.",
      "Introducerea facturilor de la furnizori și emiterea facturilor fiscale.",
      "Calcularea salariilor și a procentelor din manoperă.",
      "Întocmirea dărilor de seamă către SFS."
    ],
    contractTemplate: generateProfessionalCIMTemplate(
      "Contabil / Economist",
      "241103",
      [
        "Evidența financiar-contabilă strictă în conformitate cu SNC din Republica Moldova.",
        "Introducerea facturilor de la furnizori și emiterea facturilor fiscale către clienți.",
        "Calcularea corectă a salariilor și a cotelor de comision din manoperă ale mecanicilor.",
        "Întocmirea dărilor de seamă lunare și trimestriale (IPC21, IALS21, TBA, etc.) și depunerea lor la Serviciul Fiscal de Stat."
      ],
      "9000",
      "Salariatul poartă răspundere civilă și materială completă pentru corectitudinea intrărilor contabile executate, calcularea taxelor și păstrarea integrității documentelor arhivate."
    )
  },
  {
    id: "mechanic",
    title: "Mecanic Auto (Universal)",
    role: "Mecanic",
    isOccupied: true,
    totalUnits: 1,
    occupiedUnits: 1,
    responsibilities: [
      "Executarea lucrărilor de mecanică generală și întreținere periodică.",
      "Diagnosticarea uzurii și înlocuirea elementelor suspensiei.",
      "Repararea sistemului de direcție și a celui de frânare.",
      "Efectuarea reviziilor periodice."
    ],
    contractTemplate: generateProfessionalCIMTemplate(
      "Mecanic Auto (Universal)",
      "723103",
      [
        "Executarea lucrărilor de mecanică generală și întreținere periodică.",
        "Diagnosticarea uzurii, jocurilor și înlocuirea sistemelor suspensiei (amortizoare, brațe, pivoți, bucșe).",
        "Repararea sistemului de direcție, transmisie și a sistemului de frânare.",
        "Efectuarea reviziilor periodice (schimb ulei motor, schimb kit filtre, schimb antigel și lichid de frână)."
      ],
      "6000",
      "Salariatul este obligat să respecte instrucțiunile tehnologice de asamblare și dezasamblare a elementelor mecanice auto, să utilizeze corect elevatoarele de atelier și să garanteze siguranța rulării mașinii."
    )
  },
  {
    id: "electrician",
    title: "Electrician Auto / Diagnostician",
    role: "Electrician",
    isOccupied: false,
    totalUnits: 1,
    occupiedUnits: 0,
    responsibilities: [
      "Identificarea defecțiunilor de natură electrică și electronică.",
      "Scanarea computerizată a mașinii folosind testere.",
      "Citirea și interpretarea codurilor de eroare.",
      "Remedierea cablajelor, schimbarea senzorilor."
    ],
    contractTemplate: generateProfessionalCIMTemplate(
      "Electrician Auto / Diagnostician",
      "741214",
      [
        "Identificarea defecțiunilor de natură electrică, electronică și de multiplexare.",
        "Scanarea computerizată a mașinii folosind testere dedicate de diagnosticare (Launch, Autel, etc.).",
        "Citirea, interpretarea codurilor de eroare (DTC) și analiza parametrilor vii.",
        "Remedierea rețelelor electrice (CAN, LIN), sudarea contactelor oxidate, înlocuirea senzorilor și resetarea computerului."
      ],
      "6500",
      "Salariatul are obligațiunea de a respecta regulile de tehnica securității electrice de înaltă tensiune (la mașini hibrid și electrice) și să folosească scule izolate electrostatic pentru a preveni vătămarea."
    )
  },
  {
    id: "motorist",
    title: "Motorist",
    role: "Motorist",
    isOccupied: true,
    totalUnits: 1,
    occupiedUnits: 1,
    responsibilities: [
      "Repararea capitală a motoarelor cu ardere internă și a transmisiilor.",
      "Dezasamblarea completă a motoarelor, măsurarea uzurii cilindrilor.",
      "Înlocuirea garniturilor, segmenților.",
      "Diagnosticarea și repararea cutiilor de viteze."
    ],
    contractTemplate: generateProfessionalCIMTemplate(
      "Motorist (Mecanic Motoare Complexe)",
      "723110",
      [
        "Repararea capitală a motoarelor cu ardere internă pe benzină și motorină.",
        "Dezasamblarea completă a motoarelor, măsurarea toleranțelor cu micrometrul și evaluarea uzurii cilindrilor.",
        "Înlocuirea garniturilor de chiulasă, a segmenților de piston, a cuzineților și a kiturilor de distribuție pe lanț.",
        "Diagnosticarea și repararea cutiilor de viteze manuale s-au automate."
      ],
      "7000",
      "Salariatul răspunde direct de corectitudinea cuplurilor de strângere a șuruburilor de chiulasă, biele sau arbori cu came conform fișelor cu parametrii constructori."
    )
  },
  {
    id: "geometry",
    title: "Specialist Geometrie Roți",
    role: "Geometrie",
    isOccupied: false,
    totalUnits: 1,
    occupiedUnits: 0,
    responsibilities: [
      "Reglarea corectă a suspensiei.",
      "Operarea standului computerizat 3D de aliniere.",
      "Reglarea unghiului de fugă, de cădere și convergenței.",
      "Verificarea prealabilă a suspensiei."
    ],
    contractTemplate: generateProfessionalCIMTemplate(
      "Tehnician Reglare Unghiuri Geometrie 3D",
      "723120",
      [
        "Reglarea corectă a cinematicii suspensiei.",
        "Operarea și calibrarea standului computerizat 3D de aliniere a roților.",
        "Reglarea sub presiune a unghiurilor de fugă, de cădere și a convergenței axelor.",
        "Verificarea obligatorie a integrității preventive a bucșelor și direcției înainte de reglaj direct."
      ],
      "5500",
      "Salariatul este dator să asigure calibrarea permanentă și curățenia camerelor infraroșu și țintelor 3D ale standului, prevenind reglajele eronate care pot conduce la uzura prematură a anvelopelor clienților."
    )
  },
  {
    id: "bodywork",
    title: "Tinichigiu Auto",
    role: "Tinichigiu",
    isOccupied: true,
    totalUnits: 1,
    occupiedUnits: 1,
    responsibilities: [
      "Îndreptarea elementelor de tablă, sudură MIG/MAG.",
      "Utilizarea bancei de redresare pentru șasiu.",
      "Demontarea/montarea elementelor de interior și exterior."
    ],
    contractTemplate: generateProfessionalCIMTemplate(
      "Tinichigiu Auto (Carosier)",
      "721303",
      [
        "Îndreptarea elementelor de tablă afectate, sudură în gaz protector (MIG/MAG).",
        "Utilizarea corectă a băncii de redresare și a utilajului de calibrare structurală a șasiului.",
        "Demontarea, dezasamblarea și înlocuirea reperelor de caroserie sudate s-au fixate în șuruburi.",
        "Montarea accesoriilor interioare și exterioare la parametri din fabrică."
      ],
      "5800",
      "Salariatul se obligă să utilizeze în exclusivitate mănuși izolante, mască cu filtru activ și să verifice absența conductelor inflamabile din vecinătatea punctului de sudură auto."
    )
  },
  {
    id: "painter",
    title: "Pregătitor / Vopsitor Auto",
    role: "Vopsitor",
    isOccupied: true,
    totalUnits: 1,
    occupiedUnits: 1,
    responsibilities: [
      "Curățarea ruginii, aplicarea chitului, șlefuirea.",
      "Aplicarea grundului, prepararea vopselei.",
      "Vopsirea și lăcuirea elementelor în cabina specială."
    ],
    contractTemplate: generateProfessionalCIMTemplate(
      "Pregătitor / Vopsitor Auto",
      "713204",
      [
        "Curățarea mecanică a ruginii, aplicarea straturilor de chit și șlefuirea planurilor.",
        "Aplicarea grundului, prepararea computerizată a rețetelor de vopsele.",
        "Aplicarea vopselei (bazei) de acoperire și a lacului protector în cabina de vopsit.",
        "Efectuarea ciclului corect de uscare termică a elementelor vopsite."
      ],
      "5800",
      "Salariatul are obligațiunea absolută de a lucra în cabina de pulverizare purtând masca respiratorie cu aducțiune de aer curat și echipamentul complet antistatic de protecție."
    )
  },
  {
    id: "detailing",
    title: "Specialist Detailing / Polishator",
    role: "Detailer",
    isOccupied: false,
    totalUnits: 1,
    occupiedUnits: 0,
    responsibilities: [
      "Polișarea caroseriei, curățarea chimică detaliată a habitaclului.",
      "Aplicarea protecțiilor ceramice, tratamente hidrofobe.",
      "Restaurarea farurilor mătuite."
    ],
    contractTemplate: generateProfessionalCIMTemplate(
      "Specialist Cosmetică Auto și Detailing",
      "812204",
      [
        "Polișarea profesională a elementelor de caroserie (îndepărtarea defectelor de lac).",
        "Curățarea chimică profundă și dezinfectarea habitaclului prin tehnologia injecție-extracție.",
        "Aplicarea protecțiilor premium nano-ceramice și a protecțiilor hidrofobe pe sticlă.",
        "Restaurarea suprafeței farurilor din policarbonat mătuite."
      ],
      "5500",
      "Salariatul se obligă să testeze rezistența fizico-chimică a tapițeriei / plasticelor de bord înainte de utilizarea detergenților intensivi și să manipuleze cu grijă elementele electrice interioare."
    )
  },
  {
    id: "tire",
    title: "Vulcanizator",
    role: "Vulcanizator",
    isOccupied: true,
    totalUnits: 1,
    occupiedUnits: 1,
    responsibilities: [
      "Demontarea/montarea anvelopelor, echilibrarea roților.",
      "Repararea penelor.",
      "Gestionarea hotelului de anvelope."
    ],
    contractTemplate: generateProfessionalCIMTemplate(
      "Vulcanizator / Lucrător Anvelope",
      "723125",
      [
        "Demontarea și montarea anvelopelor folosind mașina de dejantat.",
        "Optimizarea și echilibrarea dinamică a roților pe standul electronic.",
        "Efectuarea reparațiilor calitative de pane prin aplicarea peticelor la rece sau cald.",
        "Indexarea, etichetarea și stivuirea organizată a cauciucurilor din cadrul Hotelului de Anvelope."
      ],
      "5000",
      "Salariatul răspunde de respectarea presiunilor corecte, strângerea piulițelor exclusiv cu cheia dinamometrică la cuplul dat și depozitarea ecologică a anvelopelor uzate reziduale."
    )
  },
  {
    id: "washer",
    title: "Spălător Auto",
    role: "Spălător",
    isOccupied: true,
    totalUnits: 1,
    occupiedUnits: 1,
    responsibilities: [
      "Spălarea tehnologică a mașinilor înainte de reparații.",
      "Spălarea exterior/interior înainte de predarea mașinii."
    ],
    contractTemplate: generateProfessionalCIMTemplate(
      "Spălător Vehicule Auto",
      "912203",
      [
        "Efectuarea spălărilor tehnologice pregătitoare (îndepărtarea blocului de noroi, gheață) pentru a permite mecanicilor accesul curat la elemente.",
        "Efectuarea spălării exterioare active și igienizării interioare a vehiculului finalizat, anterior predării acestuia procesuale către client."
      ],
      "4500",
      "Salariatul este obligat să utilizeze cu deplină securitate aparatele de înaltă presiune (Karcher) la distanțe care să evite decupările de vopsea afectată sau distrugerea elementelor fragile ale caroseriei."
    )
  },
  {
    id: "auxiliary",
    title: "Muncitor Auxiliar",
    role: "Auxiliar",
    isOccupied: true,
    totalUnits: 1,
    occupiedUnits: 1,
    responsibilities: [
      "Menținerea curățeniei generale.",
      "Colectarea și sortarea deșeurilor.",
      "Pregătirea uleiului uzat pentru reciclare."
    ],
    contractTemplate: generateProfessionalCIMTemplate(
      "Muncitor Auxiliar și Curățenie Atelier",
      "962201",
      [
        "Menținerea permanentă a curățeniei în ateliere, holuri, coridoare și vestiare auto.",
        "Măturarea, aspirarea și spălarea pardoselilor utilizând detergenți industriali speciali degresanți antialunecare.",
        "Colectarea zilnică ordonată și selectivă a deșeurilor din activitatea de service (filtre de ulei folosite, piese metalice desuete, ambalaje de carton și plastic).",
        "Pregătirea fluidelor uzate (ulei de motor extras) în recipiente speciale etanșe destinate partenerilor autorizați din RM de valorificare ecologică."
      ],
      "4500",
      "Salariatul are obligațiunea de a cunoaște și respecta normele de manipulare și protecție proprie la lucrul cu substanțe inflamabile sau deșeuri ecologice periculoase în service."
    )
  }
];
