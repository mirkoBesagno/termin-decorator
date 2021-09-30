import { targetTerminale } from "../utility";
import { ListaTerminaleTest, ListaTerminaleTestAPI } from "./lista-test-funzionale";



export interface ITest {
    numeroRootTest: number,
    nome: string,
    numero: number,
    /**Specifica se il percorso dato deve essere concatenato al percorso della classe o se è da prendere singolarmente di default è falso e quindi il percorso andra a sommarsi al percorso della classe */
    testUnita: {
        nome: string,
        FunzioniCreaAmbienteEsecuzione?: () => IReturnTest | Promise<IReturnTest> | undefined,
        FunzioniDaTestare: () => IReturnTest | Promise<IReturnTest> | undefined,
        FunzioniDiPulizia?: () => IReturnTest | Promise<IReturnTest> | undefined
    };
}

export interface IReturnTest {
    passato: boolean
}
/**
 * 
 * @returns 
 */
export function GetListaTestMetaData(): ListaTerminaleTest {
    let tmp: ListaTerminaleTest = Reflect.getMetadata(ListaTerminaleTest.nomeMetadataKeyTarget, targetTerminale);
    if (tmp == undefined) {
        tmp = new ListaTerminaleTest();
    }
    return tmp;
}

/**
 * 
 * @param tmp 
 */
export function SalvaListaTestMetaData(tmp: ListaTerminaleTest) {
    Reflect.defineMetadata(ListaTerminaleTest.nomeMetadataKeyTarget, tmp, targetTerminale);
}

/**
 * 
 * @returns 
 */
export function GetListaTestAPIMetaData(): ListaTerminaleTestAPI {
    let tmp: ListaTerminaleTestAPI = Reflect.getMetadata(ListaTerminaleTestAPI.nomeMetadataKeyTarget, targetTerminale);
    if (tmp == undefined) {
        tmp = new ListaTerminaleTestAPI();
    }
    return tmp;
}

/**
 * 
 * @param tmp 
 */
export function SalvaListaTestAPIMetaData(tmp: ListaTerminaleTestAPI) {
    Reflect.defineMetadata(ListaTerminaleTestAPI.nomeMetadataKeyTarget, tmp, targetTerminale);
}