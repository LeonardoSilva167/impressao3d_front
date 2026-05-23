import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
import {
    TipoMaterialInterface,
    TipoMaterialModel,
    TipoMaterialSearch,
    TipoMaterialView,
    TipoMaterialList,
} from "interfaces/TipoMaterial/TipoMaterialInterface"

export class TipoMaterialService implements TipoMaterialInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'tipo-material'
        this.httpClient = new AxiosHttpClient()
    }

    async getViewTipoMaterial(params: any): Promise<TipoMaterialView | undefined> {
        const response = await this.httpClient.get<TipoMaterialView>({
            url: `${this.url}/listar/${params.id}`
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listTipoMaterialPaginate(params: TipoMaterialSearch): Promise<PaginateInterface<TipoMaterialList> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<TipoMaterialList>>({
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
            console.error(`Erro ao buscar tipo-material:`, error)
            throw error
        }
    }

    async AsyncListTipoMaterial(params: TipoMaterialSearch): Promise<TipoMaterialModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/tipo-material-list',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async createTipoMaterial(params: TipoMaterialModel) {
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

    async editTipoMaterial(params: TipoMaterialModel) {
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

    async deleteTipoMaterial(id: number) {
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
