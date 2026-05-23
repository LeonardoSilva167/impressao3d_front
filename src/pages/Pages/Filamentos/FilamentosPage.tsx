import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { FilamentosList, FilamentosSearch } from 'interfaces/Filamentos/FilamentosInterface'
import { FilamentosService } from 'services/Filamentos/FilamentosService'
import FilamentosFilter from './FilamentosFilter/FilamentosFilter'
import FilamentosTable from './FilamentosTable/FilamentosTable'

type FilamentosFilterContextType = {
    firstEntry: boolean
} & FilamentosSearch & PaginateSearch

export const FilamentosFilterContext = createContext<FilamentosFilterContextType>({} as FilamentosFilterContextType)

const FilamentosPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const filamentosContext = useContext(FilamentosFilterContext)
    const [filamentosList, setFilamentosList] = useState<PaginateInterface<FilamentosList>>()
    const filamentosService = new FilamentosService()

    const FilamentosFilterContextValue: FilamentosFilterContextType = {
        id: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemoteFilamentosList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)
        data.perPage = perPage
        const list = await filamentosService.listFilamentosPaginate({ ...data, perPage })
        filamentosContext.palavra_chave = data.palavra_chave
        filamentosContext.page = data.page
        filamentosContext.firstEntry = true
        if (list) setFilamentosList(list as any)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteFilamentosList(filamentosContext)
    }, [perPage])

    return (
        <React.Fragment>
            <FilamentosFilterContext.Provider value={FilamentosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <FilamentosFilter getRemoteFilamentosList={getRemoteFilamentosList} />
                        {display ? (
                            <FilamentosTable
                                filters={filamentosContext}
                                getData={getRemoteFilamentosList}
                                data={filamentosList}
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
            </FilamentosFilterContext.Provider>
        </React.Fragment>
    )
}

export default FilamentosPage
