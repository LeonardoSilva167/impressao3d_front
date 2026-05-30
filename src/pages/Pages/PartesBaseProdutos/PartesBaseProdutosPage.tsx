import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { PartesBaseProdutosList, PartesBaseProdutosSearch } from 'interfaces/PartesBaseProdutos/PartesBaseProdutosInterface'
import { PartesBaseProdutosService } from 'services/PartesBaseProdutos/PartesBaseProdutosService'
import PartesBaseProdutosFilter from './PartesBaseProdutosFilter/PartesBaseProdutosFilter'
import PartesBaseProdutosTable from './PartesBaseProdutosTable/PartesBaseProdutosTable'

type PartesBaseProdutosFilterContextType = {
    firstEntry: boolean
} & PartesBaseProdutosSearch & PaginateSearch

export const PartesBaseProdutosFilterContext = createContext<PartesBaseProdutosFilterContextType>({} as PartesBaseProdutosFilterContextType)

const PartesBaseProdutosPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const partesBaseProdutosContext = useContext(PartesBaseProdutosFilterContext)
    const [partesBaseProdutosList, setPartesBaseProdutosList] = useState<PaginateInterface<PartesBaseProdutosList>>()
    const partesBaseProdutosService = new PartesBaseProdutosService()

    const PartesBaseProdutosFilterContextValue: PartesBaseProdutosFilterContextType = {
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

    const getRemotePartesBaseProdutosList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        const list = await partesBaseProdutosService.listPartesBaseProdutosPaginate({ ...data, perPage })
        partesBaseProdutosContext.palavra_chave = data.palavra_chave
        partesBaseProdutosContext.page = data.page
        partesBaseProdutosContext.firstEntry = true
        if (list) setPartesBaseProdutosList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemotePartesBaseProdutosList(partesBaseProdutosContext)
    }, [perPage])

    return (
        <React.Fragment>
            <PartesBaseProdutosFilterContext.Provider value={PartesBaseProdutosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <PartesBaseProdutosFilter getRemotePartesBaseProdutosList={getRemotePartesBaseProdutosList} />
                        {display ? (
                            <PartesBaseProdutosTable
                                filters={partesBaseProdutosContext}
                                getData={getRemotePartesBaseProdutosList}
                                data={partesBaseProdutosList}
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
            </PartesBaseProdutosFilterContext.Provider>
        </React.Fragment>
    )
}

export default PartesBaseProdutosPage
