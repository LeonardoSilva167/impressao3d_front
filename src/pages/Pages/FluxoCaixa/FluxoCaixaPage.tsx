import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import FluxoCaixaFilter from './FluxoCaixaFilter/FluxoCaixaFilter';
import FluxoCaixaTable from './FluxoCaixaTable/FluxoCaixaTable';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import { FluxoCaixaList, FluxoCaixaSearch } from 'interfaces/FluxoCaixa/FluxoCaixaInterface';
import { SubmitHandler } from 'react-hook-form';
import { FluxoCaixaService } from "services/FluxoCaixa";
import { ServicosService } from "services/ServicosService";



type FluxoCaixaFilterContextType = {
    firstEntry: boolean,
} & FluxoCaixaSearch & PaginateSearch

export const FluxoCaixaFilterContext = createContext<FluxoCaixaFilterContextType>({} as FluxoCaixaFilterContextType)


const FluxoCaixa = () => {
    // // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const FluxoCaixaContext = useContext(FluxoCaixaFilterContext)
    const [FluxoCaixaList, setFluxoCaixaList] = useState<PaginateInterface<FluxoCaixaList>>();

    const fluxoCaixaService = new FluxoCaixaService();
    const servicosService = new ServicosService();
    const FluxoCaixaFilterContextValue = {
        id: null,
        data_inicio: null,
        data_fim: null,

        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
        roles: null
    }

    const [perPage, setPerPage] = useState<number>(5);
    const [page, setPage] = useState(1)

    const getRemoteFluxoCaixaList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        const list = await fluxoCaixaService.listFluxoCaixaPaginate({ ...data, perPage: perPage });
        // const list = await servicosService.listServicosPaginate({ ...data, perPage: perPage });
        
        FluxoCaixaContext.id = data.id
        FluxoCaixaContext.data_inicio = data.data_inicio
        FluxoCaixaContext.data_fim = data.data_fim

        FluxoCaixaContext.page = data.page
        FluxoCaixaContext.firstEntry = true
        FluxoCaixaContext.palavra_chave =data.palavra_chave
        if (list) {
            setFluxoCaixaList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteFluxoCaixaList(FluxoCaixaContext)
    }, [perPage])

    useLayoutEffect(() => {
        getRemoteFluxoCaixaList(FluxoCaixaContext)
    }, [])
    return (
        <React.Fragment>
            <FluxoCaixaFilterContext.Provider value={FluxoCaixaFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <FluxoCaixaFilter getRemoteFluxoCaixaList={getRemoteFluxoCaixaList} />
                        {display ? (
                            <FluxoCaixaTable
                                filters={FluxoCaixaContext}
                                getData={getRemoteFluxoCaixaList} data={FluxoCaixaList}
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
            </FluxoCaixaFilterContext.Provider>
        </React.Fragment>
    );
};

export default FluxoCaixa;

