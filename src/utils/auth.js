// src/utils/auth.js

import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isRoleAllowed = (allowedRoleIds, userRoleId) => {
  if (!allowedRoleIds) return false; // null = ninguno
  return allowedRoleIds.includes(userRoleId);
};

export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  return true;

  try {
    const { exp } = jwtDecode(token);
    const now = Date.now() / 1000;

    if (exp < now) {
      localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch (e) {
    localStorage.removeItem("token");
    return false;
  }
};

export const canAccess = (itemSection, user) => {
  if (!user) return false; 

  if (user.businessId === 1) return true;

  if (!itemSection.allowedRoleIds) return true;

  return itemSection.allowedRoleIds.includes(user.roleId) && !itemSection.onlySystem;
};

export const canAccessSection = (section, user) => {
  if (!user) return false;
  
  const countAccessibleItems = section.items.reduce((count, item) => {
    return count + 1;
  }, 0);

  return countAccessibleItems > 0;
}