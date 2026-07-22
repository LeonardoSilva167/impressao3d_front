import React from 'react'
import { Link } from 'react-router-dom'
import { Alert } from 'reactstrap'
import { montarHrefEtapaFluxo } from './fluxoProducaoConfig'
import { FluxoProducaoQuery, anexarContextoFluxo, estaNoFluxoGuiado } from './fluxoProducaoContext'

interface FluxoProducaoContinuidadeProjetoProps {
    contexto: FluxoProducaoQuery
    projetoId: string | number
    mostrarBanner?: boolean
    mostrarAcoes?: boolean
    alinhamentoAcoes?: 'start' | 'end' | 'between'
    acoesAdicionais?: React.ReactNode
    classNameAcoes?: string
}

const FluxoProducaoContinuidadeProjeto = ({
    contexto,
    projetoId,
    mostrarBanner = false,
    mostrarAcoes = true,
    alinhamentoAcoes = 'end',
    acoesAdicionais,
    classNameAcoes = 'mb-4',
}: FluxoProducaoContinuidadeProjetoProps) => {
    if (!estaNoFluxoGuiado(contexto)) {
        return null
    }

    const contextoComProjeto: FluxoProducaoQuery = {
        ...contexto,
        projeto: String(projetoId),
        fluxo: contexto.fluxo || '1',
    }

    const hrefHubEtapa2 = montarHrefEtapaFluxo(2, contextoComProjeto)
    const hrefCriarVinculo = anexarContextoFluxo(
        '/composicao-produtos/add',
        contextoComProjeto,
        { forcarFluxo: true }
    )

    const justifyClass = alinhamentoAcoes === 'start'
        ? 'justify-content-start'
        : alinhamentoAcoes === 'between'
            ? 'justify-content-between'
            : 'justify-content-end'

    return (
        <>
            {mostrarBanner && (
                <Alert color="info" className="mb-4">
                    <strong>Etapa 2</strong> · Projeto cadastrado. Adicione partes/itens e depois crie o vínculo.
                </Alert>
            )}

            {mostrarAcoes && (
                <div className={`d-flex flex-wrap gap-2 ${justifyClass} ${classNameAcoes}`.trim()}>
                    <Link to={hrefHubEtapa2} className="btn btn-soft-secondary">
                        <i className="ri-guide-line me-1" aria-hidden />
                        Voltar à etapa 2
                    </Link>
                    <Link to={hrefCriarVinculo} className="btn btn-success">
                        <i className="ri-link me-1" aria-hidden />
                        Continuar: criar vínculo
                    </Link>
                    {acoesAdicionais}
                </div>
            )}
        </>
    )
}

export default FluxoProducaoContinuidadeProjeto
