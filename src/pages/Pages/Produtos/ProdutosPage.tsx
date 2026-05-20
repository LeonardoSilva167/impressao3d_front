import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import ProdutosTable from './ProdutosTable/ProdutosTable';

import { SubmitHandler } from 'react-hook-form';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import ProdutosFilter from './ProdutosFilter/ProdutosFilter';
import { ProdutosList, ProdutosSearch } from 'interfaces/Produtos/ProdutosInterface';
import { ProdutosService } from 'services/ProdutosService';


type ProdutosFilterContextType = {
    firstEntry: boolean,
} & ProdutosSearch & PaginateSearch

export const ProdutosFilterContext = createContext<ProdutosFilterContextType>({} as ProdutosFilterContextType)


const Produtos = () => {
    // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const produtosContext = useContext(ProdutosFilterContext)
    const [produtosList, setProdutosList] = useState<PaginateInterface<ProdutosList>>();

    const produtosService = new ProdutosService();

    const ProdutosFilterContextValue = {
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

    const getRemoteProdutosList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        const list = await produtosService.listProdutosPaginate({ ...data, perPage: perPage });

        produtosContext.codigo_base = data.codigo_base
        produtosContext.descricao = data.descricao

        produtosContext.page = data.page
        produtosContext.firstEntry = true
        produtosContext.palavra_chave =data.palavra_chave
        if (list) {
            setProdutosList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteProdutosList(produtosContext)
    }, [perPage])
    return (
        <React.Fragment>
            <ProdutosFilterContext.Provider value={ProdutosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <ProdutosFilter getRemoteProdutosList={getRemoteProdutosList} />
                        {display ? (
                            <ProdutosTable
                                filters={produtosContext}
                                getData={getRemoteProdutosList} data={produtosList}
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
            </ProdutosFilterContext.Provider>
        </React.Fragment>
    );
};

export default Produtos;

