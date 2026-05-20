import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import DespesasTable from './DespesasTable/DespesasTable';
import DespesasFilter from './DespesasFilter/DespesasFilter';

import { SubmitHandler } from 'react-hook-form';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import { DespesasService } from 'services/DespesasService';
import { DespesasList, DespesasSearch } from 'interfaces/Despesas/DespesasInterface';

type DespesasFilterContextType = {
    firstEntry: boolean,
} & DespesasSearch & PaginateSearch

export const DespesasFilterContext = createContext<DespesasFilterContextType>({} as DespesasFilterContextType)


const Despesas = () => {
    // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const despesasContext = useContext(DespesasFilterContext)
    const despesasService = new DespesasService();
    const [despesasList, setDespesasList] = useState<PaginateInterface<DespesasList>>();


    const DespesasFilterContextValue = {
        ativo: true,
        nome: null,
        valor: null,
        qtd_parcela: null,
        data_vencimento: null,
        recorrencia: null,
        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
        id_pessoa: null,
        roles: null
    }

    const [perPage, setPerPage] = useState<number>(5);
    const [page, setPage] = useState(1)

    const getRemoteDespesasList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage

        const list = await despesasService.listDespesassPaginate({ ...data, perPage: perPage });
        despesasContext.ativo = data.ativo
        despesasContext.nome = data.nome
        despesasContext.valor = data.valor
        despesasContext.qtd_parcela = data.qtd_parcela
        despesasContext.data_vencimento = data.data_vencimento
        despesasContext.recorrencia = data.recorrencia

        despesasContext.page = data.page
        despesasContext.perPage = data.perPage
        despesasContext.firstEntry = true
        despesasContext.palavra_chave =data.palavra_chave

        despesasContext.page = data.page
        despesasContext.perPage = data.perPage

        if (list) {
            setDespesasList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteDespesasList(despesasContext)
    }, [perPage])
    return (
        <React.Fragment>
            <DespesasFilterContext.Provider value={DespesasFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <DespesasFilter getRemoteDespesasList={getRemoteDespesasList} />
                        {display ? (
                            <DespesasTable
                                filters={despesasContext}
                                getData={getRemoteDespesasList} data={despesasList}
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
            </DespesasFilterContext.Provider>
        </React.Fragment>
    );
};

export default Despesas;
