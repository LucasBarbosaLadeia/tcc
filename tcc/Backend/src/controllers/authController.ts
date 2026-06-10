import { Request, Response } from "express";
import { authenticateLogin } from "../services/authService";

export const login = async (req: Request, res: Response) => {
  try {
    const { cpf, email, senha } = req.body;

    if (!senha || (!cpf && !email)) {
      return res.status(400).json({ error: "Credenciais invalidas" });
    }

    const identificador = cpf || email;
    const result = await authenticateLogin(identificador, senha);
    if (!result) {
      return res.status(401).json({ error: "Credenciais invalidas" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao autenticar", details: error });
  }
};
