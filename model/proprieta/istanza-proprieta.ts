import { ListaTerminaleClasse } from "../classe/lista-classe";
import { Constraint } from "../postgres/constraint";
import { CheckClasseMetaData, GetListaClasseMetaData, IClasse, IProprieta, ORMObject, SalvaListaClasseMetaData, tipo } from "../utility";



export class IstanzaProprieta {

    constructor(nomeClasse: string, nomeProprieta: string, item?: IProprieta) {

        const list: ListaTerminaleClasse = GetListaClasseMetaData();
        /* inizializzo metodo */
        const classe = list.CercaConNomeSeNoAggiungi(nomeClasse);

        const proprieta = classe.CercaProprietaSeNoAggiungiProprieta(nomeProprieta.toString());

        if (item) {
            if (item.Constraints) proprieta.Constraints = new Constraint(item.Constraints);
            if (item.sommario) proprieta.sommario = item.sommario;
            if ((<ORMObject>(<tipo>item.tipo)).tipo &&
                (<ORMObject>(<tipo>item.tipo)).colonnaRiferimento &&
                (<ORMObject>(<tipo>item.tipo)).tabellaRiferimento) {
                proprieta.tipo = new ORMObject(
                    (<ORMObject>item.tipo).colonnaRiferimento,
                    (<ORMObject>item.tipo).tabellaRiferimento,
                    (<ORMObject>item.tipo).onDelete,
                    (<ORMObject>item.tipo).onUpdate
                );
            }
            else {
                if (item.tipo) proprieta.tipo = item.tipo;
            }
            if (item.valore) proprieta.valore = item.valore;
            if (item.descrizione) proprieta.descrizione = item.descrizione;
            if (item.nome) proprieta.nome = item.nome;
            else if (proprieta.nome == '' || proprieta.nome == undefined) proprieta.nome = nomeProprieta;

            if (item.trigger) proprieta.CostruisciListaTrigger(item.trigger);
            if (item.grants) proprieta.grants = item.grants;
        }
        SalvaListaClasseMetaData(list);
    }
}