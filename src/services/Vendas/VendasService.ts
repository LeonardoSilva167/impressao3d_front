import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
// import { ValidationError } from "yup"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { LookupsVendas, VendasInterface, VendasModel, VendasSearch, VendasView } from "interfaces/Vendas/VendasInterface"
// import { VendasInterface, VendasModel, VendasSearch, VendasView, LookupsVendas } from "interfaces/Vendas"

export class VendasService implements VendasInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'vendas'
        this.httpClient = new AxiosHttpClient()
    }
    

    async getLookupsVendas(): Promise<LookupsVendas | undefined> {
        const response = await this.httpClient.get<LookupsVendas>({
            url: this.url + '/lookups'
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async getViewVendas(params: any): Promise<VendasView | undefined> {
        const response = await this.httpClient.get<VendasView>({
            url: `${this.url}/listar/${params.id}`
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }


    async listVendasPaginate(params: VendasSearch): Promise<PaginateInterface<VendasSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<VendasSearch>>({
            url: this.url + '/listar',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }
    // async listVendass(params: VendasSearch): Promise<PaginateInterface<VendasSearch> | undefined> {
    //     const response = await this.httpClient.get<PaginateInterface<VendasSearch>>({
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

    async AsyncListVendas(params: VendasSearch): Promise<VendasModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/Vendas-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }    
    
    async createVendas(params: VendasModel) {
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

    async editVendas(params: VendasModel) {
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

    async deleteVendas(id: number) {
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