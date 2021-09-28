import { TerminaleTest } from "./metadata-test-funzionale";



export class ListaTerminaleTest extends Array<TerminaleTest> {
    static nomeMetadataKeyTarget = "ListaTerminaleTest";

    constructor() {
        super();
    }
    AggiungiElemento(item: TerminaleTest) {
        this.push(item);
        return item;
    }
}