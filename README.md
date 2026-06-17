# 📱 Finance App

Aplicativo mobile desenvolvido em **React Native com Expo** para auxiliar no controle financeiro pessoal, permitindo o gerenciamento de receitas, despesas, saldo, categorias e acompanhamento de cotações de moedas em tempo real.

---

# 👥 Equipe de Desenvolvimento

* João Vítor da Conceição de Almeida
* Deivid Souza dos Santos Oliveira
* Ismael Rodrigues de Oliveira Neto
* André Almeida Gomes Neto
* Valnei Sousa Conceição Filho

---

# 📖 Sobre o Projeto

O **Finance App** foi criado com o objetivo de oferecer uma solução simples, intuitiva e eficiente para o gerenciamento das finanças pessoais.

A aplicação permite que o usuário registre movimentações financeiras, acompanhe seu saldo atualizado, organize despesas por categorias e consulte cotações de moedas estrangeiras, tudo em uma interface moderna e de fácil utilização.

---

# ❗ Problema Resolvido

O controle financeiro ainda é um desafio para muitas pessoas, principalmente quando se trata de:

* Registrar receitas e despesas regularmente;
* Acompanhar a evolução do saldo mensal;
* Organizar gastos por categorias;
* Visualizar informações financeiras de forma clara;
* Monitorar a variação cambial.

O Finance App centraliza essas funcionalidades em uma única aplicação, tornando o gerenciamento financeiro mais acessível e eficiente.

---

# 🎯 Público-Alvo

* Pessoas que desejam controlar melhor seus gastos;
* Usuários que buscam organizar receitas e despesas;
* Estudantes interessados em educação financeira;
* Profissionais que necessitam acompanhar suas finanças pessoais;
* Usuários que monitoram cotações de moedas internacionais.

---

# ✨ Funcionalidades

* ✅ Cadastro de receitas e despesas;
* ✅ Edição e exclusão de transações;
* ✅ Atualização automática do saldo;
* ✅ Organização por categorias;
* ✅ Proteção contra remoção de categorias padrão;
* ✅ Visualização financeira por mês;
* ✅ Consulta de cotações de moedas (USD e EUR);
* ✅ Navegação otimizada com TabBar animada;
* ✅ Armazenamento local dos dados;
* ✅ Interface intuitiva e responsiva.

---

# 🛠️ Tecnologias Utilizadas

| Tecnologia          | Finalidade                     |
| ------------------- | ------------------------------ |
| React Native (Expo) | Desenvolvimento mobile         |
| React Navigation    | Navegação entre telas          |
| Context API         | Gerenciamento de estado global |
| AsyncStorage        | Persistência local de dados    |
| Animated API        | Animações da interface         |
| JavaScript (ES6+)   | Linguagem principal do projeto |

---

# 📂 Estrutura do Projeto

```bash
.
├── App.js
├── index.js
├── package.json
├── package-lock.json
├── app.json
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
│
└── src/
    ├── components/
    │   ├── CategoryPicker.js
    │   ├── CustomButton.js
    │   ├── MonthYearPicker.js
    │   └── TransactionItem.js
    │
    ├── context/
    │   └── FinanceContext.js
    │
    ├── hooks/
    │   └── useTabBarVisibility.js
    │
    ├── navigation/
    │   ├── AnimatedTabBar.js
    │   ├── AppNavigator.js
    │   └── TabNavigator.js
    │
    ├── screens/
    │   ├── AddEditTransactionScreen.js
    │   ├── DashboardScreen.js
    │   ├── ReportsScreen.js
    │   ├── SettingsScreen.js
    │   └── TransactionsScreen.js
    │
    ├── services/
    │   ├── api.js
    │   └── storage.js
    │
    └── utils/
        ├── colors.js
        └── helpers.js
```

---

# 🚀 Como Executar o Projeto

## 1️⃣ Pré-requisitos

Certifique-se de possuir instalado:

* Node.js
* npm ou Yarn
* Expo CLI
* Expo Go (Android/iOS)

---

## 2️⃣ Clonar o Repositório

```bash
git clone <https://github.com/DVD-Souza/FinApp>
cd finance-app
```

---

## 3️⃣ Instalar Dependências

```bash
npm install
```

ou

```bash
yarn install
```

---

## 4️⃣ Executar a Aplicação

```bash
npx expo start
```

---

## 5️⃣ Abrir no Dispositivo

* Escaneie o QR Code utilizando o aplicativo **Expo Go**;
* Ou utilize os atalhos do Expo:

```text
a → Android Emulator
i → iOS Simulator
w → Navegador Web
```

# 🧠 Diferenciais do Projeto

* Interface moderna e amigável;
* Navegação intuitiva;
* Animações suaves para melhor experiência do usuário;
* Arquitetura modular e escalável;
* Código organizado para manutenção e evolução futuras;
* Persistência local para uso contínuo sem necessidade de servidor.

# 🔮 Melhorias Futuras

* Autenticação de usuários;
* Backup em nuvem;
* Integração com APIs bancárias;
* Metas financeiras;
* Notificações e lembretes;
* Exportação de relatórios em PDF.

---

# 📌 Status do Projeto

🟢 Em desenvolvimento ativo

* ✅ Funcional
* ✅ Estruturado
* ✅ Escalável
* ✅ Pronto para novas funcionalidades

---

# 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos e educacionais.
