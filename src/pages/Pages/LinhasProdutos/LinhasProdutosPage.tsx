import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { LinhasProdutosList, LinhasProdutosSearch } from 'interfaces/LinhasProdutos/LinhasProdutosInterface'
import { LinhasProdutosService } from 'services/LinhasProdutosService/LinhasProdutosService'
import LinhasProdutosFilter from './LinhasProdutosFilter/LinhasProdutosFilter'
import LinhasProdutosTable from './LinhasProdutosTable/LinhasProdutosTable'

type LinhasProdutosFilterContextType = {
    firstEntry: boolean
} & LinhasProdutosSearch & PaginateSearch

export const LinhasProdutosFilterContext = createContext<LinhasProdutosFilterContextType>({} as LinhasProdutosFilterContextType)

const LinhasProdutosPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const linhasProdutosContext = useContext(LinhasProdutosFilterContext)
    const [linhasProdutosList, setLinhasProdutosList] = useState<PaginateInterface<LinhasProdutosList>>()
    const linhasProdutosService = new LinhasProdutosService()

    const LinhasProdutosFilterContextValue: LinhasProdutosFilterContextType = {
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

    const getRemoteLinhasProdutosList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        const list = await linhasProdutosService.listLinhasProdutosPaginate({ ...data, perPage })
        linhasProdutosContext.palavra_chave = data.palavra_chave
        linhasProdutosContext.page = data.page
        linhasProdutosContext.firstEntry = true
        if (list) setLinhasProdutosList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteLinhasProdutosList(linhasProdutosContext)
    }, [perPage])

    return (
        <React.Fragment>
            <LinhasProdutosFilterContext.Provider value={LinhasProdutosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <LinhasProdutosFilter getRemoteLinhasProdutosList={getRemoteLinhasProdutosList} />
                        {display ? (
                            <LinhasProdutosTable
                                filters={linhasProdutosContext}
                                getData={getRemoteLinhasProdutosList}
                                data={linhasProdutosList}
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
            </LinhasProdutosFilterContext.Provider>
        </React.Fragment>
    )
}

export default LinhasProdutosPage
