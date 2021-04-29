import { SalvaListaClasseMetaData, TerminaleClasse } from "../classi/terminale-classe";
import chiedi from "prompts";

export class ListaTerminaleClasse extends Array<TerminaleClasse> {
    static nomeMetadataKeyTarget = "ListaTerminaleClasse";

    constructor() {
        super();
    }
    async PrintMenu() {
        const tab = '\t';
        console.log(tab + "ListaTerminaleClasse" + '->' + 'PrintMenu');
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            await element.PrintMenu();
        }
    }
    async PrintListaClassi(): Promise<string[]> {
        let ritorno: string[] = [];
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            const tmp = index + 1;
            ritorno.push(element.percorsi.pathGlobal);
            console.log(tmp + ': ' + element.nome + ' | ' + element.percorsi.pathGlobal);
        }
        return ritorno;
    }
    async PrintMenuClassi() {
        await this.PrintListaClassi();
        const scelta = await chiedi({ message: 'Scegli classe: ', type: 'number', name: 'scelta' });

        if (scelta.scelta == 0) {
        }
        else {
            await this[scelta.scelta - 1].PrintMenuClasse();
            await this.PrintListaClassi();
        }

    }
    CercaConNome(nome: string | Symbol): TerminaleClasse | undefined {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.nome == nome) return element;
        }
        return undefined;
        //throw new Error("Errore mio !");

    }
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
    CercaMetodo() {

    }
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

    GeneraHTML() {
        let lista = '';
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            const tmp = `
            <li class="pure-menu-item">
                <a href="#" class="pure-menu-link">${element.nome}</a>
            </li>
            `;
            lista = lista + '\n' + tmp;
        }
        let ritorno = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>

            <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/pure-min.css" integrity="sha384-Uu6IeWbM+gzNVXJcM9XV3SohHtmWE+3VGi496jvgX1jyvDTXfdK+rfZc8C1Aehk5" crossorigin="anonymous">
        </head>
        <body>
            <div class="pure-menu pure-menu-horizontal pure-menu-scrollable">
                <a href="#" class="pure-menu-link pure-menu-heading">Yahoo</a>
                <ul class="pure-menu-list">
                    ${lista}
                </ul>
            </div>            
        </body>
        </html>
        `;
        return ritorno;
    }
}