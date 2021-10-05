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

export interface ITestAPI {
    verbo:string, 
    path:string,
    numeroSequenza: number,
    nomeTest: string,
    body: any,
    query: any,
    header: any,
    Controllo?: (ritorno: any) => boolean
}
/* {

    numeroRootTest: number,
    nome: string,
    numero: number,
    //Specifica se il percorso dato deve essere concatenato al percorso della classe o 
    //se è da prendere singolarmente di default è falso e quindi il percorso andra a sommarsi al percorso della classe 
    testUnita: {
        messaggio: {
            body: any;
            query: any;
            header: any;
        },
        risposta: string
    }
} */