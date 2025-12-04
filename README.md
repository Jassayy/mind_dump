# 🧠 MindDump — Journal Your Thoughts, Track Your Mood

MindDump is a full-stack journaling and venting application where users can freely **dump their thoughts** via text or voice.  
Based on entries, the app **stores mood patterns** and offers **AI-generated suggestions** for emotional well-being.

This project is built from scratch to deeply learn modern full-stack development concepts including authentication, secure backend APIs, database modeling, and deployment 🌱

---

## ✨ Features

- 🔐 Secure authentication using **JWT** with HTTP-Only Cookies  
- 🛡 Route protection using Next.js Middleware  
- 🗄 Robust database powered by **NeonDB (PostgreSQL) + Prisma**  
- ✍️ Create and save personal mind-dump entries  
- 😊 Automated mood tracking (coming soon)  
- 🤖 AI-powered emotional support & coping suggestions (coming soon)  
- 🎤 Voice input support (coming soon)

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Database | NeonDB (PostgreSQL) |
| ORM | Prisma |
| Auth | JSON Web Tokens (JWT) + bcryptjs |
| Language | TypeScript |
| UI | React / Future UI upgrades |
| Deployment | Vercel (planned) |

---

## 📂 Project Structure

minddump/
├─ app/
│ ├─ api/
│ │ ├─ auth/
│ │ │ ├─ signup/route.ts
│ │ │ ├─ login/route.ts
│ ├─ (UI pages coming soon)
│
├─ prisma/
│ ├─ schema.prisma
│
├─ .env
├─ package.json
├─ README.md



---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```sh
git clone https://github.com/<your-username>/minddump.git
cd minddump

---

npm install
# or yarn install
# or pnpm install

---
