import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import ContasBancariasTable from './ContasBancariasTable/ContasBancariasTable';

import { SubmitHandler } from 'react-hook-form';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import { ContasBancariasList, ContasBancariasSearch } from 'interfaces/ContasBancarias';
import ContasBancariasFilter from './ContasBancariasFilter/ContasBancariasFilter';
import { ContasBancariasService } from 'services/ContasBancatiasService';


type ContasBancariasFilterContextType = {
    firstEntry: boolean,
} & ContasBancariasSearch & PaginateSearch

export const ContasBancariasFilterContext = createContext<ContasBancariasFilterContextType>({} as ContasBancariasFilterContextType)


const ContasBancarias = () => {
    // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const contasBancariasContext = useContext(ContasBancariasFilterContext)
    const [contasBancariasList, setContasBancariasList] = useState<PaginateInterface<ContasBancariasList>>();

    const contasBancariasService = new ContasBancariasService();

    const ContasBancariasFilterContextValue = {
        id: null,
        contas_bancaria_id: null,
        banco_id: null,
        conta_pj: null,
        apelido: null,
        saldo: null,
        ativo: true,

        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
        id_pessoa: null,
        roles: null
    }

    const [perPage, setPerPage] = useState<number>(5);
    const [page, setPage] = useState(1)

    const getRemoteContasBancariasList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        const list = await contasBancariasService.listContasBancariasPaginate({ ...data, perPage: perPage });

        contasBancariasContext.id = data.id
        contasBancariasContext.contas_bancaria_id = data.contas_bancaria_id
        contasBancariasContext.banco_id = data.banco_id
        contasBancariasContext.conta_pj = data.conta_pj
        contasBancariasContext.apelido = data.apelido
        contasBancariasContext.saldo = data.saldo
        contasBancariasContext.ativo = data.ativo

        contasBancariasContext.page = data.page
        contasBancariasContext.firstEntry = true
        contasBancariasContext.palavra_chave =data.palavra_chave
        if (list) {
            setContasBancariasList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteContasBancariasList(contasBancariasContext)
    }, [perPage])
    return (
        <React.Fragment>
            <ContasBancariasFilterContext.Provider value={ContasBancariasFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <ContasBancariasFilter getRemoteContasBancariasList={getRemoteContasBancariasList} />
                        {display ? (
                            <ContasBancariasTable
                                filters={contasBancariasContext}
                                getData={getRemoteContasBancariasList} data={contasBancariasList}
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
            </ContasBancariasFilterContext.Provider>
        </React.Fragment>
    );
};

export default ContasBancarias;

