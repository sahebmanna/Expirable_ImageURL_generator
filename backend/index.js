const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const { PORT, JWT_SECRET, MONGO_URI } = require('./config.js');
const cors = require('cors');
require('dotenv').config();
const Image = require('./models/Image.model');

const app = express();
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("application connected to MongoDB dabase!!!");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.log(err);
    });

// Multer Setup (Store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Image
app.post('/upload', upload.single('image'), async(req, res) => {
    try {
        const newImage = new Image({
            name: req.file.originalname,
            data: req.file.buffer,
            contentType: req.file.mimetype,
        });
        const savedImage = await newImage.save();
        res.json({ id: savedImage._id });
    } catch (err) {
        res.status(500).send("Upload failed");
    }
});

// Generate Expirable URL
app.get('/generate-url/:id', (req, res) => {
    const { id } = req.params;
    const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '1m' });

    const protocol = req.protocol;
    const host = req.get('host');
    const expirableUrl = `${protocol}://${host}/view-image/${token}`;
    res.json({ url: expirableUrl });
});

// Serve Image (Check Expiry)
app.get('/view-image/:token', async(req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, JWT_SECRET);
        const image = await Image.findById(decoded.id);

        if (!image) return res.status(404).send("Image not found");

        res.set('Content-Type', image.contentType);
        res.send(image.data);
    } catch (err) {
        res.status(401).send("<h1>URL Expired or Invalid</h1>");
    }
});