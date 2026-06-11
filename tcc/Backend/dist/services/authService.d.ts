type AuthResult = {
    token: string;
    usuario: Record<string, unknown>;
};
export declare const authenticateLogin: (identificador: string, senha: string) => Promise<AuthResult | null>;
export {};
