import React, { createContext, useContext, useEffect, useState } from 'react'
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { GradeProdutosList, GradeProdutosSearch } from 'interfaces/GradeProdutos/GradeProdutosInterface'
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
    const [gradeList, setGradeList] = useState<PaginateInterface<GradeProdutosList>>()
    const gradeService = new GradeProdutosService()

    const GradeProdutosFilterContextValue: GradeProdutosFilterContextType = {
        id: null,
        id_produto_base: null,
        descricao: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemoteGradeList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        const list = await gradeService.listGradeProdutosPaginate({ ...data, perPage })
        gradeContext.palavra_chave = data.palavra_chave
        gradeContext.page = data.page
        gradeContext.firstEntry = true
        if (list) setGradeList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteGradeList(gradeContext)
    }, [perPage])

    return (
        <React.Fragment>
            <GradeProdutosFilterContext.Provider value={GradeProdutosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <GradeProdutosFilter getRemoteGradeList={getRemoteGradeList} />
                        {display ? (
                            <GradeProdutosTable
                                filters={gradeContext}
                                getData={getRemoteGradeList}
                                data={gradeList}
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
