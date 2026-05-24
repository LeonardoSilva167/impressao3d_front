import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { FilamentosList, FilamentosSearch } from 'interfaces/Filamentos/FilamentosInterface'
import { FilamentosService } from 'services/Filamentos/FilamentosService'
import FilamentosFilter from './FilamentosFilter/FilamentosFilter'
import FilamentosTable from './FilamentosTable/FilamentosTable'
import FinalizarCarretelModal from './FilamentosModals/FinalizarCarretelModal'
import RegistrarConsumoModal from './FilamentosModals/RegistrarConsumoModal'

type FilamentosFilterContextType = {
    firstEntry: boolean
} & FilamentosSearch & PaginateSearch

export const FilamentosFilterContext = createContext<FilamentosFilterContextType>({} as FilamentosFilterContextType)

const FilamentosPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const filamentosContext = useContext(FilamentosFilterContext)
    const [filamentosList, setFilamentosList] = useState<PaginateInterface<FilamentosList>>()
    const filamentosService = new FilamentosService()

    const [finalizarCarretelOpen, setFinalizarCarretelOpen] = useState(false)
    const [registrarConsumoOpen, setRegistrarConsumoOpen] = useState(false)
    const [filamentoPreSelecionado, setFilamentoPreSelecionado] = useState<number | null>(null)

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

    const handleOpenFinalizarCarretel = (idFilamento?: number | null) => {
        setFilamentoPreSelecionado(idFilamento != null ? idFilamento : null)
        setFinalizarCarretelOpen(true)
    }

    const handleRefresh = () => {
        getRemoteFilamentosList(filamentosContext)
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
                        <FilamentosFilter
                            getRemoteFilamentosList={getRemoteFilamentosList}
                            onFinalizarCarretel={() => handleOpenFinalizarCarretel(null)}
                            onRegistrarConsumo={() => setRegistrarConsumoOpen(true)}
                        />
                        {display ? (
                            <FilamentosTable
                                filters={filamentosContext}
                                getData={getRemoteFilamentosList}
                                data={filamentosList}
                                setPerPage={setPerPage}
                                perPage={perPage}
                                setPage={setPage}
                                page={page}
                                onFinalizarCarretel={handleOpenFinalizarCarretel}
                            />
                        ) : (
                            <div className="text-center">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        )}
                    </Container>
                </div>

                <FinalizarCarretelModal
                    isOpen={finalizarCarretelOpen}
                    toggle={() => setFinalizarCarretelOpen(false)}
                    idFilamentoPreSelecionado={filamentoPreSelecionado}
                    onSuccess={handleRefresh}
                />
                <RegistrarConsumoModal
                    isOpen={registrarConsumoOpen}
                    toggle={() => setRegistrarConsumoOpen(false)}
                    onSuccess={handleRefresh}
                />
            </FilamentosFilterContext.Provider>
        </React.Fragment>
    )
}

export default FilamentosPage
