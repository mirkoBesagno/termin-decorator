import { Response } from "express";
import { ILogbase, IReturn, targetTerminale } from "../utility";
import { ListaTerminaleMiddleware } from "./lista-metodo";
import { SanificatoreCampo } from "./utility-metodo";

import memorycache from "memory-cache";

export function Rispondi(res: Response, item: IReturn, key?: string, durationSecondi?: number /* , url: string */) {

    res.statusCode = Number.parseInt('' + item.stato);
    res.send(item.body);
    if (key != undefined) {
        const tempo = (durationSecondi ?? 1);
        memorycache.put(key, { body: item.body, stato: res.statusCode }, tempo * 1000);
    }
    /* let key = '__express__' + url;
    memorycache.put(key, body, ) */
}

export function InizializzaLogbaseOut(res: Response, nomeMetodo?: string): ILogbase {

    const params = {};
    const body = {};
    const data = new Date(Date.now());
    const header = res.getHeaders();
    const local = res.socket?.localAddress + " : " + res.socket?.localPort;
    const remote = res.socket?.remoteAddress + " : " + res.socket?.remotePort;
    const url = '';

    const tmp: ILogbase = {
        params: params,
        body: body,
        data: data,
        header: header,
        local: local,
        remote: remote,
        url: url,
        nomeMetodo: nomeMetodo
    };

    /* const tmp = "Arrivato in : " + nomeMetodo + "\n"
        + "Data : " + new Date(Date.now()) + "\n"
        + "headersSent : " + req.headersSent + "\n"
        + "json : " + req.json + "\n"
        + "send : " + req.send + "\n"
        + "sendDate : " + req.sendDate + "\n"
        + "statusCode : " + req.statusCode + '\n'
        + "statuMessage : " + req.statusMessage + '\n'
        + "soket : " + "\n"
        + "local : " + t1 + "\n"
        + "remote : " + t2 + "\n"; */

    return tmp;
}

export function IsJsonString(str: string): boolean {
    try {
        // eslint-disable-next-line no-useless-escape
        if (/^[\],:{}\s]*$/.test(str.replace(/\\["\\\/bfnrtu]/g, '@').
            // eslint-disable-next-line no-useless-escape
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            //the json is ok 
            if (typeof str === 'object') {
                return true;
            } else {
                return false;
            }
        } else {
            //the json is not ok
            return false;
        }
    } catch (e) {
        return false;
    }
}
export function SostituisciRicorsivo(sanific: SanificatoreCampo[], currentNode: any): any {
    // eslint-disable-next-line prefer-const
    for (let attribut in currentNode) {
        if (typeof currentNode[attribut] === 'object') {
            currentNode[attribut] = SostituisciRicorsivo(sanific, currentNode[attribut]);
        }
        else {
            for (let index = 0; index < sanific.length; index++) {
                const element = sanific[index];
                if (attribut == element.campoDaCercare) {
                    currentNode[attribut] = element.valoreFuturo;
                }
            }
        }
        return currentNode;
    }
}

export function ConstruisciErrore(messaggio: any): IReturn {
    return {
        stato: 500,
        body: {
            errore: messaggio
        }
    }
}

export function GetListaMiddlewareMetaData() {
    /* let terminale = TerminaleMetodo.listaMiddleware.CercaConNomeRev(nome)

    if (terminale == undefined) {
        terminale = new TerminaleMetodo(nome, "", nome); 
        TerminaleMetodo.listaMiddleware.AggiungiElemento(terminale);
    }
    return terminale; */


    let tmp: ListaTerminaleMiddleware = Reflect.getMetadata(ListaTerminaleMiddleware.nomeMetadataKeyTarget, targetTerminale);
    if (tmp == undefined) {
        tmp = new ListaTerminaleMiddleware();
    }
    return tmp;
}


export function SalvaListaMiddlewareMetaData(tmp: ListaTerminaleMiddleware) {
    Reflect.defineMetadata(ListaTerminaleMiddleware.nomeMetadataKeyTarget, tmp, targetTerminale);
}