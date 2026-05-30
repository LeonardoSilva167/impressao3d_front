import React, { createContext, useContext, useEffect, useState } from 'react'
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { GradeProdutoGeradoList, GradeProdutosSearch } from 'interfaces/GradeProdutos/GradeProdutosInterface'
import { GradeProdutosService } from 'services/GradeProdutos/GradeProdutosService'
import GradeProdutosFilter from './GradeProdutosFilter/GradeProdutosFilter'
import GradeProdutosTable from './GradeProdutosTable/GradeProdutosTable'

type GradeProdutosFilterContextType = {
    firstEntry: boolean
} & GradeProdutosSearch & PaginateSearch

export const GradeProdutosFilterContext = createContext<GradeProdutosFilterContextType>(
    {} as GradeProdutosFilterContextType
)

const GradeProdutosPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const gradeContext = useContext(GradeProdutosFilterContext)
    const [produtosList, setProdutosList] = useState<PaginateInterface<GradeProdutoGeradoList>>()
    const gradeService = new GradeProdutosService()

    const GradeProdutosFilterContextValue: GradeProdutosFilterContextType = {
        id: null,
        id_produto_base: null,
        sku: null,
        nome_produto: null,
        codigo_base: null,
        parte: null,
        status: null,
        descricao: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)
    const [searchParams, setSearchParams] = useState<GradeProdutosSearch>({})

    const getRemoteProdutosList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        setSearchParams({ ...data })
        const list = await gradeService.listProdutosGeradosPaginate({ ...data, perPage })
        gradeContext.page = data.page
        gradeContext.firstEntry = true
        if (list) setProdutosList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteProdutosList(gradeContext)
    }, [perPage])

    return (
        <React.Fragment>
            <GradeProdutosFilterContext.Provider value={GradeProdutosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <GradeProdutosFilter getRemoteProdutosList={getRemoteProdutosList} />
                        {display ? (
                            <GradeProdutosTable
                                filters={searchParams}
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
            </GradeProdutosFilterContext.Provider>
        </React.Fragment>
    )
}

export default GradeProdutosPage
