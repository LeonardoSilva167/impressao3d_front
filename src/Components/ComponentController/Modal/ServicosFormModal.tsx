import { ServicosDefaultValues, ServicosModel } from "interfaces/Servicos";
import { ServicosFormPartial } from "pages/Pages/Servicos/ServicosForm/ServicosFormPartial";
import { ServicosFormSubmit } from "pages/Pages/Servicos/ServicosForm/ServicosFormSubmit";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";


interface ModalServicosProps {
    isOpen: boolean;
    toggle: () => void;
    onSave?: (Servico: ServicosModel) => void;
  } 

  export const ServicosFormModal = ({ isOpen, toggle, onSave }: ModalServicosProps) => {
    const {
      control,
      handleSubmit,
      register,
      reset,
      formState: { errors },
    } = useForm<ServicosModel>({ defaultValues: ServicosDefaultValues });
    
  
    const onSubmit = async (data: ServicosModel) => {
      const servicoSalvo = await ServicosFormSubmit(data);
      if (onSave) onSave(servicoSalvo);
      toggle();
    };
    
    useEffect(() => {
      if (isOpen) {
        reset();
      }
    }, [isOpen]);

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader className="modal-title" toggle={toggle}>
          Adicionar Servico
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ServicosFormPartial control={control} errors={errors} register={register} />
            <Row className="mt-3">
              <hr />
              <Col lg={12}>
                <div className="hstack gap-2 justify-content-end">
                  <Button color="light" onClick={toggle}>
                    Fechar
                  </Button>
                  <button type="submit" className="btn btn-primary">
                    Salvar
                  </button>
                </div>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>
    );
  };
  