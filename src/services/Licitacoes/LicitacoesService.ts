import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
// import { ValidationError } from "yup"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { LicitacoesInterface, LicitacoesItensModel, LicitacoesItensSearch, LicitacoesModel, LicitacoesSearch, LicitacoesView, LookupsLicitacoes } from "interfaces/Licitacoes"

export class LicitacoesService implements LicitacoesInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'licitacoes'
        this.httpClient = new AxiosHttpClient()
    }
    

    async getLookupsLicitacoes(): Promise<LookupsLicitacoes | undefined> {
        const response = await this.httpClient.get<LookupsLicitacoes>({
            url: this.url + '/lookups'
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async getViewLicitacoes(params: any): Promise<LicitacoesView | undefined> {
        const response = await this.httpClient.get<LicitacoesView>({
            url: `${this.url}/listar/${params.id}`
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }


    async listLicitacoesPaginate(params: LicitacoesSearch): Promise<PaginateInterface<LicitacoesSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<LicitacoesSearch>>({
            url: this.url + '/listar',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async AsyncListLicitacoes(params: LicitacoesSearch): Promise<LicitacoesModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/licitacoes-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }    
    
    async createLicitacoes(params: LicitacoesModel) {
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

    async editLicitacoes(params: LicitacoesModel) {
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

    async deleteLicitacoes(id: number) {
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


    async getLookupsLicitacoesItens(): Promise<LookupsLicitacoes | undefined> {
        const response = await this.httpClient.get<LookupsLicitacoes>({
            url: this.url + '/itens/lookups'
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async getViewLicitacoesItens(params: any): Promise<LicitacoesView | undefined> {
        const response = await this.httpClient.get<LicitacoesView>({
            url: `${this.url}/itens/listar/${params.id}`
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }


    async listLicitacoesItensPaginate(params: LicitacoesItensSearch): Promise<PaginateInterface<LicitacoesItensSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<LicitacoesItensSearch>>({
            url: this.url + '/itens/listar',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async AsyncListLicitacoesItens(params: LicitacoesItensSearch): Promise<LicitacoesModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/itens/licitacoes-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }    
    
    async createLicitacoesItens(params: LicitacoesItensModel) {
        const response = await this.httpClient.post({
            url: this.url + '/itens/cadastrar', body: params
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async editLicitacoesItens(params: LicitacoesItensModel) {
        const response = await this.httpClient.put({
            url: this.url + '/itens/editar', body: params
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async deleteLicitacoesItens(id: number) {
        const response = await this.httpClient.delete({
            url: this.url + '/itens/excluir/' + id
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