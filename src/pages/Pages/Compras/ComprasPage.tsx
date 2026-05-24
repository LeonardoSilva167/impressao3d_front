import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { ComprasList, ComprasSearch } from 'interfaces/Compras/ComprasInterface'
import { ComprasService } from 'services/Compras/ComprasService'
import ComprasFilter from './ComprasFilter/ComprasFilter'
import ComprasTable from './ComprasTable/ComprasTable'

type ComprasFilterContextType = {
    firstEntry: boolean
} & ComprasSearch & PaginateSearch

export const ComprasFilterContext = createContext<ComprasFilterContextType>({} as ComprasFilterContextType)

const ComprasPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const comprasContext = useContext(ComprasFilterContext)
    const [comprasList, setComprasList] = useState<PaginateInterface<ComprasList>>()
    const comprasService = new ComprasService()

    const ComprasFilterContextValue: ComprasFilterContextType = {
        id: null,
        compra_id: null,
        id_plataforma_compra: null,
        data_compra: null,
        numero_pedido: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemoteComprasList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        const list = await comprasService.listComprasPaginate({ ...data, perPage })
        comprasContext.palavra_chave = data.palavra_chave
        comprasContext.page = data.page
        comprasContext.firstEntry = true
        if (list) setComprasList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteComprasList(comprasContext)
    }, [perPage])

    return (
        <React.Fragment>
            <ComprasFilterContext.Provider value={ComprasFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <ComprasFilter getRemoteComprasList={getRemoteComprasList} />
                        {display ? (
                            <ComprasTable
                                filters={comprasContext}
                                getData={getRemoteComprasList}
                                data={comprasList}
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
            </ComprasFilterContext.Provider>
        </React.Fragment>
    )
}

export default ComprasPage
