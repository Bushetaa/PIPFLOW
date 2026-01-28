// Vercel Serverless Function Entry Point
import '../dist/index.cjs';

export default async function handler(req, res) {
    // The built server already handles all routes
    // This is just a wrapper for Vercel
    const app = require('../dist/index.cjs');
    return app(req, res);
}
