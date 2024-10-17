const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();
const PORT = 3000;


app.use('/airlines', createProxyMiddleware({ target: 'http://airLine-service:3001', changeOrigin: true }));
app.use('/flights', createProxyMiddleware({ target: 'http://flight-service:3002', changeOrigin: true }));
app.use('/passengers', createProxyMiddleware({ target: 'http://passenger-service:3003', changeOrigin: true }));

app.listen(PORT,()=>{
    console.log(`connected to port ${PORT}`);
})