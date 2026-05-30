import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import { CategoriasProdutosDefaultValues, CategoriasProdutosModel } from 'interfaces/CategoriasProdutos/CategoriasProdutosInterface'
import { CategoriasProdutosService } from 'services/CategoriasProdutos/CategoriasProdutosService'

const CategoriasProdutosForm = () => {
    const { state } = useLocation()
    const [record] = useState<CategoriasProdutosModel>(state ? state.source : CategoriasProdutosDefaultValues)
    const { handleSubmit, control, setValue } = useForm<CategoriasProdutosModel>({
        defaultValues: record
    })
    const [display, setDisplay] = useState<boolean>(false)
    const { voltarParaRotaAnterior } = useNavegacao()
    const navigate = useNavigate()
    const categoriasProdutosService = new CategoriasProdutosService()

    const onSubmit: SubmitHandler<CategoriasProdutosModel> = async (data: any) => {
        try {
            if (record.id) {
                await categoriasProdutosService.editCategoriasProdutos(data)
            } else {
                const id = await categoriasProdutosService.createCategoriasProdutos(data)
                if (id != null) setValue('id', String(id))
            }
            navigate('/categorias-produtos')
        } catch (error: any) {
            throw error
        }
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        setActiveMenu('/categorias-produtos')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/categorias-produtos"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {record.id ? 'Editar' : 'Adicionar'} Categoria de Produto
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>Produtos</BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/categorias-produtos">Categorias</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>
                                        {record.id ? 'Editar' : 'Adicionar'} Categoria de Produto
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xxl={12}>
                            <Card>
                                <CardBody>
                                    {display && (
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Row>
                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="codigo" className="form-label">Código</Label>
                                                    <InputTextControlled<CategoriasProdutosModel>
                                                        field={"codigo"}
                                                        control={control}
                                                        required={required}
                                                        maxLength={{ value: 20, message: "Máximo 20 caracteres" }}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={8}>
                                                <div className="mb-3">
                                                    <Label htmlFor="descricao" className="form-label">Descrição</Label>
                                                    <InputTextControlled<CategoriasProdutosModel>
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
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default CategoriasProdutosForm
