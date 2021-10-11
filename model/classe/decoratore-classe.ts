import { IClasse } from "../utility";
import { IstanzaClasse, IstanzaCLasseORM } from "./istanza-classe";
import { IClasseORM } from "../postgres/tabella";

/**
 * inizializza la classe, crea un rotta in express mediante il percorso specificato. 
 * @param percorso : di default il nome della classe
 */
function decoratoreClasse(parametri: IClasse, parametriORM?: IClasseORM): any {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (ctr: Function) => {
        new IstanzaClasse(parametri, ctr.name);
        if (parametriORM)
            new IstanzaCLasseORM(ctr.name, parametriORM);
    }
}

export { decoratoreClasse as mpClas };