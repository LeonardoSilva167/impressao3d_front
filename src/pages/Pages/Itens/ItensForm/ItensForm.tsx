import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import { InputCheckbox } from 'Components/ComponentController/Inputs/Checkbox/InputCheckbox'
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import { ItensDefaultValues, ItensModel } from 'interfaces/Itens/ItensInterface'
import { ItensService } from 'services/Itens/ItensService'
import { CategoriasService } from 'services/Categorias/CategoriasService'

const ItensForm = () => {
    const { state } = useLocation()
    const [record] = useState<ItensModel>(state ? state.source : ItensDefaultValues)
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<ItensModel>({
        defaultValues: record
    })
    const { voltarParaRotaAnterior } = useNavegacao()
    const navigate = useNavigate()
    const itensService = new ItensService()
    const categoriasService = new CategoriasService()

    const [categorias, setCategorias] = useState<SelectOptions[]>([])

    const getLookups = async (): Promise<void> => {
        try {
            const resCategorias = await categoriasService.AsyncListCategorias({})
            if (resCategorias) {
                setCategorias(resCategorias.map((el: any) => ({ value: el.id, label: el.descricao })))
            }
        } catch (error) {
            console.error("Erro ao carregar categorias:", error)
        }
    }

    const onSubmit: SubmitHandler<ItensModel> = async (data: any) => {
        try {
            if (record.id) {
                await itensService.editItens(data)
            } else {
                const id = await itensService.createItens(data)
                setValue('id', id)
            }
            navigate(`/itens`)
        } catch (error: any) {
            throw error
        }
    }

    useEffect(() => {
        getLookups()
    }, [])

    useEffect(() => {
        setActiveMenu('/itens')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/itens"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {record.id ? 'Editar' : 'Adicionar'} Item
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/itens">Itens</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>
                                        {record.id ? 'Editar' : 'Adicionar'} Item
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
                                                    <Label className="form-label">Categoria</Label>
                                                    <SelectListControlled<ItensModel>
                                                        control={control}
                                                        field="id_categoria_item"
                                                        options={categorias}
                                                        errors={errors.id_categoria_item}
                                                        required={required}
                                                        placeholder="Selecione..."
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <Label htmlFor="codigo" className="form-label">Código</Label>
                                                    <InputTextControlled<ItensModel>
                                                        field={"codigo"}
                                                        control={control}
                                                        required={required}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={8}>
                                                <div className="mb-3">
                                                    <Label htmlFor="descricao" className="form-label">Descrição</Label>
                                                    <InputTextControlled<ItensModel>
                                                        field={"descricao"}
                                                        control={control}
                                                        required={required}
                                                        maxLength={{ value: 255, message: "Máximo 255 caracteres" }}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="unidade_medida" className="form-label">Unidade de Medida</Label>
                                                    <InputTextControlled<ItensModel>
                                                        field={"unidade_medida"}
                                                        control={control}
                                                        required={required}
                                                        placeholder="Ex: UN, KG, G, CX"
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <div className="form-check form-switch form-switch-md mb-3">
                                                    <Label className="me-3" htmlFor="controla_estoque">Controla Estoque</Label>
                                                    <InputCheckbox<ItensModel> field='controla_estoque' register={register} role="switch" />
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="form-check form-switch form-switch-md mb-3">
                                                    <Label className="me-3" htmlFor="gera_custo">Gera Custo</Label>
                                                    <InputCheckbox<ItensModel> field='gera_custo' register={register} role="switch" />
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="form-check form-switch form-switch-md mb-3">
                                                    <Label className="me-3" htmlFor="ativo">Ativo</Label>
                                                    <InputCheckbox<ItensModel> field='ativo' register={register} role="switch" />
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

export default ItensForm
