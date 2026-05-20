import { ClientesService } from 'services/Clientes/ClientesService';
import { ClientesModel } from 'interfaces/Clientes/ClientesInterface';

const clientesService = new ClientesService();

export const ClientesFormSubmitAlterarr = async (
  data: ClientesModel
): Promise<ClientesModel> => {
  try {
    if (data.cliente_id) {
      await clientesService.editClientes(data);
      return data;
    } else {
      const response = await clientesService.createClientes(data);

      const cliente = response.clientes.data;

      if (!cliente || !cliente.id) {
        throw new Error('Cliente não retornado corretamente pela API.');
      }

      return cliente;
    }
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
    throw error;
  }
};


  
