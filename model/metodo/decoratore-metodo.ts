

import { IParametro } from "../utility";
import { IMetodo, IMetodoEventi, IMetodoLimitazioni, IMetodoParametri, IMetodoVettori, instanceOfIMetodoEventi, instanceOfIMetodoLimitazioni, instanceOfIMetodoParametri, instanceOfIMetodoVettori, RispostaControllo } from "./utility-metodo";

import { Options as OptSlowDows } from "express-slow-down";
import { Options as OptRateLimit } from "express-rate-limit";
import { IstanzaMetodo } from "./istanza-metodo";
import { GetListaClasseMetaData } from "../utility-function";

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
function decoratoreMetodo(parametri: IMetodo,
    listaParametri?: IParametro[], risposteDiControllo?: RispostaControllo[],
    slow_down?: OptSlowDows, rate_limit?: OptRateLimit): MethodDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        IstanzaMetodo.Complesso(parametri, propertyKey.toString(), descriptor, target.constructor.name,
            listaParametri, risposteDiControllo, slow_down, rate_limit);
    }
}
function decoratoreMetodoGenerico(...parametri: Array<IMetodo | IMetodoEventi | IMetodoLimitazioni | IMetodoParametri | IMetodoVettori>) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        for (let index = 0; index < parametri.length; index++) {
            const element = parametri[index];
            if (instanceOfIMetodoVettori(element)) {
                IstanzaMetodo.Vettori(element, propertyKey.toString(), target.constructor.name);
            }
            if (instanceOfIMetodoEventi(element)) {
                IstanzaMetodo.Eventi(element, propertyKey.toString(), target.constructor.name);
            }
            if (instanceOfIMetodoLimitazioni(element)) {
                IstanzaMetodo.Limitazioni(element, propertyKey.toString(), target.constructor.name);
            }
            if (instanceOfIMetodoParametri(element)) {
                IstanzaMetodo.Parametri(element, propertyKey.toString(), target.constructor.name, -1);
            }
        } 
    }
}

/* function decoratoreMetod(parametri: IMetodo,
    listaParametri?: IParametro[], risposteDiControllo?: RispostaControllo[],
    slow_down?: OptSlowDows, rate_limit?: OptRateLimit): MethodDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        IstanzaMetodo.Complesso(parametri, propertyKey.toString(), descriptor, target.constructor.name,
            listaParametri, risposteDiControllo, slow_down, rate_limit);
    }
} */


export { decoratoreMetodo as mpMet };
export { decoratoreMetodoGenerico as mpMetGen };