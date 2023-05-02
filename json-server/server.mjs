/* eslint-disable radix */
/* eslint-disable no-console */
/* eslint-disable max-len */
import { json } from 'express';
import jsonServer from 'json-server';
import jwt from 'jsonwebtoken';

const { create, defaults } = jsonServer;
const router = jsonServer.router('./json-db.json');

// Resto do código...

const server = create();
const middlewares = defaults();

server.use(middlewares);
server.use(json());

server.post('/usuarios', (req, res) => {
  const { cpf, senha } = req.body;
  const usuarios = router.db.get('usuarios').value();
  const usuarioAutenticado = usuarios.find(
    (usuario) => usuario.cpf === cpf && usuario.senha === senha,
  );

  if (usuarioAutenticado) {
    // Criar o token de acesso com expiração de 1 hora
    const token = jwt.sign(
      {
        cpf: usuarioAutenticado.cpf,
        tipoUsuario: usuarioAutenticado.tipo,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
      },
      'encomendaDirecionadaAvaliacaoOficial2',
    );

    // Enviar o usuário autenticado juntamente com o token
    res.json({
      token,
      mensagem: 'Autenticação bem-sucedida',
    });
    console.log('AUTENTICADO');
  } else {
    res.json({ mensagem: 'Autenticação não efetuada', deuger: senha });
    console.log(req);
  }
});

server.post('/usuarios/list', (req, res) => {
  const usuarios = router.db.get('usuarios').value();

  // Enviar o usuário autenticado juntamente com o token
  res.json({
    usuarios,
  });
});

server.post('/usuarios/create', (req, res) => {
  const { cpf, senha, tipo } = req.body;
  const usuarios = router.db.get('usuarios').value();
  const usuarioExistente = usuarios.find((usuario) => usuario.cpf === cpf);

  if (usuarioExistente) {
    res.status(400).json({ mensagem: 'CPF já existe na base de dados' });
  } else {
    // Código para criar o novo usuário
    const novoUsuario = {
      id: usuarios.length + 1, // Gera um novo ID baseado no tamanho atual da lista de usuários
      cpf,
      senha,
      tipo,
    };

    // Adicionar o novo usuário à base de dados
    router.db.get('usuarios').push(novoUsuario).write();

    // Responder com sucesso
    res.json({ mensagem: 'Usuário criado com sucesso' });
  }
});

server.put('/usuarios/update/:id', (req, res) => {
  const { id } = req.params;
  const { cpf, senha, tipo } = req.body;

  // Atualizar o usuário com o ID fornecido
  router.db.get('usuarios')
    .find({ id: parseInt(id) })
    .assign({ cpf, senha, tipo })
    .write();

  res.json({ mensagem: 'Usuário atualizado com sucesso' });
});

server.delete('/usuarios/delete/:id', (req, res) => {
  const { id } = req.params;

  // Excluir o usuário com o ID fornecido
  router.db.get('usuarios')
    .remove({ id: parseInt(id) })
    .write();

  res.json({ mensagem: 'Usuário excluído com sucesso' });
});

server.post('/encomendas', (req, res) => {
  const {
    recebedor, coletor, destinatario, dataRcebimento, dataRetirada, identificacao, id,
  } = req.body;
  const encomendas = router.db.get('encomendas').value();
  const encomendasAutenticado = encomendas.find(
    (encomenda) => encomenda.id === id
    && encomenda.recebedor === recebedor
    && encomenda.coletor === coletor
    && encomenda.destinatario === destinatario
    && encomenda.dataRcebimento === dataRcebimento
    && encomenda.dataRetirada === dataRetirada
    && encomenda.identificacao === identificacao,
  );

  if (encomendasAutenticado) {
    // Criar o token de acesso com expiração de 1 hora
    const token = jwt.sign(
      {
        recebedor: encomendasAutenticado.recebedor,
        coletor: encomendasAutenticado.coletor,
        destinatario: encomendasAutenticado.destinatario,
        dataRcebimento: encomendasAutenticado.dataRcebimento,
        dataRetirada: encomendasAutenticado.dataRetirada,
        identificacao: encomendasAutenticado.identificacao,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
      },
      'encomendaDirecionadaAvaliacaoOficial2',
    );

    // Enviar o usuário autenticado juntamente com o token
    res.json({
      token,
      mensagem: 'Autenticação bem-sucedida',
    });
  } else {
    res.json({ mensagem: 'Autenticação não efetuada' });
    console.log(req);
  }
});

