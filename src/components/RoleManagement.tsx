import React, { useState } from "react";
import { rolesCatalog } from "../data/roles";
import { User, UserRole } from "../types";
import { getEquivalentProfile } from "../utils/rbac";
import { Briefcase, Printer, FileText, UserCheck, Shield, Award, Sparkles, ChevronDown } from "lucide-react";

interface RoleManagementProps {
  users?: User[];
}

export const RoleManagement = ({ users = [] }: RoleManagementProps) => {
  const [selectedRole, setSelectedRole] = useState(rolesCatalog[0]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [employeeData, setEmployeeData] = useState({ name: "", idnp: "" });
  const [documentType, setDocumentType] = useState<"CIM" | "FISAPOSTULUI">("CIM");

  const staffUsers = users.filter(u => u.role !== UserRole.CLIENT);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    if (!userId) {
      setEmployeeData({ name: "", idnp: "" });
      return;
    }
    const user = staffUsers.find(u => u.id === userId);
    if (user) {
      setEmployeeData({
        name: user.name,
        idnp: `IDNP202${Math.floor(1000000000 + Math.random() * 9000000000)}`
      });

      // Find best matching role in the roles catalog
      const matchedProfile = getEquivalentProfile(user.title || user.role);
      const catalogMatch = rolesCatalog.find(r => r.role === matchedProfile.systemRole) || rolesCatalog[0];
      setSelectedRole(catalogMatch);
    }
  };

  const calculatedProfile = getEquivalentProfile(selectedRole.role || "");

  const getRoleCormCode = (roleId: string) => {
    const mapping: Record<string, string> = {
      admin: "121205",
      reception: "311518",
      purchaser: "332301",
      accountant: "241103",
      mechanic: "723103",
      electrician: "741214",
      motorist: "723110",
      geometry: "723120",
      bodywork: "721303",
      painter: "713204",
      detailing: "812204",
      tire: "723125",
      washer: "912203",
      auxiliary: "962201"
    };
    return mapping[roleId] || "723103";
  };

  const getRolePurpose = (roleId: string) => {
    const mapping: Record<string, string> = {
      admin: "Asigurarea conducerii strategice, administrative, financiare și operaționale a întregii unități de service, reprezentarea legală a companiei și supervizarea directă a activităților generale.",
      reception: "Asigurarea unei interfețe profesioniste între clienți și unitatea tehnică, preluarea vehiculelor, programarea, diagnosticarea preliminară și coordonarea devizelor estimative de plată.",
      purchaser: "Identificarea rapidă, negocierea și achiziția eficientă a pieselor de schimb și consumabilelor necesare reparațiilor auto, în cooperare directă cu marii distribuitori autorizați din RM.",
      accountant: "Asigurarea evidenței contabile riguroase, prelucrarea facturilor, calcularea corectă a salariilor și raportarea în formă electronică către Serviciul Fiscal de Stat al RM.",
      mechanic: "Mecanică generală, întreținerea tehnică periodică, asamblarea/dezasamblarea pieselor de schimb uzate, eliminarea defectelor la elementele suspensiei, direcției și sistemului de frânare.",
      electrician: "Scanarea computerizată a echipamentelor electronice, detectarea erorilor DTC, remedierea cablajelor electrice auto, adaptarea de noi module, testarea completă a senzorilor de bord.",
      motorist: "Expertiză avansată pentru reparațiile generale (capitale) ale motoarelor cu ardere internă, sisteme de distribuție, dezasamblare completă, rectificare și recondiționare bloc motor sau culbutori.",
      geometry: "Efectuarea geometriei computerizate 3D a trenului de rulare, fixarea țintelor optice și calibrarea unghiurilor de direcție/convergență conform specificațiilor originale ale constructorului.",
      bodywork: "Îndreptarea elementelor de caroserie auto, aplicarea operațiunilor de sudură MIG/MAG, utilizarea băncii de redresare și reconstrucția mecanică a elementelor de rezistență deformate.",
      painter: "Pregătirea elementelor de caroserie pentru vopsit (aplicare chit, șlefuire abrazivă, grunduire) și aplicarea uniformă a vopselei și lacului într-o cabină profesională de vopsit.",
      detailing: "Polișarea avansată a caroseriei, restaurarea farurilor, aplicarea straturilor ceramice și igienizarea chimică profundă cu aspirator cu injecție-extracție a elementelor interioare din material textil/piele.",
      tire: "Demontarea, montarea și echilibrarea anvelopelor pe jante de oțel/aliaj, vulcanizarea penelor, gestionarea depozitului sezonier (hotelului de anvelope) și reglarea presiunii optime în roți.",
      washer: "Întreținerea stării de curățenie a vehiculelor sosite pentru mentenanță sau gata pentru livrare, aplicarea proceselor de prespălare activă, spălare tehnică și uscare profesională.",
      auxiliary: "Întreținerea curățeniei spațiilor interne și externe ale atelierului auto, sortarea/gestionarea gunoaielor tehnologice periculoase (ulei uzat, filtre piese vopsite) pentru reciclare autorizată."
    };
    return mapping[roleId] || "Îndeplinirea calitativă a sarcinilor tehnice arondate departamentului de service auto conform instrucțiunilor producătorului.";
  };

  const generateFisaPostului = () => {
    const name = employeeData.name || "________________";
    const idnp = employeeData.idnp || "________________";
    const titleUpper = selectedRole.title.toUpperCase();
    const cormCode = getRoleCormCode(selectedRole.id);
    const purpose = getRolePurpose(selectedRole.id);
    
    // Structurare responsabilităţi pe litere (a, b, c, d...)
    const specAttrs = selectedRole.responsibilities.map((resp, idx) => {
      const char = String.fromCharCode(97 + idx); // a, b, c...
      return `     ${char}) ${resp}`;
    }).join("\n");

    return `================================================================================
          MODEL DETALIAT DE FIȘĂ A POSTULUI (CONFORM LEGISLAȚIEI RM)
================================================================================

AUTOPRO SERVICE S.R.L.
Sediul: Mun. Chișinău, str. Pietrăriei 12, Republica Moldova
IDNO: 1003600045618

                                                        APROBAT:
                                                        Director / Administrator
                                                        AUTOPRO SERVICE S.R.L.
                                                        ________________________
                                                        Lucian Avram
                                                        „___” ____________ 2026


                             FIȘA POSTULUI (A FUNCȚIEI)
                           Nr. ______ din „___” ________ 2026

Denumirea postului / funcției: ${titleUpper}
Codul funcției conform CORM:  ${cormCode} (Conform CORM din RM)
Subdiviziunea structurală:    Secția de Reparații și Deservire Auto
Statutul poziției:            [${selectedRole.id === "admin" ? "X" : " "}] De conducere   [${selectedRole.id !== "admin" ? "X" : " "}] De execuție


1. DISPOZIȚII GENERALE
--------------------------------------------------------------------------------
1.1. Prezenta fișă a postului este elaborată în conformitate cu prevederile Codului 
     Muncii al Republicii Moldova (Legea nr. 154/2003), cu modificările și 
     completările ulterioare, Hotărârile Guvernului în domeniu și Regulamentul 
     Intern al Unității.
1.2. Titularul postului se subordonează direct: Administratorului sau Directorului Tehnic.
1.3. Titularul postului are în subordine directă: ${selectedRole.id === "admin" ? "Întreaga echipă a service-ului auto" : "Nu are personal în subordine directă."}
1.4. In perioada absenței temporare (concediu de odihnă, concediu medical, deplasare 
     de serviciu etc.), atribuțiile titularului sunt preluate de un salariat competent desemnat prin ordin intern.
1.5. Titularul postului colaborează cu toate subdiviziunile structurale ale 
     întreprinderii și cu partenerii externi în limitele competenței sale.


2. SCOPUL GENERAL AL POSTULUI
--------------------------------------------------------------------------------
${purpose}


3. ATRIBUȚIILE ȘI SARCINILE DE SERVICIU
--------------------------------------------------------------------------------
Titularul postului îndeplinește următoarele atribuții specifice și generale:

3.1. Atribuții specifice postului (Sarcini de bază):
${specAttrs}

3.2. Sarcini generale (Valabile pentru toți angajații):
     a) Cunoaște și respectă cu strictețe Regulamentul Intern al unității, Contractul 
        Colectiv de Muncă (dacă există) și deciziile managementului superior.
     b) Respectă normele de Securitate și Sănătate în Muncă (SSM) prevăzute de Legea 
        nr. 186/2008 și instrucțiunile interne privind prevenirea riscurilor 
        profesionale.
     c) Menține ordinea și curățenia la locul de muncă, asigură utilizarea 
        rațională și în siguranță a bunurilor și echipamentelor încredințate.
     d) Își perfecționează continuu nivelul de pregătire profesională.
     e) Execută alte dispoziții ale superiorului ierarhic, care au legătură directă 
        cu specificul activității sale și nu contravin legislației în vigoare.


4. DREPTURILE ANGAJATULUI
--------------------------------------------------------------------------------
Titularul postului are dreptul:
4.1. Să ia decizii în limitele competențelor atribuite prin prezenta fișă și prin 
     procuri sau ordine interne emise de conducere.
4.2. Să solicite și să primească de la celelalte departamente informațiile, 
     rapoartele și documentele necesare pentru îndeplinirea atribuțiilor sale.
4.3. Să înainteze conducerii propuneri de îmbunătățire a activității subdiviziunii 
     sau a întreprinderii per ansamblu.
4.4. Să beneficieze de condiții de muncă ce corespund cerințelor de securitate și 
     igienă, asigurate de către angajator în conformitate cu normele legale.
4.5. Să participe la cursuri de instruire, seminare și traininguri de dezvoltare 
     profesională finanțate sau co-finanțate de unitate, conform politicilor interne.
4.6. Să beneficieze de toate drepturile și garanțiile stabilite de Codul Muncii al 
     Republicii Moldova (salariul achitat la timp, concediu anual odihnă, asistență 
     medicală și socială etc.).


5. RESPONSABILITĂȚILE ANGAJATUI
--------------------------------------------------------------------------------
Titularul postului răspunde personal de:
5.1. Îndeplinirea calitativă și în termenele stabilite a sarcinilor și atribuțiilor 
     prevăzute în prezenta Fișă a postului.
5.2. Legalitatea, veridicitatea și corectitudinea documentelor elaborate, semnate, 
     vizate sau transmise altor autorități/subdiviziuni.
5.3. Păstrarea confidențialității datelor cu caracter personal ale angajaților 
     și clienților, în conformitate cu Legea nr. 133/2011 privind protecția 
     datelor cu caracter personal din RM.
5.4. Păstrarea secretului comercial și de serviciu stabilit în cadrul companiei.
5.5. Integritatea materială a bunurilor și echipamentelor (calculator, tehnică de 
     birou etc.) transmise în folosință prin act de primire-predare.
5.6. Încălcarea disciplinei muncii, a normelor de etică profesională sau a 
     prevederilor legale, atrăgând după sine răspunderea disciplinară, materială, 
     contravențională sau penală, conform legislației Republicii Moldova.


6. CERINȚELE POSTULUI (PROFILUL COMPETENȚELOR)
--------------------------------------------------------------------------------
6.1. Studii:
     - Studii superioare de licență / medii profesionale de profil pentru sectorul auto.
6.2. Experiență profesională:
     - Minimum 1-3 ani în specialitate sau pe o poziție similară.
6.3. Cunoștințe specifice:
     - Cunoașterea profundă a Codului Muncii al Republicii Moldova și a altor 
       acte normative conexe.
     - Operare PC la nivel mediu/avansat (MS Office, identificatoare piese VIN/CORM).
6.4. Competențe lingvistice:
     - Limba română (limbă de stat) - nivel fluent.
     - Limba rusă - nivel mediu / avansat (constituie avantaj).
6.5. Abilități și trăsături de personalitate:
     - Capacități analitice, atenție la detalii și bune abilități de organizare.
     - Responsabilitate, punctualitate, integritate morală și loialitate.


7. DISPOZIȚII FINALE ȘI SEMNĂTURI
--------------------------------------------------------------------------------
7.1. Prezenta fișă a postului este întocmită în 2 (două) exemplare cu aceeași 
     valoare juridică, unul dintre care se păstrează în dosarul personal al 
     angajatului (la Serviciul Resurse Umane), iar al doilea se înmânează salariatului.


Luat în considerare și avizat:

Manager / Specialist Resurse Umane: Cătălina Rusu      Semnătura: ____________ Data: 22.05.2026


--------------------------------------------------------------------------------
DECLARAȚIA ANGAJATULUI:

Am luat cunoștință cu textul prezentei Fișe a postului, am înțeles sarcinile, 
atribuțiile, drepturile și responsabilitățile ce îmi revin și mă oblig să le respect. 
Confirm că am primit un exemplar original al prezentei fișe.

Nume, Prenume angajat: ${name}
IDNP angajat:          ${idnp}
Semnătura angajatului: __________________________    Data: _____________________`;
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      
      {/* Dynamic unified header block (One UI 8 inspired banner) */}
      <div className="bg-white rounded-3xl p-6 border border-[#E9E9EB] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <span className="text-[10px] bg-blue-50 text-[#034EA2] px-3 py-1 rounded-full font-bold uppercase tracking-normal">
            Arhitectură Personal & Securitate (CIM / RBAC)
          </span>
          <h3 className="text-2xl font-extrabold tracking-tight text-[#1D1D1F] mt-1.5">Modelator Contracte de Muncă & Fișe de Post</h3>
          <p className="text-[#86868B] text-xs font-medium max-w-2xl">
            Gestiunea centralizată a fișelor postului și generarea contractelor de muncă (CIM) conforme cu legislația muncii și grila salarială AutoBOX.
          </p>
        </div>
        <div className="w-12 h-12 bg-[#F2F2F7] rounded-full flex items-center justify-center shrink-0">
          <Briefcase className="w-5 h-5 text-[#034EA2]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Catalog Roluri (One UI style list) */}
        <div className="lg:col-span-4 bg-white border border-[#E9E9EB] rounded-3xl p-5 shadow-sm space-y-4">
          <div className="px-2 space-y-1">
            <h4 className="font-extrabold text-[10px] text-[#86868B] uppercase tracking-normal">Catalog Fișe Organigramă</h4>
            <p className="text-[11px] text-[#86868B]">Selectează un post standard pentru a vizualiza criteriile</p>
          </div>
          <div className="space-y-1.5 max-h-[440px] overflow-y-auto pr-1">
            {rolesCatalog.map(role => {
              const isActive = selectedRole?.id === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all flex justify-between items-center gap-2 cursor-pointer ${
                    isActive 
                      ? "bg-[#1D1D1F] border-transparent text-white font-semibold" 
                      : "bg-[#F2F2F7]/50 hover:bg-[#E9E9EB] text-[#1D1D1F] border-transparent"
                  }`}
                >
                  <div className="space-y-0.5 text-left">
                    <div className="text-xs font-bold leading-tight">{role.title}</div>
                    <div className={`text-[9px] font-bold uppercase tracking-normal ${isActive ? "text-slate-300" : "text-[#86868B]"}`}>
                      Echivalent: {role.role}
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? "-rotate-90 text-white" : "text-[#86868B]"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalii și Generator - UI curat, alb cu borduri subtile */}
        <div className="lg:col-span-8 space-y-6">
          {selectedRole ? (
            <>
              {/* Card Fișa funcției */}
              <div className="bg-white border border-[#E9E9EB] rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#F2F2F7] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-[#034EA2] rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#1D1D1F]">Fișa Detaliată a Postului</h4>
                      <p className="text-[10px] text-[#86868B] font-bold uppercase mt-0.5">Rol Selectat: {selectedRole.title}</p>
                    </div>
                  </div>
                  
                  {/* Salariu de baza din RBAC model */}
                  <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl text-right">
                    <span className="text-[9px] font-bold text-emerald-700 uppercase block tracking-normal">Salariu de Bază Grilă</span>
                    <span className="font-mono text-xs font-extrabold text-emerald-800">{calculatedProfile.baseSalaryMDL.toLocaleString()} MDL / lună</span>
                  </div>
                </div>

                <div className="space-y-3 bg-[#F2F2F7]/55 p-5 rounded-2xl">
                  <p className="text-[10px] font-extrabold text-[#86868B] uppercase tracking-normal">Responsabilități principale conform standardelor AutoBOX:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedRole.responsibilities.map((resp, i) => (
                      <li key={i} className="flex gap-2.5 text-xs text-[#1D1D1F] leading-normal font-semibold items-start text-left bg-white p-3 rounded-xl border border-transparent hover:border-[#E9E9EB] transition-all">
                        <span className="text-[#034EA2] font-bold shrink-0">•</span> 
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Generator inteligent Contract Individual de Muncă (CIM) & Fișă Post */}
              <div className="bg-white border border-[#E9E9EB] rounded-3xl p-6 space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#F2F2F7] pb-4">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-[#1D1D1F]">Generator Digital de Documente HR</h4>
                    <p className="text-[10px] text-[#86868B] font-bold uppercase tracking-normal">Republica Moldova – Aliniat 2026</p>
                  </div>
                  
                  {/* Selectare rapidă angajat existent */}
                  {staffUsers.length > 0 && (
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-normal">Precompletați:</label>
                      <select
                        value={selectedUserId}
                        onChange={(e) => handleSelectUser(e.target.value)}
                        className="bg-[#F2F2F7] text-[11px] font-extrabold text-[#1D1D1F] border border-[#E9E9EB] rounded-xl px-3 py-1.5 outline-none font-sans"
                      >
                        <option value="">Alegeți un angajat existent...</option>
                        {staffUsers.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.title || u.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Formular Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-normal ml-1">Nume Prenume Salariat</label>
                    <input 
                      type="text" 
                      placeholder="Nume, Prenume Angajat" 
                      className="w-full bg-[#F2F2F7] p-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#034EA2] outline-none text-xs font-semibold text-[#1D1D1F] transition-all font-sans" 
                      value={employeeData.name}
                      onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-normal ml-1">IDNP Salariat (13 cifre)</label>
                    <input 
                      type="text" 
                      placeholder="Cod IDNP valid" 
                      className="w-full bg-[#F2F2F7] p-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#034EA2] outline-none text-xs font-semibold text-[#1D1D1F] transition-all font-sans" 
                      value={employeeData.idnp}
                      onChange={(e) => setEmployeeData({ ...employeeData, idnp: e.target.value })}
                    />
                  </div>
                </div>

                {/* Selector Tip Document (One UI Tab Style) */}
                <div className="grid grid-cols-2 p-1.5 bg-[#F2F2F7] rounded-2xl gap-1">
                  <button
                    onClick={() => setDocumentType("CIM")}
                    className={`py-3.5 text-xs font-extrabold uppercase tracking-normal rounded-xl transition-all cursor-pointer ${
                      documentType === "CIM"
                        ? "bg-white text-[#1D1D1F] shadow-sm font-extrabold"
                        : "text-[#86868B] hover:text-[#1D1D1F]"
                    }`}
                  >
                    Contract de Muncă (CIM)
                  </button>
                  <button
                    onClick={() => setDocumentType("FISAPOSTULUI")}
                    className={`py-3.5 text-xs font-extrabold uppercase tracking-normal rounded-xl transition-all cursor-pointer ${
                      documentType === "FISAPOSTULUI"
                        ? "bg-white text-[#1D1D1F] shadow-sm font-extrabold"
                        : "text-[#86868B] hover:text-[#1D1D1F]"
                    }`}
                  >
                    Fișa Postului Detaliată (RM)
                  </button>
                </div>

                {/* Template box */}
                <div className="p-5 bg-[#F2F2F7]/40 rounded-3xl text-[#1D1D1F] text-xs font-mono leading-relaxed whitespace-pre-line max-h-[320px] overflow-y-auto border border-[#E9E9EB] text-left">
                  {documentType === "CIM" ? (
                    selectedRole.contractTemplate
                      .replaceAll("[Salariat Nume Prenume]", employeeData.name || "________________")
                      .replaceAll("[IDNP]", employeeData.idnp || "________________")
                      .replaceAll("[Salariu de Bază]", `${calculatedProfile.baseSalaryMDL.toLocaleString()} MDL`)
                      .replaceAll("3.000 MDL", `${calculatedProfile.baseSalaryMDL.toLocaleString()} MDL`)
                      .replaceAll("[DATA_INCEPERE]", employeeData.name ? (() => {
                        const today = new Date();
                        const months = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"];
                        return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
                      })() : "____ ________________ 20___")
                      .replaceAll("[CIM_DATE]", employeeData.name ? (() => {
                        const today = new Date();
                        const months = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"];
                        return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
                      })() : "________________")
                      .replaceAll("[CIM_YEAR]", new Date().getFullYear().toString())
                      .replaceAll("[CIM_NUMER]", employeeData.name ? `CIM-${employeeData.idnp.slice(-4)}` : "______")
                  ) : (
                    generateFisaPostului()
                  )}
                </div>

                <button 
                  onClick={() => window.print()}
                  className="w-full justify-center flex items-center gap-2 bg-[#1D1D1F] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-normal hover:bg-[#034EA2] transition-all cursor-pointer shadow-sm active:scale-95 text-center font-sans"
                >
                  <Printer className="w-4 h-4" />
                  Printează sau salvează documentul (PDF)
                </button>
              </div>
            </>
          ) : (
            <div className="text-center p-12 bg-white rounded-3xl border border-[#E9E9EB] text-[#86868B] font-bold uppercase tracking-normal text-xs font-sans">
              Selectați un rol din catalog pentru a genera CIM sau fișa postului.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
