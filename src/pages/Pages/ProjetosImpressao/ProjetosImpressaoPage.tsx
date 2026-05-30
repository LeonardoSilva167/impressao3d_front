import React, { createContext, useContext, useEffect, useState } from 'react'
import { Container, Spinner } from 'reactstrap'
import { SubmitHandler } from 'react-hook-form'
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface'
import { ProjetosImpressaoList, ProjetosImpressaoSearch } from 'interfaces/ProjetosImpressao/ProjetosImpressaoInterface'
import { ProjetosImpressaoService } from 'services/ProjetosImpressao/ProjetosImpressaoService'
import ProjetosImpressaoFilter from './ProjetosImpressaoFilter/ProjetosImpressaoFilter'
import ProjetosImpressaoTable from './ProjetosImpressaoTable/ProjetosImpressaoTable'
import { normalizarProjetosImpressaoPaginate } from './hooks/useProjetosImpressao'

type ProjetosImpressaoFilterContextType = {
    firstEntry: boolean
} & ProjetosImpressaoSearch & PaginateSearch

export const ProjetosImpressaoFilterContext = createContext<ProjetosImpressaoFilterContextType>(
    {} as ProjetosImpressaoFilterContextType
)

const ProjetosImpressaoPage = () => {
    const [display, setDisplay] = useState<boolean>(false)
    const projetosContext = useContext(ProjetosImpressaoFilterContext)
    const [projetosList, setProjetosList] = useState<PaginateInterface<ProjetosImpressaoList>>()
    const projetosImpressaoService = new ProjetosImpressaoService()

    const ProjetosImpressaoFilterContextValue: ProjetosImpressaoFilterContextType = {
        id: null,
        projeto_impressao_id: null,
        codigo_projeto: null,
        nome_original_projeto: null,
        descricao_projeto: null,
        palavra_chave: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
    }

    const [perPage, setPerPage] = useState<number>(5)
    const [page, setPage] = useState(1)

    const getRemoteProjetosImpressaoList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).forEach((k) => {
            if (!data[k]) delete data[k]
        })
        data.perPage = perPage
        const list = await projetosImpressaoService.listProjetosImpressaoPaginate({ ...data, perPage })
        projetosContext.palavra_chave = data.palavra_chave
        projetosContext.page = data.page
        projetosContext.firstEntry = true
        if (list) setProjetosList(normalizarProjetosImpressaoPaginate(list))
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getRemoteProjetosImpressaoList(projetosContext)
    }, [perPage])

    return (
        <React.Fragment>
            <ProjetosImpressaoFilterContext.Provider value={ProjetosImpressaoFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <ProjetosImpressaoFilter getRemoteProjetosImpressaoList={getRemoteProjetosImpressaoList} />
                        {display ? (
                            <ProjetosImpressaoTable
                                filters={projetosContext}
                                getData={getRemoteProjetosImpressaoList}
                                data={projetosList}
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
            </ProjetosImpressaoFilterContext.Provider>
        </React.Fragment>
    )
}

export default ProjetosImpressaoPage
