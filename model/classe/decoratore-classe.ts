import { IstanzaClasse } from "./istanza-classe";
import { IClasse } from "./utility-classe";

/**
 * inizializza la classe, crea un rotta in express mediante il percorso specificato. 
 * @param percorso : di default il nome della classe
 */
function decoratoreClasse(parametri: IClasse): any {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (ctr: Function) => {
        new IstanzaClasse(parametri, ctr.name);
    }
}

export { decoratoreClasse as mpClas };