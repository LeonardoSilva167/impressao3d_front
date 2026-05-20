import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
// import { ValidationError } from "yup"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { DashboardsInterface, DashboardsModel, DashboardsSearch, DashboardsView, LookupsDashboards } from "interfaces/Dashboards"

export class DashboardsService implements DashboardsInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'dashboards'
        this.httpClient = new AxiosHttpClient()
    }
    

    async getLookupsDashboards(): Promise<LookupsDashboards | undefined> {
        const response = await this.httpClient.get<LookupsDashboards>({
            url: this.url + '/lookups'
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async getViewDashboards(params: any): Promise<DashboardsView | undefined> {
        const response = await this.httpClient.get<DashboardsView>({
            url: `${this.url}/listar/${params.id}`
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }


    async listDashboardsPaginate(params: DashboardsSearch): Promise<PaginateInterface<DashboardsSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<DashboardsSearch>>({
            url: this.url + '/listar',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listWidgetsDashboards(params: DashboardsSearch): Promise<PaginateInterface<DashboardsSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<DashboardsSearch>>({
            url: this.url + '/list-widgets',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listFinanceiroReceitaDashboards(params: DashboardsSearch): Promise<PaginateInterface<DashboardsSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<DashboardsSearch>>({
            url: this.url + '/list-financeiro-receita',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listRankingServicosDashboards(params: DashboardsSearch): Promise<PaginateInterface<DashboardsSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<DashboardsSearch>>({
            url: this.url + '/list-ranking-servicos',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async listRetornoClientesDashboards(params: DashboardsSearch): Promise<PaginateInterface<DashboardsSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<DashboardsSearch>>({
            url: this.url + '/list-retorno-clientes',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    // async listDashboardss(params: DashboardsSearch): Promise<PaginateInterface<DashboardsSearch> | undefined> {
    //     const response = await this.httpClient.get<PaginateInterface<DashboardsSearch>>({
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

    async AsyncListDashboards(params: DashboardsSearch): Promise<DashboardsModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/Dashboards-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }    
    
    async createDashboards(params: DashboardsModel) {
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

    async editDashboards(params: DashboardsModel) {
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

    async deleteDashboards(id: number) {
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