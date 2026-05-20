import React, { createContext, useContext, useEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import ServicosFilter from './ServicosFilter/ServicosFilter';
import ServicosTable from './ServicosTable/ServicosTable';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import { ServicosList, ServicosSearch } from 'interfaces/Servicos/ServicosInterface';
import { SubmitHandler } from 'react-hook-form';
import { ServicosService } from "services/ServicosService";



type ServicosFilterContextType = {
    firstEntry: boolean,
} & ServicosSearch & PaginateSearch

export const ServicosFilterContext = createContext<ServicosFilterContextType>({} as ServicosFilterContextType)


const Servicos = () => {
    // // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const ServicosContext = useContext(ServicosFilterContext)
    const [ServicosList, setServicosList] = useState<PaginateInterface<ServicosList>>();

    const servicosService = new ServicosService();

    const ServicosFilterContextValue = {
        id: null,
        cliente_id: null,
        nome: null,
        descricao: null,
        preco: null,

        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
        roles: null
    }

    const [perPage, setPerPage] = useState<number>(5);
    const [page, setPage] = useState(1)

    const getRemoteServicosList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        const list = await servicosService.listServicosPaginate({ ...data, perPage: perPage });
        
        ServicosContext.id = data.id
        ServicosContext.id_servico = data.id_servico
        ServicosContext.nome = data.nome
        ServicosContext.descricao = data.descricao
        ServicosContext.preco = data.preco

        ServicosContext.page = data.page
        ServicosContext.firstEntry = true
        ServicosContext.palavra_chave =data.palavra_chave
        if (list) {
            setServicosList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteServicosList(ServicosContext)
    }, [perPage])
    return (
        <React.Fragment>
            <ServicosFilterContext.Provider value={ServicosFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <ServicosFilter getRemoteServicosList={getRemoteServicosList} />
                        {display ? (
                            <ServicosTable
                                filters={ServicosContext}
                                getData={getRemoteServicosList} data={ServicosList}
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
            </ServicosFilterContext.Provider>
        </React.Fragment>
    );
};

export default Servicos;