server.post('/encomendas/list', (req, res) => {
  const usuarios = router.db.get('encomendas').value();

  // Enviar o usuário autenticado juntamente com o token
  res.json({
    usuarios,
  });
});

server.post('/encomendas/create', (req, res) => {
  const {
    recebedor, coletor, destinatario, dataRcebimento, dataRetirada, identificacao,
  } = req.body;
  const encomendas = router.db.get('encomendas').value();

  // Código para criar o novo usuário
  const novoUsuario = {
    id: encomendas.length + 1, // Gera um novo ID baseado no tamanho atual da lista de usuários
    recebedor,
    coletor,
    destinatario,
    dataRcebimento,
    dataRetirada,
    identificacao,
  };

  // Adicionar o novo usuário à base de dados
  router.db.get('encomendas').push(novoUsuario).write();

  // Responder com sucesso
  res.json({ mensagem: 'Usuário criado com sucesso' });
});

server.put('/encomendas/update/:id', (req, res) => {
  const { id } = req.params;
  const {
    recebedor, coletor, destinatario, dataRcebimento, dataRetirada, identificacao,
  } = req.body;

  // Atualizar a encomenda com o ID fornecido
  router.db.get('encomendas')
    .find({ id: parseInt(id) })
    .assign({
      recebedor, coletor, destinatario, dataRcebimento, dataRetirada, identificacao,
    })
    .write();

  res.json({ mensagem: 'Encomenda atualizada com sucesso' });
});

server.delete('/encomendas/delete/:id', (req, res) => {
  const { id } = req.params;

  // Excluir a encomenda com o ID fornecido
  router.db.get('encomendas')
    .remove({ id: parseInt(id) })
    .write();

  res.json({ mensagem: 'Encomenda excluída com sucesso' });
});

server.post('/apartamentos', (req, res) => {
  const { cpf, identificacao } = req.body;
  const apartamentos = router.db.get('apartamentos').value();
  const apartamentosAutenticado = apartamentos.find(
    (apartamento) => apartamento.cpf === cpf && apartamento.identificacao === identificacao,
  );

  if (apartamentosAutenticado) {
    // Criar o token de acesso com expiração de 1 hora
    const token = jwt.sign(
      {
        cpf: apartamentosAutenticado.cpf,
        identificacao: apartamentosAutenticado.identificacao,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
      },
      'encomendaDirecionadaAvaliacaoOficial2',
    );

    // Enviar o usuário autenticado juntamente com o token
    res.json({
      token,
      mensagem: 'Autenticação bem-sucedida',
    });
    console.log('AUTENTICADO');
  } else {
    res.json({ mensagem: 'Autenticação não efetuada', deuger: identificacao });
    console.log(req);
  }
});

server.post('/apartamentos/list', (req, res) => {
  const apartamentos = router.db.get('apartamentos').value();

  // Enviar o usuário autenticado juntamente com o token
  res.json({
    apartamentos,
  });
});

server.post('/apartamentos/create', (req, res) => {
  const { identificacao, cpf } = req.body;
  const apartamentos = router.db.get('usuarios').value();
  const apartamentosExistente = apartamentos.find(
    (usuario) => usuario.identificacao === identificacao,
  );

  if (apartamentosExistente) {
    res
      .status(400)
      .json({ mensagem: 'Identificacao já existe na base de dados' });
  } else {
    // Código para criar o novo usuário
    const novoUsuario = {
      id: identificacao, // Gera um novo ID baseado no tamanho atual da lista de usuários
      cpf,
      identificacao,
    };

    // Adicionar o novo usuário à base de dados
    router.db.get('apartamentos').push(novoUsuario).write();

    // Responder com sucesso
    res.json({ mensagem: 'Apartamento criado com sucesso' });
  }
});

server.put('/apartamentos/update/:id', (req, res) => {
  const { id } = req.params;
  const { cpf, identificacao } = req.body;

  // Atualizar o apartamento com o ID fornecido
  router.db.get('apartamentos')
    .find({ id: id.toString() })
    .assign({ cpf, identificacao })
    .write();

  res.json({ mensagem: 'Apartamento atualizado com sucesso' });
});

server.delete('/apartamentos/delete/:id', (req, res) => {
  const { id } = req.params;

  // Excluir o apartamento com o ID fornecido
  router.db.get('apartamentos')
    .remove({ id: id.toString() })
    .write();

  res.json({ mensagem: 'Apartamento excluído com sucesso' });
});

server.use(router);
server.listen(3000, () => {
  console.log('Servidor JSON Server está rodando em http://localhost:3000');
});
