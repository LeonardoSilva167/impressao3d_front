import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { MovimentacoesEstoqueList, MovimentacoesEstoqueSearch } from 'interfaces/MovimentacoesEstoque/MovimentacoesEstoqueInterface'
import { MovimentacoesEstoqueService } from 'services/MovimentacoesEstoque/MovimentacoesEstoqueService'
import MovimentacoesEstoqueFilter from './MovimentacoesEstoqueFilter/MovimentacoesEstoqueFilter'
import MovimentacoesEstoqueTable from './MovimentacoesEstoqueTable/MovimentacoesEstoqueTable'

type MovimentacoesEstoqueFilterContextType = {
    firstEntry: boolean
} & MovimentacoesEstoqueSearch & PaginateSearch

export const MovimentacoesEstoqueFilterContext = createContext<MovimentacoesEstoqueFilterContextType>({} as MovimentacoesEstoqueFilterContextType)

const MovimentacoesEstoquePage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const movimentacoesContext = useContext(MovimentacoesEstoqueFilterContext)
    const [movimentacoesList, setMovimentacoesList] = useState<PaginateInterface<MovimentacoesEstoqueList>>()
    const movimentacoesEstoqueService = new MovimentacoesEstoqueService()

    const MovimentacoesEstoqueFilterContextValue: MovimentacoesEstoqueFilterContextType = {
        id: null,
        movimentacao_id: null,
        id_item: null,
        id_lote: null,
        tipo_movimentacao: null,
        data_inicio: null,
        data_fim: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemoteMovimentacoesEstoqueList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        const list = await movimentacoesEstoqueService.listMovimentacoesEstoquePaginate({ ...data, perPage })
        movimentacoesContext.palavra_chave = data.palavra_chave
        movimentacoesContext.page = data.page
        movimentacoesContext.firstEntry = true
        if (list) setMovimentacoesList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteMovimentacoesEstoqueList(movimentacoesContext)
    }, [perPage])

    return (
        <React.Fragment>
            <MovimentacoesEstoqueFilterContext.Provider value={MovimentacoesEstoqueFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <MovimentacoesEstoqueFilter getRemoteMovimentacoesEstoqueList={getRemoteMovimentacoesEstoqueList} />
                        {display ? (
                            <MovimentacoesEstoqueTable
                                filters={movimentacoesContext}
                                getData={getRemoteMovimentacoesEstoqueList}
                                data={movimentacoesList}
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
            </MovimentacoesEstoqueFilterContext.Provider>
        </React.Fragment>
    )
}

export default MovimentacoesEstoquePage
