"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListaTerminaleClasse = void 0;
class ListaTerminaleClasse extends Array {
    constructor() {
        super();
    }
    PrintMenu() {
        const tab = '\t';
        console.log(tab + "ListaTerminaleClasse" + '->' + 'PrintMenu');
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            element.PrintMenu();
        }
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
}
exports.ListaTerminaleClasse = ListaTerminaleClasse;
ListaTerminaleClasse.nomeMetadataKeyTarget = "ListaTerminaleClasse";
//# sourceMappingURL=lista-terminale-classe.js.map