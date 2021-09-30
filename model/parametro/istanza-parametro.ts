import { ListaTerminaleClasse } from "../classe/lista-classe";
import { GetListaClasseMetaData, IParametro, SalvaListaClasseMetaData } from "../utility";
import { TerminaleParametro } from "./metadata-parametro";


export class IstanzaParametro {
    constructor(parametri: IParametro, target: any, propertyKey: string | symbol, parameterIndex: number) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());

        parametri = TerminaleParametro.NormalizzaValori(parametri, parameterIndex.toString());
        const terminaleParametro = metodo.CercaParametroSeNoAggiungi(parametri.nome ?? '', parameterIndex,
            parametri.tipo ?? 'any', parametri.posizione ?? 'query');

        TerminaleParametro.CostruisciTerminaleParametro(parametri, terminaleParametro);

        SalvaListaClasseMetaData(list);
    }
}