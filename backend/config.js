require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://MANNA:MANNA@image-cluster.ontjvcy.mongodb.net/?appName=IMAGE-CLUSTER',
    JWT_SECRET: process.env.JWT_SECRET || "your_secret_key"
};