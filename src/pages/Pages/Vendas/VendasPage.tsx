import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import VendasFilter from './VendasFilter/VendasFilter';
import VendasTable from './VendasTable/VendasTable';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import { SubmitHandler } from 'react-hook-form';
import { VendasList, VendasSearch } from 'interfaces/Vendas/VendasInterface';
import { VendasService } from 'services/Vendas/VendasService';
import { dataPaginateFake } from 'helpers/functions_helpers';



type VendasFilterContextType = {
    firstEntry: boolean,
} & VendasSearch & PaginateSearch

export const VendasFilterContext = createContext<VendasFilterContextType>({} as VendasFilterContextType)


const Vendas = () => {
    // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const vendasContext = useContext(VendasFilterContext)
    const [vendasList, setVendasList] = useState<PaginateInterface<VendasList>>();

    const vendasService = new VendasService();

    const VendasFilterContextValue = {
        id: null,
        cliente_id: null,
        codigo: null,
        nome: null,

        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
        roles: null
    }

    const [perPage, setPerPage] = useState<number>(5);
    const [page, setPage] = useState(1)

    const getRemoteVendasList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        const list = await vendasService.listVendasPaginate({ ...data, perPage: perPage });

        vendasContext.id = data.id

        vendasContext.page = data.page
        vendasContext.firstEntry = true
        vendasContext.palavra_chave =data.palavra_chave

        if (list) {
            setVendasList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteVendasList(vendasContext)
    }, [perPage])
    return (
        <React.Fragment>
            <VendasFilterContext.Provider value={VendasFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <VendasFilter getRemoteVendasList={getRemoteVendasList} />
                        {display ? (
                            <VendasTable
                                filters={vendasContext}
                                getData={getRemoteVendasList} data={vendasList}
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
            </VendasFilterContext.Provider>
        </React.Fragment>
    );
};

export default Vendas;

