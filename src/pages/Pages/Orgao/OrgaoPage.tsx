import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import OrgaoFilter from './OrgaoFilter/OrgaoFilter';
import OrgaoTable from './OrgaoTable/OrgaoTable';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import { SubmitHandler } from 'react-hook-form';
import { OrgaoList, OrgaoSearch } from 'interfaces/Orgao/OrgaoInterface';
import { OrgaoService } from 'services/OrgaoService/OrgaoService';



type OrgaoFilterContextType = {
    firstEntry: boolean,
} & OrgaoSearch & PaginateSearch

export const OrgaoFilterContext = createContext<OrgaoFilterContextType>({} as OrgaoFilterContextType)


const Orgao = () => {
    // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const OrgaoContext = useContext(OrgaoFilterContext)
    const [orgaoList, setOrgaoList] = useState<PaginateInterface<OrgaoList>>();

    const orgaoService = new OrgaoService();

    const OrgaoFilterContextValue = {
        id: null,
        cliente_id: null,
        codigo: null,
        nome: null,

        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
        id_pessoa: null,
        roles: null
    }

    const [perPage, setPerPage] = useState<number>(5);
    const [page, setPage] = useState(1)

    const getRemoteOrgaoList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        const list = await orgaoService.listOrgaoPaginate({ ...data, perPage: perPage });

        OrgaoContext.id = data.id
        OrgaoContext.cliente_id = data.cliente_id
        OrgaoContext.codigo = data.codigo
        OrgaoContext.nome = data.nome

        OrgaoContext.page = data.page
        OrgaoContext.firstEntry = true
        OrgaoContext.palavra_chave =data.palavra_chave
        if (list) {
            setOrgaoList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteOrgaoList(OrgaoContext)
    }, [perPage])
    return (
        <React.Fragment>
            <OrgaoFilterContext.Provider value={OrgaoFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <OrgaoFilter getRemoteOrgaoList={getRemoteOrgaoList} />
                        {display ? (
                            <OrgaoTable
                                filters={OrgaoContext}
                                getData={getRemoteOrgaoList} data={orgaoList}
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
            </OrgaoFilterContext.Provider>
        </React.Fragment>
    );
};

export default Orgao;

