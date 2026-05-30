import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row, Spinner } from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import {
    ProjetosImpressaoDefaultValues,
    ProjetosImpressaoModel,
} from 'interfaces/ProjetosImpressao/ProjetosImpressaoInterface'
import { ProjetosImpressaoService } from 'services/ProjetosImpressao/ProjetosImpressaoService'

const ProjetosImpressaoForm = () => {
    const { state } = useLocation()
    const { id } = useParams()
    const recordId = state && state.source && state.source.id ? state.source.id : (id ? Number(id) : null)
    const isEditing = recordId != null

    const { handleSubmit, control, reset } = useForm<ProjetosImpressaoModel>({
        defaultValues: ProjetosImpressaoDefaultValues,
    })
    const { voltarParaRotaAnterior } = useNavegacao()
    const navigate = useNavigate()
    const projetosImpressaoService = new ProjetosImpressaoService()

    const [loadingRecord, setLoadingRecord] = useState(isEditing)

    const loadRecord = async (): Promise<void> => {
        if (!recordId) return
        try {
            setLoadingRecord(true)
            const view = await projetosImpressaoService.getViewProjetosImpressao({ id: recordId })
            if (view) {
                reset({
                    id: view.id,
                    projeto_impressao_id: view.id,
                    url_projeto: view.url_projeto,
                    nome_original_projeto: view.nome_original_projeto,
                    codigo_projeto: view.codigo_projeto,
                    descricao_projeto: view.descricao_projeto,
                })
            }
        } catch (error) {
            console.error('Erro ao carregar projeto:', error)
            toast.error('Erro ao carregar projeto de impressão.')
        } finally {
            setLoadingRecord(false)
        }
    }

    const onSubmit: SubmitHandler<ProjetosImpressaoModel> = async (data) => {
        try {
            const payload: ProjetosImpressaoModel = {
                id: data.id,
                url_projeto: data.url_projeto,
                nome_original_projeto: data.nome_original_projeto,
                codigo_projeto: data.codigo_projeto,
                descricao_projeto: data.descricao_projeto,
            }

            if (isEditing) {
                await projetosImpressaoService.editProjetosImpressao(payload)
                toast.success('Projeto de impressão atualizado com sucesso.')
                navigate(`/projetos-impressao/view/${recordId}`)
            } else {
                const newId = await projetosImpressaoService.createProjetosImpressao(payload)
                toast.success('Projeto cadastrado com sucesso.')
                if (newId) {
                    navigate(`/projetos-impressao/view/${newId}`)
                } else {
                    navigate('/projetos-impressao')
                }
            }
        } catch (error: any) {
            console.error('Erro ao salvar projeto:', error)
            toast.error('Erro ao salvar projeto de impressão.')
        }
    }

    useEffect(() => {
        if (isEditing) {
            loadRecord()
        } else if (state && state.source) {
            reset({
                ...ProjetosImpressaoDefaultValues,
                ...state.source,
            })
        }
    }, [recordId])

    useEffect(() => {
        setActiveMenu('/projetos-impressao')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/projetos-impressao"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {isEditing ? 'Editar' : 'Adicionar'} Projeto de Impressão
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>Produção</BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/projetos-impressao">Projetos de Impressão</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>
                                        {isEditing ? 'Editar' : 'Adicionar'} Projeto
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xxl={12}>
                            <Card>
                                <CardBody>
                                    {loadingRecord ? (
                                        <div className="text-center py-5">
                                            <Spinner animation="border" variant="primary" />
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <Row>
                                                <Col md={12}>
                                                    <h5 className="mb-3">Dados do Projeto</h5>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="url_projeto" className="form-label">URL Projeto</Label>
                                                        <InputTextControlled<ProjetosImpressaoModel>
                                                            field={'url_projeto'}
                                                            control={control}
                                                            required={required}
                                                            placeholder="https://..."
                                                            uppercase
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="nome_original_projeto" className="form-label">Nome Original Projeto</Label>
                                                        <InputTextControlled<ProjetosImpressaoModel>
                                                            field={'nome_original_projeto'}
                                                            control={control}
                                                            required={required}
                                                            uppercase
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="codigo_projeto" className="form-label">Código Projeto</Label>
                                                        <InputTextControlled<ProjetosImpressaoModel>
                                                            field={'codigo_projeto'}
                                                            control={control}
                                                            required={required}
                                                            uppercase
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={8}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="descricao_projeto" className="form-label">Descrição/Apelido Projeto</Label>
                                                        <InputTextControlled<ProjetosImpressaoModel>
                                                            field={'descricao_projeto'}
                                                            control={control}
                                                            required={required}
                                                            placeholder="Ex: Caixa de Jóias Nº1"
                                                            uppercase
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>

                                            <hr />
                                            <Row className="mt-4">
                                                <Col md={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <button type="submit" className="btn btn-primary">
                                                            Salvar Projeto
                                                        </button>
                                                        <button type="button" className="btn btn-soft-success" onClick={voltarParaRotaAnterior}>
                                                            Voltar
                                                        </button>
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

export default ProjetosImpressaoForm
