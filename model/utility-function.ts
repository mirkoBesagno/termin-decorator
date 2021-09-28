import { Request } from "express";
import { ListaTerminaleClasse } from "./classe/lista-classe";
import { ILogbase, targetTerminale } from "./utility";

export function InizializzaLogbaseIn(req: Request, nomeMetodo?: string): ILogbase {

    const params = req.params;
    const body = req.body;
    const data = new Date(Date.now());
    const header = JSON.parse(JSON.stringify(req.headers));
    const local = req.socket.localAddress + " : " + req.socket.localPort;
    const remote = req.socket.remoteAddress + " : " + req.socket.remotePort;
    const url = req.originalUrl;

    /* const tmp = "Arrivato in : " + nomeMetodo + "\n"
        + "Data : " + new Date(Date.now()) + "\n"
        + "url : " + req.originalUrl + "\n"
        + "query : " + JSON.stringify(req.query) + "\n"
        + "body : " + JSON.stringify(req.body) + "\n"
        + "header : " + JSON.stringify(req.headers) + "\n"
        + "soket : " + "\n"
        + "local : " + req.socket.localAddress + " : " + req.socket.localPort + "\n"
        + "remote : " + req.socket.remoteAddress + " : " + req.socket.remotePort + "\n"; */

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

    return tmp;
}

/**
 * 
 * @param tmp 
 */
export function SalvaListaClasseMetaData(tmp: ListaTerminaleClasse) {
    try {
        Reflect.defineMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, tmp, targetTerminale);
        console.log( Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale));
        
    } catch (error) {
        console.log(error);
    }
}
/**
 * 
 * @returns 
 */
export function GetListaClasseMetaData(temp?: number) {
    try {
        let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        if (tmp == undefined) {
            tmp = new ListaTerminaleClasse();
        }
        console.log( Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale));
        return tmp;
    } catch (err) {
        console.log(err);
        return new ListaTerminaleClasse();
    }
}