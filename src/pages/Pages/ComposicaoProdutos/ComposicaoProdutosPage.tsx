import React, { createContext, useContext, useEffect, useState } from 'react'
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { ComposicaoProdutosList, ComposicaoProdutosSearch } from 'interfaces/ComposicaoProdutos/ComposicaoProdutosInterface'
import { ComposicaoProdutosService } from 'services/ComposicaoProdutos/ComposicaoProdutosService'
import ComposicaoProdutosFilter from './ComposicaoProdutosFilter/ComposicaoProdutosFilter'
import ComposicaoProdutosTable from './ComposicaoProdutosTable/ComposicaoProdutosTable'

type ComposicaoProdutosFilterContextType = {
    firstEntry: boolean
} & ComposicaoProdutosSearch & PaginateSearch

export const ComposicaoProdutosFilterContext = createContext<ComposicaoProdutosFilterContextType>(
    {} as ComposicaoProdutosFilterContextType
)

const ComposicaoProdutosPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const composicaoContext = useContext(ComposicaoProdutosFilterContext)
    const [composicaoList, setComposicaoList] = useState<PaginateInterface<ComposicaoProdutosList>>()
    const composicaoService = new ComposicaoProdutosService()

    const ComposicaoProdutosFilterContextValue: ComposicaoProdutosFilterContextType = {
        id: null,
        id_produto_base: null,
        id_projeto_impressao: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemoteComposicaoList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        const list = await composicaoService.listComposicaoProdutosPaginate({ ...data, perPage })
        composicaoContext.palavra_chave = data.palavra_chave
        composicaoContext.page = data.page
        composicaoContext.firstEntry = true
        if (list) setComposicaoList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteComposicaoList(composicaoContext)
    }, [perPage])

    return (
        <React.Fragment>
            <ComposicaoProdutosFilterContext.Provider value={ComposicaoProdutosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <ComposicaoProdutosFilter getRemoteComposicaoList={getRemoteComposicaoList} />
                        {display ? (
                            <ComposicaoProdutosTable
                                filters={composicaoContext}
                                getData={getRemoteComposicaoList}
                                data={composicaoList}
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
            </ComposicaoProdutosFilterContext.Provider>
        </React.Fragment>
    )
}

export default ComposicaoProdutosPage
