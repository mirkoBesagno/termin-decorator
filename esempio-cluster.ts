


import express, { Request, Response } from "express";
import httpProxy from "http-proxy";
import http from "http";

class VAR {
    static TTT = false;
}

const server1 = express();
const server2 = express();
const server3 = express();

server1.get('/ciao', function (req: Request, res: Response) {
    res.send("Ciao, sono il server 1");
})

server2.get('/ciao', function (req: Request, res: Response) {
    res.send("Ciao, sono il server 2");
})

let t = false;
server3.all('*', function (req: Request, res: Response) {
    if (t) res.redirect('http://localhost:3001' + req.originalUrl);
    else res.redirect('http://localhost:3002' + req.originalUrl);
    t = !t;
});

server1.listen(3001);
server2.listen(3002);
server2.listen(3003);
server3.listen(3300);

const proxy = httpProxy.createProxyServer();
//httpProxy.createProxyServer({ target: 'http://localhost:3001' }).listen(3333);

const server = http.createServer(function (req, res) {
    // You can define here your custom logic to handle the request
    // and then proxy the request.
    VAR.TTT = !VAR.TTT;

    if (VAR.TTT) res.setHeader("proxy", "->http://localhost:3001");
    else res.setHeader("proxy", "->http://localhost:3002");

    if (VAR.TTT) proxy.web(req, res, { target: 'http://localhost:3001' });
    else proxy.web(req, res, { target: 'http://localhost:3002' });
});

server.listen(3333);

console.log("FINITO!");
