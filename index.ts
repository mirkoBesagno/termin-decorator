
import { Main } from "./model/main/metadata-main";
import { mpClas } from "./model/classe/decoratore-classe";
import { mpMet } from "./model/metodo/decoratore-metodo";
import { mpPar } from "./model/parametro/decoratore-parametro";
import { IRitornoValidatore, ILogbase, IParametriEstratti } from "./model/utility";
import { ListaTerminaleParametro } from './model/parametro/lista-parametro';
import { ErroreMio, GestioneErrore } from "./model/errore";

import "reflect-metadata";

export { Main as Main };
export { mpMet as mpMet };
export { mpPar as mpPar };
export { mpClas as mpClas };

export { ErroreMio as ErroreMio };
export { IRitornoValidatore as IRitornoValidatore };
export { GestioneErrore as GestioneErrore };

export { IParametriEstratti as IParametriEstratti };
export { ListaTerminaleParametro as ListaTerminaleParametro };

export { ILogbase as ILogbase };

/* @mpClas()
class ClassUno {

    @mpMet({ interazione: 'middleware' })
    middleClasseUno(@mpPar({ nome: 'nome', posizione: 'query' }) nome: string) {
        console.log('Hei sono la classe uno, hai il nome: ' + nome);
        return true;
    }
    Ciao() {
        console.log("Primo");
    }
    @mpMet({ nomiClasseRiferimento: [{ nome: 'ClassDue', listaMiddleware: ['middleClasseDue', 'middleClasseUno'] }] })
    @mpAddMiddle('middleClasseUno')
    MetodoPrimo(@mpPar({ nome: 'nome', posizione: 'query' }) nome: string) {
        this.Ciao();
        return 'metodo primo ciao, sei : ' + nome;
    }
}


@mpClas()
class ClassDue {
    @mpMet({ interazione: 'middleware' })
    middleClasseDue(@mpPar({ nome: 'nome', posizione: 'query' }) nome: string) {
        console.log('Hei sono la classe due, hai il nome: ' + nome);
        return true;
    }
} */


/* export function Foo(funcToCallEveryTime: (...args: any[]) => void) {
    return (target: any, key: string, descriptor: any) => {
        var originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            funcToCallEveryTime(...args);
            return originalMethod.apply(this, args);
        }

        return descriptor;
    }
}

*/



/* function Ciao(nome:string) {
    console.log("Primo ciao");
    console.log("nome :::: "+nome);

}
@mpClas()
class ClassUno {
    static CiaoDue() {
        console.log("Secondo ciao");

    }

    @mpMet({tipo:'post'})
    MetodoPrimo(@mpPar({ nome: 'nome', posizione: 'query' }) nome: string) {
        try {
            Ciao(nome);
        } catch (error) {
            console.log(error);
        }

        return 'metodo primo ciao, sei : ' + nome;
    }

}
try {
    const classe: ClassUno = new ClassUno();
    const main = new Main('app');

    main.Inizializza("localhost", 3030, true, true);
    main.StartExpress();
    main.PrintMenu();
    console.log("Finito!!!");

} catch (error) {
    console.log(error);
    console.log("Finito!!!");
}
*/


/*
function name() {
    try {
        console.log("inizio");
        //throw new ErroreMio({ codiceErrore: 200, messaggio: '', percorsoErrore: '' });

        throw new Error("Buuuuu");


    } catch (error) {
        console.log(__dirname);
        console.log(__filename);
        const tmp = GestioneErrore(error, 'classe')
        console.log(tmp);
    }

}

name();  */