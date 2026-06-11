import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Paciente from "../models/pacienteModel";

type AuthPayload = JwtPayload & {
  id_usuario: number;
  perfil: string;
};

type RequestUser = {
  id_usuario: number;
  perfil: "ADMIN" | "RECEPCIONISTA" | "PACIENTE";
  id_paciente?: number;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.header("authorization");
  if (!header) {
    return res.status(401).json({ error: "Token nao informado" });
  }

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token invalido" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "JWT_SECRET nao configurado" });
  }

  try {
    const payload = jwt.verify(token, secret) as AuthPayload;
    const user: RequestUser = {
      id_usuario: payload.id_usuario,
      perfil: payload.perfil as RequestUser["perfil"],
    };

    if (payload.perfil === "PACIENTE") {
      const paciente = await Paciente.findOne({
        where: { id_usuario: payload.id_usuario },
        attributes: ["id_paciente"],
      });

      if (paciente) {
        user.id_paciente = Number(paciente.get("id_paciente"));
      }
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalido" });
  }
};
