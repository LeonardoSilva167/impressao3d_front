import { InputTextControlled } from "Components/ComponentController/Inputs/Text/InputTextControlled";
import { GradeProdutoUnidadesInterface, GradesProdutosDefaultValues, GradesProdutosModel, GradesProdutosUnidadeDefaultValues } from "interfaces/GradesProdutos";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import classnames from "classnames";

import { Card, CardBody, Col, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { SelectListControlled } from "Components/ComponentController/Selects/Select/SelectListControlled";

export const GradeProdutoUnidade = ({ control, register, getValues, setValue, errors, setError, clearErrors,lookups, gradesProdutos, tamanhoList }: GradeProdutoUnidadesInterface) => {
    const { fields, append, remove, update } = useFieldArray({
        name: "grade", control: control, rules: {

        }
    })
    const watch = useWatch({ control, name: 'grade', defaultValue: [] })

    const handleAppendAgenda = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault()
        append(GradesProdutosDefaultValues)
    }

    const handleRemoveAgenda = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number): void => {
        const id = getValues(`tamanhosUnidades.${index}.id`)
        if (id) {
            update(index, { ...getValues(`tamanhosUnidades.${index}`), is_active: 0 })
        } else {
            remove(index)
        }
        e.preventDefault()
    }

    return (

        <>

            <div className='d-flex flex-column'>
                <div className='pt-3'>
                    {!getValues('id') && <button
                        type='button'
                        id="agenda-append-button"
                        className='btn btn-info text-white d-flex align-items-center justify-content-center py-2 px-4'
                        style={{ whiteSpace: 'pre-wrap' }}
                        onClick={(e) => handleAppendAgenda(e)}>
                        <i className="ri-add-line align-middle me-1"></i> Tamanhos
                    </button>}
                </div>
                {fields.map((item, index) => {

                    // let tipoVisitaTecnica = getValues(`agenda.${index}.id_tab_tipo_visita_tecnica`);
                    // let agendaUnidade = item?.id_tab_projetos_agenda_unidade;
                    // let disabledUnidade = (tipoVisitaTecnica == 10 && agendaUnidade !== null) || (tipoVisitaTecnica !== 10 && !!getValues(`agenda.${index}.id`)) || !getValues(`agenda.${index}.is_active`) || isInactived || (tipoVisitaTecnica !== 10);

                    return <div key={item.id} className="d-flex flex-row">
                        {/* <div className="col-md-11">
                            <div className="d-flex flex-row justify-content-between align-items-start pt-3 row">

                                <div className="col-md-4">
                                    <SelectListControlled<GradesProdutosModel>
                                        options={lookups.optTamanhoList}
                                        field={`tamanhosUnidades.${index}.tamanho`}
                                        control={control}
                                    />

                                    {(errors && errors[index].tamanho && errors[index].tamanho.type ) && errors[index].tamanho.type == 'duplicate' &&
                                        <div className="text-danger ps-3">{errors[index].tamanho.message}</div>}
                                </div>
                            </div>

                            <div className='col-md-1 align-self-end d-flex justify-content-center'>
                                {
                                    !getValues(`tamanhosUnidades.${index}.tamanho`) &&
                                    <button type="button" className='btn btn-danger text-white' onClick={(e) => handleRemoveAgenda(e, index)}><i className="ri-subtract-line align-middle me-1"></i></button>
                                }
                            </div>
                        </div> */}
                    </div>
                })}
            </div>
        </>
    );
}
