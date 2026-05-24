import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import { PlataformasCompraDefaultValues, PlataformasCompraModel } from 'interfaces/PlataformasCompra/PlataformasCompraInterface'
import { PlataformasCompraService } from 'services/PlataformasCompra/PlataformasCompraService'

const PlataformasCompraForm = () => {
    const { state } = useLocation()
    const [record] = useState<PlataformasCompraModel>(state ? state.source : PlataformasCompraDefaultValues)
    const { handleSubmit, control, setValue } = useForm<PlataformasCompraModel>({
        defaultValues: record
    })
    const { voltarParaRotaAnterior } = useNavegacao()
    const navigate = useNavigate()
    const plataformasCompraService = new PlataformasCompraService()

    const onSubmit: SubmitHandler<PlataformasCompraModel> = async (data: any) => {
        try {
            if (record.id) {
                await plataformasCompraService.editPlataformasCompra(data)
            } else {
                const id = await plataformasCompraService.createPlataformasCompra(data)
                setValue('id', id)
            }
            navigate(`/plataformas-compra`)
        } catch (error: any) {
            throw error
        }
    }

    useEffect(() => {
        setActiveMenu('/plataformas-compra')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/plataformas-compra"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {record.id ? 'Editar' : 'Adicionar'} Plataforma de Compra
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/plataformas-compra">Plataformas de Compra</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>
                                        {record.id ? 'Editar' : 'Adicionar'} Plataforma de Compra
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xxl={12}>
                            <Card>
                                <CardBody>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <Label htmlFor="descricao" className="form-label">Descrição</Label>
                                                    <InputTextControlled<PlataformasCompraModel>
                                                        field={"descricao"}
                                                        control={control}
                                                        required={required}
                                                        maxLength={{ value: 120, message: "Máximo 120 caracteres" }}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <Label htmlFor="url" className="form-label">URL</Label>
                                                    <InputTextControlled<PlataformasCompraModel>
                                                        field={"url"}
                                                        control={control}
                                                        maxLength={{ value: 255, message: "Máximo 255 caracteres" }}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row className="mt-5">
                                            <Col md={12}>
                                                <div className="hstack gap-2 justify-content-end">
                                                    <button type="submit" className="btn btn-primary">Salvar</button>
                                                    <button type="button" className="btn btn-soft-success" onClick={voltarParaRotaAnterior}>Voltar</button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default PlataformasCompraForm
