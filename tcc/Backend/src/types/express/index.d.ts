declare global {
  namespace Express {
    interface Request {
      user?: {
        id_usuario: number;
        perfil: "ADMIN" | "RECEPCIONISTA" | "PACIENTE";
        id_paciente?: number;
      };
    }
  }
}

export {};
