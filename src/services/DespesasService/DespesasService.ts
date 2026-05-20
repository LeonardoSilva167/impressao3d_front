import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
// import { ValidationError } from "yup"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { DespesasInterface, DespesasList, DespesasModel, DespesasSearch, DespesasView, LookupsDespesas } from "interfaces/Despesas/DespesasInterface"

export class DespesasService implements DespesasInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'despesas'
        this.httpClient = new AxiosHttpClient()
    }
    

    async getLookupsDespesas(): Promise<LookupsDespesas | undefined> {
        const response = await this.httpClient.get<LookupsDespesas>({
            url: this.url + '/lookups'
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async getViewDespesas(params: any): Promise<DespesasView> {
        const response = await this.httpClient.get<DespesasView>({
            url: `${this.url}/listar/${params.id}`
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }


    async listDespesassPaginate(params: DespesasSearch): Promise<PaginateInterface<DespesasList> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<DespesasList>>({
            url: this.url + '/listar',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }
    async listDespesass(params: DespesasSearch): Promise<PaginateInterface<DespesasList> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<DespesasList>>({
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

    async AsyncListDespesas(params: DespesasSearch): Promise<DespesasModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/despesas-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }    
    
    async createDespesas(params: DespesasModel) {
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

    async editDespesas(params: DespesasModel) {
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

    async deleteDespesas(id: number) {
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