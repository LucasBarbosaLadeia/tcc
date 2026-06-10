type Perfil = "ADMIN" | "RECEPCIONISTA" | "PACIENTE";
export declare const buildAuthToken: (perfil: Perfil, id_usuario?: number, id_paciente?: number) => string;
export declare const authHeaders: (perfil: Perfil, id_usuario?: number, id_paciente?: number) => {
    Authorization: string;
};
export {};
