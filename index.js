import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import pool from './db.js';

const app = express();
app.use(express.json());
app.use(cors());

const addSchoolSchema = z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    latitude: z.number().min(-90).max(90, "Invalid latitude"),
    longitude: z.number().min(-180).max(180, "Invalid longitude")
});

const listSchoolsSchema = z.object({
    latitude: z.coerce.number().min(-90).max(90, "Invalid latitude"),
    longitude: z.coerce.number().min(-180).max(180, "Invalid longitude")
});

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
}

app.post('/addSchool', async (req, res) => {
    try {
        const validatedData = addSchoolSchema.parse(req.body);
        const query = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;
        const values = [validatedData.name, validatedData.address, validatedData.latitude, validatedData.longitude];
        const [result] = await pool.query(query, values);
        res.status(201).json({ 
            message: "School added successfully", 
            schoolId: result.insertId 
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// --- Temporary Setup API ---
app.get('/init-db', async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS schools (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL,
                latitude FLOAT NOT NULL,
                longitude FLOAT NOT NULL
            )
        `);
        res.status(200).json({ message: "Table 'schools' created successfully in Aiven!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create table", details: error.message });
    }
});

app.get('/listSchools', async (req, res) => {
    try {
        const { latitude: userLat, longitude: userLon } = listSchoolsSchema.parse(req.query);
        const [schools] = await pool.query('SELECT * FROM schools');
        const sortedSchools = schools.map(school => {
            const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
            return { ...school, distance };
        }).sort((a, b) => a.distance - b.distance);
        res.status(200).json(sortedSchools);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get("/" , (req,res) => {
    res.send("Welcome to the School Management API");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});