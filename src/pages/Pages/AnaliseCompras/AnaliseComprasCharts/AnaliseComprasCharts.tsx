import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap'
import { getChartColorsArray, formatarParaMoedaSemSimbolo } from 'helpers/functions_helpers'
import { AnaliseComprasGraficoItem } from 'interfaces/AnaliseCompras/AnaliseComprasInterface'

export interface AnaliseComprasChartsProps {
    graficoMensal: AnaliseComprasGraficoItem[]
    graficoCategoria: AnaliseComprasGraficoItem[]
    graficoPlataforma: AnaliseComprasGraficoItem[]
}

const buildDonutChart = (
    titulo: string,
    dados: AnaliseComprasGraficoItem[],
    dataColors: string
) => {
    const labels = dados.map((item) => item.label || '—')
    const series = dados.map((item) => Number(item.valor || 0))
    const colors = getChartColorsArray(dataColors)

    const options: any = {
        labels,
        chart: { height: 333, type: 'donut' },
        legend: { position: 'bottom' },
        stroke: { show: false },
        dataLabels: { dropShadow: { enabled: false } },
        colors,
        tooltip: {
            y: {
                formatter: (valor: number) => `R$ ${formatarParaMoedaSemSimbolo(valor)}`,
            },
        },
    }

    return (
        <Card>
            <CardHeader className="border-0">
                <h4 className="card-title mb-0">{titulo}</h4>
            </CardHeader>
            <CardBody>
                {series.length === 0 || series.every((valor) => valor === 0) ? (
                    <div className="text-center text-muted py-5">Nenhum dado encontrado.</div>
                ) : (
                    <ReactApexChart
                        dir="ltr"
                        options={options}
                        series={series}
                        type="donut"
                        height={333}
                        className="apex-charts"
                    />
                )}
            </CardBody>
        </Card>
    )
}

const AnaliseComprasCharts = ({
    graficoMensal,
    graficoCategoria,
    graficoPlataforma,
}: AnaliseComprasChartsProps) => {
    const categorias = graficoMensal.map((item) => item.label || '')
    const valoresMensais = graficoMensal.map((item) => Number(item.valor || 0))
    const colors = getChartColorsArray('["--vz-primary"]')

    const optionsMensal: any = {
        chart: {
            height: 350,
            type: 'bar',
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '45%',
            },
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: categorias,
            axisTicks: { show: false },
            axisBorder: { show: false },
        },
        colors,
        tooltip: {
            y: {
                formatter: (valor: number) => `R$ ${formatarParaMoedaSemSimbolo(valor)}`,
            },
        },
        yaxis: {
            labels: {
                formatter: (valor: number) => `R$ ${formatarParaMoedaSemSimbolo(valor)}`,
            },
        },
    }

    const seriesMensal = [{ name: 'Compras', data: valoresMensais }]

    return (
        <React.Fragment>
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardHeader className="border-0">
                            <h4 className="card-title mb-0">Evolução Mensal de Compras</h4>
                        </CardHeader>
                        <CardBody>
                            {valoresMensais.length === 0 ? (
                                <div className="text-center text-muted py-5">Nenhum dado encontrado.</div>
                            ) : (
                                <ReactApexChart
                                    dir="ltr"
                                    options={optionsMensal}
                                    series={seriesMensal}
                                    type="bar"
                                    height={350}
                                    className="apex-charts"
                                />
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xl={6}>
                    {buildDonutChart(
                        'Participação por Categoria',
                        graficoCategoria,
                        '["--vz-primary", "--vz-success", "--vz-warning", "--vz-info", "--vz-danger"]'
                    )}
                </Col>
                <Col xl={6}>
                    {buildDonutChart(
                        'Participação por Plataforma',
                        graficoPlataforma,
                        '["--vz-info", "--vz-primary", "--vz-success", "--vz-warning", "--vz-secondary"]'
                    )}
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default AnaliseComprasCharts
