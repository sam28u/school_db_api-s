# 🏫 School Management API

A lightweight REST API built with Node.js and MySQL to manage school data. The main feature of this API is its ability to take a user's current geographic coordinates and return a list of schools sorted by distance (closest to farthest) using the Haversine formula.

## 🚀 Live Demo
- **Live API Base URL:** <https://school-db-api-s.onrender.com>
*(Note: Hosted on Render's free tier, so the first request might take a few seconds to wake up the server!)*

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MySQL (Hosted on Aiven)
- **Validation:** Zod 

## 🗂️ How to Test with Postman
I have included a pre-configured Postman collection so you don't have to manually type out the endpoints. 

1. Download the `School_Management_API.postman_collection.json` file from this repository.
2. Open Postman, click **Import**, and drag the file in.
3. The collection includes saved examples of both endpoints working properly!

---

## 📡 API Endpoints

### 1. Add a New School
**POST** `/addSchool`
Adds a new school to the database.

**Request Body (JSON):**
```json
{
  "name": "Gothapatna Central High",
  "address": "Gothapatna Main Road, Bhubaneswar",
  "latitude": 20.2944,
  "longitude": 85.7433
}
```
**Success Response (201):** Returns a confirmation message and the inserted ID.

### 2. List Schools by Proximity
**GET** `/listSchools?latitude={lat}&longitude={lng}`
Fetches all schools from the database, does the math on the backend, and returns them sorted by how close they are to the provided coordinates.

**Example Request:**
`GET /listSchools?latitude=20.2944&longitude=85.7433`

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Gothapatna Central High",
    "address": "Gothapatna Main Road, Bhubaneswar",
    "latitude": 20.2944,
    "longitude": 85.7433,
    "distance": 0.00 
  },
  {
    "id": 2,
    "name": "Khandagiri Valley Academy",
    "address": "Khandagiri Square, Bhubaneswar",
    "latitude": 20.2594,
    "longitude": 85.7865,
    "distance": 5.92 
  }
]
```

---

## 💻 Local Setup Instructions

If you want to run this project on your own machine, follow these steps:

**1. Clone the repo & install dependencies:**
```
git clone https://github.com/sam28u/school_db_api-s.git
cd school-management-api
npm install
```

**2. Set up your environment variables:**
Create a `.env` file in the root directory and add your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD="your_password"
DB_NAME=school_db
```

**3. Start the server:**
```bash
npm run dev
```
*(The server will start on port 3000 by default).*