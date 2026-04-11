# Sentra — Mood Tracking Web App

Sentra is a web-based mood tracking application designed to help users reflect on their daily emotions, identify patterns, and build healthier habits over time.

---

## Features

- **Authentication System**  
  Secure login & registration using Supabase Auth.

- **Daily Mood Logging**  
  Users can record their mood and daily experiences.

- **Mood History Tracking**  
  View past moods and reflect on emotional patterns.

- **Dashboard Overview**  
  Simple interface to monitor emotional trends.

- **Self-Improvement Focus**  
  Encourages users to build healthier habits through awareness.

---

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js
- **Database:** Supabase
- **Routing:** React Router
- **Styling:** Bootstrap + Custom CSS

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/syakirahh8/sentra-database.git
cd sentra-database
```

### 2. Run Back-End Server
```bash
cd backend
node index.js
```

### 3. Setup environment variables
Create a .env file inside the frontend folder:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
### 4. Run Front-End Server
```bash
cd frontend
npm install
```

### 5. Run the App
```bash
cd frontend
npm run dev
```

### Deployment
You can deploy this project easily using **Vercel**:

1. Import this repository to Vercel
2. Set Root Directory to:
```
frontend
```
3. Add environment variables in Vercel dashboard
4. Deploy

### Project Structure
```
sentra-database/
│
├── backend/
│ ├── config/
│ │ └── supabaseClient.js
│ ├── controllers/
│ │ ├── authController.js
│ │ └── moodController.js
│ ├── middleware/
│ │ └── authMiddleware.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ └── moodRoutes.js
│ ├── index.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── assets/
│ │ ├── home.jsx
│ │ ├── login.jsx
│ │ ├── dashboard.jsx
│ │ └── app.jsx
│ └── package.json
│
└── README.md
```

### Purpose
Sentra is built to help users:

- Reflect on daily emotions
- Recognize mood patterns
- Improve mental well-being through simple daily tracking

### Future Improvements
- Mood analytics & charts
- Daily streak system
- AI-based mood insights
- Improve mobile responsiveness

### Authors
Developed by **CC26-PS052 Team**

Members:
1. CFS211D6Y056 – Ahmad Raffael Fauzan
2. CFS211D6X071 – Nisrina Asad Alkatiri
3. CFS211D6X074 – Azka Syakirah
4. CFS211D6X072 – Najla Nafisah
5. CFS211D6X116 – Fiorenza Kinanti Prashanda
6. CFS211D6X070 – Tanzani Akasyah
