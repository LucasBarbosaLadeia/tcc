import { Request, Response } from "express";
export declare const createPaciente: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllPacientes: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPacienteById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updatePaciente: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deletePaciente: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
