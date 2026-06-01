# Atracio Chat UI

Frontend React + TypeScript application for the Atracio conversational AI platform.

This application provides a modern user interface that allows users to authenticate through the Atracio backend and interact with the Atracio AI Agent.

---

# Technologies

* React 18
* TypeScript
* Vite
* TanStack Query
* Material UI (MUI)
* React Router DOM
* Fetch API

---

# Architecture

```text
┌──────────────────────────┐
│      React Frontend      │
│        Port 3000         │
│                          │
│ - Login utilisateur      │
│ - Stockage Bearer Token  │
│ - Appels vers AI Agent   │
└─────────────┬────────────┘
              │
              │ Authentication
              ▼
┌──────────────────────────┐
│     Atracio Backend      │
│      demo.prod.com       │
│                          │
│ - User Authentication    │
│ - Authorization          │
│ - Bearer Token Issuing   │
│ - Business Services      │
└─────────────┬────────────┘
              ▲
              │
              │ API Calls with
              │ Bearer Token
              │
┌─────────────┴────────────┐
│     Atracio AI Agent     │
│   Spring AI Standalone   │
│        Port 8080         │
│                          │
│ REST APIs:               │
│ - POST /chat             │
│ - GET  chat/conversations│
│ - DELETE /chat/          │
│     {conversationId}     │
└─────────────▲────────────┘
              │
              │ Requests with
              │ Bearer Token
              ▼
┌──────────────────────────┐
│      React Frontend      │
│        Port 3000         │
└──────────────────────────┘
```

---

# System Overview

The solution is composed of three independent applications:

## 1. Atracio Backend

Responsible for:

* User authentication
* Authorization management
* Bearer token generation
* Business services
* User access validation

The frontend authenticates against the Atracio Backend and receives a Bearer Token.

---

## 2. Atracio AI Agent

A standalone Spring AI application responsible for:

* Conversational AI capabilities
* Conversation management
* Context retention
* Interaction with AI models

### Available APIs

#### Chat

```http
POST /chat
```

Send a user message and receive an AI-generated response.

#### Retrieve Conversations

```http
GET /chat/conversations
```

Returns the list of available conversations.

#### Clear Conversation

```http
DELETE /chat/{conversationId}
```

Deletes a conversation and its associated history.

---

## 3. React Frontend

Provides:

* Login page
* Chat interface
* Conversation history visualization
* Conversation management
* Communication with the AI Agent APIs

---

# Features

## Authentication

* Dedicated login page (`/login`)
* Authentication through Atracio Backend
* Bearer Token retrieval
* Protected routes
* Automatic redirection after successful login
* Automatic logout when session becomes invalid

---

## AI Chat

* Modern conversational interface
* User and assistant message separation
* Conversation history
* Loading indicators during response generation
* Network error handling
* Conversation persistence

---

## Conversation Management

* Retrieve existing conversations
* Continue previous conversations
* Delete conversations
* Maintain context across interactions

---

# Routes

| Route    | Description         |
| -------- | ------------------- |
| `/login` | User authentication |
| `/chat`  | AI chat interface   |

---

# API Communication Flow

## Authentication Flow

```text
Frontend
   │
   ▼
Atracio Backend
   │
   ▼
Bearer Token
```

## Chat Flow

```text
Frontend
   │
   │ Bearer Token
   ▼
Atracio AI Agent
   │
   ▼
AI Response
```

---

# Configuration

## Atracio Backend

Authentication endpoint provided by the Atracio platform.

Example:

```text
https://demo.prod.atracio.com/api/login
```

## Atracio AI Agent

Example:

```text
http://localhost:8080
```

Chat endpoint:

```text
http://localhost:8080/chat
```

Conversations endpoint:

```text
http://localhost:8080/chat/conversations
```

---

# Installation

## Prerequisites

* Node.js 20+
* npm 10+

## Install Dependencies

```bash
npm install
```

---

# Run in Development Mode

```bash
npm run dev
```

Application available at:

```text
http://localhost:3000
```

---

# Bearer Token Management

The frontend first authenticates with the Atracio Backend to obtain a Bearer Token.

This token is then forwarded to the Atracio AI Agent with every secured request.

Example request:

```json
{
  "userMessage": "Show me draft sales orders for ACME",
  "conversationId": "uuid-generated-by-client",
  "tenant": "demo",
  "bearerToken": "eyJ..."
}
```

Authorization validation remains fully managed by the Atracio Backend and associated security services.

---

# User Interface

Material UI (MUI) is used to provide:

* Responsive design
* Consistent theming
* Modern components
* Built-in accessibility
* Desktop and mobile compatibility

---

# Security

* Bearer Token authentication
* Protected routes
* Centralized HTTP error handling
* Backend-side authorization checks
* Automatic session invalidation handling
* Secure communication with the AI Agent

---

# Development Setup

## Full Startup Sequence


### 1. Start Atracio AI Agent

```text
Port 8090
```

### 2. Start Frontend

```bash
npm run dev
```

### 4. Open

```text
http://localhost:3000
```

---

# User Journey

```text
/login
   │
   ▼
Authenticate against Atracio Backend
   │
   ▼
Receive Bearer Token
   │
   ▼
/chat
   │
   ▼
Communicate with Atracio AI Agent
   │
   ▼
Retrieve / Continue / Delete Conversations
```

---

# Author

Atracio Frontend Application for interacting with the Atracio AI Agent built with Spring AI.
