import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { CoresList, CoresSearch } from 'interfaces/Cores/CoresInterface'
import { CoresService } from 'services/Cores/CoresService'
import CoresFilter from './CoresFilter/CoresFilter'
import CoresTable from './CoresTable/CoresTable'

type CoresFilterContextType = {
    firstEntry: boolean
} & CoresSearch & PaginateSearch

export const CoresFilterContext = createContext<CoresFilterContextType>({} as CoresFilterContextType)

const CoresPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const coresContext = useContext(CoresFilterContext)
    const [coresList, setCoresList] = useState<PaginateInterface<CoresList>>()
    const coresService = new CoresService()

    const CoresFilterContextValue: CoresFilterContextType = {
        id: null,
        cor_id: null,
        descricao: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemoteCoresList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)
        data.perPage = perPage
        const list = await coresService.listCoresPaginate({ ...data, perPage })
        coresContext.palavra_chave = data.palavra_chave
        coresContext.page = data.page
        coresContext.firstEntry = true
        if (list) setCoresList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteCoresList(coresContext)
    }, [perPage])

    return (
        <React.Fragment>
            <CoresFilterContext.Provider value={CoresFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <CoresFilter getRemoteCoresList={getRemoteCoresList} />
                        {display ? (
                            <CoresTable
                                filters={coresContext}
                                getData={getRemoteCoresList}
                                data={coresList}
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
            </CoresFilterContext.Provider>
        </React.Fragment>
    )
}

export default CoresPage
