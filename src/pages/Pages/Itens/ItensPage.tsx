import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { ItensList, ItensSearch } from 'interfaces/Itens/ItensInterface'
import { ItensService } from 'services/Itens/ItensService'
import ItensFilter from './ItensFilter/ItensFilter'
import ItensTable from './ItensTable/ItensTable'

type ItensFilterContextType = {
    firstEntry: boolean
} & ItensSearch & PaginateSearch

export const ItensFilterContext = createContext<ItensFilterContextType>({} as ItensFilterContextType)

const ItensPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const itensContext = useContext(ItensFilterContext)
    const [itensList, setItensList] = useState<PaginateInterface<ItensList>>()
    const itensService = new ItensService()

    const ItensFilterContextValue: ItensFilterContextType = {
        id: null,
        item_id: null,
        id_categoria_item: null,
        descricao: null,
        codigo: null,
        unidade_medida: null,
        controla_estoque: null,
        gera_custo: null,
        ativo: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemoteItensList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k] && data[k] !== false) delete data[k]
        })
        data.perPage = perPage
        const list = await itensService.listItensPaginate({ ...data, perPage })
        itensContext.palavra_chave = data.palavra_chave
        itensContext.page = data.page
        itensContext.firstEntry = true
        if (list) setItensList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteItensList(itensContext)
    }, [perPage])

    return (
        <React.Fragment>
            <ItensFilterContext.Provider value={ItensFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <ItensFilter getRemoteItensList={getRemoteItensList} />
                        {display ? (
                            <ItensTable
                                filters={itensContext}
                                getData={getRemoteItensList}
                                data={itensList}
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
            </ItensFilterContext.Provider>
        </React.Fragment>
    )
}

export default ItensPage
