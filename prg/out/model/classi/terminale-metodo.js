"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.MPDecMet = exports.MPDecMetodo = exports.MPDecoratoreMetodo = exports.MPMetodo = exports.MPM = exports.MPMetRev = exports.mpDecMet = exports.mpDecMetodo = exports.mpDecoratoreMetodo = exports.mpMetodo = exports.mpM = exports.mpMet = exports.mpMetRev = exports.TypeMetodo = exports.CheckMetodoMetaData = exports.TerminaleMetodo = void 0;
const tools_1 = require("../tools");
const terminale_classe_1 = require("./terminale-classe");
const terminale_parametro_1 = require("./terminale-parametro");
const prompts_1 = __importDefault(require("prompts"));
const superagent_1 = __importStar(require("superagent"));
const lista_terminale_metodo_1 = require("../liste/lista-terminale-metodo");
const lista_terminale_parametro_1 = require("../liste/lista-terminale-parametro");
class TerminaleMetodo {
    constructor(nome, path, classeParth) {
        this.classePath = '';
        this._listaParametri = new lista_terminale_parametro_1.ListaTerminaleParametro();
        this._nome = nome;
        this._path = path;
        this.classePath = this.classePath;
        this.tipo = TypeMetodo.indefinita;
        this.pathGlobal = '';
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
    EseguiChiamata(path) {
        const header = {}; //questa dovro costruirla a seconda dei permessi e delle restrizioni
        superagent_1.default.post(path + '/' + this.nome)
            .set({})
            .send('');
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
            //rotte.get('/' + this.nome, this.metodoAvviabile);
            switch (this.tipo) {
                case TypeMetodo.get:
                    this.metodoAvviabile.body;
                    rotte.get("/" + this.path.toString(), (req, res) => {
                        console.log('Risposta a chiamata : ' + this.pathGlobal);
                        const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                        const tmp = this.metodoAvviabile.apply(this, parametri);
                        res.status(tmp.stato).send(tmp.body);
                        return res;
                    });
                    break;
                case TypeMetodo.post:
                    this.metodoAvviabile.body;
                    rotte.post("/" + this.path.toString(), (req, res) => {
                        console.log('Risposta a chiamata : ' + this.pathGlobal);
                        const parametri = this.listaParametri.EstraiParametriDaRequest(req);
                        const tmp = this.metodoAvviabile.apply(this, parametri);
                        //const tmp = this.metodoAvviabile(req.body.nome);
                        res.status(tmp.stato).send(tmp.body);
                        return res;
                    });
                    break;
                default:
                    break;
            }
        }
        return rotte;
    }
    ChiamaLaRotta(headerpath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (headerpath == undefined) {
                headerpath = "http://localhost:3000";
            }
            console.log('chiamata per : ' + superagent_1.head + this.pathGlobal + ' | Verbo: ' + this.tipo);
            const parametri = yield this.listaParametri.SoddisfaParamtri();
            let ritorno;
            switch (this.tipo) {
                case TypeMetodo.get:
                    try {
                        ritorno = yield superagent_1.default
                            .get(headerpath + this.pathGlobal)
                            .query(JSON.parse(parametri.query))
                            .send(JSON.parse(parametri.body))
                            .set('accept', 'json');
                    }
                    catch (error) {
                        console.log(error);
                    }
                case TypeMetodo.post:
                    try {
                        ritorno = yield superagent_1.default
                            .post(headerpath + this.pathGlobal)
                            .query(JSON.parse(parametri.query))
                            .send(JSON.parse(parametri.body))
                            .set('accept', 'json');
                    }
                    catch (error) {
                        console.log(error);
                    }
                    return ritorno;
                case TypeMetodo.purge:
                    try {
                        ritorno = yield superagent_1.default
                            .purge(headerpath + this.pathGlobal)
                            .query(JSON.parse(parametri.query))
                            .send(JSON.parse(parametri.body))
                            .set('accept', 'json');
                    }
                    catch (error) {
                        console.log(error);
                    }
                    return ritorno;
                case TypeMetodo.patch:
                    try {
                        ritorno = yield superagent_1.default
                            .patch(headerpath + this.pathGlobal)
                            .query(JSON.parse(parametri.query))
                            .send(JSON.parse(parametri.body))
                            .set('accept', 'json');
                    }
                    catch (error) {
                        console.log(error);
                    }
                    return ritorno;
                case TypeMetodo.delete:
                    try {
                        ritorno = yield superagent_1.default
                            .delete(headerpath + this.pathGlobal)
                            .query(JSON.parse(parametri.query))
                            .send(JSON.parse(parametri.body))
                            .set('accept', 'json');
                    }
                    catch (error) {
                        console.log(error);
                    }
                    return ritorno;
                default:
                    break;
            }
        });
    }
    SoddisfaParamtri() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = [];
            for (let index = 0; index < this.listaParametri.length; index++) {
                const element = this.listaParametri[index];
                const messaggio = "Nome campo :" + element.nome + "|Tipo campo :"
                    + element.tipo + '|Inserire valore :';
                const scelta = yield prompts_1.default({ message: messaggio, type: 'text', name: 'scelta' });
                body.push({ nome: element.nome, valore: scelta.scelta });
            }
            return body;
        });
    }
    CercaParametroSeNoAggiungi(nome, parameterIndex, tipoParametro, posizione) {
        this.listaParametri.push(new terminale_parametro_1.TerminaleParametro(nome, tipoParametro, posizione, parameterIndex)); //.lista.push({ propertyKey: propertyKey, Metodo: target });                                           
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
function decoratoreMetodo(tipo, path) {
    return function (target, propertyKey, descriptor) {
        const list = terminale_classe_1.GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.metodoAvviabile = descriptor.value;
            metodo.tipo = TypeMetodo[tipo];
            if (path == undefined)
                metodo.path = propertyKey.toString();
            else
                metodo.path = path;
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
//# sourceMappingURL=terminale-metodo.js.map