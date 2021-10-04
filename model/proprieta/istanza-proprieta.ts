import { ListaTerminaleClasse } from "../classe/lista-classe";
import { CheckClasseMetaData, GetListaClasseMetaData, IClasse, IProprieta, SalvaListaClasseMetaData } from "../utility";



export class IstanzaProprieta {

    constructor(nomeClasse: string, nomeProprieta: string, item?: IProprieta) {

        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        /* inizializzo metodo */
        const classe = list.CercaConNomeSeNoAggiungi(nomeClasse);

        const proprieta = classe.CercaProprietaSeNoAggiungiProprieta(nomeProprieta.toString());

        if (item) {
            if (item.Constraints) proprieta.Constraints = item.Constraints;
            if (item.sommario) proprieta.sommario = item.sommario;
            if (item.tipo) proprieta.tipo = item.tipo;
            if (item.valore) proprieta.valore = item.valore;
            if (item.descrizione) proprieta.descrizione = item.descrizione;
            if (item.nome) proprieta.nome = item.nome;
            else if (proprieta.nome == '' || proprieta.nome == undefined) proprieta.nome = nomeProprieta;
            if (item.trigger) proprieta.trigger = item.trigger;
        }
        SalvaListaClasseMetaData(list);
    }
}