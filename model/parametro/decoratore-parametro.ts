

import {  IParametro } from "../utility";
import { IstanzaParametro } from "./istanza-parametro";

/**
 * di default mette obbligatorio a true
 * @param parametri 
 *  nome: nome del parametro, in pratica il nome della variabile o un nome assonante (parlante) 
 *  posizione: la posizione rispetto alla chiamata, ovvero: "body" | "query" | "header" 
 *  tipo?: fa riferimento al tipo di base, ovvero: "number" | "text" | "date" 
 *  descrizione?: descrizione lunga  
 *  sommario?: descrizione breve  
 *  dovePossoTrovarlo?: TypeDovePossoTrovarlo,
 *  Validatore?: (parametro: any) => IRitornoValidatore
 * @returns 
 */
function decoratoreParametroGenerico<T>(parametri: IParametro)/* (nome: string, posizione: TypePosizione, tipo?: tipo, descrizione?: string, sommario?: string) */ {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {

        IstanzaParametro.Semplice(parametri, target, propertyKey, parameterIndex);
        /*  const list: ListaTerminaleClasse = GetListaClasseMetaData();
         const classe = list.CercaConNomeSeNoAggiungi(target.constructor.name);
         const metodo = classe.CercaMetodoSeNoAggiungiMetodo(propertyKey.toString());
 
         parametri = TerminaleParametro.NormalizzaValori(parametri, parameterIndex.toString());
         const terminaleParametro = metodo.CercaParametroSeNoAggiungi(parametri.nome ?? '', parameterIndex,
             parametri.tipo ?? 'any', parametri.posizione ?? 'query');
 
         TerminaleParametro.CostruisciTerminaleParametro(parametri, terminaleParametro);
 
         SalvaListaClasseMetaData(list); */
    }
}


export { decoratoreParametroGenerico as mpPar };