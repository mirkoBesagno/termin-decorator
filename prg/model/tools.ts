
import { Request, Response } from "express";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
export var targetTerminale = { name: 'Terminale' };

export interface IPrintabile {
    PrintMenu(): any
}
export interface IDescrivibile {
    descrizione: string;
    sommario: string;
}

export type TipoParametro = "number" | "text" | "date";

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
export function InizializzaLogbaseIn(req: Request, nomeMetodo?: string): string {
    console.log("InizializzaLogbaseIn - Arrivato in : " + nomeMetodo + "\n"
        + "Data : " + new Date(Date.now()) + "\n"
        + "url : " + req.originalUrl + "\n"
        + "query : " + JSON.stringify(req.query) + "\n"
        + "body : " + JSON.stringify(req.body) + "\n"
        + "header : " + JSON.stringify(req.headers) + "\n"
        + "soket : " + "\n"
        + "local : " + req.socket.localAddress + " : " + req.socket.localPort + "\n"
        + "remote : " + req.socket.remoteAddress + " : " + req.socket.remotePort + "\n"
    );
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
export function InizializzaLogbaseOut(req: Response, nomeMetodo?: string): string {

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
        + "remote : " + t2 + "\n"
    );


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