import jwt from "jsonwebtoken";

type Perfil = "ADMIN" | "RECEPCIONISTA" | "PACIENTE";

const secret = process.env.JWT_SECRET || "test-secret";
process.env.JWT_SECRET = secret;

export const buildAuthToken = (
  perfil: Perfil,
  id_usuario = 1,
  id_paciente?: number,
) => {
  return jwt.sign(
    { id_usuario, perfil, ...(typeof id_paciente === "number" ? { id_paciente } : {}) },
    secret,
    { expiresIn: "1h" },
  );
};

export const authHeaders = (
  perfil: Perfil,
  id_usuario = 1,
  id_paciente?: number,
) => ({
  Authorization: `Bearer ${buildAuthToken(perfil, id_usuario, id_paciente)}`,
});
