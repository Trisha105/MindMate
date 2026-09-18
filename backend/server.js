import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const validateConfig = () => {
    const requiredVars = {
        'OPENAI_API_KEY': 'OpenAI API Key',
        'MONGO_URI': 'MongoDB Connection URI',
        'FIREBASE_PROJECT_ID': 'Firebase Project ID',
        'FIREBASE_CLIENT_EMAIL': 'Firebase Client Email',
        'FIREBASE_PRIVATE_KEY': 'Firebase Private Key'
    };

    const missingVars = Object.entries(requiredVars).filter(([key]) => !process.env[key]).map(([, label]) => label);
    if (missingVars.length > 0) {
        console.warn('⚠️  WARNING: Missing environment variables:');
        missingVars.forEach(v => console.warn(`  - ${v}`));
        console.warn('\n📝 See .env.example for setup instructions');
    }
    if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
        console.warn('⚠️  WARNING: Invalid OpenAI API Key format!');
    }
    console.log('✅ Environment variables validated');
};

validateConfig();
connectDB();

const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📝 OpenAI Model: ${process.env.OPENAI_MODEL || 'gpt-3.5-turbo'}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
