import { Request, Response } from "express";
export declare const createProfissional: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllProfissionais: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProfissionalById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateProfissional: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteProfissional: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
