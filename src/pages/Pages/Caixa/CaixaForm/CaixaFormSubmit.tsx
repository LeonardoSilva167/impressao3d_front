import { MovimentoCaixaService } from 'services/MovimentoCaixa';
import { CaixaModel } from 'interfaces/MovimentoCaixa/MovimentoCaixaInterface';

const movimentoCaixaService = new MovimentoCaixaService();

export const CaixaFormSubmit = async (data: CaixaModel): Promise<CaixaModel> => {
  const service = new MovimentoCaixaService();
  console.log(!data.caixa_fechado)
  try {
    if (!data.caixa_fechado) {
      const response = await service.caixaAbertura(data);
      return response;
    } else {
      const response = await service.caixaFechamento(data);
      return response
    }
  } catch (error) {
    console.error('Erro ao salvar c:', error);
    throw error;
  }
};



  