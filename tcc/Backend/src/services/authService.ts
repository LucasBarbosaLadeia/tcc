import jwt, { SignOptions } from "jsonwebtoken";
import { Op } from "sequelize";
import Usuario from "../models/usuarioModel";
import { comparePassword } from "../utils/password";

type AuthResult = {
  token: string;
  usuario: Record<string, unknown>;
};

export const authenticateLogin = async (
  identificador: string,
  senha: string,
): Promise<AuthResult | null> => {
  const usuario = await Usuario.findOne({
    where: {
      [Op.or]: [{ cpf: identificador }, { email: identificador }],
    },
    attributes: { include: ["senha"] },
  });

  if (!usuario) {
    return null;
  }

  const senhaValida = await comparePassword(
    senha,
    usuario.get("senha") as string,
  );
  if (!senhaValida) {
    return null;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET nao configurado");
  }

  const signOptions: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"],
  };

  const token = jwt.sign(
    { id_usuario: usuario.get("id_usuario"), perfil: usuario.get("perfil") },
    secret,
    signOptions,
  );

  const { senha: _senha, ...usuarioSemSenha } = usuario.toJSON();
  return { token, usuario: usuarioSemSenha };
};
