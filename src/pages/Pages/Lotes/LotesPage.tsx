import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { LotesList, LotesSearch } from 'interfaces/Lotes/LotesInterface'
import { LotesService } from 'services/Lotes/LotesService'
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
    const lotesService = new LotesService()

    const LotesFilterContextValue: LotesFilterContextType = {
        id: null,
        lote_id: null,
        id_item: null,
        status: 'ativo',
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

        let list
        if (data.status === 'zerado') {
            list = await lotesService.listLotesZeradosPaginate({ ...data, perPage })
        } else if (data.status === 'ativo') {
            list = await lotesService.listLotesAtivosPaginate({ ...data, perPage })
        } else {
            list = await lotesService.listLotesPaginate({ ...data, perPage })
        }

        lotesContext.palavra_chave = data.palavra_chave
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
