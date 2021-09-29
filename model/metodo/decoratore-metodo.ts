
/**
 * crea una rotta con il nome della classe e la aggiunge alla classe di riferimento, il tipo del metodo dipende dal tipo di parametro.
 * @param parametri : 
 * tipo?: Specifica il tipo, questo puo essere: "get" | "put" | "post" | "patch" | "purge" | "delete" 
 * path?: specifica il percorso di una particolare rotta, se non impostato prende il nome della classe  
 * interazione?: l'interazione è come viene gestito il metodo, puo essere : "rotta" | "middleware" | "ambo"  
 * descrizione?: la descrizione è utile piu nel menu o in caso di output  
 * sommario?: il sommario è una versione piu semplice della descrizione  
 * nomiClasseRiferimento?: questa è la strada per andare ad assegnare questa funzione è piu classi o sotto percorsi  
 * onChiamataCompletata?: (logOn: string, result: any, logIn: string) => void 
 * Validatore?: (parametri: IParametriEstratti, listaParametri: ListaTerminaleParametro) => IRitornoValidatore;
 * @returns 
 */

import { IMetodo, IParametro, RispostaControllo } from "../utility";
import { IstanzaMetodo } from "./istanza-metodo";
import slowDown, { Options as OptSlowDows } from "express-slow-down";
import rateLimit, { Options as OptRateLimit } from "express-rate-limit";

/* function decoratoreMetodo(parametri:IMetodoParametri, eventi:IMetodoEventi, limitazioni:IMetodoLimitazioni, vettori:IMetodoVettori) */
function decoratoreMetodo(parametri: IMetodo,
    listaParametri?: IParametro[], risposteDiControllo?: RispostaControllo[],
    slow_down?: OptSlowDows, rate_limit?: OptRateLimit): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        new IstanzaMetodo(
            parametri, propertyKey.toString(), descriptor, target.constructor.name,
            listaParametri, risposteDiControllo,
            slow_down, rate_limit
        );
        //return descriptor;
    }
}


export { decoratoreMetodo as mpMet };