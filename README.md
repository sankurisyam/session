# session

# 🎥 Live Session Web App (MERN + Vite)

A modern **Live Session Management System** built using the **MERN stack (MongoDB, Express, React, Node)** and **Vite**.  
It allows an **Admin** to start a video session by uploading a video and generates a unique session URL for **Students** to join and watch.

---

## 🚀 Features

### 👩‍🏫 Admin Panel
- “Start Session” button to create a new session  
- Upload a video file to start the session  
- Automatically generates:
  - `unique_id` (Session ID)
  - `userurl` (Shareable student link)  
- Video player with:
  - Play / Pause
  - Volume control
  - Fullscreen mode
  - Responsive layout  

### 🧑‍🎓 Student View
- Students can open the session link to join  
- Watch the same uploaded video  
- Full control over video playback  
- Session linked to the same `unique_id`

### 🗄️ Database (MongoDB)
Stores all live sessions with the following fields:
| Field | Type | Description |
|--------|------|-------------|
| id | Auto Increment (or ObjectId) | Unique key |
| type | String | User type (admin/student) |
| unique_id | String | Unique session identifier |
| userurl | String | URL for session access |

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React + Vite + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose) |
| **Video Player** | HTML5 `<video>` element with React |
| **Routing** | React Router v6 |
| **HTTP Client** | Axios |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/sankurisyam/session.git
cd live-session-mern
