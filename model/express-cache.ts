
import { Request } from "express";
//import redis from "redis";
import expressRedisCache from "express-redis-cache";

/* 
const RedisServer = require('redis-server'); 
export const redisClient = new RedisServer();
//export const redisClient = redis.createClient(6379, '127.0.0.1');

redisClient.on("error", function (item: any) {
    console.log(item);
});
redisClient.on("ready", function (item: any) {
    console.log(item);
});
redisClient.on("erroconnectr", function (item: any) {
    console.log(item);
});
redisClient.on("end", function (item: any) {
    console.log(item);
});
redisClient.on("warning", function (item: any) {
    console.log(item);
});
export const cacheMiddleware = expressRedisCache({ client: redisClient, expire: 10 });

*/

import crypto from "crypto";

export function CalcolaChiaveMemoryCache(req: Request) {
    const keySHA = 'Besagno'
    const headerTmp = req.headers['authorization'] != undefined ? String(req.headers['authorization']) : JSON.stringify({
        "Aauthorization9X": "10"
    })

    const tmp = '-' + JSON.stringify(req.body) + '-' + headerTmp + '-' + JSON.stringify(req.query) + '-';
    const tmpmd = crypto.createHmac('sha1', keySHA)
        .update(tmp).digest('hex');
    const ritorno = '__express__' + req.url + '__MP__' + tmpmd + '__';
    return ritorno;
}
/* 
export const memoCache = (durationSecondi: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const key = CalcolaChiaveMemoryCache(req);
        const cachedBody = memorycache.get(key)
        if (cachedBody) {
            res.setHeader('Content-Type', 'application/json');
            res.status(cachedBody.stato).send(JSON.parse(cachedBody.body))
            return
        } else {
            (<any>res).sendResponse = res.send;
            res.send = (body: string): any => {
                memorycache.put(key, { body: body, stato: res.statusCode }, durationSecondi * 1000);
                (<any>res).sendResponse(body);
            }
            next();
        }
    }
} */