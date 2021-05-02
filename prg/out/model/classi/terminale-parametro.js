"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mpPar = exports.TerminaleParametro = void 0;
const tools_1 = require("../tools");
const terminale_classe_1 = require("./terminale-classe");
class TerminaleParametro {
    constructor(nomeParametro, tipoParametro, posizione, indexParameter) {
        this.nomeParametro = nomeParametro;
        this.tipoParametro = tipoParametro;
        this.posizione = posizione;
        this.indexParameter = indexParameter;
        this.descrizione = "";
        this.sommario = "";
    }
    PrintMenu() {
        const t = Reflect.getMetadata('info', tools_1.targetTerminale);
    }
    PrintCredenziali() {
        console.log("nomeParametro:" + this.nomeParametro + ':;:' + "tipoParametro:" + this.tipoParametro.toString());
    }
    PrintParametro() {
        return "tipoParametro:" + this.tipoParametro.toString() + ";" + "nomeParametro:" + this.nomeParametro;
    }
    SettaSwagger() {
        /* const tmp = {
            name: this.nomeParametro,
            in: this.posizione,
            required: false,
            type: this.tipoParametro,
            description: this.descrizione,
            summary: this.sommario
        }; */
        const ritorno = `{
                "name": "${this.nomeParametro}",
                "in": "${this.posizione}",
                "required": false,
                "type": "${this.tipoParametro}",
                "description": "${this.descrizione}",
                "summary":"${this.sommario}"
            }`;
        try {
            JSON.parse(ritorno);
        }
        catch (error) {
            console.log(error);
        }
        return ritorno;
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
        if (parametri.Validatore != undefined)
            paramestro.Validatore = parametri.Validatore;
        terminale_classe_1.SalvaListaClasseMetaData(list);
    };
}
exports.mpPar = decoratoreParametroGenerico;
//# sourceMappingURL=terminale-parametro.js.map