import { UserRole } from "../types";

export const getRoleAvatar = (role?: UserRole | string) => {
  switch (role) {
    case UserRole.ADMIN:
      return "/images/avatar_admin_1779391694663.png";
    case UserRole.HR:
      return "/images/avatar_hr_1779391678849.png";
    case UserRole.ACCOUNTANT:
      return "/images/avatar_accountant_1779391661361.png";
    case UserRole.OWNER:
      return "/images/avatar_owner_1779391726901.png";
    case UserRole.MECHANIC:
      return "/images/avatar_mechanic_1779391645210.png";
    case UserRole.RECEPTION:
      return "/images/avatar_reception_1779391742804.png";
    case UserRole.CLIENT:
      return "/images/avatar_client_1779391710003.png";
    default:
      return "/images/avatar_client_1779391710003.png";
  }
};
