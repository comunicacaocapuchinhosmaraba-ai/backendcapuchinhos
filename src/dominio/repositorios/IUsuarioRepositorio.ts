import { Usuario } from '../entidades/Usuario';

export interface IUsuarioRepositorio {
  criar(usuario: Usuario): Promise<Usuario>;
  buscarPorId(id: string): Promise<Usuario | null>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  listarTodos(): Promise<Usuario[]>;
  atualizar(id: string, dados: Partial<Usuario>): Promise<Usuario>;
  deletar(id: string): Promise<void>;
  existeEmail(email: string): Promise<boolean>;
}