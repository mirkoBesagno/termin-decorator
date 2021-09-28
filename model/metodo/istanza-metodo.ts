import { IParametro } from "../utility";
import { IMetodo, IMetodoEventi, IMetodoLimitazioni, IMetodoParametri, IMetodoVettori, RispostaControllo } from "./utility-metodo";

import { Options as OptSlowDows } from "express-slow-down";
import { Options as OptRateLimit } from "express-rate-limit";
import { ListaTerminaleClasse } from "../classe/lista-classe";
import { TerminaleParametro } from "../parametro/metadata-parametro";
import { GetListaClasseMetaData, SalvaListaClasseMetaData } from "../utility-function";
import { AssegnaMetodo } from "./utility-function-metodo";

export class IstanzaMetodo {
    constructor() {
        console.log("constructor");

    }
    /* constructor(parametri: IMetodo, nomeMetodo: string | symbol, descriptor: PropertyDescriptor, nomeClasse: string,
        listaParametri?: IParametro[], risposteDiControllo?: RispostaControllo[],
        slow_down?: OptSlowDows, rate_limit?: OptRateLimit) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        
        const classe = list.CercaConNomeSeNoAggiungi(nomeClasse);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(nomeMetodo.toString());
        
        if (metodo != undefined && list != undefined && classe != undefined) {
            if (risposteDiControllo) parametri.RisposteDiControllo = risposteDiControllo;
            parametri.slow_down = slow_down;
            parametri.rate_limit = rate_limit;

            if (listaParametri) {
                for (let index = listaParametri.length - 1; index >= 0; index--) {
                    
                    let parametri = listaParametri[index];
                    parametri = TerminaleParametro.NormalizzaValori(parametri, index.toString());
                    const terminaleParametro = metodo.CercaParametroSeNoAggiungi(parametri.nome ?? '', index,
                        parametri.tipo ?? 'any', parametri.posizione ?? 'query');
                    TerminaleParametro.CostruisciTerminaleParametro(parametri, terminaleParametro);
                }
            }

            metodo.Setta(parametri, nomeMetodo, descriptor, list);

            SalvaListaClasseMetaData(list);
        }
        else {
            //console.log("Errore mio!");
        } 
    } */
    static Complesso(parametri: IMetodo, nomeMetodo: string, descriptor: PropertyDescriptor, nomeClasse: string,
        listaParametri?: IParametro[], risposteDiControllo?: RispostaControllo[],
        slow_down?: OptSlowDows, rate_limit?: OptRateLimit) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        /* inizializzo metodo */
        const classe = list.CercaConNomeSeNoAggiungi(nomeClasse);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(nomeMetodo.toString());
        /* inizio a lavorare sul metodo */
        if (metodo != undefined && list != undefined && classe != undefined) {
            if (risposteDiControllo) parametri.RisposteDiControllo = risposteDiControllo;
            parametri.slow_down = slow_down;
            parametri.rate_limit = rate_limit;
            if (listaParametri) {
                for (let index = listaParametri.length - 1; index >= 0; index--) {
                    //for (let index = 0; index < listaParametri.length; index++) {
                    let parametri = listaParametri[index];
                    parametri = TerminaleParametro.NormalizzaValori(parametri, index.toString());
                    const terminaleParametro = metodo.CercaParametroSeNoAggiungi(parametri.nome ?? '', index,
                        parametri.tipo ?? 'any', parametri.posizione ?? 'query');
                    TerminaleParametro.CostruisciTerminaleParametro(parametri, terminaleParametro);
                }
            }
            metodo.Setta(parametri, nomeMetodo, descriptor, list);
            SalvaListaClasseMetaData(list);
            return list;
        }
        else {
            return undefined;
        }
    }

    static Semplice(nomeMetodo: string, nomeClasse: string) {

        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        /* inizializzo metodo */
        const classe = list.CercaConNomeSeNoAggiungi(nomeClasse);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(nomeMetodo.toString());
        /* inizio a lavorare sul metodo */
        if (metodo != undefined && list != undefined && classe != undefined) {
            return list;
        }
        else {
            return undefined;
        }
    }

    static Eventi(init: IMetodoEventi, nomeMetodo: string, nomeClasse: string, descriptor?: PropertyDescriptor) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        /* inizializzo metodo */
        const classe = list.CercaConNomeSeNoAggiungi(nomeClasse);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(nomeMetodo.toString());
        metodo.InitMetodoEventi(init);
        /* if (metodo.metodoAvviabile == undefined && descriptor != undefined)
            metodo.metodoAvviabile = descriptor; */
        // AssegnaMetodo(metodo, descriptor);
        if (metodo && metodo.metodoAvviabile == undefined && descriptor != undefined && descriptor.value != undefined)
            metodo.metodoAvviabile = descriptor.value;
        SalvaListaClasseMetaData(list);
    }

    static Vettori(init: IMetodoVettori, nomeMetodo: string, nomeClasse: string, descriptor?: PropertyDescriptor) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        /* inizializzo metodo */
        const classe = list.CercaConNomeSeNoAggiungi(nomeClasse);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(nomeMetodo.toString());
        metodo.InitMetodoVettori(init);
        AssegnaMetodo(metodo, descriptor);
        SalvaListaClasseMetaData(list);
    }

    static Parametri(init: IMetodoParametri, nomeMetodo: string, nomeClasse: string, numeroParametri: number, descriptor?: PropertyDescriptor) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        /* inizializzo metodo */
        const classe = list.CercaConNomeSeNoAggiungi(nomeClasse);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(nomeMetodo.toString());
        metodo.InitMetodoParametri(init, numeroParametri, nomeMetodo);
        // AssegnaMetodo(metodo, descriptor);
        if (metodo && metodo.metodoAvviabile == undefined && descriptor != undefined && descriptor.value != undefined)
            metodo.metodoAvviabile = descriptor.value;
        SalvaListaClasseMetaData(list);
    }

    static Limitazioni(init: IMetodoLimitazioni, nomeMetodo: string, nomeClasse: string, descriptor?: PropertyDescriptor) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        /* inizializzo metodo */
        const classe = list.CercaConNomeSeNoAggiungi(nomeClasse);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(nomeMetodo.toString());
        metodo.InitMetodoLimitazioni(init);
        // AssegnaMetodo(metodo, descriptor);
        if (metodo && metodo.metodoAvviabile == undefined && descriptor != undefined && descriptor.value != undefined)
            metodo.metodoAvviabile = descriptor.value;
        SalvaListaClasseMetaData(list);
    }
}