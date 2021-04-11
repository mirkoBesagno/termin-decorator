"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mpParRev = exports.TerminaleParametro = exports.EPosizione = void 0;
const tools_1 = require("../tools");
const terminale_classe_1 = require("./terminale-classe");
var EPosizione;
(function (EPosizione) {
    EPosizione[EPosizione["body"] = 0] = "body";
    EPosizione[EPosizione["query"] = 1] = "query";
})(EPosizione = exports.EPosizione || (exports.EPosizione = {}));
class TerminaleParametro {
    constructor(nome, tipo, posizione, indexParameter) {
        this.nome = nome;
        this.tipo = tipo;
        this.posizione = posizione;
        this.indexParameter = indexParameter;
    }
    PrintMenu() {
        const t = Reflect.getMetadata('info', tools_1.targetTerminale);
    }
    PrintCredenziali() {
        console.log("nome:" + this.nome + ':;:' + "tipo:" + this.tipo.toString());
    }
    PrintParametro() {
        return "tipo:" + this.tipo.toString() + ";" + "nome:" + this.nome;
    }
}
exports.TerminaleParametro = TerminaleParametro;
function mpParRev(tipoParametro, nomeParametro, posizione) {
    return function (target, propertyKey, parameterIndex) {
        const list = terminale_classe_1.GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        metodo.CercaParametroSeNoAggiungi(nomeParametro, tipoParametro, parameterIndex, posizione);
        terminale_classe_1.SalvaListaClasseMetaData(list);
    };
}
exports.mpParRev = mpParRev;
//# sourceMappingURL=terminale-parametro.js.map