# 📝 Notes App (MERN Stack)

A full-stack Notes Application built using the MERN stack (MongoDB, Express, React, Node.js).  
It allows users to create, manage, and organize notes with a clean and modern UI.

---

## 🚀 Features

- User Authentication (Signup & Login)
- Create, Read, Update, Delete (CRUD) notes
- Search notes
- Add tags to notes
- Pin & favorite notes
- Pagination
- Responsive UI

---

## 🛠️ Tech Stack

### Frontend:
- React.js  
- Tailwind CSS  

### Backend:
- Node.js  
- Express.js  

### Database:
- MongoDB (Mongoose)

---

## 📁 Folder Structure

```
notes-app/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   └── App.jsx
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone <your-repo-link>
cd notes-app
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints

### Auth
- POST /auth/signup  
- POST /auth/login  

### Notes
- GET /notes  
- POST /notes  
- PUT /notes/:id  
- DELETE /notes/:id  

---

## 🎯 Future Improvements

- Image upload in notes  
- Auto-save feature  
- Dark/light mode toggle  
- Better animations  

---

## 👨‍💻 Author

Prince Raj  

---

## ⭐ Note

This project is built for learning and practice purposes.  
Feel free to improve and customize it.