import UiContent from "Components/Common/UiContent"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Flatpickr from "react-flatpickr"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
import "flatpickr/dist/themes/material_blue.css"
import AsyncSelect from "react-select/async"
import Select from "react-select"
import {
    Breadcrumb, BreadcrumbItem, Button, ButtonGroup, Card, CardHeader, Col, Label, Row
} from "reactstrap"
import { SelectOptions } from "interfaces/SystemInterfaces/SelectInterface"
import {
    AnaliseComprasPeriodoPreset,
    AnaliseComprasSearch,
} from "interfaces/AnaliseCompras/AnaliseComprasInterface"
import { ItensModel } from "interfaces/Itens/ItensInterface"
import { CategoriasService } from "services/Categorias/CategoriasService"
import { ItensService } from "services/Itens/ItensService"
import { PlataformasCompraService } from "services/PlataformasCompra/PlataformasCompraService"
import {
    calcularPeriodoPorPreset,
    PERIODO_PRESET_OPTIONS,
} from "../hooks/useAnaliseComprasPeriodo"
import "Components/ComponentController/Selects/AsyncSelect/AsyncSelecStyle.css"

const selectStyles = {
    container: (provided: any) => ({ ...provided, width: '100%' }),
    control: (provided: any) => ({ ...provided, width: '100%', minWidth: 0 }),
}

export interface AnaliseComprasFilterProps {
    filters: AnaliseComprasSearch
    onFiltersChange: (filters: AnaliseComprasSearch) => void
}

const mapIdsToOptions = (
    ids: (string | number)[] | null | undefined,
    options: SelectOptions[]
): SelectOptions[] => {
    if (!ids || ids.length === 0) return []

    return ids
        .map((id) => options.find((opt) => String(opt.value) === String(id)))
        .filter((opt): opt is SelectOptions => !!opt)
}

