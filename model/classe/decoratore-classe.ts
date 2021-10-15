import { IClasse } from "../utility";
import { IArtefattoClassePostgres } from "../postgres/tabella";
import { TerminaleClasse } from "./metadata-classe";

/**
 * inizializza la classe, crea un rotta in express mediante il percorso specificato. 
 * @param percorso : di default il nome della classe
 */
function decoratoreClasse(parametri: IClasse, parametriORM?: IArtefattoClassePostgres): any {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (ctr: Function) => {
        TerminaleClasse.IstanziaExpress(parametri, ctr.name);
        if (parametriORM)
            TerminaleClasse.IstanziaPostgres(ctr.name, parametriORM);
    }
}

export { decoratoreClasse as mpClas };