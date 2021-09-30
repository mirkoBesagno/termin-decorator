import { IClasse } from "../utility";
import { IstanzaClasse } from "./istanza-classe";

/**
 * inizializza la classe, crea un rotta in express mediante il percorso specificato. 
 * @param percorso : di default il nome della classe
 */
function decoratoreClasse(parametri: IClasse, parametriORM?:any): any {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (ctr: Function) => {
        new IstanzaClasse(parametri, ctr.name);

    }
}

export { decoratoreClasse as mpClas };