import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
// import { ValidationError } from "yup"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { LookupsTipoProduto, TipoProdutoInterface, TipoProdutoModel, TipoProdutoSearch, TipoProdutoView } from "interfaces/TipoProduto"


export class TipoProdutoService implements TipoProdutoInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'tipo-produto'
        this.httpClient = new AxiosHttpClient()
    }
    

    async getLookupsTipoProduto(): Promise<LookupsTipoProduto | undefined> {
        const response = await this.httpClient.get<LookupsTipoProduto>({
            url: this.url + '/lookups'
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async getViewTipoProduto(params: any): Promise<TipoProdutoView | undefined> {
        const response = await this.httpClient.get<TipoProdutoView>({
            url: `${this.url}/listar/${params.id}`
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }


    async listTipoProdutoPaginate(params: TipoProdutoSearch): Promise<PaginateInterface<TipoProdutoSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<TipoProdutoSearch>>({
            url: this.url + '/listar',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }
    async listTipoProdutos(params: TipoProdutoSearch): Promise<PaginateInterface<TipoProdutoSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<TipoProdutoSearch>>({
            // url: this.url + '/listar',
            url: this.url + '',
            body: params
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async AsyncListTipoProduto(params: TipoProdutoSearch): Promise<TipoProdutoModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/TipoProduto-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }    
    
    async createTipoProduto(params: TipoProdutoModel) {
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

    async editTipoProduto(params: TipoProdutoModel) {
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

    async deleteTipoProduto(id: number) {
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