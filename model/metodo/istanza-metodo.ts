import { ListaTerminaleClasse } from "../classe/lista-classe";
import { TerminaleParametro } from "../parametro/metadata-parametro";
import { AssegnaMetodo, GetListaClasseMetaData, IMetodo, IMetodoEventi, IMetodoLimitazioni, IMetodoParametri, IMetodoVettori, IParametro, RispostaControllo, SalvaListaClasseMetaData } from "../utility";
import slowDown, { Options as OptSlowDows } from "express-slow-down";
import rateLimit, { Options as OptRateLimit } from "express-rate-limit";
import { TerminaleMetodo } from "./metadata-metodo";

export class IstanzaMetodo {
    constructor(parametri: IMetodo, nomeMetodo: string | symbol, descriptor: PropertyDescriptor, nomeClasse: string,
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
        }
        else {
            //console.log("Errore mio!");
        }
        //return descriptor;
    }

    static ParametriMetodo(init: IParametro[], nomeMetodo: string, nomeClasse: string, descriptor?: PropertyDescriptor) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        /* inizializzo metodo */
        const classe = list.CercaConNomeSeNoAggiungi(nomeClasse);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(nomeMetodo.toString());
        if (init) {
            for (let index = init.length - 1; index >= 0; index--) {
                //for (let index = 0; index < listaParametri.length; index++) {
                let parametri = init[index];
                parametri = TerminaleParametro.NormalizzaValori(parametri, index.toString());
                const terminaleParametro = metodo.CercaParametroSeNoAggiungi(parametri.nome ?? '', index,
                    parametri.tipo ?? 'any', parametri.posizione ?? 'query');
                TerminaleParametro.CostruisciTerminaleParametro(parametri, terminaleParametro);
            }
        }
        AssegnaMetodo(metodo, descriptor);
        SalvaListaClasseMetaData(list);
    }

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

    static Semplice(nomeMetodo: string, nomeClasse: string, descriptor: PropertyDescriptor,) {

        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        /* inizializzo metodo */
        const classe = list.CercaConNomeSeNoAggiungi(nomeClasse);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(nomeMetodo.toString());
        /* inizio a lavorare sul metodo */
        if (metodo != undefined && list != undefined && classe != undefined) {
            metodo.Setta({ metodoAvviabile: descriptor.value }, nomeMetodo, descriptor, list);
            SalvaListaClasseMetaData(list);
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
        AssegnaMetodo(metodo, descriptor);
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
        AssegnaMetodo(metodo, descriptor);
        SalvaListaClasseMetaData(list);
    }

    static Limitazioni(init: IMetodoLimitazioni, nomeMetodo: string, nomeClasse: string, descriptor?: PropertyDescriptor) {
        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        /* inizializzo metodo */
        const classe = list.CercaConNomeSeNoAggiungi(nomeClasse);
        const metodo = classe.CercaMetodoSeNoAggiungiMetodo(nomeMetodo.toString());
        metodo.InitMetodoLimitazioni(init);
        AssegnaMetodo(metodo, descriptor);
        SalvaListaClasseMetaData(list);
    }
}