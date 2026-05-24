import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import { CategoriasDefaultValues, CategoriasModel } from 'interfaces/Categorias/CategoriasInterface'
import { CategoriasService } from 'services/Categorias/CategoriasService'

const CategoriasForm = () => {
    const { state } = useLocation()
    const [record] = useState<CategoriasModel>(state ? state.source : CategoriasDefaultValues)
    const { handleSubmit, control, setValue } = useForm<CategoriasModel>({
        defaultValues: record
    })
    const { voltarParaRotaAnterior } = useNavegacao()
    const navigate = useNavigate()
    const categoriasService = new CategoriasService()

    const onSubmit: SubmitHandler<CategoriasModel> = async (data: any) => {
        try {
            if (record.id) {
                await categoriasService.editCategorias(data)
            } else {
                const id = await categoriasService.createCategorias(data)
                setValue('id', id)
            }
            navigate(`/categorias-itens`)
        } catch (error: any) {
            throw error
        }
    }

    useEffect(() => {
        setActiveMenu('/categorias-itens')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/categorias-itens"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {record.id ? 'Editar' : 'Adicionar'} Categoria
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/categorias-itens">Categorias</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>
                                        {record.id ? 'Editar' : 'Adicionar'} Categoria
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
                                                    <InputTextControlled<CategoriasModel>
                                                        field={"descricao"}
                                                        control={control}
                                                        required={required}
                                                        maxLength={{ value: 120, message: "Máximo 120 caracteres" }}
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

export default CategoriasForm
