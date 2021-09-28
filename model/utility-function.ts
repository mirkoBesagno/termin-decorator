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
    if (tmp == undefined || tmp == null || tmp.length == 0) {
        console.log("hei che succede!!!");
    }
    console.log("+++++++++++++++++++++++++++++++++ SalvaListaClasseMetaData");
    console.log(ListaTerminaleClasse.nomeMetadataKeyTarget);
    console.log(targetTerminale);
    console.log('----------------------------------------------------');
    Reflect.defineMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, tmp, targetTerminale);

    const tmp2 = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
    console.log(tmp2);
    console.log('222222222222----------------------------------------------------');
}
/**
 * 
 * @returns 
 */
export function GetListaClasseMetaData(temp?:number) {
    console.log("******************** GetListaClasseMetaData");
    console.log(ListaTerminaleClasse.nomeMetadataKeyTarget);
    console.log(targetTerminale);
    console.log('----------------------------------------------------');
    let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
    if (tmp == undefined) {
        tmp = new ListaTerminaleClasse();
    }
    console.log(tmp);
    console.log('111111111111----------------------------------------------------');
    if (temp) {
        console.log('holaaaaaaa');        
    }
    return tmp;
}