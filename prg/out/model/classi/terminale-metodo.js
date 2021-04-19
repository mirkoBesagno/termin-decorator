"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MPDecMet = exports.MPDecMetodo = exports.MPDecoratoreMetodo = exports.MPMetodo = exports.MPM = exports.MPMetRev = exports.mpDecMet = exports.mpDecMetodo = exports.mpDecoratoreMetodo = exports.mpMetodo = exports.mpM = exports.mpMet = exports.mpMetRev = exports.mpAddMiddle = exports.mpAddHelmet = exports.mpAddCors = exports.CheckMetodoMetaData = exports.TerminaleMetodo = void 0;
const tools_1 = require("../tools");
const terminale_classe_1 = require("./terminale-classe");
const terminale_parametro_1 = require("./terminale-parametro");
const helmet_1 = __importDefault(require("helmet"));
const superagent_1 = __importDefault(require("superagent"));
const lista_terminale_metodo_1 = require("../liste/lista-terminale-metodo");
const lista_terminale_parametro_1 = require("../liste/lista-terminale-parametro");
const cors_1 = __importDefault(require("cors"));
class TerminaleMetodo {
    constructor(nome, path, classePath) {
        this.classePath = '';
        this.middleware = [];
        this.listaParametri = new lista_terminale_parametro_1.ListaTerminaleParametro();
        this.nome = nome;
        this.path = path;
        this.classePath = classePath;
        this.tipo = 'get';
        this.pathGlobal = '';
        this.tipoInterazione = "rotta";
        this.descrizione = "";
        this.sommario = "";
        //this.listaRotteGeneraChiavi = [];
    }
    PrintMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < this.listaParametri.length; index++) {
                const element = this.listaParametri[index];
                element.PrintMenu();
            }
        });
    }
    PrintCredenziali(pathRoot) {
        const tab = '\t\t\t';
        let parametri = "";
        console.log(tab + 'TerminaleMetodo' + '->' + 'PrintCredenziali');
        console.log(tab + this.nome + ' | ' + this.path + ' ;');
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            parametri = parametri + element.PrintParametro();
        }
        if (pathRoot != undefined)
            console.log(tab + this.nome + ' | ' + '/' + pathRoot + '/' + this.path + '  |  ' + parametri);
        else
            console.log(tab + this.nome + ' | ' + "/" + this.path + '  |  ' + parametri);
        console.log(this.pathGlobal);
    }
    PrintStamp() {
        let parametri = "";
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            parametri = parametri + element.PrintParametro();
        }
        const tmp = this.nome + ' | ' + '/' + this.pathGlobal + '/' + this.path + '  |  ' + parametri;
        //console.log(tmp);
        return tmp;
    }
    ConfiguraRotta(rotte, pathglobal) {
        this.pathGlobal = pathglobal + '/' + this.path;
        const middlew = [];
        this.middleware.forEach(element => {
            if (element instanceof TerminaleMetodo) {
                const listaMidd = lista_terminale_metodo_1.GetListaMiddlewareMetaData();
                const midd = listaMidd.CercaConNomeSeNoAggiungi(element.nome.toString());
                middlew.push(midd.ConvertiInMiddleare());
            }
        });
        if (this.metodoAvviabile != undefined) {
            var corsOptions = {};
            switch (this.tipo) {
                case 'get':
                    this.metodoAvviabile.body;
                    /* const options: cors.CorsOptions = {
                        allowedHeaders: [
                          'Origin',
                          'X-Requested-With',
                          'Content-Type',
                          'Accept',
                          'X-Access-Token',
                        ],
                        credentials: true,
                        methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
                        origin: API_URL,
                        preflightContinue: false,
                      }; */
                    corsOptions = {
                        methods: "GET"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet_1.default();
                    }
                    if (this.cors == undefined) {
                        this.cors == cors_1.default(corsOptions);
                    }
                    rotte.get("/" + this.path.toString(), cors_1.default(this.cors), helmet_1.default(this.helmet), middlew, (req, res) => __awaiter(this, void 0, void 0, function* () {
                        console.log('Risposta a chiamata : ' + this.pathGlobal);
                        this.InizializzaLogbaseIn(req, this.nome.toString());
                        const tmp = yield this.Esegui(req);
                        res.status(tmp.stato).send(tmp.body);
                        this.InizializzaLogbaseOut(res, this.nome.toString());
                        return res;
                    }));
                    break;
                case 'post':
                    corsOptions = {
                        methods: "POST"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet_1.default();
                    }
                    if (this.cors == undefined) {
                        this.cors == cors_1.default(corsOptions);
                    }
                    this.metodoAvviabile.body;
                    rotte.post("/" + this.path.toString(), cors_1.default(this.cors), helmet_1.default(this.helmet), middlew, (req, res) => __awaiter(this, void 0, void 0, function* () {
                        console.log('Risposta a chiamata : ' + this.pathGlobal);
                        /* const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                        const tmp = this.metodoAvviabile.apply(this, parametri); */
                        this.InizializzaLogbaseIn(req, this.nome.toString());
                        const tmp = yield this.Esegui(req);
                        res.status(tmp.stato).send(tmp.body);
                        this.InizializzaLogbaseOut(res, this.nome.toString());
                        return res;
                    }));
                    break;
                case 'delete':
                    this.metodoAvviabile.body;
                    corsOptions = {
                        methods: "DELETE"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet_1.default();
                    }
                    if (this.cors == undefined) {
                        this.cors == cors_1.default(corsOptions);
                    }
                    rotte.delete("/" + this.path.toString(), cors_1.default(this.cors), helmet_1.default(this.helmet), middlew, (req, res) => __awaiter(this, void 0, void 0, function* () {
                        console.log('Risposta a chiamata : ' + this.pathGlobal);
                        /* const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                        const tmp = this.metodoAvviabile.apply(this, parametri); */
                        this.InizializzaLogbaseIn(req, this.nome.toString());
                        const tmp = yield this.Esegui(req);
                        res.status(tmp.stato).send(tmp.body);
                        this.InizializzaLogbaseOut(res, this.nome.toString());
                        return res;
                    }));
                    break;
                case 'patch':
                    corsOptions = {
                        methods: "PATCH"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet_1.default();
                    }
                    if (this.cors == undefined) {
                        this.cors == cors_1.default(corsOptions);
                    }
                    this.metodoAvviabile.body;
                    rotte.patch("/" + this.path.toString(), cors_1.default(this.cors), helmet_1.default(this.helmet), middlew, (req, res) => __awaiter(this, void 0, void 0, function* () {
                        console.log('Risposta a chiamata : ' + this.pathGlobal);
                        /* const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                        const tmp = this.metodoAvviabile.apply(this, parametri); */
                        this.InizializzaLogbaseIn(req, this.nome.toString());
                        const tmp = yield this.Esegui(req);
                        res.status(tmp.stato).send(tmp.body);
                        this.InizializzaLogbaseOut(res, this.nome.toString());
                        return res;
                    }));
                    break;
                case 'purge':
                    corsOptions = {
                        methods: "PURGE"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet_1.default();
                    }
                    if (this.cors == undefined) {
                        this.cors == cors_1.default(corsOptions);
                    }
                    this.metodoAvviabile.body;
                    rotte.purge("/" + this.path.toString(), cors_1.default(this.cors), helmet_1.default(this.helmet), middlew, (req, res) => __awaiter(this, void 0, void 0, function* () {
                        console.log('Risposta a chiamata : ' + this.pathGlobal);
                        /* const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                        const tmp = this.metodoAvviabile.apply(this, parametri); */
                        this.InizializzaLogbaseIn(req, this.nome.toString());
                        const tmp = yield this.Esegui(req);
                        res.status(tmp.stato).send(tmp.body);
                        this.InizializzaLogbaseOut(res, this.nome.toString());
                        return res;
                    }));
                    break;
                case 'put':
                    corsOptions = {
                        methods: "PUT"
                    };
                    if (this.helmet == undefined) {
                        this.helmet = helmet_1.default();
                    }
                    if (this.cors == undefined) {
                        this.cors == cors_1.default(corsOptions);
                    }
                    this.metodoAvviabile.body;
                    rotte.put("/" + this.path.toString(), cors_1.default(this.cors), helmet_1.default(this.helmet), middlew, (req, res) => __awaiter(this, void 0, void 0, function* () {
                        console.log('Risposta a chiamata : ' + this.pathGlobal);
                        /* const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                        const tmp = this.metodoAvviabile.apply(this, parametri); */
                        this.InizializzaLogbaseIn(req, this.nome.toString());
                        const tmp = yield this.Esegui(req);
                        res.status(tmp.stato).send(tmp.body);
                        this.InizializzaLogbaseOut(res, this.nome.toString());
                        return res;
                    }));
                    break;
                default:
                    break;
            }
        }
        return rotte;
    }
    ChiamaLaRotta(headerpath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let body = "";
                let query = "";
                let header = "";
                for (let index = 0; index < this.middleware.length; index++) {
                    const element = this.middleware[index];
                    if (element instanceof TerminaleMetodo) {
                        const listaMidd = lista_terminale_metodo_1.GetListaMiddlewareMetaData();
                        const midd = listaMidd.CercaConNomeSeNoAggiungi(element.nome.toString());
                        const rit = yield midd.listaParametri.SoddisfaParamtri();
                        if (rit.body != "") {
                            if (body != "") {
                                body = body + ", " + rit.body;
                            }
                            else {
                                body = rit.body;
                            }
                        }
                        if (rit.query != "") {
                            if (query != "") {
                                query = query + ", " + rit.query;
                            }
                            else
                                query = rit.query;
                        }
                        if (rit.header != "") {
                            if (header != "") {
                                header = header + ", " + rit.header;
                            }
                            else
                                header = rit.header;
                        }
                        if (index + 1 >= this.middleware.length) {
                            const tmp = yield this.MetSpalla(body, query, header, headerpath);
                            return tmp;
                        }
                    }
                }
            }
            catch (error) {
                throw new Error("Errore :" + error);
            }
        });
    }
    MetSpalla(body, query, header, headerpath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (headerpath == undefined)
                    headerpath = "http://localhost:3000";
                console.log('chiamata per : ' + headerpath + this.pathGlobal + ' | Verbo: ' + this.tipo);
                let parametri = yield this.listaParametri.SoddisfaParamtri();
                if (parametri.body != "") {
                    if (body != "") {
                        body = body + ", " + parametri.body;
                    }
                    else {
                        body = parametri.body;
                    }
                }
                if (parametri.query != "") {
                    if (query != "") {
                        query = query + ", " + parametri.query;
                    }
                    else
                        query = parametri.query;
                }
                if (parametri.header != "") {
                    if (header != "") {
                        header = header + ", " + parametri.header;
                    }
                    else
                        header = parametri.header;
                }
                let ritorno;
                if (this.tipo) {
                    switch (this.tipo) {
                        case 'get':
                            try {
                                ritorno = yield superagent_1.default
                                    .get(headerpath + this.pathGlobal)
                                    .query(JSON.parse('{ ' + query + ' }'))
                                    .send(JSON.parse('{ ' + body + ' }'))
                                    .set(JSON.parse('{ ' + header + ' }'))
                                    .set('accept', 'json');
                                if (ritorno) {
                                    return ritorno.body;
                                }
                                else {
                                    return '';
                                }
                            }
                            catch (error) {
                                console.log(error);
                                throw new Error("Errore:" + error);
                            }
                            break;
                        case 'post':
                            try {
                                ritorno = yield superagent_1.default
                                    .post(headerpath + this.pathGlobal)
                                    .query(JSON.parse('{ ' + query + ' }'))
                                    .send(JSON.parse('{ ' + body + ' }'))
                                    .set(JSON.parse('{ ' + header + ' }'))
                                    .set('accept', 'json');
                                if (ritorno) {
                                    return ritorno.body;
                                }
                                else {
                                    return '';
                                }
                            }
                            catch (error) {
                                console.log(error);
                                throw new Error("Errore:" + error);
                            }
                            break;
                        case 'purge':
                            try {
                                ritorno = yield superagent_1.default
                                    .purge(headerpath + this.pathGlobal)
                                    .query(JSON.parse('{ ' + query + ' }'))
                                    .send(JSON.parse('{ ' + body + ' }'))
                                    .set(JSON.parse('{ ' + header + ' }'))
                                    .set('accept', 'json');
                                if (ritorno) {
                                    return ritorno.body;
                                }
                                else {
                                    return '';
                                }
                            }
                            catch (error) {
                                console.log(error);
                                throw new Error("Errore:" + error);
                            }
                            break;
                        case 'patch':
                            try {
                                ritorno = yield superagent_1.default
                                    .patch(headerpath + this.pathGlobal)
                                    .query(JSON.parse('{ ' + query + ' }'))
                                    .send(JSON.parse('{ ' + body + ' }'))
                                    .set(JSON.parse('{ ' + header + ' }'))
                                    .set('accept', 'json');
                                if (ritorno) {
                                    return ritorno.body;
                                }
                                else {
                                    return '';
                                }
                            }
                            catch (error) {
                                console.log(error);
                                throw new Error("Errore:" + error);
                            }
                            break;
                        case 'delete':
                            try {
                                ritorno = yield superagent_1.default
                                    .delete(headerpath + this.pathGlobal)
                                    .query(JSON.parse('{ ' + query + ' }'))
                                    .send(JSON.parse('{ ' + body + ' }'))
                                    .set(JSON.parse('{ ' + header + ' }'))
                                    .set('accept', 'json');
                                if (ritorno) {
                                    return ritorno.body;
                                }
                                else {
                                    return '';
                                }
                            }
                            catch (error) {
                                console.log(error);
                                throw new Error("Errore:" + error);
                            }
                            break;
                        default:
                            return '';
                            break;
                    }
                }
                else {
                    return '';
                }
                /* if (ritorno) {
                    ritorno?.body;
                    return ritorno.body;
                } else {
                    return undefined;
                } */
            }
            catch (error) {
                throw new Error("Errore:" + error);
            }
        });
    }
    /* async RecuperaChiave(): Promise<IResponse> {
        try {
            console.log("La rotta è protetta, sono state trovate delle funzioni che potrebbero sbloccarla, scegli:");
            for (let index = 0; index < this.listaRotteGeneraChiavi.length; index++) {
                const element = this.listaRotteGeneraChiavi[index];
                console.log(index + ': ' + element.nome);
            }
            const tmp = await chiedi({
                message: 'Scegli: ',
                type: 'number',
                name: 'scelta'
            });
            const ritorno = await this.listaRotteGeneraChiavi[tmp.scelta].ChiamaLaRotta();
            let tmp2: IResponse = { body: '' };
            if (ritorno) {
                tmp2.body = ritorno.body;
            }
            return tmp2;
        } catch (error) {
            return { body: '' };
        }
    } */
    CercaParametroSeNoAggiungi(nome, parameterIndex, tipoParametro, posizione) {
        const tmp = new terminale_parametro_1.TerminaleParametro(nome, tipoParametro, posizione, parameterIndex);
        this.listaParametri.push(tmp); //.lista.push({ propertyKey: propertyKey, Metodo: target });
        return tmp;
    }
    Esegui(req) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Risposta a chiamata : ' + this.pathGlobal);
            const parametri = this.listaParametri.EstraiParametriDaRequest(req);
            let tmp;
            try {
                tmp = this.metodoAvviabile.apply(this, parametri);
            }
            catch (error) {
                console.log("Errore : \n" + error);
                tmp = {
                    body: { "Errore Interno filtrato ": 'internal error!!!!' },
                    stato: 500
                };
            }
            return tmp;
        });
    }
    InizializzaLogbaseIn(req, nomeMetodo) {
        console.log("Arrivato in : " + nomeMetodo + "\n"
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
    InizializzaLogbaseOut(req, nomeMetodo) {
        var t1 = '', t2 = '';
        if (req.socket != undefined) {
            t1 = req.socket.localAddress + " : " + req.socket.localPort;
            t2 = req.socket.remoteAddress + " : " + req.socket.remotePort;
        }
        console.log("Arrivato in : " + nomeMetodo + "\n"
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
    ConvertiInMiddleare() {
        return (req, res, nex) => __awaiter(this, void 0, void 0, function* () {
            const tmp = yield this.Esegui(req);
            if (tmp.stato >= 300) {
                throw new Error("Errore : " + tmp.body);
            }
            else {
                return nex;
            }
        });
    }
    SettaSwagger() {
        let ritorno = `"${this.pathGlobal}": {
            "${this.tipo}": {
                "summary": "${this.sommario}",
                "description": "${this.descrizione}",                
                "parameters": [`;
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = this.listaParametri[index];
            const tt = element.SettaSwagger();
            if (index == 0 && index + 1 != this.listaParametri.length) {
                ritorno = ritorno + ', ';
            }
            if (index + 1 == this.listaParametri.length) {
                ritorno = ritorno + ' }';
            }
        }
        ritorno = ritorno + ` 
                ],
                "responses": {
                    "200":{
                        "description":"ok"
                    }
                },
            },
        },`;
        return ritorno;
    }
}
exports.TerminaleMetodo = TerminaleMetodo;
TerminaleMetodo.nomeMetadataKeyTarget = "MetodoTerminaleTarget";
function CheckMetodoMetaData(nomeMetodo, classe) {
    let tmp = Reflect.getMetadata(lista_terminale_metodo_1.ListaTerminaleMetodo.nomeMetadataKeyTarget, tools_1.targetTerminale); // vado a prendere la struttura legata alle funzioni
    if (tmp == undefined) { //se non c'è 
        tmp = new lista_terminale_metodo_1.ListaTerminaleMetodo(classe.rotte); //lo creo
        Reflect.defineMetadata(lista_terminale_metodo_1.ListaTerminaleMetodo.nomeMetadataKeyTarget, tmp, tools_1.targetTerminale); //e lo aggiungo a i metadata
    }
    let terminale = tmp.CercaConNome(nomeMetodo, classe.path); //cerca la mia funzione
    if (terminale == undefined) /* se non c'è */ {
        terminale = new TerminaleMetodo(nomeMetodo, "", classe.nome); // creo la funzione
    }
    return terminale;
}
exports.CheckMetodoMetaData = CheckMetodoMetaData;
function decoratoreMetodo(parametri) {
    return function (target, propertyKey, descriptor) {
        const list = terminale_classe_1.GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.metodoAvviabile = descriptor.value;
            if (parametri.tipo != undefined)
                metodo.tipo = parametri.tipo;
            else
                metodo.tipo = 'get';
            if (parametri.descrizione != undefined)
                metodo.descrizione = parametri.descrizione;
            else
                metodo.descrizione = '';
            if (parametri.sommario != undefined)
                metodo.sommario = parametri.sommario;
            else
                metodo.sommario = '';
            if (parametri.interazione != undefined)
                metodo.tipoInterazione = parametri.interazione;
            else
                metodo.tipoInterazione = 'rotta';
            if (parametri.path == undefined)
                metodo.path = propertyKey.toString();
            else
                metodo.path = parametri.path;
            if (parametri.interazione == 'middleware' || parametri.interazione == 'ambo') {
                const listaMidd = lista_terminale_metodo_1.GetListaMiddlewareMetaData();
                const midd = listaMidd.CercaConNomeSeNoAggiungi(propertyKey.toString());
                midd.metodoAvviabile = descriptor.value;
                midd.listaParametri = metodo.listaParametri;
                lista_terminale_metodo_1.SalvaListaMiddlewareMetaData(listaMidd);
            }
            terminale_classe_1.SalvaListaClasseMetaData(list);
        }
        else {
            console.log("Errore mio!");
        }
    };
}
exports.mpMetRev = decoratoreMetodo;
exports.mpMet = decoratoreMetodo;
exports.mpM = decoratoreMetodo;
exports.mpMetodo = decoratoreMetodo;
exports.mpDecoratoreMetodo = decoratoreMetodo;
exports.mpDecMetodo = decoratoreMetodo;
exports.mpDecMet = decoratoreMetodo;
exports.MPMetRev = decoratoreMetodo;
exports.MPM = decoratoreMetodo;
exports.MPMetodo = decoratoreMetodo;
exports.MPDecoratoreMetodo = decoratoreMetodo;
exports.MPDecMetodo = decoratoreMetodo;
exports.MPDecMet = decoratoreMetodo;
function mpAddCors(cors) {
    return function (target, propertyKey, descriptor) {
        const list = terminale_classe_1.GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.cors = cors;
            terminale_classe_1.SalvaListaClasseMetaData(list);
        }
        else {
            console.log("Errore mio!");
        }
    };
}
exports.mpAddCors = mpAddCors;
function mpAddHelmet(helmet) {
    return function (target, propertyKey, descriptor) {
        const list = terminale_classe_1.GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.helmet = helmet;
            terminale_classe_1.SalvaListaClasseMetaData(list);
        }
        else {
            console.log("Errore mio!");
        }
    };
}
exports.mpAddHelmet = mpAddHelmet;
function mpAddMiddle(item) {
    return function (target, propertyKey, descriptor) {
        const list = terminale_classe_1.GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        let midd = undefined;
        const listaMidd = lista_terminale_metodo_1.GetListaMiddlewareMetaData();
        if (typeof item === 'string' || item instanceof String) {
            midd = listaMidd.CercaConNomeSeNoAggiungi(String(item));
            lista_terminale_metodo_1.SalvaListaMiddlewareMetaData(listaMidd);
        }
        else {
            midd = item;
        }
        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.middleware.push(midd);
            terminale_classe_1.SalvaListaClasseMetaData(list);
        }
        else {
            console.log("Errore mio!");
        }
    };
}
exports.mpAddMiddle = mpAddMiddle;
//# sourceMappingURL=terminale-metodo.js.map