import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../../src/types";

export interface CustomRequest extends Request {
  userId?: string;
  userRole?: UserRole;
  userEmail?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "drivedoc_secret_key_moldova_ungheni_2026";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Acces refuzat. Tokenul lipsește sau este invalid." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; userRole: UserRole; userEmail: string };
    (req as CustomRequest).userId = decoded.userId;
    (req as CustomRequest).userRole = decoded.userRole;
    (req as CustomRequest).userEmail = decoded.userEmail;
    next();
  } catch (error) {
    res.status(403).json({ error: "Token nevalid sau expirat." });
    return;
  }
}

export function hasRole(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as CustomRequest).userRole;

    // OWNER is the omnipotent DB superuser, bypass all security checks immediately
    if (userRole === UserRole.OWNER) {
      return next();
    }

    if (!userRole || !roles.includes(userRole)) {
      res.status(433).json({ error: `Acces nepermis. Această operațiune necesită unul dintre rolurile: ${roles.join(", ")}` });
      return;
    }

    next();
  };
}

export const isAdmin = hasRole([UserRole.ADMIN]);
export const isMechanic = hasRole([UserRole.MECHANIC]);
export const isReceptionist = hasRole([UserRole.RECEPTION, UserRole.ADMIN]);
export const isAccountant = hasRole([UserRole.ACCOUNTANT, UserRole.ADMIN]);
export const isClient = hasRole([UserRole.CLIENT]);
