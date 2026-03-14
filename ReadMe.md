
# 💰 BackEnd Ledger
### Secure Banking & Transaction System

[![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

A robust, production-ready banking backend that manages user accounts, handles complex financial transactions using **ACID-compliant sessions**, and maintains an **immutable ledger** for full data integrity.

[Features](#-key-features) · [Tech Stack](#️-tech-stack) · [API Docs](#-api-documentation) · [Quick Start](#-quick-start) · [Environment Variables](#-environment-variables)

</div>

---

## 🌟 Key Features

### 🔐 High-Level Security

| Feature | Description |
|---|---|
| **JWT Authentication** | Secure, stateless auth with `cookie-parser` and header support |
| **Token Blacklisting** | TTL index in MongoDB prevents token reuse after logout |
| **Rate Limiting** | Brute-force protection on Auth and General API routes |
| **Input Validation** | Strict sanitization and validation via `express-validator` |
| **Security Headers** | `Helmet.js` + `mongo-sanitize` guard against XSS and NoSQL injection |

### 💸 Fintech Core

| Feature | Description |
|---|---|
| **Atomic Transactions** | MongoDB Sessions ensure Debit/Credit operations are fully atomic |
| **Event-Sourced Ledger** | Balances computed via Aggregation Pipelines for 100% accuracy |
| **Immutable Ledger** | Schema-level hooks block modification or deletion of any ledger entry |
| **Idempotency** | Unique idempotency keys prevent duplicate transactions from retries |

### 📧 Automated Communications

- **OAuth2 Email Integration** — Secure automated emails for registration confirmations and transaction notifications via Gmail OAuth2.

---

## 🛠️ Tech Stack

```
Runtime      →  Node.js
Framework    →  Express.js v5.x
Database     →  MongoDB  (Mongoose v9.x)
Auth         →  JSON Web Tokens (JWT) · Bcrypt
Security     →  Helmet · Express-Rate-Limit · mongo-sanitize
Email        →  Nodemailer (Gmail OAuth2)
```

---

## 📋 API Documentation

Base URL: `/api`

### 🔑 Authentication — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|:---:|:---|:---|:---:|
| `POST` | `/register` | Register a new user and send welcome email | ❌ |
| `POST` | `/login` | Authenticate user and receive JWT | ❌ |
| `POST` | `/logout` | Blacklist current token and clear cookies | ✅ |

### 🏦 Accounts — `/api/account`

| Method | Endpoint | Description | Auth Required |
|:---:|:---|:---|:---:|
| `POST` | `/create-account` | Create a new account for the logged-in user | ✅ |
| `GET` | `/get-account` | Fetch all accounts belonging to the user | ✅ |
| `GET` | `/get-balance/:accountId` | Get computed balance for a specific account | ✅ |

### 💸 Transactions — `/api/transaction`

| Method | Endpoint | Description | Auth Required |
|:---:|:---|:---|:---:|
| `POST` | `/create-transaction` | Transfer funds between two accounts (ACID compliant) | ✅ |
| `POST` | `/create-initial-funds` | **Admin only:** Inject initial funds into an account | 🔒 System |

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/MuhammadSarimUmer/Banking-Transaction-BackEnd.git
cd Banking-Transaction-BackEnd
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/banking

# Authentication
JWT_SECRET=your_super_secret_key

# Gmail OAuth2
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
GMAIL_USER=your_email@gmail.com
```

> See [Environment Variables](#-environment-variables) for full setup details.

### 4. Start the Server

```bash
# Production
npm start

# Development (with hot-reload)
npm run dev
```

The server will start on `http://localhost:3000` by default.

---

## 🔧 Environment Variables

| Variable | Description | Required |
|---|---|:---:|
| `DB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key for signing JWTs | ✅ |
| `PORT` | Server port (default: `3000`) | ❌ |
| `GMAIL_CLIENT_ID` | Google OAuth2 Client ID | ✅ |
| `GMAIL_CLIENT_SECRET` | Google OAuth2 Client Secret | ✅ |
| `GMAIL_REFRESH_TOKEN` | Google OAuth2 Refresh Token | ✅ |
| `GMAIL_USER` | Gmail address used for sending | ✅ |

---

## 🏗️ Architecture Overview

```
┌─────────────┐     JWT      ┌──────────────────┐
│   Client    │ ──────────▶  │   Express API    │
└─────────────┘              │  (Rate Limited)  │
                             └────────┬─────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
             ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
             │  Auth Route  │  │  Accounts   │  │ Transactions│
             └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
                    │                │                 │
                    └────────────────┼─────────────────┘
                                     │
                              ┌──────▼──────┐
                              │   MongoDB   │
                              │  (Sessions) │
                              └─────────────┘
```

---

## 🔒 Security Model

```
Request ──▶ Rate Limiter ──▶ Helmet Headers ──▶ JWT Verify
               │                                    │
            Block if                          Blacklist Check
           too many                                 │
            requests                         Route Handler
                                                    │
                                             Input Validation
                                          (express-validator)
                                                    │
                                           Mongo Sanitize
                                                    │
                                            Business Logic
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---
