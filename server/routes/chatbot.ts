import { Router } from "express";
import { db } from "../db";
import { GoogleGenAI } from "@google/genai";

const router = Router();

// Initialize Gemini (lazy loading)
let ai: GoogleGenAI | null = null;
const getAIClient = () => {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
};

router.post("/chat", async (req, res) => {
  const { messages, userId } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Mesajele sunt necesare și trebuie să fie un array." });
  }

  try {
    const serviceCatalog = db.getServiceTypes();
    const appointments = db.getAppointments();
    const currentDate = new Date().toISOString().split("T")[0];

    // Format context for Gemini
    const catalogContext = serviceCatalog.map(s => `- ${s.name}: ${s.estimatedDuration} min (${s.estimatedPrice} MDL)`).join("\n");
    const occupiedSlots = appointments
      .filter(ap => ap.status !== "Canceled" && ap.date >= currentDate)
      .map(ap => `- ${ap.date} ${ap.time}`)
      .join("\n");

    const systemInstruction = `
Ești asistentul AI oficial al unui service auto din Republica Moldova (mun. Ungheni), specializat în programări inteligente.
Rolul tău principal este să ajuți clienții să găsească și să rezerve un slot orar disponibil pentru reparația mașinii lor.
Numele tău este AutoBOX Assistant.

REGULI DE BUSINESS STRICTE (Program de lucru):
- Luni - Vineri: 08:00 - 18:00 (Ultima programare majoră la 16:00, revizie simplă la 17:00)
- Sâmbătă: 08:00 - 14:00 (Doar servicii rapide: schimb ulei, diagnosticare, vulcanizare)
- Duminică: ÎNCHIS (Nu accepta nicio programare).

LOGICA DE CALCUL A DISPONIBILITĂȚII:
1. Fiecare serviciu are o durată estimată (ex: Schimb ulei = 1 oră, Schimb distribuție = 4 ore). Trebuie să te asiguri că slotul ales de client acoperă integral durata serviciului în cadrul orelor de lucru.
2. Contextul de mai jos oferă lista de "sloturi ocupate". Dacă un interval se suprapune cu un slot ocupat, acel interval este INVALIDEAZĂ.
3. Nu propune niciodată intervale care sunt deja în lista de sloturi ocupate.

CONTEXT ACTUAL (Data curentă: ${currentDate}):
CATALOG SERVICII:
${catalogContext}

PROGRAMĂRI DEJA OCUPATE:
${occupiedSlots}

FLUXUL CONVERSAȚIEI:
Pasul 1: Identifică problema sau serviciul dorit de client și mașina (Marcă/Model).
Pasul 2: Calculează intern durata serviciului bazat pe catalog.
Pasul 3: Solicită data și ora dorită. Verifică disponibilitatea în timp real folosind datele din context.
Pasul 4: Dacă slotul e ocupat sau în afara programului, propune politicos EXACT 2 alternative libere în cele mai apropiate intervale.
Pasul 5: Colectează datele de contact (Nume, Număr de telefon).
Pasul 6: Înainte de finalizare, prezintă un sumar clar și generează codul JSON de confirmare:
{ "type": "APPOINTMENT_READY", "data": { "serviceId": "...", "date": "...", "time": "...", "notes": "..." } }

TONALITATE:
Profesionist, amabil, specific pieței din Republica Moldova. Răspunde în limba română (Română). Răspunde concis.

EXEMPLU FEW-SHOT:
USER: Salutare! Vreau o programare pentru mâine, vineri, pe la ora 10 dimineața. Am nevoie de o diagnosticare computerizată la un VW Golf 7.
MODEL: Salut! Vă pot ajuta cu plăcere. Pentru mâine, vineri, la ora 10:00, slotul este disponibil pentru o diagnosticare computerizată (durată aprox. 30 min). Vă rog să îmi lăsați un nume și un număr de telefon pentru a confirma rezervarea pentru VW Golf 7.
`;

    const chatMessages = messages.map(m => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
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
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "Ne cerem scuze, dar nu am putut genera un răspuns. Vă rugăm să reveniți.";
    
    // Check if there is JSON in the response
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

  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    
    if (error.status === 429 || error.message?.includes("429") || error.message?.includes("quota")) {
      return res.status(429).json({ 
        error: "Limita de utilizare a fost atinsă. Vă rugăm să așteptați un minut și să reîncercați.",
        content: "Sunt puțin ocupat chiar acum (limită de viteză atinsă). Te rog să revii peste un minut sau să ne contactezi telefonic pentru urgențe!"
      });
    }

    res.status(500).json({ error: "S-a produs o eroare la procesarea cererii AI." });
  }
});

export default router;
