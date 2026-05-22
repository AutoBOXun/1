import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { User, UserRole } from "../../src/types";
import { verifyToken, CustomRequest, isAdmin } from "../middlewares/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "drivedoc_secret_key_moldova_ungheni_2026";

// Auth Register Route (Default registers CLIENT role, but ADMIN can register other roles)
router.post("/register", async (req: any, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      res.status(400).json({ error: "Toate câmpurile (nume, email, telefon, parolă) sunt necesare." });
      return;
    }

    const users = db.getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      res.status(400).json({ error: "Există deja un cont cu această adresă de email." });
      return;
    }

    // Assign Role
    let assignedRole = UserRole.CLIENT;
    if (role && Object.values(UserRole).includes(role as UserRole)) {
      assignedRole = role as UserRole;
    }

    const newUser: User = {
      id: `u-${Date.now().toString().slice(-4)}`,
      name,
      email: email.toLowerCase(),
      phone,
      role: assignedRole,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150`
    };

    // Save user detail
    db.setUsers([...users, newUser]);

    // Save credentials
    const passwordHash = await bcrypt.hash(password, 10);
    db.addCredential({
      userId: newUser.id,
      passwordHash
    });

    res.status(201).json({
      message: "Cont înregistrat cu succes în mun. Ungheni!",
      user: newUser
    });
  } catch (error) {
    console.error("Eroare la înregistrare:", error);
    res.status(500).json({ error: "Eroare internă de server la înregistrare." });
  }
});

// Auth Login Route
router.post("/login", async (req: any, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Emailul și parola sunt obligatorii." });
      return;
    }

    const users = db.getUsers();
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() ||
      u.name.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      res.status(401).json({ error: "Email sau parolă incorectă." });
      return;
    }

    const credentials = db.getCredentials();
    const userCred = credentials.find(c => c.userId === user.id);

    if (!userCred) {
      res.status(401).json({ error: "Credențiale corupte sau inexistente. Contactați administratorul." });
      return;
    }

    const isMatch = await bcrypt.compare(password, userCred.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Email sau parolă incorectă." });
      return;
    }

    // Sign jwt token
    const token = jwt.sign(
      { userId: user.id, userRole: user.role, userEmail: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Autentificare reușită!",
      token,
      user
    });
  } catch (error) {
    console.error("Eroare la autentificare:", error);
    res.status(500).json({ error: "Eroare internă de server la autentificare." });
  }
});

// Auth Current user profile
router.get("/profile", verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const users = db.getUsers();
    const user = users.find(u => u.id === req.userId);

    if (!user) {
      res.status(404).json({ error: "Utilizatorul nu a fost găsit." });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Eroare la încărcarea profilului." });
  }
});

// Auth Users list (accessible only by non-clients typically)
router.get("/users", verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (req.userRole === UserRole.CLIENT) {
      res.status(433).json({ error: "Acces nepermis pentru clienți." });
      return;
    }
    res.json(db.getUsers());
  } catch (error) {
    res.status(500).json({ error: "Eroare la încărcarea listei de utilizatori." });
  }
});

export default router;
