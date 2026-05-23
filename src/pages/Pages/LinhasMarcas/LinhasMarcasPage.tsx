import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { LinhasMarcasList, LinhasMarcasSearch } from 'interfaces/LinhasMarcas/LinhasMarcasInterface'
import { LinhasMarcasService } from 'services/LinhasMarcas/LinhasMarcasService'
import LinhasMarcasFilter from './LinhasMarcasFilter/LinhasMarcasFilter'
import LinhasMarcasTable from './LinhasMarcasTable/LinhasMarcasTable'

type LinhasMarcasFilterContextType = {
    firstEntry: boolean
} & LinhasMarcasSearch & PaginateSearch

export const LinhasMarcasFilterContext = createContext<LinhasMarcasFilterContextType>({} as LinhasMarcasFilterContextType)

const LinhasMarcasPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const linhasMarcasContext = useContext(LinhasMarcasFilterContext)
    const [linhasMarcasList, setLinhasMarcasList] = useState<PaginateInterface<LinhasMarcasList>>()
    const linhasMarcasService = new LinhasMarcasService()

    const LinhasMarcasFilterContextValue: LinhasMarcasFilterContextType = {
        id: null,
        linha_marca_id: null,
        descricao: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemoteLinhasMarcasList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)
        data.perPage = perPage
        const list = await linhasMarcasService.listLinhasMarcasPaginate({ ...data, perPage })
        linhasMarcasContext.palavra_chave = data.palavra_chave
        linhasMarcasContext.page = data.page
        linhasMarcasContext.firstEntry = true
        if (list) setLinhasMarcasList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteLinhasMarcasList(linhasMarcasContext)
    }, [perPage])

    return (
        <React.Fragment>
            <LinhasMarcasFilterContext.Provider value={LinhasMarcasFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <LinhasMarcasFilter getRemoteLinhasMarcasList={getRemoteLinhasMarcasList} />
                        {display ? (
                            <LinhasMarcasTable
                                filters={linhasMarcasContext}
                                getData={getRemoteLinhasMarcasList}
                                data={linhasMarcasList}
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
            </LinhasMarcasFilterContext.Provider>
        </React.Fragment>
    )
}

export default LinhasMarcasPage
