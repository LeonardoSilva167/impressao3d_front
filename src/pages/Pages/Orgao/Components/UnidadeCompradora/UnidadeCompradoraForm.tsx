import { InputTextControlled } from "Components/ComponentController/Inputs/Text/InputTextControlled";
import { SelectListControlled } from "Components/ComponentController/Selects/Select/SelectListControlled";
import { maxLength, required } from "Components/ComponentController/ValidatorForm/ValidatorForm";
import { UFEstadosSelect } from "helpers/functions_helpers";
import { OrgaoModel, OrgaoUnidadeCompradoraInterface, UnidadeCompradoraModel } from "interfaces/Orgao/OrgaoInterface";
import { SelectOptions } from "interfaces/SystemInterfaces/SelectInterface";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Col, Label } from "reactstrap";

export const UnidadeCompradoraForm = ({ control, register, getValues, setValue, setError, clearErrors, watch, orgao, errors, }: OrgaoUnidadeCompradoraInterface) => {

    const { fields, append, remove, replace } = useFieldArray({
        name: "unidadeCompradora",
        control: control,
    });
    console.log(fields)

    const unidadeCompradoraDefaultValues: UnidadeCompradoraModel = {
        id: null,
        orgaos_id: null,
        codigo: '',
        nome: '',
        uf: null,
        cidade: '',
    }

    const [optUF, setOptUF] = useState<SelectOptions[]>(UFEstadosSelect())


    const handleAppendVariacao = (
        e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e?.preventDefault();
        append({
            ...unidadeCompradoraDefaultValues,
        });
    };

    const handleRemoveVariacao = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        index: number
    ): void => {
        e.preventDefault();
        remove(index);
    };

    return (
        <div className='d-flex flex-column'>
            <div className="row">

                <div className='pt-3 col-md-11'>
                    <button
                        type='button'
                        id="agenda-append-button"
                        className='btn btn-info text-white d-flex align-items-center justify-content-center py-2 px-4'
                        style={{ whiteSpace: 'pre-wrap' }}
                        onClick={(e) => handleAppendVariacao(e)}
                    >
                        <i className='fas fa-plus' /> Unidade Compradora
                    </button>
                </div>
            </div>
            <div className="row mt-5">
                {errors?.root && <div className='text-danger ms-1'><i className='fas fa-warning text-danger' /> {errors?.root?.message}</div>}
                {fields.map((item, index) => {
                    const fieldBase = `unidadeCompradora.${index}`;
                    return (
                        <div key={item.id} className="col-md-12">

                            <div className="ps-3">
                                <div className="d-flex flex-row justify-content-start align-items-start row mt-2">

                                    <Col md={2}>
                                        <div className="mb-3">
                                            <Label htmlFor="codigo" className="form-label">Código</Label>
                                            <InputTextControlled<OrgaoModel>
                                                field={`${fieldBase}.codigo`}
                                                control={control}
                                                required={required}
                                                maxLength={maxLength(6)}
                                                errors={errors && errors[index]?.codigo}

                                            />
                                        </div>
                                    </Col>
                                    <Col md={5}>
                                        <div className="mb-3">
                                            <Label htmlFor="nome" className="form-label">Nome</Label>
                                            <InputTextControlled<OrgaoModel>
                                                field={`${fieldBase}.nome`}
                                                control={control}
                                                required={required}
                                                errors={errors && errors[index]?.nome}

                                            />
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div className="mb-3">
                                            <Label htmlFor="uf" className="form-label">UF</Label>
                                            <SelectListControlled<OrgaoModel>
                                                options={optUF}
                                                required={required}
                                                field={`${fieldBase}.uf`}
                                                control={control}
                                                errors={errors && errors[index]?.uf}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div className="mb-3">
                                            <Label htmlFor="cidade" className="form-label">Cidade</Label>
                                            <InputTextControlled<OrgaoModel>
                                                field={`${fieldBase}.cidade`}
                                                control={control}
                                                required={required}
                                                errors={errors && errors[index]?.cidade}

                                            />
                                        </div>
                                    </Col>
                                    <Col md={1}>
                                        <div className="mb-3">
                                            <button type="button" className='btn btn-danger text-white mt-4' onClick={(e) => handleRemoveVariacao(e, index)}>
                                                <i className="ri-subtract-fill align-middle me-1"></i>
                                            </button>
                                        </div>
                                    </Col>


                                </div>
                            </div>

                        </div>
                    )
                })}

            </div>



        </div>
    );
}
