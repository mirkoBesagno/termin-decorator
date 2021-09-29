

import chiedi from "prompts"; 
import { SalvaListaClasseMetaData } from "../utility";
import { TerminaleClasse } from "./metadata-classe";

export class ListaTerminaleClasse extends Array<TerminaleClasse> {
    static nomeMetadataKeyTarget = "ListaTerminaleClasse";

    constructor() {
        super();
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    CercaConNome(nome: string | Symbol): TerminaleClasse | undefined {
        try {
            for (let index = 0; index < this.length; index++) {
                const element = this[index];
                if (element.nome == nome) return element;
            }
            return undefined;
        } catch (error: any) {
            console.log("Errore.");
            throw error;
        }
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    CercaConPath(path: string | Symbol): TerminaleClasse | undefined {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.GetPath == path) return element;
        }
        return undefined;
        //throw new Error("Errore mio !");

    }
    CercaConNomeSeNoAggiungi(nome: string) {
        /* poi la cerco */
        let classe = this.CercaConNome(nome);
        if (classe == undefined) {
            classe = new TerminaleClasse(nome); //se il metodo non c'è lo creo
            this.AggiungiElemento(classe);
            SalvaListaClasseMetaData(this);
        }
        return classe;
    }
    /* CercaMetodo() {

    } */

    AggiungiElemento(item: TerminaleClasse) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.nome == item.nome) {
                this[index] = item;
                return item;
            }
        }
        this.push(item);
        return item;
    }

    /************************************************************* */


    async PrintMenuClassi() {
        await this.PrintListaClassi();
        const scelta = await chiedi({ message: 'Scegli classe: ', type: 'number', name: 'scelta' });

        if (scelta.scelta != 0) {
            await this[scelta.scelta - 1].PrintMenuClasse();
            //await this.PrintListaClassi();
            await this.PrintMenuClassi();
        }

    }
    async PrintListaClassi(): Promise<string[]> {
        const ritorno: string[] = [];
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            const tmp = index + 1;
            ritorno.push(element.percorsi.pathGlobal);
            console.log(tmp + ': ' + element.nome + ' | ' + element.percorsi.pathGlobal);
        }
        return ritorno;
    }
}