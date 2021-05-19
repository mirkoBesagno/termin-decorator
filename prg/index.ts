import { mpMain, Main } from "./model/classi/terminale-main";
import { mpClas } from "./model/classi/terminale-classe";
import { IReturn, mpAddMiddle, mpMet } from "./model/classi/terminale-metodo";
import { mpPar, IParametro } from "./model/classi/terminale-parametro";
import { TipoParametro } from "./model/tools";

import "reflect-metadata";

export {Main as Main};
export { mpMet as mpMet };
export { mpPar as mpPar };
export { mpClas as mpClas };


@mpClas()
class ClassUno {

    @mpMet({ interazione: 'middleware' })
    middleClasseUno(@mpPar({nomeParametro:'nome',posizione:'query'}) nome:string) {
        console.log('Hei sono la classe uno, hai il nome: '+nome);
        return true;
    }

    @mpMet({ nomiClasseRiferimento: [{ nome: 'ClassDue', listaMiddleware: ['middleClasseDue', 'middleClasseUno'] }] })
    @mpAddMiddle('middleClasseUno')
    MetodoPrimo(@mpPar({nomeParametro:'nome',posizione:'query'}) nome:string) {
        return 'metodo primo ciao, sei : '+nome;
    }
}
/* ciao */
@mpClas()
class ClassDue {
    @mpMet({ interazione: 'middleware' })
    middleClasseDue(@mpPar({nomeParametro:'nome',posizione:'query'}) nome:string) {
        console.log('Hei sono la classe due, hai il nome: '+nome);
        return true;
    }
}

const main = new Main('app');

main.Inizializza("http://localhost", 3030, true,true);
main.StartExpressConsole(3030, "http://localhost");
        