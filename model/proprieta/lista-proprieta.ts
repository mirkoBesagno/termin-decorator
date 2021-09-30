import { TerminaleProprieta } from "./metadata-proprieta";




export class ListaTerminaleProprieta extends Array<TerminaleProprieta> {
    static nomeMetadataKeyTarget = "ListaTerminaleProprieta";

    constructor() {
        super();
    }
    CercaConNome(nome: string): TerminaleProprieta | undefined {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.nome == nome) return element;
        }
        return undefined;
    }
    AggiungiElemento(item: TerminaleProprieta) {
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
    /* ConfiguraListaRotteApplicazione(app: any, percorsi: IRaccoltaPercorsi) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.interazione == 'rotta' || element.interazione == 'ambo') {
                //element.ConfiguraRotta(this.rotte, this.percorsi);
                element.ConfiguraRottaApplicazione(app, percorsi);
            }
            //element.listaRotteGeneraChiavi=this.listaMetodiGeneraKey;
        }
    } */
}