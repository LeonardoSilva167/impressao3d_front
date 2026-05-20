import { useForm } from "react-hook-form";
import { Modal, ModalHeader, ModalBody, Button, Row, Col } from "reactstrap";
import { CaixaModel, CaixaModelDefaultValues } from "interfaces/MovimentoCaixa/MovimentoCaixaInterface";
import { useEffect, useState } from "react";
import { MovimentoCaixaService } from "services/MovimentoCaixa";
import { CaixaFormSubmit } from "pages/Pages/Caixa/CaixaForm/CaixaFormSubmit";
import { toast } from "react-toastify";
import { CaixaFormPartial } from "pages/Pages/Caixa/CaixaForm/CaixaFormPartial";

interface AbreFechaCaixaModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSave?: (caixa: CaixaModel) => void;
  statusInicialCaixa: boolean; // novo parâmetro vindo do pai
}

export const AbreFechaCaixaModal = ({ isOpen, toggle, onSave, statusInicialCaixa }: AbreFechaCaixaModalProps) => {
  const { handleSubmit, reset, register } = useForm<CaixaModel>({
    defaultValues: CaixaModelDefaultValues,
  });

  const onSubmit = async (data: CaixaModel) => {
    try {
      const result = await CaixaFormSubmit({ ...data, caixa_fechado: statusInicialCaixa });
      toast.success(statusInicialCaixa ? "Caixa fechado com sucesso" : "Caixa aberto com sucesso");
      if (onSave) onSave(result);
      toggle();
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar a operação do caixa");
    }
  };

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} backdrop>
      <ModalHeader toggle={toggle}>Status do Caixa</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CaixaFormPartial register={register} caixaAberto={statusInicialCaixa} />
        </form>
      </ModalBody>
    </Modal>
  );
};