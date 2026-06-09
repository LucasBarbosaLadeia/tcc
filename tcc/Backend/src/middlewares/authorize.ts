import { NextFunction, Request, Response } from "express";

type RequestWithUser = Request & {
  user?: { perfil?: "PACIENTE" | "RECEPCIONISTA" | "ADMIN" };
};

type Perfil = "PACIENTE" | "RECEPCIONISTA" | "ADMIN";

export const authorize = (...perfisPermitidos: Perfil[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    const perfil = req.user?.perfil;
    if (!perfil || !perfisPermitidos.includes(perfil as Perfil)) {
      return res.status(403).json({ error: "Acesso nao autorizado" });
    }

    return next();
  };
};
