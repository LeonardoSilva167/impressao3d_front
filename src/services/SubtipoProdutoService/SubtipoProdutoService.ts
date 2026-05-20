import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
// import { ValidationError } from "yup"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { LookupsSubtipoProduto, SubtipoProdutoInterface, SubtipoProdutoModel, SubtipoProdutoSearch, SubtipoProdutoView } from "interfaces/SubtipoProduto"


export class SubtipoProdutoService implements SubtipoProdutoInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'subtipo-produto'
        this.httpClient = new AxiosHttpClient()
    }
    

    async getLookupsSubtipoProduto(): Promise<LookupsSubtipoProduto | undefined> {
        const response = await this.httpClient.get<LookupsSubtipoProduto>({
            url: this.url + '/lookups'
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async getViewSubtipoProduto(params: any): Promise<SubtipoProdutoView | undefined> {
        const response = await this.httpClient.get<SubtipoProdutoView>({
            url: `${this.url}/listar/${params.id}`
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }


    async listSubtipoProdutoPaginate(params: SubtipoProdutoSearch): Promise<PaginateInterface<SubtipoProdutoSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<SubtipoProdutoSearch>>({
            url: this.url + '/listar',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }
    async listSubtipoProdutos(params: SubtipoProdutoSearch): Promise<PaginateInterface<SubtipoProdutoSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<SubtipoProdutoSearch>>({
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

    async AsyncListSubtipoProduto(params: SubtipoProdutoSearch): Promise<SubtipoProdutoModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/SubtipoProduto-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }    
    
    async createSubtipoProduto(params: SubtipoProdutoModel) {
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

    async editSubtipoProduto(params: SubtipoProdutoModel) {
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

    async deleteSubtipoProduto(id: number) {
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