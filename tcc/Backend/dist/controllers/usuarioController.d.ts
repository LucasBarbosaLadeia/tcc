import { Request, Response } from "express";
export declare const createUsuario: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllUsuarios: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUsuarioById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateUsuario: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteUsuario: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
