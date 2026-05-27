import { Request, Response } from "express";
export declare const createAgenda: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllAgendas: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAgendaById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAgenda: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAgenda: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
