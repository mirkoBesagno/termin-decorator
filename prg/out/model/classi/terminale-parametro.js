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
        this.descrizione = "";
        this.sommario = "";
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
    SettaSwagger() {
        const ritorno = `{
                        "name": "${this.nome}",
                        "in": "${this.posizione}",
                        "required": false,
                        "type": "${this.tipo}",
                        "description": "${this.descrizione}",
                        "summary":"${this.sommario}"
                    }
        `;
    }
}
exports.TerminaleParametro = TerminaleParametro;
function decoratoreParametroGenerico(parametri) {
    return function (target, propertyKey, parameterIndex) {
        if (parametri.tipoParametro == undefined)
            parametri.tipoParametro = 'text';
        if (parametri.descrizione == undefined)
            parametri.descrizione = '';
        if (parametri.sommario == undefined)
            parametri.sommario = '';
        const list = terminale_classe_1.GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
        const paramestro = metodo.CercaParametroSeNoAggiungi(parametri.nomeParametro, parameterIndex, parametri.tipoParametro, parametri.posizione);
        if (parametri.descrizione != undefined)
            paramestro.descrizione = parametri.descrizione;
        else
            paramestro.descrizione = '';
        if (parametri.sommario != undefined)
            paramestro.sommario = parametri.sommario;
        else
            paramestro.sommario = '';
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