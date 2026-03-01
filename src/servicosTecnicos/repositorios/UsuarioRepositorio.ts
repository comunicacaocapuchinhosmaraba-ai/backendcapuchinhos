import { Repository } from 'typeorm';
import { Usuario } from '@dominio/entidades/Usuario';
import { IUsuarioRepositorio } from '@dominio/repositorios/IUsuarioRepositorio';
import { AppDataSource } from '../database/dataSource';

export class UsuarioRepositorio implements IUsuarioRepositorio {
  private repositorio: Repository<Usuario>;

  constructor() {
    this.repositorio = AppDataSource.getRepository(Usuario);
  }

  async criar(usuario: Usuario): Promise<Usuario> {
    return await this.repositorio.save(usuario);
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return await this.repositorio.findOne({ where: { id } });
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
  return await this.repositorio
    .createQueryBuilder('usuario')
    .addSelect('usuario.senha') // 🔑 força trazer a senha
    .where('usuario.email = :email', { email })
    .getOne();
}

  async listarTodos(): Promise<Usuario[]> {
    return await this.repositorio.find({
      select: ['id', 'nome', 'email', 'tipo', 'ativo', 'criadoEm']
    });
  }

  async atualizar(id: string, dados: Partial<Usuario>): Promise<Usuario> {
    await this.repositorio.update(id, dados);
    const usuario = await this.buscarPorId(id);
    if (!usuario) throw new Error('Usuário não encontrado');
    return usuario;
  }

  async deletar(id: string): Promise<void> {
    await this.repositorio.delete(id);
  }

  async existeEmail(email: string): Promise<boolean> {
    const count = await this.repositorio.count({ where: { email } });
    return count > 0;
  }
}