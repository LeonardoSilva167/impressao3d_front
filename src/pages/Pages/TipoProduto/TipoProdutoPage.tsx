import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';

import { SubmitHandler } from 'react-hook-form';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import { TipoProdutoList, TipoProdutoSearch } from 'interfaces/TipoProduto/TipoProdutoInterface';
import { TipoProdutoService } from 'services/TipoProdutoService';
import TipoProdutoTable from './TipoProdutoTable/TipoProdutoTable';
import TipoProdutoFilter from './TipoProdutoFilter/TipoProdutoFilter';


type TipoProdutoFilterContextType = {
    firstEntry: boolean,
} & TipoProdutoSearch & PaginateSearch

export const TipoProdutoFilterContext = createContext<TipoProdutoFilterContextType>({} as TipoProdutoFilterContextType)


const TipoProduto = () => {
    // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const TipoProdutoContext = useContext(TipoProdutoFilterContext)
    const [TipoProdutoList, setTipoProdutoList] = useState<PaginateInterface<TipoProdutoList>>();

    const tipoProdutoService = new TipoProdutoService();

    const TipoProdutoFilterContextValue = {
        codigo_base: null,
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

    const getRemoteTipoProdutoList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        const list = await tipoProdutoService.listTipoProdutoPaginate({ ...data, perPage: perPage });

        TipoProdutoContext.codigo_base = data.codigo_base
        TipoProdutoContext.descricao = data.descricao

        TipoProdutoContext.page = data.page
        TipoProdutoContext.firstEntry = true
        TipoProdutoContext.palavra_chave =data.palavra_chave
        if (list) {
            setTipoProdutoList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteTipoProdutoList(TipoProdutoContext)
    }, [perPage])
    return (
        <React.Fragment>
            <TipoProdutoFilterContext.Provider value={TipoProdutoFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <TipoProdutoFilter getRemoteTipoProdutoList={getRemoteTipoProdutoList} />
                        {display ? (
                            <TipoProdutoTable
                                filters={TipoProdutoContext}
                                getData={getRemoteTipoProdutoList} data={TipoProdutoList}
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
            </TipoProdutoFilterContext.Provider>
        </React.Fragment>
    );
};

export default TipoProduto;

