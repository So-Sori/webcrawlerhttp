const express = require("express");
const cors = require("cors");
const corsProxy = require("cors-anywhere");
const app = express();
const PORT = process.env.PORT || 3000;

let corsOptions = {
    origin: '*',
    methods: 'GET',
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.static("public"));

// app.use(cors(corsOptions));
const corsServer  = corsProxy.createServer({
    originWhitelist: [],
    requireHeader: [],
    removeHeaders: ['cookie', 'cookie2']
});

app.use('/proxy', (req, res) => {
    corsServer.emit('request', req, res);
});

app.listen(PORT,()=>{
    console.log(`server running on: http://localhost:${PORT}`);
});