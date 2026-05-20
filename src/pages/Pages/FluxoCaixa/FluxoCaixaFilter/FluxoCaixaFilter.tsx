import UiContent from "Components/Common/UiContent";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Breadcrumb, BreadcrumbItem, Card, CardHeader, Col, Collapse, Label, Row } from "reactstrap";
import { InputTextControlled } from "Components/ComponentController/Inputs/Text/InputTextControlled";
import { InputDate } from "Components/ComponentController/Inputs/Date/InputDate";
import { formatDateSQL, formatDateSQLForTimezone} from "helpers/functions_helpers";
import { FluxoCaixaService } from "services/FluxoCaixa";
import { FluxoCaixaSearch } from "interfaces/FluxoCaixa";


export interface FluxoCaixaFilterProps {
    getRemoteFluxoCaixaList: (data: any) => void
}

const FluxoCaixaFilter = ({ getRemoteFluxoCaixaList }: FluxoCaixaFilterProps) => {
    const fluxoCaixaService = new FluxoCaixaService()
    
    const { handleSubmit, control, setValue, register, watch } = useForm<FluxoCaixaSearch>({ defaultValues: {} })
    const [showFilter, setShowFilter] = useState<boolean>(true);

    useEffect(() => {
        const now = new Date();
        const data_inicio = new Date(now.getFullYear(), now.getMonth(), 1);
        const data_fim = now;
      
        setValue('data_inicio', formatDateSQLForTimezone(data_inicio));
        setValue('data_fim', formatDateSQLForTimezone(data_fim));
      }, []);
      
    
    return (
        <React.Fragment>
            <UiContent />
            {/* Breadcrumb */}
            <Row>
                <Col xs={12}>
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Link to="/dashboard" className="me-2">
                                <i className="bx bx-arrow-back bx-sm"></i>
                            </Link>
                            <h4 className="mb-0">Fluxo de Caixa</h4>
                        </div>
                        <Breadcrumb pageTitle="" listClassName='mb-sm-0 pt-1 py-2'>
                            <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                            <BreadcrumbItem active> Fluxo de Caixa </BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>
            </Row>
            {/* Filter */}
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col>
                                    <Collapse isOpen={showFilter} id="multiCollapseExample2" className="multi-collapse mt-3">
                                        <div className="">
                                            <form className="px-0 my-0 m-2" id="form-search" name="form-search" onSubmit={handleSubmit(getRemoteFluxoCaixaList)}>
                                                <Row className="align-items-end">
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="data_inicio" className="form-label">Data Início</Label>
                                                            <InputDate<FluxoCaixaSearch> field={"data_inicio"} register={register} />
                                                        </div>
                                                    </Col>

                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="data_fim" className="form-label">Data Final</Label>
                                                            <InputDate<FluxoCaixaSearch> field={"data_fim"} register={register} />
                                                        </div>
                                                    </Col>
                                                    <Col md={4}></Col>
                                                    {/* <Col md={4}>
                                                        <div className="mb-3">
                                                        <InputTextControlled<FluxoCaixaSearch>
                                                            field={"palavra_chave"}
                                                            control={control}
                                                            placeholder="Buscar..."
                                                        />
                                                        </div>
                                                    </Col> */}

                                                    <Col md={2}>
                                                        <div className="mb-3">
                                                        <button
                                                            className="btn btn-success form-control"
                                                            type="submit"
                                                            id="button-addon2"
                                                        >
                                                            Buscar
                                                        </button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </form>
                                        </div>
                                    </Collapse>
                                </Col>
                            </Row>
                        </CardHeader>
                    </Card>
                </Col>
            </Row>
        </React.Fragment >
    )
}

export default FluxoCaixaFilter;     