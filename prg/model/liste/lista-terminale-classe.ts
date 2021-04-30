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
        let bodyStart = `<div class="tab">`;
        let bodyEnd = '</div>';
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            const tmp = `<button class="tablinks" onclick="openCity(event, '${element.nome}')">${element.nome}</button>`;
            listaNomi = listaNomi + '\n' + tmp;
        }
        let listaMetodi = '';
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            const tmp = element.GeneraHTML();
            listaNomi = listaNomi + '\n' + tmp;
        }
        let ritorno = `
        <!DOCTYPE html>
        <html>

        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {
                    font-family: Arial;
                }

                /* Style the tab */
                .tab {
                    overflow: hidden;
                    border: 1px solid #ccc;
                    background-color: #f1f1f1;
                }

                /* Style the buttons inside the tab */
                .tab button {
                    background-color: inherit;
                    float: left;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    padding: 14px 16px;
                    transition: 0.3s;
                    font-size: 17px;
                }

                /* Change background color of buttons on hover */
                .tab button:hover {
                    background-color: #ddd;
                }

                /* Create an active/current tablink class */
                .tab button.active {
                    background-color: #ccc;
                }

                /* Style the tab content */
                .tabcontent {
                    display: none;
                    padding: 6px 12px;
                    border: 1px solid #ccc;
                    border-top: none;
                }

                /* Style the accordion content */
                .accordion {
                    background-color: #eee;
                    color: #444;
                    cursor: pointer;
                    padding: 18px;
                    width: 100%;
                    border: none;
                    text-align: left;
                    outline: none;
                    font-size: 15px;
                    transition: 0.4s;
                  }
                  
                /* Style the accordion content */
                  .active, .accordion:hover {
                    background-color: #ccc; 
                  }
                  
                /* Style the accordion content */
                  .panel {
                    padding: 0 18px;
                    display: none;
                    background-color: white;
                    overflow: hidden;
                  }
                  </style>
            </style>
        </head>

        <body>

            <h2>Tabs</h2>
            <p>Click on the buttons inside the tabbed menu:</p>

            ${listaNomi}


            <script>
                function openCity(evt, cityName) {
                    var i, tabcontent, tablinks;
                    tabcontent = document.getElementsByClassName("tabcontent");
                    for (i = 0; i < tabcontent.length; i++) {
                        tabcontent[i].style.display = "none";
                    }
                    tablinks = document.getElementsByClassName("tablinks");
                    for (i = 0; i < tablinks.length; i++) {
                        tablinks[i].className = tablinks[i].className.replace(" active", "");
                    }
                    document.getElementById(cityName).style.display = "block";
                    evt.currentTarget.className += " active";
                }
                var acc = document.getElementsByClassName("accordion");
                var i;

                for (i = 0; i < acc.length; i++) {
                acc[i].addEventListener("click", function() {
                    this.classList.toggle("active");
                    var panel = this.nextElementSibling;
                    if (panel.style.display === "block") {
                    panel.style.display = "none";
                    } else {
                    panel.style.display = "block";
                    }
                });
                }
            </script>

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