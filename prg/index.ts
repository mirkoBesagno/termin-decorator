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
/* 
@mpClas()
class ClassUno {


    @mpMet({ nomiClasseRiferimento: [{ nome: 'ClassDue' }] })
    MetodoPrimo(@mpPar({
        nomeParametro: 'nome', posizione: 'query',
        Validatore: (item: any) => {
            let tmp: IRitornoValidatore = { approvato: true, messaggio: '', stato: 300 };

            return tmp;
        }
    }) nome: string) {
        return 'metodo primo ciao, sei : ' + nome;
    }
}


@mpClas()
class ClassDue {

}

const main = new Main('app');

main.Inizializza("http://localhost", 3030, true, true);
main.StartExpressConsole(); */
