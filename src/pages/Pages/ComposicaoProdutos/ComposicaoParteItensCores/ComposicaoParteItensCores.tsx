import React, { useMemo } from 'react'
import Select from 'react-select'
import { Card, CardBody, Col, Label, Row } from 'reactstrap'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import { ComposicaoItemConfigModel } from 'interfaces/ComposicaoProdutos/ComposicaoProdutosInterface'
import { LookupItem } from 'interfaces/Produtos/ProdutosInterface'
import { mapLookupToOptions } from 'pages/Pages/Produtos/hooks/useProdutos'

const multiSelectStyles = {
    multiValue: (styles: Record<string, unknown>) => ({
        ...styles,
        backgroundColor: '#3762ea',
    }),
    multiValueLabel: (styles: Record<string, unknown>) => ({
        ...styles,
        backgroundColor: '#405189',
        color: 'white',
    }),
    multiValueRemove: (styles: Record<string, unknown>) => ({
        ...styles,
        color: 'white',
        backgroundColor: '#405189',
        ':hover': {
            backgroundColor: '#405189',
            color: 'white',
        },
    }),
}

const idsParaOptions = (ids: number[] | undefined, options: SelectOptions[]): SelectOptions[] => {
    if (!ids || !ids.length) return []
    return ids
        .map((idCor) => options.find((opt) => String(opt.value) === String(idCor)))
        .filter((opt): opt is SelectOptions => Boolean(opt))
}

export type CampoCoresItem = 'cores_primarias' | 'cores_secundarias' | 'cores_terciarias'

export interface ComposicaoParteItensCoresProps {
    nomeParte: string
    itens: ComposicaoItemConfigModel[]
    cores: LookupItem[]
    onCoresChange: (itemIndex: number, campo: CampoCoresItem, ids: number[]) => void
    readOnly?: boolean
}

const ComposicaoParteItensCores = ({
    nomeParte,
    itens,
    cores,
    onCoresChange,
    readOnly = false,
}: ComposicaoParteItensCoresProps) => {
    const coresOptions = useMemo(() => mapLookupToOptions(cores), [cores])

    const handleChange = (
        itemIndex: number,
        campo: CampoCoresItem,
        selected: SelectOptions[] | null
    ) => {
        const ids = (selected || [])
            .map((opt) => Number(opt.value))
            .filter((idCor) => !Number.isNaN(idCor) && idCor > 0)
        onCoresChange(itemIndex, campo, ids)
    }

    if (itens.length === 0) {
        return <p className="text-muted mb-0">Nenhum item encontrado nesta parte.</p>
    }

    return (
        <div>
            <div className="mb-4 p-3 bg-light rounded">
                <div className="fw-semibold mb-2">Parte: {nomeParte}</div>
                <div className="text-muted small mb-2">Itens encontrados:</div>
                <ul className="mb-0 ps-3">
                    {itens.map((item) => (
                        <li key={item.id_projeto_impressao_parte_item != null
                            ? String(item.id_projeto_impressao_parte_item)
                            : item.nome_item}>
                            {item.nome_item || '—'}
                        </li>
                    ))}
                </ul>
            </div>

            {itens.map((item, index) => {
                const tituloItem = item.nome_item || `Item ${index + 1}`

                return (
                    <Card key={item.id_projeto_impressao_parte_item != null
                        ? String(item.id_projeto_impressao_parte_item)
                        : index} className="mb-4 border">
                        <CardBody>
                            <h6 className="mb-3 pb-2 border-bottom">Item: {tituloItem}</h6>
                            <Row>
                                <Col md={4}>
                                    <div className="mb-3">
                                        <Label className="form-label">Cor Primária</Label>
                                        {readOnly ? (
                                            <div>
                                                {idsParaOptions(item.cores_primarias, coresOptions)
                                                    .map((c) => c.label)
                                                    .join(', ') || '—'}
                                            </div>
                                        ) : (
                                            <Select
                                                isMulti
                                                placeholder="Selecione..."
                                                options={coresOptions}
                                                value={idsParaOptions(item.cores_primarias, coresOptions)}
                                                onChange={(selected) => handleChange(
                                                    index,
                                                    'cores_primarias',
                                                    selected as SelectOptions[]
                                                )}
                                                styles={multiSelectStyles}
                                                closeMenuOnSelect={false}
                                                isClearable
                                            />
                                        )}
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-3">
                                        <Label className="form-label">Cor Secundária</Label>
                                        {readOnly ? (
                                            <div>
                                                {idsParaOptions(item.cores_secundarias, coresOptions)
                                                    .map((c) => c.label)
                                                    .join(', ') || '—'}
                                            </div>
                                        ) : (
                                            <Select
                                                isMulti
                                                placeholder="Selecione..."
                                                options={coresOptions}
                                                value={idsParaOptions(item.cores_secundarias, coresOptions)}
                                                onChange={(selected) => handleChange(
                                                    index,
                                                    'cores_secundarias',
                                                    selected as SelectOptions[]
                                                )}
                                                styles={multiSelectStyles}
                                                closeMenuOnSelect={false}
                                                isClearable
                                            />
                                        )}
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-3">
                                        <Label className="form-label">Cor Terciária</Label>
                                        {readOnly ? (
                                            <div>
                                                {idsParaOptions(item.cores_terciarias, coresOptions)
                                                    .map((c) => c.label)
                                                    .join(', ') || '—'}
                                            </div>
                                        ) : (
                                            <Select
                                                isMulti
                                                placeholder="Selecione..."
                                                options={coresOptions}
                                                value={idsParaOptions(item.cores_terciarias, coresOptions)}
                                                onChange={(selected) => handleChange(
                                                    index,
                                                    'cores_terciarias',
                                                    selected as SelectOptions[]
                                                )}
                                                styles={multiSelectStyles}
                                                closeMenuOnSelect={false}
                                                isClearable
                                            />
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                )
            })}
        </div>
    )
}

export default ComposicaoParteItensCores
