import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';

import { SubmitHandler } from 'react-hook-form';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import { SubtipoProdutoList, SubtipoProdutoSearch } from 'interfaces/SubtipoProduto/SubtipoProdutoInterface';
import SubtipoProdutoFilter from './SubtipoProdutoFilter/SubtipoProdutoFilter';
import SubtipoProdutoTable from './SubtipoProdutoTable/SubtipoProdutoTable';
import { SubtipoProdutoService } from 'services/SubtipoProdutoService';


type SubtipoProdutoFilterContextType = {
    firstEntry: boolean,
} & SubtipoProdutoSearch & PaginateSearch

export const SubtipoProdutoFilterContext = createContext<SubtipoProdutoFilterContextType>({} as SubtipoProdutoFilterContextType)


const SubtipoProduto = () => {
    // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const subtipoProdutoContext = useContext(SubtipoProdutoFilterContext)
    const [subtipoProdutoList, setSubtipoProdutoList] = useState<PaginateInterface<SubtipoProdutoList>>();

    const subtipoProdutoService = new SubtipoProdutoService();

    const SubtipoProdutoFilterContextValue = {
        tipo_produtos_id: null,
        nome: null,
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

    const getRemoteSubtipoProdutoList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        const list = await subtipoProdutoService.listSubtipoProdutoPaginate({ ...data, perPage: perPage });

        subtipoProdutoContext.tipo_produtos_id = data.tipo_produtos_id
        subtipoProdutoContext.nome = data.nome
        subtipoProdutoContext.ativo = data.ativo

        subtipoProdutoContext.page = data.page
        subtipoProdutoContext.firstEntry = true
        subtipoProdutoContext.palavra_chave =data.palavra_chave
        if (list) {
            setSubtipoProdutoList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteSubtipoProdutoList(subtipoProdutoContext)
    }, [perPage])
    return (
        <React.Fragment>
            <SubtipoProdutoFilterContext.Provider value={SubtipoProdutoFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <SubtipoProdutoFilter getRemoteSubtipoProdutoList={getRemoteSubtipoProdutoList} />
                        {display ? (
                            <SubtipoProdutoTable
                                filters={subtipoProdutoContext}
                                getData={getRemoteSubtipoProdutoList} data={subtipoProdutoList}
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
            </SubtipoProdutoFilterContext.Provider>
        </React.Fragment>
    );
};

export default SubtipoProduto;

