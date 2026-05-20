import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import LancamentosTable from './LancamentosTable/LancamentosTable';

import { SubmitHandler } from 'react-hook-form';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import { LancamentosList, LancamentosSearch } from 'interfaces/Lancamentos';
import { LancamentosService } from 'services/LancamentosServicve/LancamentosService';
import LancamentosFilter from './LancamentosFilter/LancamentosFilter';


type LancamentosFilterContextType = {
    firstEntry: boolean,
} & LancamentosSearch & PaginateSearch

export const LancamentosFilterContext = createContext<LancamentosFilterContextType>({} as LancamentosFilterContextType)


const Lancamentos = () => {
    // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const lancamentosContext = useContext(LancamentosFilterContext)
    const lancamentosService = new LancamentosService();
    const [lancamentosList, setLancamentosList] = useState<PaginateInterface<LancamentosList>>();


    const LancamentosFilterContextValue = {
        lancamento_id: null,
        tipo_lancamento: null,
        dthr_lancamento: null,
        nome_despesa: null,
        nome_receita: null,
        entrada_id: null,
        despesa_id: null,
        receita_id: null,
        contas_bancaria_origem_id: null,
        contas_bancaria_destino_id: null,
        valor: null,
        descricao: null,

        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
        id_pessoa: null,
        roles: null
    }

    const [perPage, setPerPage] = useState<number>(5);
    const [page, setPage] = useState(1)

    const getRemoteLancamentosList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        console.log(data)
        const list = await lancamentosService.listLancamentosPaginate({ ...data, perPage: perPage });

        lancamentosContext.tipo_lancamento = data.tipo_lancamento
        lancamentosContext.dthr_lancamento = data.dthr_lancamento
        lancamentosContext.nome_despesa = data.nome_despesa
        lancamentosContext.nome_receita = data.nome_receita
        lancamentosContext.entrada_id = data.entrada_id
        lancamentosContext.despesa_id = data.despesa_id
        lancamentosContext.contas_bancaria_origem_id = data.contas_bancaria_origem_id
        lancamentosContext.contas_bancaria_destino_id = data.contas_bancaria_destino_id
        lancamentosContext.valor = data.valor
        lancamentosContext.descricao = data.descricao

        lancamentosContext.page = data.page
        lancamentosContext.perPage = data.perPage
        lancamentosContext.firstEntry = true
        lancamentosContext.palavra_chave =data.palavra_chave

        lancamentosContext.page = data.page
        lancamentosContext.perPage = data.perPage

        if (list) {
            setLancamentosList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteLancamentosList(lancamentosContext)
    }, [perPage])
    return (
        <React.Fragment>
            <LancamentosFilterContext.Provider value={LancamentosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <LancamentosFilter getRemoteLancamentosList={getRemoteLancamentosList} />
                        {display ? (
                            <LancamentosTable
                                filters={lancamentosContext}
                                getData={getRemoteLancamentosList} data={lancamentosList}
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
            </LancamentosFilterContext.Provider>
        </React.Fragment>
    );
};

export default Lancamentos;

