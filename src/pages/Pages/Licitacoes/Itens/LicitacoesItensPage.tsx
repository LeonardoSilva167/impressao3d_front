import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import { SubmitHandler } from 'react-hook-form';
import { LicitacoesService } from 'services/Licitacoes/LicitacoesService';
import LicitacoesItensTable from './LicitacoesItensTable/LicitacoesItensTable';
import { LicitacoesItensList, LicitacoesItensSearch } from 'interfaces/Licitacoes';
import { useParams } from 'react-router-dom';
import LicitacoesItensFilter from './LicitacoesItensFilter/LicitacoesItensFilter';



type LicitacoesItensFilterContextType = {
    firstEntry: boolean,
} & LicitacoesItensSearch & PaginateSearch

export const LicitacoesItensFilterContext = createContext<LicitacoesItensFilterContextType>({} as LicitacoesItensFilterContextType)


const LicitacoesItens = () => {
    // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const { idLicitacao } = useParams();

    const [display, setDisplay] = useState<boolean>(false)
    const licitacoesItensContext = useContext(LicitacoesItensFilterContext)
    const [licitacoesItensList, setLicitacoesItensList] = useState<PaginateInterface<LicitacoesItensList>>();

    const licitacoesItensService = new LicitacoesService();

    const LicitacoesItensFilterContextValue = {
        id: null,
        licitacao_id: idLicitacao,
        cliente_id: null,
        status_licitacoes_itens_id: null,
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

    const getRemoteLicitacoesItensList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        const list = await licitacoesItensService.listLicitacoesItensPaginate({ ...data, perPage: perPage });

        licitacoesItensContext.id = data.id
        licitacoesItensContext.licitacao_id = idLicitacao
        // licitacoesItensContext.status_licitacoes_itens_id = data.status_licitacoes_itens_id
        // licitacoesItensContext.status_cotacao_id  = data.status_cotacao_id    
        // licitacoesItensContext.modalidade_id = data.modalidade_id
        // licitacoesItensContext.data_limite_proposta = data.data_limite_proposta
        // licitacoesItensContext.data_limite_proposta_inicio = data.data_limite_proposta_inicio
        // licitacoesItensContext.data_limite_proposta_final = data.data_limite_proposta_final

        
        licitacoesItensContext.page = data.page
        licitacoesItensContext.firstEntry = true
        licitacoesItensContext.palavra_chave =data.palavra_chave
        if (list) {
            setLicitacoesItensList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        licitacoesItensContext.licitacao_id = idLicitacao
        getRemoteLicitacoesItensList(licitacoesItensContext)
    }, [perPage])
    return (
        <React.Fragment>
            <LicitacoesItensFilterContext.Provider value={LicitacoesItensFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <LicitacoesItensFilter getRemoteLicitacoesItensList={getRemoteLicitacoesItensList} />
                        {display ? (
                            <LicitacoesItensTable
                                filters={licitacoesItensContext}
                                getData={getRemoteLicitacoesItensList} data={licitacoesItensList}
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
            </LicitacoesItensFilterContext.Provider>
        </React.Fragment>
    );
};

export default LicitacoesItens;

