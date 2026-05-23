import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
import {
    LinhasMarcasInterface,
    LinhasMarcasModel,
    LinhasMarcasSearch,
    LinhasMarcasView,
} from "interfaces/LinhasMarcas/LinhasMarcasInterface"

export class LinhasMarcasService implements LinhasMarcasInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'linhas-marcas'          
        this.httpClient = new AxiosHttpClient()
    }

    async getViewLinhasMarcas(params: any): Promise<LinhasMarcasView | undefined> {
        const response = await this.httpClient.get<LinhasMarcasView>({
            url: `${this.url}/listar/${params.id}`
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listLinhasMarcasPaginate(params: LinhasMarcasSearch): Promise<PaginateInterface<LinhasMarcasSearch> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<LinhasMarcasSearch>>({
                url: this.url + '/listar',
                body: params
            })
            if (!response || !response.statusCode) throw new UnexpectedError()
            switch (response.statusCode) {
                case HttpStatusCode.ok: return response.body
                case HttpStatusCode.unauthorized: throw new AccessDeniedError()
                default: throw new UnexpectedError()
            }
        } catch (error) {
            console.error(`Erro ao buscar linhas-marcas:`, error)
            throw error
        }
    }

    async AsyncListLinhasMarcas(params: LinhasMarcasSearch): Promise<LinhasMarcasModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/linhas-marcas-list',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async createLinhasMarcas(params: LinhasMarcasModel) {
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

    async editLinhasMarcas(params: LinhasMarcasModel) {
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

    async deleteLinhasMarcas(id: number) {
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
