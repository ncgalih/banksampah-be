const authentication = (req, res, next) => {
    const apiKey = req.headers['api-key']; // or another header name you prefer

    if (!apiKey) {
        return res.status(401).json({ error: 'API key is missing' });
    }

    // For demonstration purposes, let's assume the valid API key is "12345"
    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: 'Invalid API key' });
    }
    
    next(); // Call the next middleware or route handler
};