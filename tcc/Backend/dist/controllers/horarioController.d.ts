import { Request, Response } from "express";
export declare const createHorario: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllHorarios: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getHorarioById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateHorario: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteHorario: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
