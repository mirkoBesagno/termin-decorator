import { ListaTerminaleParametro, Main, mpClas, mpMet, mpMetGen, mpPar, IParametriEstratti, mpProp } from ".";
import { IReturnTest } from "./model/test-funzionale/utility-test-funzionale";
import { IMetodoEventi, IMetodoLimitazioni, IMetodoParametri, IMetodoVettori, IReturn } from "./model/utility";

/* 

*/
@mpClas({ percorso: 'persona' })
export class Persona {

    @mpProp()
    nome: string;

    constructor(nome: string) {
        this.nome = nome;
    }

    @mpMetGen()
    SalutaChiunque() {
        return "Ciao";
    }
    @mpMetGen([{ nome: 'nome', tipo: 'text', posizione: 'query' }], <IMetodoParametri>{ tipo: 'get' })
    SalutaConNome(nome: string) {
        return "Ciao " + nome;
    }
    @mpMetGen(undefined, <IMetodoEventi>{
        Istanziatore: (parametri: IParametriEstratti, listaParametri: ListaTerminaleParametro) => {

            return undefined;
        }
    })
    SalutaColTuoNome() {
        return "Ciao " + this.nome;
    }
}


const main = new Main('api');


main.Inizializza("localhost", 8080, true, true);

main.AggiungiTest([
    {
        nome: 'Testo la rotta SalutaChiunque()',
        numero: 1,
        numeroRootTest: 0,
        testUnita: {
            nome: '',
            FunzioniDaTestare: () => {
                const persone = new Persona('mirko io persona');
                persone.SalutaChiunque();
                return <IReturnTest>{};
            },
        }
    }
]);


main.StartHttpServer(); 
