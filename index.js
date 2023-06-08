const http = require('http');
const app=require("./app");
const server=http.createServer(app);
const{API_PORT}=process.env;
const port = 8000;
server.listen(port,()=>{
    console.log(`listehing at ${port}`);
});

