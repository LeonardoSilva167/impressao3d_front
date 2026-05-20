import UiContent from "Components/Common/UiContent";
import { buscarMesPorNumero, mesesSelect, numberFormat, useNavegacao } from 'helpers/functions_helpers';
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Label, Row, UncontrolledDropdown } from "reactstrap";
import { PaginateInterface, PaginateSearch, PerPageProps } from "interfaces/SystemInterfaces/PaginateInterface";
import CustomModal from "Components/ComponentController/Modal/CustomModal";
import { GradesProdutosList, GradesProdutosSearch } from "interfaces/GradesProdutos/GradesProdutosInterface";
import { GradesProdutosService } from "services/GradesProdutosService/GradesProdutosService";

export interface GradesProdutosTableProps {
    data: PaginateInterface<GradesProdutosList> | undefined,
    getData: (data: PaginateSearch & GradesProdutosSearch) => void,
    setPerPage: (perPage: number) => void
    setPage: (page: number) => void
    page: number
    perPage: number
    filters: any
}

export const GradesProdutosTable = ({ data, getData, setPerPage, setPage, perPage, filters }: GradesProdutosTableProps) => {
    const [optPerPage, setOptPerPage] = useState<PerPageProps[]>([
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 20, label: "20" },
        { value: 50, label: "50" },
        { value: 100, label: "100" },
    ]);
    const gradesProdutosService = new GradesProdutosService();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);


    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen);
    };

    const handleRemoteDelete = async (id: number) => {
        try {
            const response = await gradesProdutosService.deleteGradesProdutos(id);
            if (data) {
                await handleThisRoute(data.first_page_url)
            }

            toggleModal();
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    const handleThisRoute = async (url: string) => {
        try {
            const new_url = new URL(url);
            await getData({
                // id: new_url.searchParams.get('id'),
                // marca_id: new_url.searchParams.get('marca_id'),
                // uso_periodo_id: new_url.searchParams.get('uso_periodo_id'),
                // nome: new_url.searchParams.get('nome'),
                // codigo: new_url.searchParams.get('codigo'),
                // descricao: new_url.searchParams.get('descricao'),
                // tipo_id: new_url.searchParams.get('tipo_id'),
                // hora_protecao: new_url.searchParams.get('hora_protecao'),

                page: Number(new_url.searchParams.get('page')),
                palavra_chave: new_url.searchParams.get('palavra_chave')
            })
        } catch (error) {

        }
    }

    const hancdleCheckColorProgress = (value: number): any => {
        value = Number(value);

        if (value < 20) {
            return 'danger'
        } else if (value >= 20 && value < 80) {
            return 'warning'
        } else if (value >= 80) {
            return 'success'
        }
        else {
            return 'info'
        }
    };

    <i className="ri-checkbox-circle-line fs-17 align-middle"></i>

    useEffect(() => {
        if (data) {
            handleThisRoute(data.first_page_url)
        }
    }, [perPage])

    // Botão Voltar
    const { voltarParaRotaAnterior } = useNavegacao();
    const gotoPage = async (item: any) => {

    };

    return (
        <React.Fragment>
            <UiContent />
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardBody>
                            <div className="live-preview mt-1">
                                {data && data.total == 0 ?
                                    <div className="bg-primary text-white border-0 alert alert-primary fade show text-center" >INFORME OS FILTROS DESEJADOS E CLIQUE EM BUSCAR!</div>
                                    :
                                    !data ?
                                        <div className="bg-danger text-white border-0 alert alert-danger fade show text-center" >NENHUM RESULTADO ENCONTRADO!</div>
                                        :
                                        <>
                                            <Row className="d-felx align-items-center g-3 text-center text-sm-start">
                                                <Col lg={12} >
                                                    <div className="col-sm ">
                                                        <Col lg={2}>
                                                            <div className="d-flex flex-row justify-content-betweencenter align-items-center">
                                                                <Label htmlFor="firstNameinput" className="form-label me-3">Mostrar</Label>
                                                                <select className="form-select d-flex ps-3 mb-3" style={{ width: "100px", }} value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} >
                                                                    {optPerPage.map((item: any) => {
                                                                        return (<option key={item.value} value={item.value}>{item.label}</option>);

                                                                    })}
                                                                </select>
                                                                <Label htmlFor="firstNameinput" className="form-label ms-3 ">resultados</Label>
                                                            </div>
                                                        </Col>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={12}>
                                                    <div className="table-responsive">
                                                        <table className="table align-middle table-nowrap table-striped-columns mb-0 text-center">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th scope="col">Marca</th>
                                                                    <th scope="col">Nome Linha</th>
                                                                    <th scope="col">Código Linha</th>
                                                                    <th scope="col">Usabilidade</th>
                                                                    <th scope="col">Tipo</th>
                                                                    <th scope="col">Horas Duração</th>
                                                                    <th scope="col" style={{ width: "150px" }}>Ação</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {data && data.data.map((row: any, index: number) => {
                                                               
                                                                    return (    
                                                                        <tr>
                                                                            <td className="text-left">{`${row.marca_nome} - ${row.marca_codigo}`}</td>
                                                                            <td>{row.nome}</td>
                                                                            <td>{row.codigo}</td>
                                                                            <td>{row.uso_periodo_descricao}</td>
                                                                            <td>{row.tipo_descricao}</td>
                                                                            <td>{row.hora_protecao}</td>
                                                                            <td>
                                                                                <ButtonGroup>
                                                                                    <UncontrolledDropdown direction="down">
                                                                                        <DropdownToggle tag="button" className="btn">
                                                                                            <i className="ri-more-2-fill"></i>
                                                                                        </DropdownToggle>
                                                                                        <DropdownMenu style={{ zIndex: '999' }}>
                                                                                            <Link to={`/linha-produto/edit/${row.id}`} state={{ source: row }}>
                                                                                                <DropdownItem>Editar</DropdownItem>
                                                                                            </Link>
                                                                                            <DropdownItem
                                                                                                onClick={() => {
                                                                                                    setSelectedId(row.id);
                                                                                                    toggleModal();
                                                                                                }}
                                                                                            >
                                                                                                Excluir
                                                                                            </DropdownItem>
                                                                                            <CustomModal
                                                                                                isOpen={modalIsOpen}
                                                                                                toggle={toggleModal}
                                                                                                title="Confirmação de Exclusão"
                                                                                                delete={true}
                                                                                                body=""
                                                                                                onConfirmDelete={() => handleRemoteDelete(selectedId!)}
                                                                                            />
                                                                                        </DropdownMenu>
                                                                                    </UncontrolledDropdown>
                                                                                </ButtonGroup>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
                                                <div className="col-sm">
                                                    <div className="text-muted">Exibindo<span className="fw-semibold ms-1">{data && data.per_page}</span> de <span className="fw-semibold">{data && data.total}</span> Resultados</div>
                                                </div>
                                                <div className="col-sm-auto">
                                                    <ul className="pagination pagination-separated pagination-md justify-content-start justify-content-sm-start mb-0  table-responsive">
                                                        {
                                                            data.links && data.links.map((item: any, key: number) => {
                                                                switch (key) {
                                                                    case 0:
                                                                        return (
                                                                            <li key={item.label} className={data.current_page == 1 ? "page-item disabled" : "page-item"}>
                                                                                <Link to="#" className="page-link" onClick={() => handleThisRoute(item.url)}>Anterior</Link>
                                                                            </li>
                                                                        )
                                                                    case data.links.length - 1:
                                                                        return (
                                                                            <li className={data.last_page == data.current_page ? "page-item disabled" : "page-item"}>
                                                                                <Link to="#" className="page-link" onClick={() => handleThisRoute(item.url)}>Próximo</Link>
                                                                            </li>
                                                                        )
                                                                    default:
                                                                        return (
                                                                            <li className={`${item.active ? 'page-item active' : 'page-item'}`}>
                                                                                <Link to="#" className={`page-link `} onClick={() => handleThisRoute(item.url)}>{item.active}{item.label}</Link>
                                                                            </li>
                                                                        )
                                                                }
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </Row>
                                        </>}
                            </div>
                        </CardBody>
                    </Card>
                </Col>

            </Row >
            <Row>
                <Col md={12}>
                    <div className="hstack gap-2 justify-content-end">
                        <button type="button" className="btn btn-soft-success" onClick={voltarParaRotaAnterior}>Voltar</button>
                    </div>
                </Col>
            </Row>
        </React.Fragment >

    )
}
export default GradesProdutosTable;
