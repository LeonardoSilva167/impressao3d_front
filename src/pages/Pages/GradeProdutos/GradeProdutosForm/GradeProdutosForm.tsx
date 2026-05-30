import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import {
    Breadcrumb, BreadcrumbItem, Button, Card, CardBody, Col, Container,
    Label, Row, Spinner, Table
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { AsyncSelectListControlled } from 'Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import {
    GradeCombinacao,
    GradeCombinacaoPayload,
    GradeProdutosCarregarDados,
} from 'interfaces/GradeProdutos/GradeProdutosInterface'
import { ProdutosList } from 'interfaces/Produtos/ProdutosInterface'
import { GradeProdutosService } from 'services/GradeProdutos/GradeProdutosService'
import { ProdutosService } from 'services/ProdutosService/ProdutosService'
import GradeCombinacaoModal from '../GradeCombinacaoModal/GradeCombinacaoModal'
import {
    formatarPartesCombinacao,
    mapCombinacoesView,
    obterQuantidadePartesCombinacao,
} from '../hooks/useGradeProdutos'

interface GradeFormFields {
    id_produto_base: string | number | null
}

const GradeProdutosForm = () => {
    const { id } = useParams()
    const { state } = useLocation()
    const navigate = useNavigate()
    const { voltarParaRotaAnterior } = useNavegacao()

    const gradeService = new GradeProdutosService()
    const produtosService = new ProdutosService()

    const isEditing = Boolean(id)
    const [loading, setLoading] = useState(isEditing)
    const [carregandoDados, setCarregandoDados] = useState(false)
    const [gerando, setGerando] = useState(false)

    const [dadosCarregados, setDadosCarregados] = useState<GradeProdutosCarregarDados>()
    const [combinacoes, setCombinacoes] = useState<GradeCombinacao[]>([])
    const [modalAberto, setModalAberto] = useState(false)
    const [combinacaoEdicao, setCombinacaoEdicao] = useState<GradeCombinacao | null>(null)

    const { control, setValue, watch, handleSubmit } = useForm<GradeFormFields>({
        defaultValues: { id_produto_base: null },
    })

    const idProdutoBase = watch('id_produto_base')

    const getListProdutos = async (inputValue: string): Promise<SelectOptions[]> => {
        const list = await produtosService.AsyncListProdutos({ palavra_chave: inputValue })
        if (!list) return [{ value: '', label: 'Selecione' }]
        return [
            { value: '', label: 'Selecione' },
            ...list.map((item: ProdutosList) => ({
                value: item.id,
                label: item.sku_base
                    ? `${item.sku_base} - ${item.descricao_produto || ''}`
                    : (item.descricao_produto || String(item.id)),
            })),
        ]
    }

    const carregarDadosProduto = async (produtoBaseId: string | number) => {
        if (!produtoBaseId) {
            setDadosCarregados(undefined)
            setCombinacoes([])
            return
        }

        setCarregandoDados(true)
        try {
            const dados = await gradeService.carregarDados({ id_produto_base: produtoBaseId })
            if (!dados) {
                toast.error('Não foi possível carregar os dados do produto base.')
                setDadosCarregados(undefined)
                return
            }
            setDadosCarregados(dados)
            if (!isEditing) {
                setCombinacoes([])
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error)
            toast.error('Erro ao carregar dados do produto base.')
            setDadosCarregados(undefined)
        } finally {
            setCarregandoDados(false)
        }
    }

    const loadRecord = async () => {
        if (!id) return

        const registroId = Number(id)
        if (Number.isNaN(registroId)) return

        setLoading(true)
        try {
            const view = await gradeService.getViewGradeProdutos({ id: registroId })
            if (!view) {
                toast.error('Grade não encontrada.')
                return
            }

            setValue('id_produto_base', view.id_produto_base || null)

            if (view.id_produto_base) {
                const dados = await gradeService.carregarDados({ id_produto_base: view.id_produto_base })
                if (dados) {
                    setDadosCarregados(dados)
                    if (view.combinacoes && view.combinacoes.length > 0) {
                        setCombinacoes(mapCombinacoesView(view.combinacoes, dados.partes || []))
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao carregar grade:', error)
            toast.error('Erro ao carregar grade.')
        } finally {
            setLoading(false)
        }
    }

    const abrirModalNovaCombinacao = () => {
        setCombinacaoEdicao(null)
        setModalAberto(true)
    }

    const abrirModalEditarCombinacao = (combinacao: GradeCombinacao) => {
        setCombinacaoEdicao(combinacao)
        setModalAberto(true)
    }

    const toggleModal = () => {
        setModalAberto((prev) => {
            if (prev) {
                setCombinacaoEdicao(null)
            }
            return !prev
        })
    }

    const salvarCombinacao = (combinacao: GradeCombinacao) => {
        setCombinacoes((prev) => {
            const index = prev.findIndex((c) => c.id === combinacao.id)
            if (index >= 0) {
                const next = [...prev]
                next[index] = combinacao
                return next
            }
            return [...prev, combinacao]
        })
        toast.success('Combinação salva.')
    }

    const removerCombinacao = (combinacaoId: number | string | null | undefined) => {
        setCombinacoes((prev) => prev.filter((c) => c.id !== combinacaoId))
    }

    const montarPayloadCombinacoes = (): GradeCombinacaoPayload[] => {
        return combinacoes.map((comb) => {
            const payload: GradeCombinacaoPayload = {
                descricao: comb.descricao,
                partes: comb.partes.map((parte) => ({
                    id_parte: parte.id_parte,
                    quantidade: parte.quantidade,
                })),
            }
            if (comb.id != null && typeof comb.id === 'number') {
                payload.id = comb.id
            }
            return payload
        })
    }

    const onSubmit = async () => {
        if (!idProdutoBase) {
            toast.error('Selecione o produto base.')
            return
        }

        if (combinacoes.length === 0) {
            toast.error('Cadastre ao menos uma combinação para gerar a grade.')
            return
        }

        setGerando(true)
        try {
            const payload = {
                id: isEditing ? Number(id) : null,
                id_produto_base: idProdutoBase,
                combinacoes: montarPayloadCombinacoes(),
            }

            const gradeId = await gradeService.gerarGrade(payload)
            toast.success(isEditing ? 'Grade atualizada com sucesso.' : 'Grade gerada com sucesso.')

            const destinoId = gradeId != null ? gradeId : (isEditing ? Number(id) : null)
            if (destinoId != null) {
                navigate(`/grade-produtos/view/${destinoId}`)
            } else {
                navigate('/grade-produtos')
            }
        } catch (error) {
            console.error('Erro ao gerar grade:', error)
            toast.error('Erro ao gerar grade.')
        } finally {
            setGerando(false)
        }
    }

    useEffect(() => {
        setActiveMenu('/grade-produtos')
    }, [])

    useEffect(() => {
        if (isEditing) {
            loadRecord()
        } else if (state && state.source && state.source.id_produto_base) {
            setValue('id_produto_base', state.source.id_produto_base)
        }
    }, [id])

    useEffect(() => {
        if (!isEditing && idProdutoBase) {
            carregarDadosProduto(idProdutoBase)
        }
    }, [idProdutoBase, isEditing])

    const partes = (dadosCarregados && dadosCarregados.partes) || []

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/grade-produtos"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {isEditing ? 'Editar' : 'Adicionar'} Grade de Produtos
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>Produtos</BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/grade-produtos">Grade de Produtos</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>{isEditing ? 'Editar' : 'Adicionar'}</BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xxl={12}>
                            <Card>
                                <CardBody>
                                    {loading ? (
                                        <div className="text-center py-5">
                                            <Spinner animation="border" variant="primary" />
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <p className="text-muted mb-4">
                                                Selecione o produto base e cadastre as combinações de partes
                                                que serão utilizadas para gerar os produtos finais.
                                            </p>

                                            <Row>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="id_produto_base" className="form-label">Produto Base</Label>
                                                        <AsyncSelectListControlled<GradeFormFields>
                                                            field="id_produto_base"
                                                            control={control}
                                                            callback={getListProdutos}
                                                            required={required}
                                                            disabled={isEditing}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>

                                            {carregandoDados && (
                                                <div className="text-center py-4">
                                                    <Spinner animation="border" variant="primary" size="sm" />
                                                    <span className="ms-2 text-muted">Carregando dados...</span>
                                                </div>
                                            )}

                                            {dadosCarregados && !carregandoDados && (
                                                <>
                                                    <hr />
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h5 className="mb-0">Combinações Cadastradas</h5>
                                                        <Button
                                                            type="button"
                                                            color="primary"
                                                            onClick={abrirModalNovaCombinacao}
                                                            disabled={partes.length === 0}
                                                        >
                                                            <i className="ri-add-line me-1"></i> Adicionar Combinação
                                                        </Button>
                                                    </div>

                                                    {partes.length === 0 ? (
                                                        <p className="text-muted">
                                                            Nenhuma parte encontrada na composição do produto.
                                                            Configure a composição antes de cadastrar combinações.
                                                        </p>
                                                    ) : combinacoes.length === 0 ? (
                                                        <p className="text-muted">
                                                            Nenhuma combinação cadastrada. Clique em &quot;Adicionar Combinação&quot; para começar.
                                                        </p>
                                                    ) : (
                                                        <div className="table-responsive mb-4">
                                                            <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th>Descrição</th>
                                                                        <th>Partes</th>
                                                                        <th style={{ width: '140px' }}>Quantidade Partes</th>
                                                                        <th style={{ width: '120px' }}>Ações</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {combinacoes.map((combinacao) => (
                                                                        <tr key={String(combinacao.id)}>
                                                                            <td>{combinacao.descricao}</td>
                                                                            <td>{formatarPartesCombinacao(combinacao.partes)}</td>
                                                                            <td>{obterQuantidadePartesCombinacao(combinacao.partes)}</td>
                                                                            <td>
                                                                                <div className="d-flex gap-1">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-sm btn-soft-primary"
                                                                                        onClick={() => abrirModalEditarCombinacao(combinacao)}
                                                                                    >
                                                                                        <i className="ri-edit-line"></i>
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-sm btn-soft-danger"
                                                                                        onClick={() => removerCombinacao(combinacao.id)}
                                                                                    >
                                                                                        <i className="ri-delete-bin-line"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            <hr />
                                            <Row className="mt-4">
                                                <Col md={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary"
                                                            disabled={
                                                                gerando
                                                                || carregandoDados
                                                                || !dadosCarregados
                                                                || combinacoes.length === 0
                                                            }
                                                        >
                                                            {gerando ? 'Gerando...' : 'Gerar Grade'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-soft-success"
                                                            onClick={voltarParaRotaAnterior}
                                                        >
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

            <GradeCombinacaoModal
                isOpen={modalAberto}
                toggle={toggleModal}
                partesDisponiveis={partes}
                combinacaoEdicao={combinacaoEdicao}
                onSalvar={salvarCombinacao}
            />
        </React.Fragment>
    )
}

export default GradeProdutosForm
