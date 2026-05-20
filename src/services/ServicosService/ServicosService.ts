import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
// import { ValidationError } from "yup"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { ServicosInterface, ServicosModel, ServicosSearch, ServicosView } from "interfaces/Servicos"

export class ServicosService implements ServicosInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'servicos'
        this.httpClient = new AxiosHttpClient()
    }
    async getViewServicos(params: any): Promise<ServicosView | undefined> {
        const response = await this.httpClient.get<ServicosView>({
            url: `${this.url}/listar/${params.id}`
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }


    async listServicos(params: ServicosSearch): Promise<PaginateInterface<ServicosSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<ServicosSearch>>({
            url: this.url + '/list',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }
    async listServicosPaginate(params: ServicosSearch): Promise<PaginateInterface<ServicosSearch> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<ServicosSearch>>({
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
            console.error("Erro ao buscar Servicos:", error);
            throw error; // ou retorne undefined, se preferir
        }
    }
    

    async AsyncListServicos(params: ServicosSearch): Promise<ServicosModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/servicos-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }    
    
    async createServicos(params: ServicosModel) {
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

    async editServicos(params: ServicosModel) {
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

    async deleteServicos(id: number) {
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