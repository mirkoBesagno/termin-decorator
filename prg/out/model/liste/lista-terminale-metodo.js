"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalvaListaMiddlewareMetaData = exports.GetListaMiddlewareMetaData = exports.ListaTerminaleMiddleware = exports.ListaTerminaleMetodo = void 0;
const terminale_metodo_1 = require("../classi/terminale-metodo");
const tools_1 = require("../tools");
class ListaTerminaleMetodo extends Array {
    constructor() {
        super();
    }
    CercaConNome(nome) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.nome == nome)
                return element;
        }
        return undefined;
    }
    AggiungiElemento(item) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.nome == item.nome && element.classePath == item.classePath) {
                this[index] = item;
                return item;
            }
        }
        this.push(item);
        return item;
    }
}
exports.ListaTerminaleMetodo = ListaTerminaleMetodo;
ListaTerminaleMetodo.nomeMetadataKeyTarget = "ListaTerminaleMetodo";
class ListaTerminaleMiddleware extends Array {
    constructor() {
        super();
    }
    CercaConNomeSeNoAggiungi(nome) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.nome == nome) {
                return element;
            }
        }
        return this.AggiungiElemento(new terminale_metodo_1.TerminaleMetodo(nome, '', ''));
    }
    AggiungiElemento(item) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.nome == item.nome && element.classePath == item.classePath) {
                this[index] = item;
                return item;
            }
        }
        this.push(item);
        return item;
    }
}
exports.ListaTerminaleMiddleware = ListaTerminaleMiddleware;
ListaTerminaleMiddleware.nomeMetadataKeyTarget = "ListaTerminaleMiddleare";
function GetListaMiddlewareMetaData() {
    /* let terminale = TerminaleMetodo.listaMiddleware.CercaConNomeRev(nome)

    if (terminale == undefined) {
        terminale = new TerminaleMetodo(nome, "", nome);
        TerminaleMetodo.listaMiddleware.AggiungiElemento(terminale);
    }
    return terminale; */
    let tmp = Reflect.getMetadata(ListaTerminaleMiddleware.nomeMetadataKeyTarget, tools_1.targetTerminale);
    if (tmp == undefined) {
        tmp = new ListaTerminaleMiddleware();
    }
    return tmp;
}
exports.GetListaMiddlewareMetaData = GetListaMiddlewareMetaData;
function SalvaListaMiddlewareMetaData(tmp) {
    Reflect.defineMetadata(ListaTerminaleMiddleware.nomeMetadataKeyTarget, tmp, tools_1.targetTerminale);
}
exports.SalvaListaMiddlewareMetaData = SalvaListaMiddlewareMetaData;
//# sourceMappingURL=lista-terminale-metodo.js.map