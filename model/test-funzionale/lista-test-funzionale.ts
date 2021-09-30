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
export class ListaTerminaleTestAPI extends Array<ITestAPI> {
    static nomeMetadataKeyTarget = "ListaTerminaleTestAPI";

    constructor() {
        super();
    }
    AggiungiElemento(item: ITestAPI) {
        this.push(item);
        return item;
    }

}

export interface ITestAPI{
    
        body: any;
        query: any;
        header: any;
}