import { Main, mpClas } from ".";
import { mpMetGen } from "./model/metodo/decoratore-metodo";
import { IMetodoParametri } from "./model/metodo/utility-metodo";


@mpClas({ percorso: 'persona' })
export class Persona {

    @mpMetGen(
        <IMetodoParametri>{ path: 'SalutaChiunque', descrizione: '', interazione: 'rotta', percorsoIndipendente: false, sommario: '', tipo: 'get' }
    ) SalutaChiunque() {
        return "Ciao";
    }
}


const main = new Main('api');


main.Inizializza("localhost", 8080, true, true).then(() => {
    main.StartHttpServer();
});

//main.PrintMenu();
