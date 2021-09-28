import { Options as OptionsCache } from "express-redis-cache";
import { IHtml, targetTerminale } from "../utility";
import { ListaTerminaleClasse } from "./lista-classe";
import { TerminaleClasse } from "./metadata-classe";

export interface IClasse {
    cacheOptionRedis?: OptionsCache,
    cacheOptionMemory?: { durationSecondi: number },

    percorso?: string,
    LogGenerale?: any,
    /*  ((logOut: any, result: any, logIn: any, errore: any) => void) */
    Inizializzatore?: any,
    classeSwagger?: string,
    html?: IHtml[]/* ,
    listaTest?:{
        nomeTest: string,
        numeroEsecuzione: number,
        nomemetodoChiamato: string,
        risultatiAspettati: number[]
    }[]; */
}


/**
 * 
 * @param tmp 
 */
export function SalvaListaClasseMetaData(tmp: ListaTerminaleClasse) {
    Reflect.defineMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, tmp, targetTerminale);
}
/**
 * 
 * @returns 
 */
export function GetListaClasseMetaData() {
    let tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
    if (tmp == undefined) {
        tmp = new ListaTerminaleClasse();
    }
    return tmp;
}

/**
 * 
 * @param nome 
 * @returns 
 */
export function CheckClasseMetaData(nome: string) {
    let listClasse: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale); // vado a prendere la struttura legata alle funzioni ovvero le classi
    if (listClasse == undefined)/* se non c'è la creo*/ {
        listClasse = new ListaTerminaleClasse();
        Reflect.defineMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, listClasse, targetTerminale);
    }
    /* poi la cerco */
    let classe = listClasse.CercaConNome(nome);
    if (classe == undefined) {
        classe = new TerminaleClasse(nome); //se il metodo non c'è lo creo
        listClasse.AggiungiElemento(classe);
        Reflect.defineMetadata(TerminaleClasse.nomeMetadataKeyTarget, classe, targetTerminale); //e lo vado a salvare nel meta data
    }
    return classe;
}