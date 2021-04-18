"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MPDecPar = exports.MPDecParametro = exports.MPDecoratoreParametroGenerico = exports.MPParametro = exports.MPP = exports.MPParRev = exports.mpDecPar = exports.mpDecParametro = exports.mpDecoratoreParametroGenerico = exports.mpParametro = exports.mpP = exports.mpParRev = exports.mpPar = exports.TerminaleParametro = void 0;
const tools_1 = require("../tools");
const terminale_classe_1 = require("./terminale-classe");
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
function decoratoreParametroGenerico(tipoParametro, nomeParametro, posizione) {
    return function (target, propertyKey, parameterIndex) {
        const list = terminale_classe_1.GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        metodo.CercaParametroSeNoAggiungi(nomeParametro, tools_1.IType[tipoParametro], parameterIndex, posizione);
        terminale_classe_1.SalvaListaClasseMetaData(list);
    };
}
exports.mpPar = decoratoreParametroGenerico;
exports.mpParRev = decoratoreParametroGenerico;
exports.mpP = decoratoreParametroGenerico;
exports.mpParametro = decoratoreParametroGenerico;
exports.mpDecoratoreParametroGenerico = decoratoreParametroGenerico;
exports.mpDecParametro = decoratoreParametroGenerico;
exports.mpDecPar = decoratoreParametroGenerico;
exports.MPParRev = decoratoreParametroGenerico;
exports.MPP = decoratoreParametroGenerico;
exports.MPParametro = decoratoreParametroGenerico;
exports.MPDecoratoreParametroGenerico = decoratoreParametroGenerico;
exports.MPDecParametro = decoratoreParametroGenerico;
exports.MPDecPar = decoratoreParametroGenerico;
//# sourceMappingURL=terminale-parametro.js.map