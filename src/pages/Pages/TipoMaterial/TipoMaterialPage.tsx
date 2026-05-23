import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { TipoMaterialList, TipoMaterialSearch } from 'interfaces/TipoMaterial/TipoMaterialInterface'
import { TipoMaterialService } from 'services/TipoMaterial/TipoMaterialService'
import TipoMaterialFilter from './TipoMaterialFilter/TipoMaterialFilter'
import TipoMaterialTable from './TipoMaterialTable/TipoMaterialTable'

type TipoMaterialFilterContextType = {
    firstEntry: boolean
} & TipoMaterialSearch & PaginateSearch

export const TipoMaterialFilterContext = createContext<TipoMaterialFilterContextType>({} as TipoMaterialFilterContextType)

const TipoMaterialPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const tipoMaterialContext = useContext(TipoMaterialFilterContext)
    const [tipoMaterialList, setTipoMaterialList] = useState<PaginateInterface<TipoMaterialList>>()
    const tipoMaterialService = new TipoMaterialService()

    const TipoMaterialFilterContextValue: TipoMaterialFilterContextType = {
        id: null,
        tipo_material_id: null,
        descricao: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemoteTipoMaterialList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        const list = await tipoMaterialService.listTipoMaterialPaginate({ ...data, perPage })
        tipoMaterialContext.palavra_chave = data.palavra_chave
        tipoMaterialContext.page = data.page
        tipoMaterialContext.firstEntry = true
        if (list) setTipoMaterialList(list)
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteTipoMaterialList(tipoMaterialContext)
    }, [perPage])

    return (
        <React.Fragment>
            <TipoMaterialFilterContext.Provider value={TipoMaterialFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <TipoMaterialFilter getRemoteTipoMaterialList={getRemoteTipoMaterialList} />
                        {display ? (
                            <TipoMaterialTable
                                filters={tipoMaterialContext}
                                getData={getRemoteTipoMaterialList}
                                data={tipoMaterialList}
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
            </TipoMaterialFilterContext.Provider>
        </React.Fragment>
    )
}

export default TipoMaterialPage
