import api from "./axios";

export function registerUser(payload) {
  // payload: { email, name, password }
  return api.post("/api/auth/register", payload);
}

export function loginUser(payload) {
  // payload: { email, password }
  return api.post("/api/auth/login", payload);
}
