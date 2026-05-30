import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import {
    Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row, Spinner
} from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import {
    LookupsProdutos,
    ProdutosDefaultValues,
    ProdutosModel,
} from 'interfaces/Produtos/ProdutosInterface'
import { ProdutosService } from 'services/ProdutosService/ProdutosService'
import {
    mapLookupToOptions,
    montarSkuBase,
    normalizarLookupsProdutos,
    normalizarProdutoView,
} from '../hooks/useProdutos'

const ProdutosForm = () => {
    const { state } = useLocation()
    const { id } = useParams()
    const recordId = state && state.source && state.source.id ? state.source.id : (id ? Number(id) : null)
    const isEditing = recordId != null

    const { handleSubmit, control, reset, watch } = useForm<ProdutosModel>({
        defaultValues: ProdutosDefaultValues,
    })
    const { voltarParaRotaAnterior } = useNavegacao()
    const navigate = useNavigate()
    const produtosService = new ProdutosService()

    const [loadingRecord, setLoadingRecord] = useState(isEditing)
    const [lookups, setLookups] = useState<LookupsProdutos>()
    const [categoriasOptions, setCategoriasOptions] = useState<SelectOptions[]>([])
    const [modelosOptions, setModelosOptions] = useState<SelectOptions[]>([])
    const [linhasOptions, setLinhasOptions] = useState<SelectOptions[]>([])
    const [proximoCodigoBase, setProximoCodigoBase] = useState<string | null>(null)

    const codigoBaseWatch = watch('codigo_base')
    const idCategoriaWatch = watch('id_categoria')
    const idModeloWatch = watch('id_modelo')
    const idLinhaWatch = watch('id_linha')

    const codigoBaseExibicao = isEditing
        ? (codigoBaseWatch != null ? String(codigoBaseWatch) : '')
        : (proximoCodigoBase || '')

    const skuBasePreview = useMemo(() => (
        montarSkuBase(
            isEditing ? codigoBaseWatch : proximoCodigoBase,
            idCategoriaWatch,
            idModeloWatch,
            idLinhaWatch,
            lookups
        )
    ), [isEditing, codigoBaseWatch, proximoCodigoBase, idCategoriaWatch, idModeloWatch, idLinhaWatch, lookups])

    const loadLookups = async () => {
        try {
            const data = await produtosService.getLookupsProdutos()
            if (data) {
                const normalizado = normalizarLookupsProdutos(data as Record<string, any>)
                setLookups(normalizado)
                setCategoriasOptions(mapLookupToOptions(normalizado.categoriasProdutos))
                setModelosOptions(mapLookupToOptions(normalizado.modelosProdutos))
                setLinhasOptions(mapLookupToOptions(normalizado.linhasProdutos))
                if (!isEditing && normalizado.proximoCodigoBase != null) {
                    setProximoCodigoBase(String(normalizado.proximoCodigoBase))
                }
            }
        } catch (error) {
            console.error('Erro ao carregar lookups:', error)
            toast.error('Erro ao carregar opções do formulário.')
        }
    }

    const loadRecord = async (): Promise<void> => {
        if (!recordId) return
        try {
            setLoadingRecord(true)
            const view = await produtosService.getViewProdutos({ id: recordId })
            if (view) {
                const produto = normalizarProdutoView(view as Record<string, any>)
                reset({
                    id: produto.id,
                    descricao_produto: produto.descricao_produto != null ? produto.descricao_produto : null,
                    codigo_base: produto.codigo_base != null ? produto.codigo_base : null,
                    id_categoria: produto.id_categoria != null ? produto.id_categoria : null,
                    id_modelo: produto.id_modelo != null ? produto.id_modelo : null,
                    id_linha: produto.id_linha != null ? produto.id_linha : null,
                })
            }
        } catch (error) {
            console.error('Erro ao carregar produto:', error)
            toast.error('Erro ao carregar produto.')
        } finally {
            setLoadingRecord(false)
        }
    }

    const onSubmit: SubmitHandler<ProdutosModel> = async (data) => {
        try {
            const payload: ProdutosModel = {
                id: data.id,
                descricao_produto: data.descricao_produto,
                codigo_base: data.codigo_base != null ? String(data.codigo_base) : null,
                id_categoria: data.id_categoria,
                id_modelo: data.id_modelo,
                id_linha: data.id_linha,
            }

            if (isEditing) {
                await produtosService.editProdutos(payload)
                toast.success('Produto atualizado com sucesso.')
                navigate(`/produtos/view/${recordId}`)
            } else {
                const newId = await produtosService.createProdutos(payload)
                toast.success('Produto cadastrado com sucesso.')
                if (newId) {
                    navigate(`/produtos/view/${newId}`)
                } else {
                    navigate('/produtos')
                }
            }
        } catch (error: any) {
            console.error('Erro ao salvar produto:', error)
            const msg = (error && error.message) ? error.message : 'Erro ao salvar produto.'
            toast.error(msg)
        }
    }

    useEffect(() => {
        loadLookups()
    }, [])

    useEffect(() => {
        if (isEditing) {
            loadRecord()
        } else if (state && state.source) {
            reset({
                ...ProdutosDefaultValues,
                ...state.source,
            })
        }
    }, [recordId])

    useEffect(() => {
        setActiveMenu('/produtos')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/produtos"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {isEditing ? 'Editar' : 'Adicionar'} Produto Base
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>Produtos</BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/produtos">Produtos</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>
                                        {isEditing ? 'Editar' : 'Adicionar'} Produto
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
                                                    <h5 className="mb-3">Dados do Produto Base</h5>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={8}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="descricao_produto" className="form-label">Descrição Produto</Label>
                                                        <InputTextControlled<ProdutosModel>
                                                            field={'descricao_produto'}
                                                            control={control}
                                                            required={required}
                                                            maxLength={{ value: 120, message: 'Máximo 120 caracteres' }}
                                                            uppercase
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="codigo_base" className="form-label">Código Base</Label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={codigoBaseExibicao || '—'}
                                                            readOnly
                                                            disabled
                                                        />
                                                        {!isEditing && (
                                                            <small className="text-muted">
                                                                Próximo código disponível (atribuído automaticamente ao salvar)
                                                            </small>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="id_categoria" className="form-label">Categoria</Label>
                                                        <SelectListControlled<ProdutosModel>
                                                            field={'id_categoria'}
                                                            control={control}
                                                            options={categoriasOptions}
                                                            required={required}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="id_modelo" className="form-label">Modelo</Label>
                                                        <SelectListControlled<ProdutosModel>
                                                            field={'id_modelo'}
                                                            control={control}
                                                            options={modelosOptions}
                                                            required={required}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="id_linha" className="form-label">Linha</Label>
                                                        <SelectListControlled<ProdutosModel>
                                                            field={'id_linha'}
                                                            control={control}
                                                            options={linhasOptions}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={12}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">SKU Base</Label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={skuBasePreview || '—'}
                                                            readOnly
                                                            disabled
                                                        />
                                                        <small className="text-muted">
                                                            Gerado automaticamente: código-categoria-modelo[-linha]
                                                        </small>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <hr />
                                            <Row className="mt-4">
                                                <Col md={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <button type="submit" className="btn btn-primary">
                                                            Salvar Produto
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

export default ProdutosForm
