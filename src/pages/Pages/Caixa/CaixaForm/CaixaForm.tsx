import { useLocation } from "react-router-dom";
import { CaixaFormPartial } from "./CaixaFormPartial"
import { useState } from "react";
import { CaixaModel, CaixaModelDefaultValues } from "interfaces/MovimentoCaixa/MovimentoCaixaInterface";
import { SubmitHandler, useForm } from "react-hook-form";
import { CaixaFormSubmit } from "./CaixaFormSubmit";


const CaixaForm = () => {
    const { state } = useLocation()
    
    const [caixa, setCaixa] = useState<CaixaModel>(state ? state.source : CaixaModelDefaultValues)
    const { handleSubmit, control,register, formState: { errors, } } = useForm<CaixaModel>({
        defaultValues: caixa
    })

    const onSubmit: SubmitHandler<CaixaModel> = async (data: any) => {
        try {
            await CaixaFormSubmit(data);
        } catch (error: any) {
            throw error;
        }   
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CaixaFormPartial register={register} caixaAberto={true} />
        </form>
    )
};

export default CaixaForm;