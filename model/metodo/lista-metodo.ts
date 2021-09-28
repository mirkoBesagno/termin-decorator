import { IRaccoltaPercorsi } from "../utility";
import { TerminaleMetodo } from "./metadata-metodo";

export class ListaTerminaleMetodo extends Array<TerminaleMetodo> {
    static nomeMetadataKeyTarget = "ListaTerminaleMetodo";

    constructor() {
        super();
    }
    CercaConNome(nome: string): TerminaleMetodo | undefined {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.nome == nome) return element;
        }
        return undefined;
    }
    AggiungiElemento(item: TerminaleMetodo) {
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
    async ConfiguraListaRotteApplicazione(app: any,  percorsi: IRaccoltaPercorsi) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.interazione == 'rotta' || element.interazione == 'ambo') {
                //element.ConfiguraRotta(this.rotte, this.percorsi);
                await element.ConfiguraRottaApplicazione(app, percorsi);
            }
            //element.listaRotteGeneraChiavi=this.listaMetodiGeneraKey;
        }
    }
}

export class ListaTerminaleMiddleware extends Array<TerminaleMetodo> {
    static nomeMetadataKeyTarget = "ListaTerminaleMiddleare";
    constructor() {
        super();
    }

    CercaConNomeSeNoAggiungi(nome: string) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.nome == nome) {
                return element;
            }
        }
        return this.AggiungiElemento(new TerminaleMetodo(nome, '', ''))

    }
    private AggiungiElemento(item: TerminaleMetodo) {
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
