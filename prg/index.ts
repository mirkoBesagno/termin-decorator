
import "reflect-metadata";

import { mpMain, Main } from "./model/classi/terminale-main";
import { mpClas } from "./model/classi/terminale-classe";
import { IReturn, IRitornoValidatore, mpAddMiddle, mpMet } from "./model/classi/terminale-metodo";
import { mpPar, IParametro } from "./model/classi/terminale-parametro";
import { TipoParametro, ErroreMio } from "./model/tools";


export { Main as Main };
export { mpMet as mpMet };
export { mpPar as mpPar };
export { mpClas as mpClas };
export { ErroreMio as ErroreMio };
export { IRitornoValidatore as IRitornoValidatore };



/* 


@mpClas()
export class ClassDue {
    constructor() {
        console.log("Ciao");
    }
    static MetodoSaluta() {
        return 'Ciao';
    }

    MetodoSalutaDue() {
        return 'Ciao';
    }


    @mpMet({})
    MetodoPrimo(nome: string) {
        const t = ClassDue.MetodoSaluta();
        try {
            this.MetodoSalutaDue();
        } catch (error) {
            console.log(error);
        }
        if (nome && nome != '') {
            nome = t;
        }
        return 'metodo primo ciao, sei : ' + t + ' : ' + nome;
    }
}

@mpClas()
export class ClassUno {


    @mpMet({})
    MetodoPrimo(@mpPar({ nomeParametro: 'nome' }) nome: string) {
        return 'metodo primo ciao, sei : ' + nome;
    }
}



const main = new Main('app');

main.Inizializza("http://localhost", 3040, true, true);
main.StartExpress();//.StartExpressConsole();

 */

