import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

type AuthPayload = JwtPayload & {
  id_usuario: number;
  perfil: string;
};

export const authMiddleware = (
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
    (req as Request & { user?: AuthPayload }).user = {
      id_usuario: payload.id_usuario,
      perfil: payload.perfil,
    } as AuthPayload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalido" });
  }
};
