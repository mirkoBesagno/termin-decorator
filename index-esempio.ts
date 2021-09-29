import { Main, mpClas, mpMet } from ".";


@mpClas({ percorso: 'persona' })
export class Persona {

    @mpMet({}) SalutaChiunque() {
        return "Ciao";
    }
}


const main = new Main('api');


main.Inizializza("localhost", 8080, true, true);

main.StartHttpServer(); 
