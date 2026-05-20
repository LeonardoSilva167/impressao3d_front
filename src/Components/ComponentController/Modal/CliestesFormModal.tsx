import { useForm } from 'react-hook-form';
import { ClientesModel, ClientesDefaultValues } from 'interfaces/Clientes/ClientesInterface';
import { ClientesFormPartial } from 'pages/Pages/Clientes/ClientesForm/ClientesFormPartial';
import { Button, Col, Input, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { useEffect, useState } from 'react';
import { ClientesFormSubmit } from 'pages/Pages/Clientes/ClientesForm/ClientesFormSubmit';

interface ModalClientesProps {
    isOpen: boolean;
    toggle: () => void;
    onSave?: (cliente: ClientesModel) => void;
  } 
export const CliestesFormModal = ({ isOpen, toggle, onSave }: ModalClientesProps) => {

  const { 
    control, 
    handleSubmit,
    reset 
  } = useForm<ClientesModel>({ defaultValues: ClientesDefaultValues });

  
  const onSubmit = async (data: ClientesModel) => {
    const clienteSalvo = await ClientesFormSubmit(data);
    if (onSave) onSave(clienteSalvo);
    toggle();
  };
  
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader className="modal-title" toggle={toggle}>Adicionar Cliente</ModalHeader>
    <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
            <ClientesFormPartial control={control} />
            <Row className='mt-3'>
            <hr />
                <Col lg={12}>
                    <div className="hstack gap-2 justify-content-end">
                        <Button color="light" onClick={toggle}>Fechar</Button>
                        <button type="submit" className="btn btn-primary">Salvar</button>

                    </div>
                </Col>
            </Row>
        </form>
    </ModalBody>
</Modal> 
  );
}
