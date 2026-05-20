import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import { SubmitHandler } from 'react-hook-form';
import { dataPaginateFake } from 'helpers/functions_helpers';
import { MovimentoCaixaList, MovimentoCaixaSearch } from 'interfaces/MovimentoCaixa';
import MovimentoCaixaFilter from './MovimentoCaixaFilter/MovimentoCaixaFilter';
import MovimentoCaixaTable from './MovimentoCaixaTable/MovimentoCaixaTable';
import { MovimentoCaixaService } from 'services/MovimentoCaixa';



type MovimentoCaixaFilterContextType = {
    firstEntry: boolean,
} & MovimentoCaixaSearch & PaginateSearch

export const MovimentoCaixaFilterContext = createContext<MovimentoCaixaFilterContextType>({} as MovimentoCaixaFilterContextType)


const MovimentoCaixa = () => {
    // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const movimentoCaixaContext = useContext(MovimentoCaixaFilterContext)
    const [movimentoCaixaList, setMovimentoCaixaList] = useState<PaginateInterface<MovimentoCaixaList>>();

    const movimentoCaixaService = new MovimentoCaixaService();

    const MovimentoCaixaFilterContextValue = {
        id: null,
        id_movimento_caixas: null,
        id_tipo_origem_pagamento: null,
        id_forma_pagamento: null,
        valor: null,

        page: 1,
        perPage: 5,
        id_origem: null,
        showMoreFields: false,
        firstEntry: false,
        roles: null
    }

    const [perPage, setPerPage] = useState<number>(5);
    const [page, setPage] = useState(1)

    const getRemoteMovimentoCaixaList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        data.id_tipo_origem_pagamento = [3,4,5];
        const list = await movimentoCaixaService.listMovimentoCaixaPaginate({ ...data, perPage: perPage });

        movimentoCaixaContext.id = data.id
        movimentoCaixaContext.id_movimento_caixas = data.id_movimento_caixas
        movimentoCaixaContext.id_tipo_origem_pagamento = data.id_tipo_origem_pagamento
        movimentoCaixaContext.id_forma_pagamento = data.id_forma_pagamento
        movimentoCaixaContext.valor = data.valor

        movimentoCaixaContext.page = data.page
        movimentoCaixaContext.firstEntry = true
        movimentoCaixaContext.palavra_chave =data.palavra_chave

        if (list) {
            setMovimentoCaixaList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteMovimentoCaixaList(movimentoCaixaContext)
    }, [perPage])
    return (
        <React.Fragment>
            <MovimentoCaixaFilterContext.Provider value={MovimentoCaixaFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <MovimentoCaixaFilter getRemoteMovimentoCaixaList={getRemoteMovimentoCaixaList} />
                        {display ? (
                            <MovimentoCaixaTable
                                filters={movimentoCaixaContext}
                                getData={getRemoteMovimentoCaixaList} data={movimentoCaixaList}
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
            </MovimentoCaixaFilterContext.Provider>
        </React.Fragment>
    );
};

export default MovimentoCaixa;

