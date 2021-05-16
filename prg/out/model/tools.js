"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsJsonString = exports.InizializzaLogbaseOut = exports.InizializzaLogbaseIn = exports.targetTerminale = void 0;
exports.targetTerminale = { name: 'Terminale' };
/* @Entity()
export class LogBaseIn {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: "varchar", nullable: true})
    data: string;
    @Column({type: "varchar", nullable: true})
    url: string;
    @Column({type: "varchar", nullable: true})
    query: string;
    @Column({type: "varchar", nullable: true})
    body: string;
    @Column({type: "varchar", nullable: true})
    header: string;
    @Column({type: "varchar", nullable: true})
    header: string;
    @Column({type: "varchar", nullable: true})
    local: string;
    @Column({type: "varchar", nullable: true})
    remote: string;
} */
function InizializzaLogbaseIn(req, nomeMetodo) {
    console.log("InizializzaLogbaseIn - Arrivato in : " + nomeMetodo + "\n"
        + "Data : " + new Date(Date.now()) + "\n"
        + "url : " + req.originalUrl + "\n"
        + "query : " + JSON.stringify(req.query) + "\n"
        + "body : " + JSON.stringify(req.body) + "\n"
        + "header : " + JSON.stringify(req.headers) + "\n"
        + "soket : " + "\n"
        + "local : " + req.socket.localAddress + " : " + req.socket.localPort + "\n"
        + "remote : " + req.socket.remoteAddress + " : " + req.socket.remotePort + "\n");
    const body = req.body;
    const data = new Date(Date.now());
    const header = JSON.parse(JSON.stringify(req.headers));
    const local = req.socket.localAddress + " : " + req.socket.localPort;
    const remote = req.socket.remoteAddress + " : " + req.socket.remotePort;
    const url = req.originalUrl;
    const tmp = "Arrivato in : " + nomeMetodo + "\n"
        + "Data : " + new Date(Date.now()) + "\n"
        + "url : " + req.originalUrl + "\n"
        + "query : " + JSON.stringify(req.query) + "\n"
        + "body : " + JSON.stringify(req.body) + "\n"
        + "header : " + JSON.stringify(req.headers) + "\n"
        + "soket : " + "\n"
        + "local : " + req.socket.localAddress + " : " + req.socket.localPort + "\n"
        + "remote : " + req.socket.remoteAddress + " : " + req.socket.remotePort + "\n";
    return tmp;
}
exports.InizializzaLogbaseIn = InizializzaLogbaseIn;
function InizializzaLogbaseOut(req, nomeMetodo) {
    var t1 = '', t2 = '';
    if (req.socket != undefined) {
        t1 = req.socket.localAddress + " : " + req.socket.localPort;
        t2 = req.socket.remoteAddress + " : " + req.socket.remotePort;
    }
    console.log("InizializzaLogbaseOut - Arrivato in : " + nomeMetodo + "\n"
        + "Data : " + new Date(Date.now()) + "\n"
        + "headersSent : " + req.headersSent + "\n"
        // + "json : " + req.json + "\n"
        // + "send : " + req.send + "\n"
        + "sendDate : " + req.sendDate + "\n"
        + "statusCode : " + req.statusCode + '\n'
        + "statuMessage : " + req.statusMessage + '\n'
        + "soket : " + "\n"
        + "local : " + t1 + "\n"
        + "remote : " + t2 + "\n");
    const tmp = "Arrivato in : " + nomeMetodo + "\n"
        + "Data : " + new Date(Date.now()) + "\n"
        + "headersSent : " + req.headersSent + "\n"
        + "json : " + req.json + "\n"
        + "send : " + req.send + "\n"
        + "sendDate : " + req.sendDate + "\n"
        + "statusCode : " + req.statusCode + '\n'
        + "statuMessage : " + req.statusMessage + '\n'
        + "soket : " + "\n"
        + "local : " + t1 + "\n"
        + "remote : " + t2 + "\n";
    return tmp;
}
exports.InizializzaLogbaseOut = InizializzaLogbaseOut;
function IsJsonString(str) {
    try {
        if (/^[\],:{}\s]*$/.test(str.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            //the json is ok 
            if (typeof str === 'object') {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            //the json is not ok
            return false;
        }
    }
    catch (e) {
        return false;
    }
}
exports.IsJsonString = IsJsonString;
//# sourceMappingURL=tools.js.map