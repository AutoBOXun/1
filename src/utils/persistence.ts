import { User, Vehicle, Appointment, ServiceJob, InventoryItem, Invoice } from "../types";

export const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const clearStorage = (keys: string[]) => {
  keys.forEach(key => localStorage.removeItem(key));
};

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};
