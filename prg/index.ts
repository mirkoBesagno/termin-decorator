import { mpMain, Main } from "./model/classi/terminale-main";
import { mpClas } from "./model/classi/terminale-classe";
import { IReturn, IRitornoValidatore, mpAddMiddle, mpMet } from "./model/classi/terminale-metodo";
import { mpPar, IParametro } from "./model/classi/terminale-parametro";
import { TipoParametro, ErroreMio } from "./model/tools";

import "reflect-metadata";

export { Main as Main };
export { mpMet as mpMet };
export { mpPar as mpPar };
export { mpClas as mpClas };
export { ErroreMio as ErroreMio };
export { IRitornoValidatore as IRitornoValidatore };


/* @mpClas()
class ClassDue {

}

@mpClas()
class ClassUno {


    @mpMet({})
    MetodoPrimo(@mpPar({nomeParametro:'nome'}) nome: string) {
        return 'metodo primo ciao, sei : ' + nome;
    }
}



const main = new Main('app');

main.Inizializza("http://localhost", 3040, true, true);
main.StartExpressConsole();

*/

