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
exports.MPDecMet = exports.MPDecMetodo = exports.MPDecoratoreMetodo = exports.MPMetodo = exports.MPM = exports.MPMetRev = exports.mpDecMet = exports.mpDecMetodo = exports.mpDecoratoreMetodo = exports.mpMetodo = exports.mpM = exports.mpMet = exports.mpMetRev = exports.mpAddMiddle = exports.mpAddHelmet = exports.mpAddCors = exports.TypeMetodo = exports.CheckMetodoMetaData = exports.TerminaleMetodo = exports.ERuolo = void 0;
const tools_1 = require("../tools");
const terminale_classe_1 = require("./terminale-classe");
const terminale_parametro_1 = require("./terminale-parametro");
const prompts_1 = __importDefault(require("prompts"));
const helmet_1 = __importDefault(require("helmet"));
const superagent_1 = __importDefault(require("superagent"));
const lista_terminale_metodo_1 = require("../liste/lista-terminale-metodo");
const lista_terminale_parametro_1 = require("../liste/lista-terminale-parametro");
const cors_1 = __importDefault(require("cors"));
var ERuolo;
(function (ERuolo) {
    ERuolo[ERuolo["bloccato"] = 0] = "bloccato";
    ERuolo[ERuolo["chiave"] = 1] = "chiave";
})(ERuolo = exports.ERuolo || (exports.ERuolo = {}));
class TerminaleMetodo {
    constructor(nome, path, classePath, protetto) {
        this.classePath = '';
        this.middleware = [];
        this._listaParametri = new lista_terminale_parametro_1.ListaTerminaleParametro();
        this._nome = nome;
        this._path = path;
        this.classePath = classePath;
        this.tipo = TypeMetodo.indefinita;
        this.pathGlobal = '';
        this.ruolo = protetto;
    }
    /* start : get e set */
    get nome() {
        return this._nome;
    }
    set nome(value) {
        this._nome = value;
    }
    get path() {
        return this._path;
    }
    set path(value) {
        this._path = value;
    }
    get listaParametri() {
        return this._listaParametri;
    }
    set listaParametri(value) {
        this._listaParametri = value;
    }
    /* end : get e ste */
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
        if (this.metodoAvviabile != undefined) {
            if (this.ruolo == "bloccato") {
            }
            var corsOptions = {};
            switch (this.tipo) {
                case TypeMetodo.get:
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
                    rotte.get("/" + this.path.toString(), cors_1.default(this.cors), helmet_1.default(this.helmet), this.middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                        console.log('Risposta a chiamata : ' + this.pathGlobal);
                        /* const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                        let tmp: IReturn;
                        try {
                            tmp = this.metodoAvviabile.apply(this, parametri);
                        } catch (error) {
                            console.log("Errore : \n" + error);
                            tmp = {
                                body: { "Errore Interno filtrato ": 'internal error!!!!' },
                                stato: 500
                            }
                        }   */
                        this.InizializzaLogbaseIn(req, this.nome.toString());
                        const tmp = yield this.Esegui(req);
                        res.status(tmp.stato).send(tmp.body);
                        this.InizializzaLogbaseOut(res, this.nome.toString());
                        return res;
                    }));
                    break;
                case TypeMetodo.post:
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
                    rotte.post("/" + this.path.toString(), cors_1.default(this.cors), helmet_1.default(this.helmet), this.middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                case TypeMetodo.delete:
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
                    rotte.delete("/" + this.path.toString(), cors_1.default(this.cors), helmet_1.default(this.helmet), this.middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                case TypeMetodo.patch:
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
                    rotte.patch("/" + this.path.toString(), cors_1.default(this.cors), helmet_1.default(this.helmet), this.middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                case TypeMetodo.purge:
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
                    rotte.purge("/" + this.path.toString(), cors_1.default(this.cors), helmet_1.default(this.helmet), this.middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                case TypeMetodo.put:
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
                    rotte.put("/" + this.path.toString(), cors_1.default(this.cors), helmet_1.default(this.helmet), this.middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                case TypeMetodo.indefinita:
                    break;
                default:
                    break;
            }
        }
        return rotte;
    }
    ChiamaLaRotta(headerpath) {
        return __awaiter(this, void 0, void 0, function* () {
            let chiave = { body: '' };
            if (this.ruolo == 'bloccato') {
                console.log();
                chiave = yield this.RecuperaChiave();
                chiave.body;
            }
            if (headerpath == undefined)
                headerpath = "http://localhost:3000";
            console.log('chiamata per : ' + headerpath + this.pathGlobal + ' | Verbo: ' + this.tipo);
            const parametri = yield this.listaParametri.SoddisfaParamtri();
            let ritorno;
            switch (this.tipo) {
                case TypeMetodo.get:
                    try {
                        ritorno = yield superagent_1.default
                            .get(headerpath + this.pathGlobal)
                            .query(JSON.parse(parametri.query))
                            .send(JSON.parse(parametri.body))
                            .set('accept', 'json')
                            .set('Authorization', `Bearer ${chiave.body}`);
                    }
                    catch (error) {
                        console.log(error);
                    }
                    break;
                case TypeMetodo.post:
                    try {
                        ritorno = yield superagent_1.default
                            .post(headerpath + this.pathGlobal)
                            .query(JSON.parse(parametri.query))
                            .send(JSON.parse(parametri.body))
                            .set('accept', 'json')
                            .set('Authorization', `Bearer ${chiave.body}`);
                    }
                    catch (error) {
                        console.log(error);
                    }
                    break;
                case TypeMetodo.purge:
                    try {
                        ritorno = yield superagent_1.default
                            .purge(headerpath + this.pathGlobal)
                            .query(JSON.parse(parametri.query))
                            .send(JSON.parse(parametri.body))
                            .set('accept', 'json')
                            .set('Authorization', `Bearer ${chiave.body}`);
                    }
                    catch (error) {
                        console.log(error);
                    }
                    break;
                case TypeMetodo.patch:
                    try {
                        ritorno = yield superagent_1.default
                            .patch(headerpath + this.pathGlobal)
                            .query(JSON.parse(parametri.query))
                            .send(JSON.parse(parametri.body))
                            .set('accept', 'json')
                            .set('Authorization', `Bearer ${chiave.body}`);
                    }
                    catch (error) {
                        console.log(error);
                    }
                    break;
                case TypeMetodo.delete:
                    try {
                        ritorno = yield superagent_1.default
                            .delete(headerpath + this.pathGlobal)
                            .query(JSON.parse(parametri.query))
                            .send(JSON.parse(parametri.body))
                            .set('accept', 'json')
                            .set('Authorization', `Bearer ${chiave.body}`);
                    }
                    catch (error) {
                        console.log(error);
                    }
                    break;
                default:
                    break;
            }
            ritorno === null || ritorno === void 0 ? void 0 : ritorno.body;
            return ritorno;
        });
    }
    RecuperaChiave() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("La rotta è protetta, sono state trovate delle funzioni che potrebbero sbloccarla, scegli:");
                for (let index = 0; index < TerminaleMetodo.ListaRotteGeneraChiavi.length; index++) {
                    const element = TerminaleMetodo.ListaRotteGeneraChiavi[index];
                    console.log(index + ': ' + element.nome);
                }
                const tmp = yield prompts_1.default({
                    message: 'Scegli: ',
                    type: 'number',
                    name: 'scelta'
                });
                const ritorno = yield TerminaleMetodo.ListaRotteGeneraChiavi[tmp.scelta].ChiamaLaRotta();
                let tmp2 = { body: '' };
                if (ritorno) {
                    tmp2.body = ritorno.body;
                }
                return tmp2;
            }
            catch (error) {
                return { body: '' };
            }
        });
    }
    CercaParametroSeNoAggiungi(nome, parameterIndex, tipoParametro, posizione) {
        this.listaParametri.push(new terminale_parametro_1.TerminaleParametro(nome, tipoParametro, posizione, parameterIndex)); //.lista.push({ propertyKey: propertyKey, Metodo: target });                                           
    }
    Esegui(req) {
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
}
exports.TerminaleMetodo = TerminaleMetodo;
TerminaleMetodo.ListaRotteGeneraChiavi = [];
TerminaleMetodo.ListaRotteValidaChiavi = [];
TerminaleMetodo.nomeMetadataKeyTarget = "MetodoTerminaleTarget";
function CheckMetodoMetaData(nomeMetodo, classe, ruolo) {
    let tmp = Reflect.getMetadata(lista_terminale_metodo_1.ListaTerminaleMetodo.nomeMetadataKeyTarget, tools_1.targetTerminale); // vado a prendere la struttura legata alle funzioni
    if (tmp == undefined) { //se non c'è 
        tmp = new lista_terminale_metodo_1.ListaTerminaleMetodo(classe.rotte); //lo creo
        Reflect.defineMetadata(lista_terminale_metodo_1.ListaTerminaleMetodo.nomeMetadataKeyTarget, tmp, tools_1.targetTerminale); //e lo aggiungo a i metadata
    }
    let terminale = tmp.CercaConNome(nomeMetodo, classe.path); //cerca la mia funzione
    if (terminale == undefined) /* se non c'è */ {
        terminale = new TerminaleMetodo(nomeMetodo, "", classe.nome, ruolo); // creo la funzione
    }
    return terminale;
}
exports.CheckMetodoMetaData = CheckMetodoMetaData;
var TypeMetodo;
(function (TypeMetodo) {
    TypeMetodo[TypeMetodo["get"] = 0] = "get";
    TypeMetodo[TypeMetodo["put"] = 1] = "put";
    TypeMetodo[TypeMetodo["post"] = 2] = "post";
    TypeMetodo[TypeMetodo["patch"] = 3] = "patch";
    TypeMetodo[TypeMetodo["purge"] = 4] = "purge";
    TypeMetodo[TypeMetodo["delete"] = 5] = "delete";
    TypeMetodo[TypeMetodo["indefinita"] = 6] = "indefinita";
})(TypeMetodo = exports.TypeMetodo || (exports.TypeMetodo = {}));
function decoratoreMetodo(tipo, path, ruolo) {
    return function (target, propertyKey, descriptor) {
        const list = terminale_classe_1.GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.metodoAvviabile = descriptor.value;
            metodo.tipo = TypeMetodo[tipo];
            if (ruolo == undefined)
                metodo.ruolo = 'bloccato';
            else
                metodo.ruolo = ruolo;
            if (path == undefined)
                metodo.path = propertyKey.toString();
            else
                metodo.path = path;
            if (metodo.ruolo == 'chiavegen') {
                classe.listaMetodiGeneraKey.push(metodo);
                TerminaleMetodo.ListaRotteGeneraChiavi.push(metodo);
            }
            else if (metodo.ruolo == 'chiavevalid') {
                classe.listaMetodiValidaKey.push(metodo);
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
        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.middleware.push(item);
            terminale_classe_1.SalvaListaClasseMetaData(list);
        }
        else {
            console.log("Errore mio!");
        }
    };
}
exports.mpAddMiddle = mpAddMiddle;
//# sourceMappingURL=terminale-metodo.js.map