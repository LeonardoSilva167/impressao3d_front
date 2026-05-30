import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { CategoriasProdutosList, CategoriasProdutosSearch } from 'interfaces/CategoriasProdutos/CategoriasProdutosInterface'
import { CategoriasProdutosService } from 'services/CategoriasProdutos/CategoriasProdutosService'
import CategoriasProdutosFilter from './CategoriasProdutosFilter/CategoriasProdutosFilter'
import CategoriasProdutosTable from './CategoriasProdutosTable/CategoriasProdutosTable'

type CategoriasProdutosFilterContextType = {
    firstEntry: boolean
} & CategoriasProdutosSearch & PaginateSearch

export const CategoriasProdutosFilterContext = createContext<CategoriasProdutosFilterContextType>({} as CategoriasProdutosFilterContextType)

const CategoriasProdutosPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const categoriasProdutosContext = useContext(CategoriasProdutosFilterContext)
    const [categoriasProdutosList, setCategoriasProdutosList] = useState<PaginateInterface<CategoriasProdutosList>>()
    const categoriasProdutosService = new CategoriasProdutosService()

    const CategoriasProdutosFilterContextValue: CategoriasProdutosFilterContextType = {
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

    const getRemoteCategoriasProdutosList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        const list = await categoriasProdutosService.listCategoriasProdutosPaginate({ ...data, perPage })
        categoriasProdutosContext.palavra_chave = data.palavra_chave
        categoriasProdutosContext.page = data.page
        categoriasProdutosContext.firstEntry = true
        if (list) setCategoriasProdutosList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteCategoriasProdutosList(categoriasProdutosContext)
    }, [perPage])

    return (
        <React.Fragment>
            <CategoriasProdutosFilterContext.Provider value={CategoriasProdutosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <CategoriasProdutosFilter getRemoteCategoriasProdutosList={getRemoteCategoriasProdutosList} />
                        {display ? (
                            <CategoriasProdutosTable
                                filters={categoriasProdutosContext}
                                getData={getRemoteCategoriasProdutosList}
                                data={categoriasProdutosList}
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
            </CategoriasProdutosFilterContext.Provider>
        </React.Fragment>
    )
}

export default CategoriasProdutosPage
