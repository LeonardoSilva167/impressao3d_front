import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { ModelosProdutosList, ModelosProdutosSearch } from 'interfaces/ModelosProdutos/ModelosProdutosInterface'
import { ModelosProdutosService } from 'services/ModelosProdutos/ModelosProdutosService'
import ModelosProdutosFilter from './ModelosProdutosFilter/ModelosProdutosFilter'
import ModelosProdutosTable from './ModelosProdutosTable/ModelosProdutosTable'

type ModelosProdutosFilterContextType = {
    firstEntry: boolean
} & ModelosProdutosSearch & PaginateSearch

export const ModelosProdutosFilterContext = createContext<ModelosProdutosFilterContextType>({} as ModelosProdutosFilterContextType)

const ModelosProdutosPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const modelosProdutosContext = useContext(ModelosProdutosFilterContext)
    const [modelosProdutosList, setModelosProdutosList] = useState<PaginateInterface<ModelosProdutosList>>()
    const modelosProdutosService = new ModelosProdutosService()

    const ModelosProdutosFilterContextValue: ModelosProdutosFilterContextType = {
        id: null,
        codigo: null,
        descricao: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemoteModelosProdutosList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        const list = await modelosProdutosService.listModelosProdutosPaginate({ ...data, perPage })
        modelosProdutosContext.palavra_chave = data.palavra_chave
        modelosProdutosContext.page = data.page
        modelosProdutosContext.firstEntry = true
        if (list) setModelosProdutosList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteModelosProdutosList(modelosProdutosContext)
    }, [perPage])

    return (
        <React.Fragment>
            <ModelosProdutosFilterContext.Provider value={ModelosProdutosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <ModelosProdutosFilter getRemoteModelosProdutosList={getRemoteModelosProdutosList} />
                        {display ? (
                            <ModelosProdutosTable
                                filters={modelosProdutosContext}
                                getData={getRemoteModelosProdutosList}
                                data={modelosProdutosList}
                                setPerPage={setPerPage}
                                perPage={perPage}
                                setPage={setPage}
                                page={page}
                            />
                        ) : (
                            <div className="text-center">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        )}
                    </Container>
                </div>
            </ModelosProdutosFilterContext.Provider>
        </React.Fragment>
    )
}

export default ModelosProdutosPage
