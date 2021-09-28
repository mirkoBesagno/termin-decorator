import { ListaTerminaleTest } from "./lista-test-funzionale";
import { TerminaleTest } from "./metadata-test-funzionale";
import { GetListaTestMetaData, ITest, SalvaListaTerminaleMetaData } from "./utility-test-funzionale";



function decoratoreTestClasse(parametri: ITest[]): any {
    return (ctr: FunctionConstructor) => {
        const tmp: ListaTerminaleTest = GetListaTestMetaData();
        for (let index = 0; index < parametri.length; index++) {
            const element = parametri[index];
            tmp.AggiungiElemento(new TerminaleTest(element));
        }
        SalvaListaTerminaleMetaData(tmp);
    }
}

function decoratoreTestMetodo(parametri: ITest[]) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const tmp: ListaTerminaleTest = GetListaTestMetaData();
        for (let index = 0; index < parametri.length; index++) {
            const element = parametri[index];
            tmp.AggiungiElemento(new TerminaleTest(element));
        }
        SalvaListaTerminaleMetaData(tmp);
    }
}