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
        const ritorno = {
            errori: [], nontrovato: [], valoriParametri: []
        };
        for (let index = this.length - 1; index >= 0; index--) {
            const element = this[index];
            let tmp = undefined;
            if (richiesta.body[element.nomeParametro] != undefined) {
                tmp = richiesta.body[element.nomeParametro];
            }
            else if (richiesta.query[element.nomeParametro] != undefined) {
                tmp = richiesta.query[element.nomeParametro];
            }
            else if (richiesta.headers[element.nomeParametro] != undefined) {
                tmp = richiesta.headers[element.nomeParametro];
            }
            else {
                ritorno.nontrovato.push({
                    nomeParametro: element.nomeParametro,
                    posizioneParametro: element.indexParameter
                });
            }
            if (element.Validatore) {
                const rit = element.Validatore(tmp);
                if (rit.approvato == false) {
                    /* rit.terminale = {
                        nomeParametro: element.nomeParametro, posizione: element.posizione, tipoParametro: element.tipoParametro, descrizione: element.descrizione, sommario: element.sommario
                    } */
                    rit.terminale = element;
                    ritorno.errori.push(rit);
                }
            }
            ritorno.valoriParametri.push(tmp);
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
                    const messaggio = "Nome campo :" + element.nomeParametro + "|Tipo campo :"
                        + element.tipoParametro + 'Descrizione : ' + element.descrizione + '|Inserire valore :';
                    const scelta = yield prompts_1.default({ message: messaggio, type: 'text', name: 'scelta' });
                    body = body + ' "' + element.nomeParametro + '": ' + ' "' + scelta.scelta + '" ';
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
                    const messaggio = "Nome campo :" + element.nomeParametro + "|Tipo campo :"
                        + element.tipoParametro + 'Descrizione : ' + element.descrizione + '|Inserire valore :';
                    const scelta = yield prompts_1.default({ message: messaggio, type: 'text', name: 'scelta' });
                    query = query + ' "' + element.nomeParametro + '": ' + ' "' + scelta.scelta + '" ';
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
                    const messaggio = "Nome campo :" + element.nomeParametro + "|Tipo campo :"
                        + element.tipoParametro + 'Descrizione : ' + element.descrizione + '|Inserire valore :';
                    const scelta = yield prompts_1.default({ message: messaggio, type: 'text', name: 'scelta' });
                    header = header + ' "' + element.nomeParametro + '": ' + ' "' + scelta.scelta + '" ';
                }
            }
            header = header + '';
            return { body, query, header };
        });
    }
}
exports.ListaTerminaleParametro = ListaTerminaleParametro;
//# sourceMappingURL=lista-terminale-parametro.js.map