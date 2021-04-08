"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListaTerminaleMetodo = void 0;
class ListaTerminaleMetodo extends Array {
    constructor(rotte) {
        super();
        this.rotte = rotte;
    }
    CercaConNome(nome, classePath) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.nome == nome && element.classePath == classePath)
                return element;
        }
        return undefined;
        //throw new Error("Errore mio !");
    }
    AggiungiElemento(item) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.nome == item.nome && element.classePath == item.classePath) {
                this[index] = item;
                this.rotte = item.ConfiguraRotta(this.rotte);
                return item;
            }
        }
        this.push(item);
        this.rotte = item.ConfiguraRotta(this.rotte);
        return item;
    }
}
exports.ListaTerminaleMetodo = ListaTerminaleMetodo;
ListaTerminaleMetodo.nomeMetadataKeyTarget = "ListaTerminaleMetodo";
//# sourceMappingURL=lista-terminale-metodo.js.map