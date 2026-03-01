// Representa o arquivo recebido via upload (multer)
export interface ArquivoUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

/**
 * Contrato do serviço de armazenamento de arquivos.
 * 
 * Regras IMPORTANTES:
 * - salvarArquivo → retorna SOMENTE o caminho relativo (ex: "2026/02/arquivo.png")
 * - obterUrlPublica → monta URL completa usando variável de ambiente (BASE_URL)
 * - UseCases NUNCA devem conhecer localhost ou domínio
 */
export interface IArmazenamentoServico {
  /**
   * Salva fisicamente o arquivo
   * @returns caminho relativo do arquivo salvo
   * Ex: "2026/02/arquivo.png"
   */
  salvarArquivo(arquivo: ArquivoUpload): Promise<string>;

  /**
   * Remove fisicamente o arquivo
   */
  deletarArquivo(caminhoRelativo: string): Promise<void>;

  /**
   * Retorna a URL pública completa para visualização
   * Ex: https://backendpatinhas.onrender.com/uploads/2026/02/arquivo.png
   */
  obterUrlPublica(caminhoRelativo: string): string;

  /**
   * Valida se o tipo do arquivo é permitido
   */
  validarTipoArquivo(mimetype: string): boolean;

  /**
   * Valida se o tamanho do arquivo está dentro do limite
   */
  validarTamanhoArquivo(tamanho: number): boolean;
}
