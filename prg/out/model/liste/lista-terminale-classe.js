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
exports.ListaTerminaleClasse = void 0;
const terminale_classe_1 = require("../classi/terminale-classe");
const prompts_1 = __importDefault(require("prompts"));
class ListaTerminaleClasse extends Array {
    constructor() {
        super();
    }
    PrintMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            const tab = '\t';
            console.log(tab + "ListaTerminaleClasse" + '->' + 'PrintMenu');
            for (let index = 0; index < this.length; index++) {
                const element = this[index];
                yield element.PrintMenu();
            }
        });
    }
    PrintListaClassi() {
        return __awaiter(this, void 0, void 0, function* () {
            let ritorno = [];
            for (let index = 0; index < this.length; index++) {
                const element = this[index];
                const tmp = index + 1;
                ritorno.push(element.percorsi.pathGlobal);
                console.log(tmp + ': ' + element.nome + ' | ' + element.percorsi.pathGlobal);
            }
            return ritorno;
        });
    }
    PrintMenuClassi() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.PrintListaClassi();
            const scelta = yield prompts_1.default({ message: 'Scegli classe: ', type: 'number', name: 'scelta' });
            if (scelta.scelta == 0) {
            }
            else {
                yield this[scelta.scelta - 1].PrintMenuClasse();
                yield this.PrintListaClassi();
            }
        });
    }
    CercaConNome(nome) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.nome == nome)
                return element;
        }
        return undefined;
        //throw new Error("Errore mio !");
    }
    CercaConPath(path) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.GetPath == path)
                return element;
        }
        return undefined;
        //throw new Error("Errore mio !");
    }
    CercaConNomeSeNoAggiungi(nome) {
        /* poi la cerco */
        let classe = this.CercaConNome(nome);
        if (classe == undefined) {
            classe = new terminale_classe_1.TerminaleClasse(nome); //se il metodo non c'è lo creo
            this.AggiungiElemento(classe);
            terminale_classe_1.SalvaListaClasseMetaData(this);
        }
        return classe;
    }
    CercaMetodo() {
    }
    AggiungiElemento(item) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.nome == item.nome) {
                this[index] = item;
                return item;
            }
        }
        this.push(item);
        return item;
    }
    GeneraHTML() {
        let lista = '';
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            const tmp = `
            <li class="pure-menu-item">
                <a href="#" class="pure-menu-link">${element.nome}</a>
            </li>
            `;
            lista = lista + '\n' + tmp;
        }
        let ritorno = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>

            <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/pure-min.css" integrity="sha384-Uu6IeWbM+gzNVXJcM9XV3SohHtmWE+3VGi496jvgX1jyvDTXfdK+rfZc8C1Aehk5" crossorigin="anonymous">
        </head>
        <body>
            <div class="pure-menu pure-menu-horizontal pure-menu-scrollable">
                <a href="#" class="pure-menu-link pure-menu-heading">Yahoo</a>
                <ul class="pure-menu-list">
                    ${lista}
                </ul>
            </div>            
        </body>
        </html>
        `;
        return ritorno;
    }
}
exports.ListaTerminaleClasse = ListaTerminaleClasse;
ListaTerminaleClasse.nomeMetadataKeyTarget = "ListaTerminaleClasse";
//# sourceMappingURL=lista-terminale-classe.js.map