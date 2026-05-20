import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
// import { ValidationError } from "yup"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { OrgaoInterface, OrgaoModel, OrgaoSearch, OrgaoView, LookupsOrgao } from "interfaces/Orgao/OrgaoInterface"
import { OrgaoList } from "interfaces/Orgao/OrgaoInterface"
// import { OrgaoInterface, OrgaoModel, OrgaoSearch, OrgaoView, LookupsOrgao } from "interfaces/Orgao"

export class OrgaoService implements OrgaoInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'orgao'
        this.httpClient = new AxiosHttpClient()
    }
    async getViewOrgao(params: any): Promise<OrgaoView | undefined> {
        const response = await this.httpClient.get<OrgaoView>({
            url: `${this.url}/listar/${params.id}`
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }


    // async listOrgaoPaginate(params: OrgaoSearch): Promise<PaginateInterface<OrgaoSearch> | undefined> {
    //     const response = await this.httpClient.get<PaginateInterface<OrgaoSearch>>({
    //         url: this.url + '/listar',
    //         body: params
    //     })
    //     switch (response.statusCode) {
    //         case HttpStatusCode.ok: return response.body
    //         case HttpStatusCode.unauthorized: throw new AccessDeniedError()
    //         default: throw new UnexpectedError()
    //     }
    // }
    async listOrgaoPaginate(params: OrgaoSearch): Promise<PaginateInterface<OrgaoSearch> | undefined> {
        try {
            const response = await this.httpClient.get<PaginateInterface<OrgaoSearch>>({
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
            console.error("Erro ao buscar Orgao:", error);
            throw error; // ou retorne undefined, se preferir
        }
    }
    async listIdOrgao(orgaos_id: string | number): Promise<OrgaoList | undefined> {
        const response = await this.httpClient.get<OrgaoList>({
            url: `${this.url}/listar/${orgaos_id}`
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok:
                return response.body;
            case HttpStatusCode.unauthorized:
                throw new AccessDeniedError();
            default:
                throw new UnexpectedError();
        }
    }

    async AsyncListOrgao(params: OrgaoSearch): Promise<OrgaoModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/orgao-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async AsyncListUnidadeCompradora(params: OrgaoSearch): Promise<OrgaoModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/unidade-compradora-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async createOrgao(params: OrgaoModel) {
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

    async editOrgao(params: OrgaoModel) {
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

    async deleteOrgao(id: number) {
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