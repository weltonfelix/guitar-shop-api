# GuitarShop API

API para uma loja de instrumentos músicas feita utilizando NestJS

<p align="center">
  <img alt="Github language counter" src="https://img.shields.io/github/languages/count/weltonfelix/guitar-shop-api?color=%2304D361">

  <img alt="Repo size" src="https://img.shields.io/github/repo-size/weltonfelix/guitar-shop-api">

  <a href="https://www.github.com/weltonfelix">
    <img alt="Made by Welton" src="https://img.shields.io/badge/Made%20by-Welton-%2304D361">
  </a>

  <a href="https://github.com/welton/guitar-shop-api/commits/master">
    <img alt="Last commit" src="https://img.shields.io/github/last-commit/weltonfelix/guitar-shop-api">
  </a>

  <a href="https://github.com/weltonfelix/guitar-shop-api/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/weltonfelix/guitar-shop-api">
  </a>

  <a href="https://github.com/weltonfelix/guitar-shop-api/blob/master/LICENSE" target="_blank">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen"/>
  </a>
</p>

## Instalação

Para instalar as dependências do projeto, execute o seguinte comando:

```bash
npm install
```

Após isso, duplique o arquivo `.env.example` e renomeie para `.env`. Nele, você deve preencher as variáveis de ambiente necessárias para o projeto funcionar.

Agora, você deve rodar os seguintes comandos para criar o banco de dados e rodar as migrations.
```bash
npx prisma migrate dev
```

Para popular o banco de dados com dados iniciais, você pode rodar o seguinte comando:
```bash
npx prisma db seed
```

## Executando o Projeto

Para executar o projeto em ambiente de desenvolvimento, use:

```bash
npm run start:dev
```

Agora, você pode acessar a API em `http://localhost:3000`.
A documentação da API está disponível em `http://localhost:3000/api`.

## Testes

Para rodar os testes, execute o seguinte comando:

```bash
npm run test
```


## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/weltonfelix/subtitler/issues).

- Make a fork;
- Create a branch with your feature: `git checkout -b my-feature`;
- Commit changes: `git commit -m 'feat: My new feature'`;
- Make a push to your branch: `git push origin my-feature`.

After merging your receipt request to done, you can delete a branch from yours.

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE) for details.

---

Made with ♥ by Welton Felix :wave: [Get in touch!](mailto:wplf@cin.ufpe.br)
