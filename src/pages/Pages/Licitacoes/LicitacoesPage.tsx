import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import LicitacoesFilter from './LicitacoesFilter/LicitacoesFilter';
import LicitacoesTable from './LicitacoesTable/LicitacoesTable';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import { SubmitHandler } from 'react-hook-form';
import { LicitacoesList, LicitacoesSearch } from 'interfaces/Licitacoes';
import { LicitacoesService } from 'services/Licitacoes/LicitacoesService';



type LicitacoesFilterContextType = {
    firstEntry: boolean,
} & LicitacoesSearch & PaginateSearch

export const LicitacoesFilterContext = createContext<LicitacoesFilterContextType>({} as LicitacoesFilterContextType)


const Licitacoes = () => {
    // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const licitacoesContext = useContext(LicitacoesFilterContext)
    const [licitacoesList, setLicitacoesList] = useState<PaginateInterface<LicitacoesList>>();

    const licitacoesService = new LicitacoesService();

    const LicitacoesFilterContextValue = {
        id: null,
        cliente_id: null,
        status_licitacoes_id: null,
        status_compra_id: null,
        status_cotacao_id: null,
        modalidade_id: null,
        data_limite_proposta: null,
        data_limite_proposta_inicio: null,
        data_limite_proposta_final: null,
        palavra_chave: null,

        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
        id_pessoa: null,
        roles: null
    }

    const [perPage, setPerPage] = useState<number>(5);
    const [page, setPage] = useState(1)

    const getRemoteLicitacoesList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        const list = await licitacoesService.listLicitacoesPaginate({ ...data, perPage: perPage });

        licitacoesContext.id = data.id
        licitacoesContext.cliente_id = data.cliente_id
        licitacoesContext.status_licitacoes_id = data.status_licitacoes_id
        licitacoesContext.status_cotacao_id  = data.status_cotacao_id    
        licitacoesContext.modalidade_id = data.modalidade_id
        licitacoesContext.data_limite_proposta = data.data_limite_proposta
        licitacoesContext.data_limite_proposta_inicio = data.data_limite_proposta_inicio
        licitacoesContext.data_limite_proposta_final = data.data_limite_proposta_final

        
        licitacoesContext.page = data.page
        licitacoesContext.firstEntry = true
        licitacoesContext.palavra_chave =data.palavra_chave
        if (list) {
            setLicitacoesList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteLicitacoesList(licitacoesContext)
    }, [perPage])
    return (
        <React.Fragment>
            <LicitacoesFilterContext.Provider value={LicitacoesFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <LicitacoesFilter getRemoteLicitacoesList={getRemoteLicitacoesList} />
                        {display ? (
                            <LicitacoesTable
                                filters={licitacoesContext}
                                getData={getRemoteLicitacoesList} data={licitacoesList}
                                setPerPage={setPerPage} perPage={perPage}
                                setPage={setPage} page={page}
                            />
                        ) : (
                            <div className="text-center">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        )}
                    </Container>
                </div>
            </LicitacoesFilterContext.Provider>
        </React.Fragment>
    );
};

export default Licitacoes;

