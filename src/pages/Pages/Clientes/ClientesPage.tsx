import BreadCrumb from 'Components/Common/BreadCrumb';
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Container, Spinner } from 'reactstrap';
import ClientesFilter from './ClientesFilter/ClientesFilter';
import ClientesTable from './ClientesTable/ClientesTable';
import { PaginateInterface, PaginateSearch } from 'interfaces/SystemInterfaces/PaginateInterface';
import { ClientesList, ClientesSearch } from 'interfaces/Clientes/ClientesInterface';
import { ClientesService } from 'services/Clientes/ClientesService';
import { SubmitHandler } from 'react-hook-form';



type ClientesFilterContextType = {
    firstEntry: boolean,
} & ClientesSearch & PaginateSearch

export const ClientesFilterContext = createContext<ClientesFilterContextType>({} as ClientesFilterContextType)


const Clientes = () => {
    // // document.title = "Widgets | Velzon - React Admin & Dashboard Template";
    const [display, setDisplay] = useState<boolean>(false)
    const clientesContext = useContext(ClientesFilterContext)
    const [clientesList, setClientesList] = useState<PaginateInterface<ClientesList>>();

    const clientesService = new ClientesService();

    const ClientesFilterContextValue = {
        id: null,
        cliente_id: null,
        nome: null,
        telefone: null,

        page: 1,
        perPage: 5,
        showMoreFields: false,
        firstEntry: false,
        id_pessoa: null,
        roles: null
    }

    const [perPage, setPerPage] = useState<number>(5);
    const [page, setPage] = useState(1)

    const getRemoteClientesList: SubmitHandler<any> = async (data): Promise<void> => {
        Object.keys(data).reduce((acc, k) => (!data[k] && delete acc[k], acc), data)

        data.perPage = perPage
        const list = await clientesService.listClientesPaginate({ ...data, perPage: perPage });
        
        clientesContext.id = data.id
        clientesContext.cliente_id = data.cliente_id
        clientesContext.nome = data.nome
        clientesContext.telefone = data.telefone

        clientesContext.page = data.page
        clientesContext.firstEntry = true
        clientesContext.palavra_chave =data.palavra_chave
        if (list) {
            setClientesList(list)
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    useEffect(() => {
        getRemoteClientesList(clientesContext)
    }, [perPage])
    return (
        <React.Fragment>
            <ClientesFilterContext.Provider value={ClientesFilterContextValue}>
                <div className="page-content">
                    <Container fluid>
                        <ClientesFilter getRemoteClientesList={getRemoteClientesList} />
                        {display ? (
                            <ClientesTable
                                filters={clientesContext}
                                getData={getRemoteClientesList} data={clientesList}
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
            </ClientesFilterContext.Provider>
        </React.Fragment>
    );
};

export default Clientes;

