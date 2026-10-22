<div align="center">

# TaskHub

**Удобное пространство для планирования задач и отслеживания их выполнения.**

[**Открыть приложение ↗**](https://tasks-hub.vercel.app) · [**Исходный код**](https://github.com/am1rch1k/TaskHub)

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

</div>

## Возможности

- Регистрация и вход в аккаунт.
- Создание, редактирование, выполнение и удаление задач.
- Установка сроков, приоритетов и напоминаний.
- Фильтрация по статусу и приоритету.
- Просмотр задач в интерактивном календаре.

> Напоминания работают в браузере, пока приложение открыто.

## Технологии

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, React Big Calendar.  
**Backend:** Node.js, Express, MongoDB, Mongoose.

## Локальный запуск

```bash
git clone https://github.com/am1rch1k/TaskHub.git
cd TaskHub/front
npm install
npm run dev
```

По умолчанию frontend обращается к развёрнутому API. Чтобы использовать другой сервер, создайте файл `front/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Код сервера находится в `backend/` и использует переменную окружения `MONGO_URI`. Сейчас backend настроен как serverless-обработчик для Vercel; для самостоятельного локального запуска ему потребуется добавить HTTP-listener.

---

<sub>Учебный full-stack проект для практики разработки веб-приложений.</sub>
