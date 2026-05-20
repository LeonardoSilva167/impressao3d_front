import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import LinhasProdutosTable from './LinhasProdutosTable/LinhasProdutosTable';

import { SubmitHandler } from 'react-hook-form';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import LinhasProdutosFilter from './LinhasProdutosFilter/LinhasProdutosFilter';
import { LinhasProdutosList, LinhasProdutosSearch } from 'interfaces/LinhasProdutos/LinhasProdutosInterface';
import { LinhasProdutosService } from 'services/LinhasProdutosService';


type LinhasProdutosFilterContextType = {
    firstEntry: boolean,
} & LinhasProdutosSearch & PaginateSearch

export const LinhasProdutosFilterContext = createContext<LinhasProdutosFilterContextType>({} as LinhasProdutosFilterContextType)


const LinhasProdutos = () => {
    // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const linhasProdutosContext = useContext(LinhasProdutosFilterContext)
    const [linhasProdutosList, setLinhasProdutosList] = useState<PaginateInterface<LinhasProdutosList>>();

    const linhasProdutosService = new LinhasProdutosService();

    const LinhasProdutosFilterContextValue = {
        id: null,
        linha_id: null,
        marca_id: null,
        uso_periodo_id: null,
        nome: null,
        descricao: null,
        tipo_id: null,
        hora_protecao: null,


        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
        id_pessoa: null,
        roles: null
    }

    const [perPage, setPerPage] = useState<number>(5);
    const [page, setPage] = useState(1)

    const getRemoteLinhasProdutosList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        const list = await linhasProdutosService.listLinhasProdutosPaginate({ ...data, perPage: perPage });

        linhasProdutosContext.id = data.id
        linhasProdutosContext.linha_id = data.linha_id
        linhasProdutosContext.marca_id = data.marca_id
        linhasProdutosContext.uso_periodo_id = data.uso_periodo_id
        linhasProdutosContext.nome = data.nome
        linhasProdutosContext.descricao = data.descricao
        linhasProdutosContext.tipo_id = data.tipo_id
        linhasProdutosContext.hora_protecao = data.hora_protecao

        linhasProdutosContext.page = data.page
        linhasProdutosContext.firstEntry = true
        linhasProdutosContext.palavra_chave =data.palavra_chave
        if (list) {
            setLinhasProdutosList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteLinhasProdutosList(linhasProdutosContext)
    }, [perPage])
    return (
        <React.Fragment>
            <LinhasProdutosFilterContext.Provider value={LinhasProdutosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <LinhasProdutosFilter getRemoteLinhasProdutosList={getRemoteLinhasProdutosList} />
                        {display ? (
                            <LinhasProdutosTable
                                filters={linhasProdutosContext}
                                getData={getRemoteLinhasProdutosList} data={linhasProdutosList}
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
            </LinhasProdutosFilterContext.Provider>
        </React.Fragment>
    );
};

export default LinhasProdutos;

