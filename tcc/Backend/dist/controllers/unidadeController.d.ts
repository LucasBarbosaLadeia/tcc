import { Request, Response } from "express";
export declare const createUnidade: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllUnidades: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUnidadeById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateUnidade: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteUnidade: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
