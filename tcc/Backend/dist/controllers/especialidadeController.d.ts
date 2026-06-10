import { Request, Response } from "express";
export declare const createEspecialidade: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllEspecialidades: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getEspecialidadeById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateEspecialidade: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteEspecialidade: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
