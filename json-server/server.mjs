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

server.use(router);
server.listen(3000, () => {
  console.log('Servidor JSON Server está rodando em http://localhost:3000');
});
