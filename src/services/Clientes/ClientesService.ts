import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
// import { ValidationError } from "yup"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { ClientesInterface, ClientesModel, ClientesSearch, ClientesView, LookupsClientes } from "interfaces/Clientes/ClientesInterface"
// import { ClientesInterface, ClientesModel, ClientesSearch, ClientesView, LookupsClientes } from "interfaces/Clientes"

export class ClientesService implements ClientesInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'clientes'
        this.httpClient = new AxiosHttpClient()
    }
    async getViewClientes(params: any): Promise<ClientesView | undefined> {
        const response = await this.httpClient.get<ClientesView>({
            url: `${this.url}/listar/${params.id}`
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }


    // async listClientesPaginate(params: ClientesSearch): Promise<PaginateInterface<ClientesSearch> | undefined> {
    //     const response = await this.httpClient.get<PaginateInterface<ClientesSearch>>({
    //         url: this.url + '/listar',
    //         body: params
    //     })
    //     switch (response.statusCode) {
    //         case HttpStatusCode.ok: return response.body
    //         case HttpStatusCode.unauthorized: throw new AccessDeniedError()
    //         default: throw new UnexpectedError()
    //     }
    // }
    async listClientesPaginate(params: ClientesSearch): Promise<PaginateInterface<ClientesSearch> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<ClientesSearch>>({
                url: this.url + '/listar',
                body: params
            });
    
            if (!response || !response.statusCode) {
                throw new UnexpectedError(); // ou retorne undefined
            }
    
            switch (response.statusCode) {
                case HttpStatusCode.ok:
                    return response.body;
                case HttpStatusCode.unauthorized:
                    throw new AccessDeniedError();
                default:
                    throw new UnexpectedError();
            }
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            throw error; // ou retorne undefined, se preferir
        }
    }
    

    async AsyncListClientes(params: ClientesSearch): Promise<ClientesModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/clientes-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }    
    
    async createClientes(params: ClientesModel) {
        const response = await this.httpClient.post({
            url: this.url + '/cadastrar', body: params
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async editClientes(params: ClientesModel) {
        const response = await this.httpClient.put({
            url: this.url + '/editar', body: params
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async deleteClientes(id: number) {
        const response = await this.httpClient.delete({
            url: this.url + '/excluir/' + id
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }
}