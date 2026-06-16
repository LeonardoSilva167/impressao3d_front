import React, { useCallback, useEffect, useState } from 'react'
import { Container, Spinner } from 'reactstrap'
import { setActiveMenu } from 'helpers/system_helpers'
import {
    AnaliseComprasResponse,
    AnaliseComprasResponseDefault,
    AnaliseComprasSearch,
} from 'interfaces/AnaliseCompras/AnaliseComprasInterface'
import { AnaliseComprasService } from 'services/AnaliseCompras/AnaliseComprasService'
import AnaliseComprasFilter from './AnaliseComprasFilter/AnaliseComprasFilter'
import AnaliseComprasCards from './AnaliseComprasCards/AnaliseComprasCards'
import AnaliseComprasCharts from './AnaliseComprasCharts/AnaliseComprasCharts'
import AnaliseComprasTables from './AnaliseComprasTables/AnaliseComprasTables'
import { buildDefaultAnaliseComprasFilters } from './hooks/useAnaliseComprasPeriodo'

const AnaliseComprasPage = () => {
    const analiseComprasService = new AnaliseComprasService()

    const [display, setDisplay] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [filters, setFilters] = useState<AnaliseComprasSearch>(buildDefaultAnaliseComprasFilters())
    const [data, setData] = useState<AnaliseComprasResponse>(AnaliseComprasResponseDefault)

    const fetchAnalise = useCallback(async (currentFilters: AnaliseComprasSearch) => {
        if (!currentFilters.data_inicio || !currentFilters.data_fim) return

        setLoading(true)

        try {
            const response = await analiseComprasService.getAnaliseCompras(currentFilters)
            setData(response || AnaliseComprasResponseDefault)
        } catch (error) {
            console.error('Erro ao carregar análise de compras:', error)
            setData(AnaliseComprasResponseDefault)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        setActiveMenu('/analise-compras')
    }, [])

    useEffect(() => {
        fetchAnalise(filters)
    }, [filters, fetchAnalise])

    const resumo = data.resumo || AnaliseComprasResponseDefault.resumo || {}
    const possuiDados = !!data.possui_dados

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <AnaliseComprasFilter
                        filters={filters}
                        onFiltersChange={setFilters}
                    />

                    {!display ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <>
                            {loading && (
                                <div className="text-center py-3">
                                    <Spinner animation="border" size="sm" variant="primary" />
                                    <span className="ms-2 text-muted">Atualizando indicadores...</span>
                                </div>
                            )}

                            <AnaliseComprasCards resumo={resumo} possuiDados={possuiDados} />

                            {possuiDados && (
                                <>
                                    <AnaliseComprasCharts
                                        graficoMensal={data.grafico_mensal || []}
                                        graficoCategoria={data.grafico_categoria || []}
                                        graficoPlataforma={data.grafico_plataforma || []}
                                    />

                                    <AnaliseComprasTables
                                        tabelaItens={data.tabela_itens || []}
                                        rankingItens={data.ranking_itens || []}
                                    />
                                </>
                            )}
                        </>
                    )}
                </Container>
            </div>
        </React.Fragment>
    )
}

export default AnaliseComprasPage
