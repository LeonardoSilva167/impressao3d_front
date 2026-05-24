import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { CarreteisFinalizadosList, CarreteisFinalizadosSearch } from 'interfaces/CarreteisFinalizados/CarreteisFinalizadosInterface'
import { CarreteisFinalizadosService } from 'services/CarreteisFinalizados/CarreteisFinalizadosService'
import CarreteisFinalizadosFilter from './CarreteisFinalizadosFilter/CarreteisFinalizadosFilter'
import CarreteisFinalizadosTable from './CarreteisFinalizadosTable/CarreteisFinalizadosTable'

type CarreteisFinalizadosFilterContextType = {
    firstEntry: boolean
} & CarreteisFinalizadosSearch & PaginateSearch

export const CarreteisFinalizadosFilterContext = createContext<CarreteisFinalizadosFilterContextType>(
    {} as CarreteisFinalizadosFilterContextType
)

const CarreteisFinalizadosPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const carreteisContext = useContext(CarreteisFinalizadosFilterContext)
    const [carreteisList, setCarreteisList] = useState<PaginateInterface<CarreteisFinalizadosList>>()
    const carreteisFinalizadosService = new CarreteisFinalizadosService()

    const CarreteisFinalizadosFilterContextValue: CarreteisFinalizadosFilterContextType = {
        id: null,
        carreteis_finalizados_id: null,
        id_item: null,
        gramatura: null,
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

    const getRemoteCarreteisFinalizadosList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        const list = await carreteisFinalizadosService.listCarreteisFinalizadosPaginate({ ...data, perPage })
        carreteisContext.palavra_chave = data.palavra_chave
        carreteisContext.page = data.page
        carreteisContext.firstEntry = true
        if (list) setCarreteisList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteCarreteisFinalizadosList(carreteisContext)
    }, [perPage])

    return (
        <React.Fragment>
            <CarreteisFinalizadosFilterContext.Provider value={CarreteisFinalizadosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <CarreteisFinalizadosFilter getRemoteCarreteisFinalizadosList={getRemoteCarreteisFinalizadosList} />
                        {display ? (
                            <CarreteisFinalizadosTable
                                filters={carreteisContext}
                                getData={getRemoteCarreteisFinalizadosList}
                                data={carreteisList}
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
            </CarreteisFinalizadosFilterContext.Provider>
        </React.Fragment>
    )
}

export default CarreteisFinalizadosPage
