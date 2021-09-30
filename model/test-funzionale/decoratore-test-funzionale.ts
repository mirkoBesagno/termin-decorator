import { ITestAPI, ListaTerminaleTest, ListaTerminaleTestAPI } from "./lista-test-funzionale";
import { TerminaleTest, TerminaleTestAPI } from "./metadata-test-funzionale";
import { GetListaTestAPIMetaData, GetListaTestMetaData, ITest, SalvaListaTestAPIMetaData, SalvaListaTestMetaData } from "./utility-test-funzionale";



function decoratoreTestClasse(parametri: ITest[]): any {
    return (ctr: FunctionConstructor) => {
        const tmp: ListaTerminaleTest = GetListaTestMetaData();
        for (let index = 0; index < parametri.length; index++) {
            const element = parametri[index];
            tmp.AggiungiElemento(new TerminaleTest(element));
        }
        SalvaListaTestMetaData(tmp);
    }
}

function decoratoreTestAPIClasse(parametri: ITestAPI[]): any {
    return (ctr: FunctionConstructor) => {
        const tmp: ListaTerminaleTestAPI = GetListaTestAPIMetaData();
        for (let index = 0; index < parametri.length; index++) {
            const element = parametri[index];
            tmp.AggiungiElemento((element));
        }
        SalvaListaTestAPIMetaData(tmp);
    }
}
function decoratoreTestMetodo(parametri: ITest[]) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const tmp: ListaTerminaleTest = GetListaTestMetaData();
        for (let index = 0; index < parametri.length; index++) {
            const element = parametri[index];
            tmp.AggiungiElemento(new TerminaleTest(element));
        }
        SalvaListaTestMetaData(tmp);
    }
}