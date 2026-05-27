import { Request, Response } from "express";
export declare const createAgendamento: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllAgendamentos: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAgendamentoById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAgendamento: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAgendamento: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
