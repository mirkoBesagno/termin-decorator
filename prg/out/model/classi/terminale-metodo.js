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
exports.CheckMetodoMetaData = exports.mpMet = exports.TypeMetodo = exports.TerminaleMetodo = void 0;
const tools_1 = require("../tools");
const terminale_classe_1 = require("./terminale-classe");
const superagent_1 = __importDefault(require("superagent"));
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
    }
    ConfiguraRotta(rotte) {
        if (this.metodoAvviabile != undefined) {
            //rotte.get('/' + this.nome, this.metodoAvviabile);
            switch (this.tipo) {
                case TypeMetodo.get:
                    this.metodoAvviabile.body;
                    rotte.get("/" + this.path.toString(), (req, res) => {
                        const tmp = this.metodoAvviabile();
                        res.send(tmp.body);
                    });
                    break;
                default:
                    break;
            }
        }
        return rotte;
    }
}
exports.TerminaleMetodo = TerminaleMetodo;
TerminaleMetodo.nomeMetadataKeyTarget = "MetodoTerminaleTarget";
var TypeMetodo;
(function (TypeMetodo) {
    TypeMetodo[TypeMetodo["get"] = 0] = "get";
    TypeMetodo[TypeMetodo["put"] = 1] = "put";
    TypeMetodo[TypeMetodo["indefinita"] = 2] = "indefinita";
})(TypeMetodo = exports.TypeMetodo || (exports.TypeMetodo = {}));
/**
* arrivati a questo punto il metodo dovrebbe gia esistere ma se non esiste bisogna crearlo
* poi deve essere configurata la sua funzione
* @returns q
*/
function mpMet(tipo, path) {
    return function (target, propertyKey, descriptor) {
        const classe = terminale_classe_1.CheckClasseMetaData(target.constructor.name);
        const metodo = CheckMetodoMetaData(propertyKey.toString(), classe);
        ///////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////
        let tmp = Reflect.getMetadata(lista_terminale_metodo_1.ListaTerminaleMetodo.nomeMetadataKeyTarget, tools_1.targetTerminale); // vado a prendere la struttura legata alle funzioni
        if (metodo != undefined && tmp != undefined && classe != undefined) {
            metodo.metodoAvviabile = descriptor.value;
            metodo.tipo = tipo;
            if (path == undefined)
                metodo.path = propertyKey.toString();
            else
                metodo.path = path;
            tmp.AggiungiElemento(metodo);
            classe.listaMetodi.AggiungiElemento(metodo);
            Reflect.defineMetadata(lista_terminale_metodo_1.ListaTerminaleMetodo.nomeMetadataKeyTarget, tmp, tools_1.targetTerminale); // salvo tutto
            Reflect.defineMetadata(terminale_classe_1.TerminaleClasse.nomeMetadataKeyTarget, classe, tools_1.targetTerminale); //e lo vado a salvare nel meta data
            //Reflect.defineMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, classe, targetTerminale);
        }
        else {
            console.log("Errore mio!");
        }
    };
}
exports.mpMet = mpMet;
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
//# sourceMappingURL=terminale-metodo.js.map