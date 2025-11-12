import api from "./axios";

export function getProfile() {
  return api.get("/api/profile");
}

export function updateProfile(payload) {
  // payload: { email?, name? }
  return api.patch("/api/profile", payload);
}

export function changePassword(payload) {
  // payload: { current_password, new_password }
  return api.post("/api/profile/change-password", payload);
}
