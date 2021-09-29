import { ListaTerminaleClasse } from "../classe/lista-classe";
import { TerminaleParametro } from "../parametro/metadata-parametro";
import { GetListaClasseMetaData, IMetodo, IParametro, RispostaControllo, SalvaListaClasseMetaData } from "../utility";
import slowDown, { Options as OptSlowDows } from "express-slow-down";
import rateLimit, { Options as OptRateLimit } from "express-rate-limit";

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
}