declare namespace Express {
  export interface Request {
    user?: {
      id_usuario: number;
      perfil: string;
    };
  }
}
