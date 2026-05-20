import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import ContasPagarTable from './ContasPagarTable/ContasPagarTable';
import ContasPagarFilter from './ContasPagarFilter/ContasPagarFilter';

import { SubmitHandler } from 'react-hook-form';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import { ContasPagarService } from 'services/ContasPagarService';
import { ContasPagarList, ContasPagarSearch } from 'interfaces/ContasContasPagar/ContasPagarInterface';

type ContasPagarFilterContextType = {
    firstEntry: boolean,
} & ContasPagarSearch & PaginateSearch

export const ContasPagarFilterContext = createContext<ContasPagarFilterContextType>({} as ContasPagarFilterContextType)


const ContasPagar = () => {
    // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const contasPagarContext = useContext(ContasPagarFilterContext)
    const contasPagarService = new ContasPagarService();
    const [contasPagarList, setContasPagarList] = useState<PaginateInterface<ContasPagarList>>();


    const ContasPagarFilterContextValue = {
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

    const getRemoteContasPagarList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage

        const list = await contasPagarService.listContasPagarsPaginate({ ...data, perPage: perPage });
        contasPagarContext.ativo = data.ativo
        contasPagarContext.nome = data.nome
        contasPagarContext.valor = data.valor
        contasPagarContext.qtd_parcela = data.qtd_parcela
        contasPagarContext.data_vencimento = data.data_vencimento
        contasPagarContext.recorrencia = data.recorrencia

        contasPagarContext.page = data.page
        contasPagarContext.perPage = data.perPage
        contasPagarContext.firstEntry = true
        contasPagarContext.palavra_chave =data.palavra_chave

        contasPagarContext.page = data.page
        contasPagarContext.perPage = data.perPage

        if (list) {
            setContasPagarList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteContasPagarList(contasPagarContext)
    }, [perPage])
    return (
        <React.Fragment>
            <ContasPagarFilterContext.Provider value={ContasPagarFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <ContasPagarFilter getRemoteContasPagarList={getRemoteContasPagarList} />
                        {display ? (
                            <ContasPagarTable
                                filters={contasPagarContext}
                                getData={getRemoteContasPagarList} data={contasPagarList}
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
            </ContasPagarFilterContext.Provider>
        </React.Fragment>
    );
};

export default ContasPagar;

