import React, { createContext, useContext, useEffect, useState } from 'react'
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { ProdutosList, ProdutosSearch } from 'interfaces/Produtos/ProdutosInterface'
import { ProdutosService } from 'services/ProdutosService/ProdutosService'
import ProdutosFilter from './ProdutosFilter/ProdutosFilter'
import ProdutosTable from './ProdutosTable/ProdutosTable'
import { normalizarProdutosPaginate } from './hooks/useProdutos'

type ProdutosFilterContextType = {
    firstEntry: boolean
} & ProdutosSearch & PaginateSearch

export const ProdutosFilterContext = createContext<ProdutosFilterContextType>(
    {} as ProdutosFilterContextType
)

const ProdutosPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const produtosContext = useContext(ProdutosFilterContext)
    const [produtosList, setProdutosList] = useState<PaginateInterface<ProdutosList>>()
    const produtosService = new ProdutosService()

    const ProdutosFilterContextValue: ProdutosFilterContextType = {
        id: null,
        descricao_produto: null,
        codigo_base: null,
        sku_base: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemoteProdutosList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        const list = await produtosService.listProdutosPaginate({ ...data, perPage })
        produtosContext.palavra_chave = data.palavra_chave
        produtosContext.page = data.page
        produtosContext.firstEntry = true
        if (list) setProdutosList(normalizarProdutosPaginate(list))
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteProdutosList(produtosContext)
    }, [perPage])

    return (
        <React.Fragment>
            <ProdutosFilterContext.Provider value={ProdutosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <ProdutosFilter getRemoteProdutosList={getRemoteProdutosList} />
                        {display ? (
                            <ProdutosTable
                                filters={produtosContext}
                                getData={getRemoteProdutosList}
                                data={produtosList}
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
            </ProdutosFilterContext.Provider>
        </React.Fragment>
    )
}

export default ProdutosPage
