import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { MarcasList, MarcasSearch } from 'interfaces/Marcas/MarcasInterface'
import { MarcasService } from 'services/MarcasService/MarcasService'
import MarcasFilter from './MarcasFilter/MarcasFilter'
import MarcasTable from './MarcasTable/MarcasTable'

type MarcasFilterContextType = {
    firstEntry: boolean
} & MarcasSearch & PaginateSearch

export const MarcasFilterContext = createContext<MarcasFilterContextType>({} as MarcasFilterContextType)

const MarcasPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const marcasContext = useContext(MarcasFilterContext)
    const [marcasList, setMarcasList] = useState<PaginateInterface<MarcasList>>()
    const marcasService = new MarcasService()

    const MarcasFilterContextValue: MarcasFilterContextType = {
        id: null,
        descricao: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemoteMarcasList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)
        data.perPage = perPage
        const list = await marcasService.listMarcasPaginate({ ...data, perPage })
        marcasContext.palavra_chave = data.palavra_chave
        marcasContext.page = data.page
        marcasContext.firstEntry = true
        if (list) setMarcasList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteMarcasList(marcasContext)
    }, [perPage])

    return (
        <React.Fragment>
            <MarcasFilterContext.Provider value={MarcasFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <MarcasFilter getRemoteMarcasList={getRemoteMarcasList} />
                        {display ? (
                            <MarcasTable
                                filters={marcasContext}
                                getData={getRemoteMarcasList}
                                data={marcasList}
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
            </MarcasFilterContext.Provider>
        </React.Fragment>
    )
}

export default MarcasPage
