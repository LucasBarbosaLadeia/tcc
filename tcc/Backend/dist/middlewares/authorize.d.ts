import { NextFunction, Request, Response } from "express";
type RequestWithUser = Request & {
    user?: {
        perfil?: "PACIENTE" | "RECEPCIONISTA" | "ADMIN";
    };
};
type Perfil = "PACIENTE" | "RECEPCIONISTA" | "ADMIN";
export declare const authorize: (...perfisPermitidos: Perfil[]) => (req: RequestWithUser, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export {};
