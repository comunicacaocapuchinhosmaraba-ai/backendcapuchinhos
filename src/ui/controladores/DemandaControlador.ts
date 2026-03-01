import { Request, Response } from 'express';

interface DemandaDTO {
  nome: string;
  telefone: string;
  assunto: string;
  mensagem: string;
}

export async function criarDemanda(req: Request, res: Response) {
  try {
    const data = req.body as DemandaDTO;

    if (!data?.nome || !data?.telefone || !data?.assunto || !data?.mensagem) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const formData = new URLSearchParams();
    formData.append('nome', data.nome);
    formData.append('telefone', data.telefone);
    formData.append('assunto', data.assunto);
    formData.append('mensagem', data.mensagem);

    // Configurações do FormSubmit
    formData.append('_subject', 'Nova solicitação – Patinhas de Rua');
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');

    const response = await fetch(
      'https://formsubmit.co/patinhasderuamaraba@gmail.com',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao enviar e-mail');
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Falha no envio' });
  }
}
