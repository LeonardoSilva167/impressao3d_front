import { ajustaMoedaBanco } from 'helpers/functions_helpers';
import { ServicosModel } from 'interfaces/Servicos';
import { ServicosService } from 'services/ServicosService';

const servicosService = new ServicosService();

export const ServicosFormSubmit = async (
  data: ServicosModel,
): Promise<ServicosModel> => {
  try {
    const servicosService = new ServicosService();
      data.preco = ajustaMoedaBanco(data.preco);

    if (data.id_servico) {
      await servicosService.editServicos(data);
      return data;
    } else {
      const response = await servicosService.createServicos(data);

      const servico = response.Servicos.data;

      if (!servico || !servico.id) {
        throw new Error("Serviço não retornado corretamente pela API.");
      }

      return servico;
    }
  } catch (error) {
    console.error("Erro ao salvar Serviço:", error);
    throw error;
  }
};

