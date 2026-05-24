import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { PlataformasCompraList, PlataformasCompraSearch } from 'interfaces/PlataformasCompra/PlataformasCompraInterface'
import { PlataformasCompraService } from 'services/PlataformasCompra/PlataformasCompraService'
import PlataformasCompraFilter from './PlataformasCompraFilter/PlataformasCompraFilter'
import PlataformasCompraTable from './PlataformasCompraTable/PlataformasCompraTable'

type PlataformasCompraFilterContextType = {
    firstEntry: boolean
} & PlataformasCompraSearch & PaginateSearch

export const PlataformasCompraFilterContext = createContext<PlataformasCompraFilterContextType>({} as PlataformasCompraFilterContextType)

const PlataformasCompraPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const plataformasCompraContext = useContext(PlataformasCompraFilterContext)
    const [plataformasCompraList, setPlataformasCompraList] = useState<PaginateInterface<PlataformasCompraList>>()
    const plataformasCompraService = new PlataformasCompraService()

    const PlataformasCompraFilterContextValue: PlataformasCompraFilterContextType = {
        id: null,
        plataforma_compra_id: null,
        descricao: null,
        url: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemotePlataformasCompraList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        const list = await plataformasCompraService.listPlataformasCompraPaginate({ ...data, perPage })
        plataformasCompraContext.palavra_chave = data.palavra_chave
        plataformasCompraContext.page = data.page
        plataformasCompraContext.firstEntry = true
        if (list) setPlataformasCompraList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemotePlataformasCompraList(plataformasCompraContext)
    }, [perPage])

    return (
        <React.Fragment>
            <PlataformasCompraFilterContext.Provider value={PlataformasCompraFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <PlataformasCompraFilter getRemotePlataformasCompraList={getRemotePlataformasCompraList} />
                        {display ? (
                            <PlataformasCompraTable
                                filters={plataformasCompraContext}
                                getData={getRemotePlataformasCompraList}
                                data={plataformasCompraList}
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
            </PlataformasCompraFilterContext.Provider>
        </React.Fragment>
    )
}

export default PlataformasCompraPage
