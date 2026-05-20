import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
// import { ValidationError } from "yup"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { LookupsTipoOrigemPagamentos, TipoOrigemPagamentosInterface, TipoOrigemPagamentosModel, TipoOrigemPagamentosSearch, TipoOrigemPagamentosView } from "interfaces/TipoOrigemPagamentos/TipoOrigemPagamentosInterface"
// import { TipoOrigemPagamentosInterface, TipoOrigemPagamentosModel, TipoOrigemPagamentosSearch, TipoOrigemPagamentosView, LookupsTipoOrigemPagamentos } from "interfaces/TipoOrigemPagamentos"

export class TipoOrigemPagamentosService implements TipoOrigemPagamentosInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'tipo-origem-pagamento-caixas'
        this.httpClient = new AxiosHttpClient()
    }


    async getLookupsTipoOrigemPagamentos(): Promise<LookupsTipoOrigemPagamentos | undefined> {
        const response = await this.httpClient.get<LookupsTipoOrigemPagamentos>({
            url: this.url + '/lookups'
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async getViewTipoOrigemPagamentos(params: any): Promise<TipoOrigemPagamentosView | undefined> {
        const response = await this.httpClient.get<TipoOrigemPagamentosView>({
            url: `${this.url}/listar/${params.id}`
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }


    async listTipoOrigemPagamentosPaginate(params: TipoOrigemPagamentosSearch): Promise<PaginateInterface<TipoOrigemPagamentosSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<TipoOrigemPagamentosSearch>>({
            url: this.url + '/listar',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }
    // async listTipoOrigemPagamentoss(params: TipoOrigemPagamentosSearch): Promise<PaginateInterface<TipoOrigemPagamentosSearch> | undefined> {
    //     const response = await this.httpClient.get<PaginateInterface<TipoOrigemPagamentosSearch>>({
    //         // url: this.url + '/listar',
    //         url: this.url + '',
    //         body: params
    //     })

    //     switch (response.statusCode) {
    //         case HttpStatusCode.ok: return response.body
    //         case HttpStatusCode.unauthorized: throw new AccessDeniedError()
    //         default: throw new UnexpectedError()
    //     }
    // }

    async AsyncListTipoOrigemPagamentos(params: TipoOrigemPagamentosSearch): Promise<TipoOrigemPagamentosModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/tipo-origem-pagamento-caixas-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }    
   
    
    async createTipoOrigemPagamentos(params: TipoOrigemPagamentosModel) {
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

    async editTipoOrigemPagamentos(params: TipoOrigemPagamentosModel) {
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

    async deleteTipoOrigemPagamentos(id: number) {
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