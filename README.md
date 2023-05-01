# IMPORTANTE!!!!
Caso haja problema ao desenvolver, verifique o ícone como "CRLF" no seu visual studio code para transformar em "LF" pois o eslint ira gritar erro por causa disso.

utilize o comando `npm install` para instalar as dependências do projeto

para utilizar o arquivo sever.mjs utilize `node server.mjs`

além de que para rodar o projeto, é necessário utilizar o comando `cd json-server` e depois `npm run dev`

no geral, você irá ter dois terminais abertos, um rodando o `node server.mjs` e o outro rodando o `npm run dev`

# Avaliacao-Oficial-2-EncomendasDirecionada
João, sindico do condomínio morada sinistra, está recebendo várias reclamações dos seus inquilinos. Todas as entregas direcionadas aos inquilinos são entregues na portaria, mas o porteiro não consegue avisar todos os inquilinos sobre suas encomendas e correspondências, com isso, vários inquilinos ficam dias sem poder retirar suas entregas, porque não sabem da existência das mesmas.

Para solucionar esse problema, João contratou a sua equipe para desenvolver um aplicativo que ele considera bem “Simples”. A ideia é criar uma aplicativo onde o inquilino poderá consultar se existe alguma encomenda direcionada a ele.

João solicitou as seguintes funcionalidades:

- Quando o inquilino abrir o aplicativo, o mesmo deverá se identificar informando o seu CPF e o número do seu apartamento.
- Um mesmo inquilino pode ter mais de um apartamento
- Todas as encomendas devem estar associadas ao apartamento e não ao inquilino, ou seja, se o inquilino se identificar como:

```java
cpf: "123.456.789-99"
apartamento: "1234B"
```

> Apenas as encomendas direcionadas a esse apartamento deverão ser exibidas, mesmo que ele tenha outro apartamento em seu nome.
>
- Na visão do Inquilino deve haver uma página para exibir as encomendas que ainda não foram retiradas e uma página de histórico onde será possível ver as encomendas que já foram retiradas.
- Deve haver 3 tipos de usuários: “inquilino”, “porteiro” e “sindico”. Um inquilino não poderá se cadastrar no sistema, apenas os usuários com perfil: “porteiro” ou “sindico” poderão cadastrar novos usuários.

<aside>
💡 A mesma tela de login deve permitir que usuários do tipo **porteiro** e **sindico** se identifiquem na aplicação. Porém ao invés de informar **CPF** e **APARTAMENTO**, eles informarão: **CPF** e **Chave Privada**.

</aside>

## Perfis de acesso

**Porteiro:**

- Pode cadastrar encomendas / correspondências e associa-las a um apartamento que esteja previamente cadastrado no sistema.
- Pode cadastrar, editar e excluir inquilinos / apartamentos
- Pode consultar se há alguma encomenda para determinado inquilino / apartamento

**Sindico:**

- Pode fazer tudo que o usuário do tipo **porteiro** tem permissão
- Pode cadastrar, editar e excluir usuários do tipo **Sindico** e também **Porteiro**

**Inquilino:**

- Pode apenas consultar suas encomendas

## Entidades

- **Encomendas devem possuir:**

    Identificação do item (Ex.: Caixa da Kabum)

    Destinatário (Número do apartamento)

    Coletor (Identificação do usuário que retirou a encomenda)

    Recebedor (Identificação do usuário que recebeu a encomenda da transportadora)

    Data de recebimento

    Data de retirada (deve ser preenchida pelo porteiro ou sindico no momento da retirada)

- **Apartamentos devem possuir:**

    Identificação (Ex.: 1234B)

    CPF do inquilino

- **Usuários devem possuir:**

    CPF do usuário

    Código de acesso (Chave Privada ou Número do apartamento)

    Nome do Inquilino


## Back-end

- O back-end deve ser desenvolvido com o JSON Server e o JSON deve ser enviado junto à aplicação para analise.
