# 🌸 Guestbook

> A playful guestbook where visitors sign in, see live stats, and get cute reactions from an anime girl.

---

## ✨ Features

- Clickable anime girl with surprise reactions 🐱
- Falling sakura petal animation
- Live stats — total visitors, countries, latest ID
- PostgreSQL-backed visitor storage
- Responsive for desktop & mobile

---

## 🛠 Tech Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | React + TypeScript          |
| Backend  | Node.js + Express           |
| Database | PostgreSQL (via Docker)     |
| Extras   | CORS, dotenv                |

---

## 📁 Project Structure

```
├── client/             # React frontend
├── server/             # Node.js / Express backend
├── docker-compose.yml  # PostgreSQL container
├── .env                # Environment variables (not committed)
├── dev.sh              # Dev helper script
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Docker & Docker Compose

### 1. Clone & install

```bash
git clone https://github.com/Zeini-23025/guestbook.git
cd guestbook
./dev.sh setup        # installs client + server dependencies
```

### 2. Set up environment

```bash
cp .env.example .env
# edit .env with your DB credentials
```

### 3. Start everything

```bash
./dev.sh              # interactive menu
# or
./dev.sh all          # Docker + server + client in one command
```

---

## ⚙️ dev.sh Commands

```bash
./dev.sh all          # Start Docker + server + client
./dev.sh setup        # Install all dependencies

./dev.sh d:up         # docker-compose up -d
./dev.sh d:stop       # Stop all containers
./dev.sh d:logs       # Follow container logs

./dev.sh s:start      # npm start  (server)
./dev.sh s:build      # npm run build (server)

./dev.sh c:run        # npm run dev (client)
./dev.sh c:build      # npm run build (client)
```

---

## 🔑 Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=guestbook
PORT=3001
```

---
