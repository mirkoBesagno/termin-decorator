
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

import { IMetodo, IMetodoEventi, IMetodoLimitazioni, IMetodoParametri, IMetodoVettori, instanceOfIMetodoEventi, instanceOfIMetodoLimitazioni, instanceOfIMetodoParametri, instanceOfIMetodoVettori, IParametro, RispostaControllo } from "../utility";
import { IstanzaMetodo } from "./istanza-metodo";
import slowDown, { Options as OptSlowDows } from "express-slow-down";
import rateLimit, { Options as OptRateLimit } from "express-rate-limit";
import { TerminaleParametro } from "../parametro/metadata-parametro";

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

function decoratoreMetodoGenerico(listaParametri?: IParametro[], ...parametri: Array<IMetodo | IMetodoEventi | IMetodoLimitazioni | IMetodoParametri | IMetodoVettori>) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {

        if (listaParametri)
            IstanzaMetodo.ParametriMetodo(listaParametri, propertyKey.toString(), target.constructor.name);
        for (let index = 0; index < parametri.length; index++) {
            const element = parametri[index];
            if (instanceOfIMetodoVettori(element)) {
                IstanzaMetodo.Vettori(element, propertyKey.toString(), target.constructor.name, descriptor);
            }
            if (instanceOfIMetodoEventi(element)) {
                IstanzaMetodo.Eventi(element, propertyKey.toString(), target.constructor.name, descriptor);
            }
            if (instanceOfIMetodoLimitazioni(element)) {
                IstanzaMetodo.Limitazioni(element, propertyKey.toString(), target.constructor.name, descriptor);
            }
            if (instanceOfIMetodoParametri(element)) {
                IstanzaMetodo.Parametri(element, propertyKey.toString(), target.constructor.name, -1, descriptor);
            }
        }
        if (parametri == undefined || parametri.length == undefined || parametri.length == 0) {
            IstanzaMetodo.Semplice(propertyKey.toString(), target.constructor.name, descriptor);
        }
    }
}

export { decoratoreMetodo as mpMet };
export { decoratoreMetodoGenerico as mpMetGen };