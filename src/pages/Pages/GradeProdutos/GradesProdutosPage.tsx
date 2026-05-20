import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import GradesProdutosTable from './GradesProdutosTable/GradesProdutosTable';

import { SubmitHandler } from 'react-hook-form';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import GradesProdutosFilter from './GradesProdutosFilter/GradesProdutosFilter';
import { GradesProdutosList, GradesProdutosSearch } from 'interfaces/GradesProdutos/GradesProdutosInterface';
import { GradesProdutosService } from 'services/GradesProdutosService/GradesProdutosService';


type GradesProdutosFilterContextType = {
    firstEntry: boolean,
} & GradesProdutosSearch & PaginateSearch

export const GradesProdutosFilterContext = createContext<GradesProdutosFilterContextType>({} as GradesProdutosFilterContextType)


const GradesProdutos = () => {
    // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const gradesProdutosContext = useContext(GradesProdutosFilterContext)
    const [gradesProdutosList, setGradesProdutosList] = useState<PaginateInterface<GradesProdutosList>>();

    const gradesProdutosService = new GradesProdutosService();

    const GradesProdutosFilterContextValue = {
        produto_codigo_base: null,
        codigo: null,
        descricao: null,
        tamanho: null,
        unidade_id: null,
        unidade_qtd: null,
        preco_venda: null,
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

    const getRemoteGradesProdutosList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        const list = await gradesProdutosService.listGradesProdutosPaginate({ ...data, perPage: perPage });

        gradesProdutosContext.produto_codigo_base = data.produto_codigo_base
        gradesProdutosContext.codigo = data.codigo
        gradesProdutosContext.descricao = data.descricao
        gradesProdutosContext.tamanho = data.tamanho
        gradesProdutosContext.unidade_id = data.unidade_id
        gradesProdutosContext.unidade_qtd = data.unidade_qtd
        gradesProdutosContext.preco_venda = data.preco_venda
        gradesProdutosContext.ativo = data.ativo

        gradesProdutosContext.page = data.page
        gradesProdutosContext.firstEntry = true
        gradesProdutosContext.palavra_chave =data.palavra_chave
        if (list) {
            setGradesProdutosList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteGradesProdutosList(gradesProdutosContext)
    }, [perPage])
    return (
        <React.Fragment>
            <GradesProdutosFilterContext.Provider value={GradesProdutosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <GradesProdutosFilter getRemoteGradesProdutosList={getRemoteGradesProdutosList} />
                        {display ? (
                            <GradesProdutosTable
                                filters={gradesProdutosContext}
                                getData={getRemoteGradesProdutosList} data={gradesProdutosList}
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
            </GradesProdutosFilterContext.Provider>
        </React.Fragment>
    );
};

export default GradesProdutos;

