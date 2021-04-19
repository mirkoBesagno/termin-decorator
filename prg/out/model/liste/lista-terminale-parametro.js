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
exports.ListaTerminaleParametro = void 0;
const prompts_1 = __importDefault(require("prompts"));
class ListaTerminaleParametro extends Array {
    constructor() {
        super();
    }
    EstraiParametriDaRequest(richiesta) {
        const ritorno = [];
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            //const indice = JSON.stringify(richiesta.body).search(element.nome);
            if (richiesta.body[element.nome] != undefined) {
                const tmp = richiesta.body[element.nome];
                ritorno.push(tmp);
            }
            else if (richiesta.query[element.nome] != undefined) {
                const tmp2 = richiesta.query[element.nome];
                ritorno.push(tmp2);
            }
            else if (richiesta.headers[element.nome] != undefined) {
                const tmp3 = richiesta.headers[element.nome];
                ritorno.push(tmp3);
            }
        }
        return ritorno;
    }
    SoddisfaParamtri() {
        return __awaiter(this, void 0, void 0, function* () {
            let body = '';
            let primo = false;
            console.log('Soddisfa il body:');
            for (let index = 0; index < this.length; index++) {
                const element = this[index];
                if (element.posizione == 'body') {
                    if (index != this.length - 1 && primo == true) {
                        body = body + ', ';
                    }
                    primo = true;
                    const messaggio = "Nome campo :" + element.nome + "|Tipo campo :"
                        + element.tipo + 'Descrizione : ' + element.descrizione + '|Inserire valore :';
                    const scelta = yield prompts_1.default({ message: messaggio, type: 'text', name: 'scelta' });
                    body = body + ' "' + element.nome + '": ' + ' "' + scelta.scelta + '" ';
                }
            }
            body = body + '';
            let query = '';
            primo = false;
            console.log('Soddisfa le query:');
            for (let index = 0; index < this.length; index++) {
                const element = this[index];
                if (element.posizione == 'query') {
                    if (index != this.length - 1 && primo == true) {
                        query = query + ', ';
                    }
                    primo = true;
                    const messaggio = "Nome campo :" + element.nome + "|Tipo campo :"
                        + element.tipo + 'Descrizione : ' + element.descrizione + '|Inserire valore :';
                    const scelta = yield prompts_1.default({ message: messaggio, type: 'text', name: 'scelta' });
                    query = query + ' "' + element.nome + '": ' + ' "' + scelta.scelta + '" ';
                }
            }
            query = query + '';
            let header = '';
            primo = false;
            console.log("Soddisfa l'header:");
            for (let index = 0; index < this.length; index++) {
                const element = this[index];
                if (element.posizione == 'header') {
                    if (index != this.length - 1 && primo == true) {
                        header = header + ', ';
                    }
                    primo = true;
                    const messaggio = "Nome campo :" + element.nome + "|Tipo campo :"
                        + element.tipo + 'Descrizione : ' + element.descrizione + '|Inserire valore :';
                    const scelta = yield prompts_1.default({ message: messaggio, type: 'text', name: 'scelta' });
                    header = header + ' "' + element.nome + '": ' + ' "' + scelta.scelta + '" ';
                }
            }
            header = header + '';
            return { body, query, header };
        });
    }
}
exports.ListaTerminaleParametro = ListaTerminaleParametro;
//# sourceMappingURL=lista-terminale-parametro.js.map