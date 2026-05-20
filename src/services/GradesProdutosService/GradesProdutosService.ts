import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
// import { ValidationError } from "yup"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { GradesProdutosInterface, GradesProdutosModel, GradesProdutosSearch, GradesProdutosView, LookupsGradesProdutos } from "interfaces/GradesProdutos/GradesProdutosInterface"


export class GradesProdutosService implements GradesProdutosInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'grades-produtos'
        this.httpClient = new AxiosHttpClient()
    }
    

    async getLookupsGradesProdutos(): Promise<LookupsGradesProdutos | undefined> {
        const response = await this.httpClient.get<LookupsGradesProdutos>({
            url: this.url + '/lookups'
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async getViewGradesProdutos(params: any): Promise<GradesProdutosView | undefined> {
        const response = await this.httpClient.get<GradesProdutosView>({
            url: `${this.url}/listar/${params.id}`
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }


    async listGradesProdutosPaginate(params: GradesProdutosSearch): Promise<PaginateInterface<GradesProdutosSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<GradesProdutosSearch>>({
            url: this.url + '/listar',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }
    async listGradesProdutoss(params: GradesProdutosSearch): Promise<PaginateInterface<GradesProdutosSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<GradesProdutosSearch>>({
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

    async AsyncListGradesProdutos(params: GradesProdutosSearch): Promise<GradesProdutosModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/produto-Grades-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }    
    
    async createGradesProdutos(params: GradesProdutosModel) {
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

    async editGradesProdutos(params: GradesProdutosModel) {
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

    async deleteGradesProdutos(id: number) {
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