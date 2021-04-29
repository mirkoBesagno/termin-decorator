import { SalvaListaClasseMetaData, TerminaleClasse } from "../classi/terminale-classe";
import chiedi from "prompts";
import fs from 'fs';

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
        let listaNomi = '';
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            const tmp = `
            <li class="nav-item" role="presentation">
                <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#${element.nome}" role="tab" aria-controls="pills-home" aria-selected="true">${element.nome}</a>
            </li>
            `;
            listaNomi = listaNomi + '\n' + tmp;
        }
        let listaMetodi = '';
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            const tmp = `
            <li class="nav-item" role="presentation">
                <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#${element.nome}" role="tab" aria-controls="pills-home" aria-selected="true">${element.nome}</a>
            </li>
            `;
            listaNomi = listaNomi + '\n' + tmp;
        }
        let ritorno = `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>

            <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/pure-min.css"
                integrity="sha384-Uu6IeWbM+gzNVXJcM9XV3SohHtmWE+3VGi496jvgX1jyvDTXfdK+rfZc8C1Aehk5" crossorigin="anonymous">
            <!-- Bootstrap CSS -->
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
                integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">

        </head>

        <body>
            <!-- Option 1: jQuery and Bootstrap Bundle (includes Popper) -->
            <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
                integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
                crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-Piv4xVNRyMGpqkS2by6br4gNJ7DXjqk09RmUpJ8jgGtD7zP9yug3goQfGII0yAns"
                crossorigin="anonymous"></script>

            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li class="nav-item" role="presentation">
                    <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab"
                        aria-controls="pills-home" aria-selected="true">
                        ${listaNomi}
                    </a>
                </li>
            </ul>
            <div class="tab-content" id="pills-tabContent">
                <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                    ${listaMetodi}
                </div>
            </div>

        </body>

        </html>
        `;
        return ritorno;
    }
    GeneraStruttura(path: String) {
        let listaNomi = '';
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            var dir = path + '/' + element.nome;

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            element.GeneraStruttura(dir);
        }
    }
}