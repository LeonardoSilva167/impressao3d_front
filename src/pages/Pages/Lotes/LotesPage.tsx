import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { LotesList, LotesSearch } from 'interfaces/Estoque/EstoqueInterface'
import { EstoqueService } from 'services/Estoque/EstoqueService'
import LotesFilter from './LotesFilter/LotesFilter'
import LotesTable from './LotesTable/LotesTable'

type LotesFilterContextType = {
    firstEntry: boolean
} & LotesSearch & PaginateSearch

export const LotesFilterContext = createContext<LotesFilterContextType>({} as LotesFilterContextType)

const LotesPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const lotesContext = useContext(LotesFilterContext)
    const [lotesList, setLotesList] = useState<PaginateInterface<LotesList>>()
    const estoqueService = new EstoqueService()

    const LotesFilterContextValue: LotesFilterContextType = {
        id: null,
        lote_id: null,
        id_item: null,
        id_filamento: null,
        data_compra: null,
        status: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemoteLotesList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        const list = await estoqueService.listLotesPaginate({ ...data, perPage })

        lotesContext.palavra_chave = data.palavra_chave
        lotesContext.id_item = data.id_item
        lotesContext.id_filamento = data.id_filamento
        lotesContext.data_compra = data.data_compra
        lotesContext.status = data.status
        lotesContext.page = data.page
        lotesContext.firstEntry = true
        if (list) setLotesList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteLotesList(lotesContext)
    }, [perPage])

    return (
        <React.Fragment>
            <LotesFilterContext.Provider value={LotesFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <LotesFilter getRemoteLotesList={getRemoteLotesList} />
                        {display ? (
                            <LotesTable
                                filters={lotesContext}
                                getData={getRemoteLotesList}
                                data={lotesList}
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
            </LotesFilterContext.Provider>
        </React.Fragment>
    )
}

export default LotesPage