const AnaliseComprasFilter = ({ filters, onFiltersChange }: AnaliseComprasFilterProps) => {
    const plataformasCompraService = new PlataformasCompraService()
    const categoriasService = new CategoriasService()
    const itensService = new ItensService()

    const [plataformas, setPlataformas] = useState<SelectOptions[]>([])
    const [categorias, setCategorias] = useState<SelectOptions[]>([])
    const [itensSelecionados, setItensSelecionados] = useState<SelectOptions[]>([])
    const [periodoRange, setPeriodoRange] = useState<Date[]>(() => {
        if (filters.data_inicio && filters.data_fim) {
            return [new Date(`${filters.data_inicio}T00:00:00`), new Date(`${filters.data_fim}T00:00:00`)]
        }
        return []
    })

    const getLookups = async (): Promise<void> => {
        try {
            const [resPlataformas, resCategorias] = await Promise.all([
                plataformasCompraService.AsyncListPlataformasCompra({}),
                categoriasService.AsyncListCategorias({}),
            ])

            if (resPlataformas) {
                setPlataformas(resPlataformas.map((el) => ({ value: el.id, label: el.descricao || '' })))
            }

            if (resCategorias) {
                setCategorias(resCategorias.map((el) => ({ value: el.id, label: el.descricao || '' })))
            }
        } catch (error) {
            console.error('Erro ao carregar filtros da análise de compras:', error)
        }
    }

    const getListItens = async (inputValue: string): Promise<SelectOptions[]> => {
        if (inputValue.length <= 2) return []

        const listItens = await itensService.AsyncListItens({ palavra_chave: inputValue })

        return (listItens || []).map((item: ItensModel) => ({
            value: item.id,
            label: item.descricao || '',
        }))
    }

    const handlePeriodoPreset = (preset: AnaliseComprasPeriodoPreset) => {
        if (preset === 'personalizado') {
            onFiltersChange({
                ...filters,
                periodo_preset: preset,
            })
            return
        }

        const periodo = calcularPeriodoPorPreset(preset)
        setPeriodoRange([
            new Date(`${periodo.data_inicio}T00:00:00`),
            new Date(`${periodo.data_fim}T00:00:00`),
        ])

        onFiltersChange({
            ...filters,
            ...periodo,
            periodo_preset: preset,
        })
    }

    const handlePeriodoPersonalizado = (dates: Date[]) => {
        setPeriodoRange(dates)

        if (dates.length < 2) return

        const data_inicio = dates[0].toISOString().split('T')[0]
        const data_fim = dates[1].toISOString().split('T')[0]

        onFiltersChange({
            ...filters,
            data_inicio,
            data_fim,
            periodo_preset: 'personalizado',
        })
    }

    const handlePlataformaChange = (selected: SelectOptions[] | null) => {
        onFiltersChange({
            ...filters,
            id_plataforma_compra: selected ? selected.map((item) => String(item.value)) : [],
        })
    }

    const handleCategoriaChange = (selected: SelectOptions[] | null) => {
        onFiltersChange({
            ...filters,
            id_categoria_item: selected ? selected.map((item) => String(item.value)) : [],
        })
    }

    const handleItensChange = (selected: SelectOptions[] | null) => {
        const options = selected ? [...selected] : []
        setItensSelecionados(options)

        onFiltersChange({
            ...filters,
            id_item: options.map((item) => String(item.value)),
        })
    }

    useEffect(() => {
        getLookups()
    }, [])

    useEffect(() => {
        if (!filters.id_item || filters.id_item.length === 0) {
            setItensSelecionados([])
        }
    }, [filters.id_item])

    const plataformasSelecionadas = mapIdsToOptions(filters.id_plataforma_compra, plataformas)
    const categoriasSelecionadas = mapIdsToOptions(filters.id_categoria_item, categorias)

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
                            <h4 className="mb-0">Análise de Compras</h4>
                        </div>
                        <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                            <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                            <BreadcrumbItem><Link to="/compras">Compras</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Análise de Compras</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xl={12}>
                    <Card>
                        <CardHeader>
                            <Row className="align-items-end g-3">
                                <Col xs={12}>
                                    <Label className="form-label mb-2">Período</Label>
                                    <div className="d-flex flex-wrap align-items-center gap-2">
                                        <ButtonGroup>
                                            {PERIODO_PRESET_OPTIONS.map((option) => (
                                                <Button
                                                    key={option.value}
                                                    size="sm"
                                                    color={filters.periodo_preset === option.value ? 'primary' : 'light'}
                                                    onClick={() => handlePeriodoPreset(option.value)}
                                                >
                                                    {option.label}
                                                </Button>
                                            ))}
                                        </ButtonGroup>

                                        {filters.periodo_preset === 'personalizado' && (
                                            <div className="input-group" style={{ maxWidth: '280px' }}>
                                                <Flatpickr
                                                    className="form-control border-0 dash-filter-picker shadow"
                                                    options={{
                                                        mode: 'range',
                                                        dateFormat: 'd/m/Y',
                                                        locale: Portuguese,
                                                    }}
                                                    value={periodoRange}
                                                    onChange={handlePeriodoPersonalizado}
                                                />
                                                <div className="input-group-text bg-primary border-primary text-white">
                                                    <i className="ri-calendar-2-line"></i>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                <Col md={4}>
                                    <Label className="form-label">Plataforma</Label>
                                    <Select
                                        isMulti
                                        isClearable
                                        options={plataformas}
                                        value={plataformasSelecionadas}
                                        onChange={handlePlataformaChange}
                                        placeholder="Todas"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        styles={selectStyles}
                                    />
                                </Col>

                                <Col md={4}>
                                    <Label className="form-label">Categoria</Label>
                                    <Select
                                        isMulti
                                        isClearable
                                        options={categorias}
                                        value={categoriasSelecionadas}
                                        onChange={handleCategoriaChange}
                                        placeholder="Todas"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        styles={selectStyles}
                                    />
                                </Col>

                                <Col md={4}>
                                    <Label className="form-label">Item</Label>
                                    <AsyncSelect
                                        isMulti
                                        isClearable
                                        cacheOptions
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="Digite para buscar..."
                                        loadOptions={getListItens}
                                        getOptionLabel={(option) => option.label || ''}
                                        getOptionValue={(option) => String(option.value)}
                                        value={itensSelecionados}
                                        onChange={handleItensChange}
                                        noOptionsMessage={() => 'Digite ao menos 3 caracteres'}
                                        styles={selectStyles}
                                    />
                                </Col>
                            </Row>
                        </CardHeader>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default AnaliseComprasFilter
