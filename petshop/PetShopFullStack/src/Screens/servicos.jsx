import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Modal,
  Form,
  Table,
  ModalBody,
  FormGroup,
} from "react-bootstrap";
import Api from "../Api.jsx";
import { BsTrash } from "react-icons/bs";
import Header from "../Components/header.jsx";

const Servicos = () => {
  useEffect(() => {
    const getServicos = async () => {
      const responseServicos = await Api.get("/buscarServicos");
      setServicos(responseServicos.data);
    };
    getServicos();
  }, []);

  const [showModal, setShowModal] = useState(false);

  const [servicos, setServicos] = useState([]);

  const [newServiceName, setnewServiceName] = useState("");
  const [NewServicePreco, setNewServicePreco] = useState("");
  const [NewServiceEstoque, setNewServiceEstoque] = useState("");

  const handleModal = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleDeleteProduct = async (id) => {
    console.log("Deletando servico com o id: ", id);

    try {
      const response = await Api.delete(`DeletarServico/${id}`);

      if (response.status === 200) {
        setServicos((prevServicos) =>
          prevServicos.filter((servico) => servico.id !== id)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      newServiceName == null ||
      newServiceName == undefined ||
      newServiceName == ""
    ) {
      alert("nome nao pode ser nulo!");
      return;
    }
    const newService = {
      nome: newServiceName,
      preco: NewServicePreco,
      estoque: NewServiceEstoque
    };

    const response = await Api.post(
      "/NovoServico",
      JSON.stringify(newService),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(response.data.insertId);

    setServicos([
      ...servicos,
      { id: response.data.insertId, nome: newServiceName,preco: NewServicePreco, estoque: NewServiceEstoque },
    ]);

    handleClose();

    setnewServiceName("");
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <Header />
      <h1>Lista de Servicos</h1>

      <Button variant="primary" onClick={handleModal}>
        Cadastrar novo servico
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de novo Servico</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite o Nome do Servico"
                onChange={(e) => setnewServiceName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPreco">
              <Form.Label>Preco</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite o Preco do Servico"
                onChange={(e) => setNewServicePreco(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEstoque">
              <Form.Label>Estoque</Form.Label>
              <Form.Control
                type="number"
                placeholder="Digite o Estoque inical do Servico"
                onChange={(e) => setNewServiceEstoque(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Preco</th>
            <th>Estoque</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {servicos.map((service) => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.nome}</td>
              <td>{service.preco}</td>
              <td>{service.estoque}</td>

              <td>
                <Button
                  onClick={() => {
                    handleDeleteProduct(service.id);
                  }}
                >
                  <BsTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Servicos;