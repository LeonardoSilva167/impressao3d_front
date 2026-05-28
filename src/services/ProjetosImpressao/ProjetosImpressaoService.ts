import { AxiosHttpClient, HttpStatusCode } from '../../libs/api/ApiConfig'
import { AccessDeniedError } from '../../libs/api/exceptions/AccessDeniedError'
import { UnexpectedError } from '../../libs/api/exceptions/UnexpectedError'
import { ValidationError } from '../../libs/api/exceptions/ValidationError'
import { PaginateInterface } from 'interfaces/SystemInterfaces/PaginateInterface'
import {
    ProjetosImpressaoInterface,
    ProjetosImpressaoList,
    ProjetosImpressaoModel,
    ProjetosImpressaoSearch,
    ProjetosImpressaoView,
} from 'interfaces/ProjetosImpressao/ProjetosImpressaoInterface'

export class ProjetosImpressaoService implements ProjetosImpressaoInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'projetos-impressao'
        this.httpClient = new AxiosHttpClient()
    }

    async getViewProjetosImpressao(params: { id: number }): Promise<ProjetosImpressaoView | undefined> {
        const response = await this.httpClient.get<ProjetosImpressaoView>({
            url: `${this.url}/listar/${params.id}`,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listProjetosImpressaoPaginate(params: ProjetosImpressaoSearch): Promise<PaginateInterface<ProjetosImpressaoList> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<ProjetosImpressaoList>>({
                url: this.url + '/listar',
                body: params,
            })
            if (!response || !response.statusCode) throw new UnexpectedError()
            switch (response.statusCode) {
                case HttpStatusCode.ok: return response.body
                case HttpStatusCode.unauthorized: throw new AccessDeniedError()
                default: throw new UnexpectedError()
            }
        } catch (error) {
            console.error('Erro ao buscar projetos de impressão:', error)
            throw error
        }
    }

    async AsyncListProjetosImpressao(params: ProjetosImpressaoSearch): Promise<ProjetosImpressaoModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/projetos-impressao-list',
            body: params,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async createProjetosImpressao(params: ProjetosImpressaoModel) {
        const response = await this.httpClient.post({
            url: this.url + '/cadastrar',
            body: params,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async editProjetosImpressao(params: ProjetosImpressaoModel) {
        const response = await this.httpClient.put({
            url: this.url + '/editar',
            body: params,
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async deleteProjetosImpressao(id: number) {
        const response = await this.httpClient.delete({
            url: this.url + '/excluir/' + id,
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
