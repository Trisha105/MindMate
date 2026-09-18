#!/usr/bin/env node

/**
 * Chatbot Diagnostics Script
 * Tests OpenAI connection and reports issues
 * 
 * Usage: node scripts/testChatbot.js
 */

import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = {
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
    header: (msg) => console.log(`\n${colors.blue}${msg}${colors.reset}`),
};

async function test() {
    log.header('🔍 MindMate Chatbot Diagnostics');
    console.log('');

    log.header('1. Environment Configuration');
    if (!process.env.OPENAI_API_KEY) {
        log.error('OPENAI_API_KEY not set in .env');
        log.info('Set it with: OPENAI_API_KEY=sk-your-key-here');
        process.exit(1);
    } else {
        const maskedKey = process.env.OPENAI_API_KEY.substring(0, 8) + '...' + process.env.OPENAI_API_KEY.substring(-4);
        log.success(`OPENAI_API_KEY found: ${maskedKey}`);
    }

    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    log.success(`OPENAI_MODEL: ${model}`);
    log.header('2. API Key Validation');
    if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
        log.error('API Key does not start with "sk-"');
        process.exit(1);
    } else log.success('API Key format is valid');

    log.header('3. Testing OpenAI Connection');
    try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
            model,
            messages: [{ role: 'system', content: 'You are a helpful assistant. Respond with exactly: "OpenAI connection successful!"' }, { role: 'user', content: 'Test message' }],
            max_tokens: 50,
        });
        log.success(`OpenAI responded: "${response.choices[0].message.content}"`);
    } catch (error) {
        log.error(`OpenAI connection failed: ${error.message}`);
        process.exit(1);
    }
}

test().catch(err => { log.error(`Unexpected error: ${err.message}`); process.exit(1); });
