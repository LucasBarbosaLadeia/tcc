import { Model } from "sequelize";
export interface IPaciente {
    id_paciente?: number;
    id_usuario: number;
    cpf: string;
    nome_completo: string;
    data_nascimento: Date;
    sexo: "M" | "F" | "Outro";
    telefone: string;
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    contador_faltas?: number;
    created_at?: Date;
    updated_at?: Date;
}
declare class Paciente extends Model<IPaciente> implements IPaciente {
    id_paciente: number;
    id_usuario: number;
    cpf: string;
    nome_completo: string;
    data_nascimento: Date;
    sexo: "M" | "F" | "Outro";
    telefone: string;
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    contador_faltas: number;
    created_at: Date;
    updated_at: Date;
}
export default Paciente;
