import UiContent from 'Components/Common/UiContent'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
    Breadcrumb, BreadcrumbItem, Button, Card, CardHeader, Col, Collapse, Row
} from 'reactstrap'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import { GradeProdutosSearch } from 'interfaces/GradeProdutos/GradeProdutosInterface'

export interface GradeProdutosFilterProps {
    getRemoteProdutosList: (data: any) => void
}

const GradeProdutosFilter = ({ getRemoteProdutosList }: GradeProdutosFilterProps) => {
    const { handleSubmit, control, register } = useForm<GradeProdutosSearch>({ defaultValues: {} })
    const [showFilter, setShowFilter] = useState<boolean>(false)

    return (
        <React.Fragment>
            <UiContent />

            <Row>
                <Col xs={12}>
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Link to="/dashboard" className="me-2">
                                <i className="bx bx-arrow-back bx-sm"></i>
                            </Link>
                            <h4 className="mb-0">Grade de Produtos</h4>
                        </div>
                        <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                            <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                            <BreadcrumbItem>Produtos</BreadcrumbItem>
                            <BreadcrumbItem active>Grade de Produtos</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <div className="d-flex flex-row justify-content-end align-items-center mb-4">
                        <Link to="add" className="btn btn-primary">
                            <i className="ri-add-circle-line align-middle me-1"></i> Adicionar Grade
                        </Link>
                    </div>
                </Col>
                <Col xl={12}>
                    <Card>
                        <CardHeader>
                            <div className="gap-2 flex-wrap">
                                <Row>
                                    <Col md={4}>
                                        <Button onClick={() => setShowFilter(!showFilter)} color="primary" className="mb-1">
                                            Filtros
                                        </Button>
                                    </Col>
                                    {!showFilter && (
                                        <Col md={8}>
                                            <form onSubmit={handleSubmit(getRemoteProdutosList)}>
                                                <div className="input-group">
                                                    <input
                                                        {...register('nome_produto')}
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Buscar por nome do produto..."
                                                    />
                                                    <button className="btn btn-success" type="submit">
                                                        <i className="ri-search-line align-middle me-1"></i> Buscar
                                                    </button>
                                                </div>
                                            </form>
                                        </Col>
                                    )}
                                </Row>
                            </div>

                            <Row>
                                <Col>
                                    <Collapse isOpen={showFilter} className="multi-collapse mt-3">
                                        <form
                                            className="px-0 my-0 m-2"
                                            id="form-search"
                                            onSubmit={handleSubmit(getRemoteProdutosList)}
                                        >
                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <label htmlFor="sku" className="form-label">SKU</label>
                                                        <InputTextControlled<GradeProdutosSearch>
                                                            field={'sku'}
                                                            control={control}
                                                            placeholder="SKU do produto..."
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <label htmlFor="nome_produto" className="form-label">Nome Produto</label>
                                                        <InputTextControlled<GradeProdutosSearch>
                                                            field={'nome_produto'}
                                                            control={control}
                                                            placeholder="Nome do produto..."
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <label htmlFor="codigo_base" className="form-label">Código Base</label>
                                                        <InputTextControlled<GradeProdutosSearch>
                                                            field={'codigo_base'}
                                                            control={control}
                                                            placeholder="Código base..."
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <label htmlFor="parte" className="form-label">Parte</label>
                                                        <InputTextControlled<GradeProdutosSearch>
                                                            field={'parte'}
                                                            control={control}
                                                            placeholder="Ex.: Cuba, Tampa..."
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <label htmlFor="status" className="form-label">Status</label>
                                                        <InputTextControlled<GradeProdutosSearch>
                                                            field={'status'}
                                                            control={control}
                                                            placeholder="Ex.: 1, 0, Ativo..."
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="mt-2">
                                                <div className="d-flex flex-row justify-content-end align-items-center">
                                                    <Col md={2} className="me-3">
                                                        <button className="btn btn-success form-control" type="submit">
                                                            Buscar
                                                        </button>
                                                    </Col>
                                                </div>
                                            </Row>
                                        </form>
                                    </Collapse>
                                </Col>
                            </Row>
                        </CardHeader>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default GradeProdutosFilter
