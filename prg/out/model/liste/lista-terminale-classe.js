"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListaTerminaleClasse = void 0;
const terminale_classe_1 = require("../classi/terminale-classe");
const prompts_1 = __importDefault(require("prompts"));
const fs_1 = __importDefault(require("fs"));
class ListaTerminaleClasse extends Array {
    constructor() {
        super();
    }
    PrintMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            const tab = '\t';
            console.log(tab + "ListaTerminaleClasse" + '->' + 'PrintMenu');
            for (let index = 0; index < this.length; index++) {
                const element = this[index];
                yield element.PrintMenu();
            }
        });
    }
    PrintListaClassi() {
        return __awaiter(this, void 0, void 0, function* () {
            let ritorno = [];
            for (let index = 0; index < this.length; index++) {
                const element = this[index];
                const tmp = index + 1;
                ritorno.push(element.percorsi.pathGlobal);
                console.log(tmp + ': ' + element.nome + ' | ' + element.percorsi.pathGlobal);
            }
            return ritorno;
        });
    }
    PrintMenuClassi() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.PrintListaClassi();
            const scelta = yield prompts_1.default({ message: 'Scegli classe: ', type: 'number', name: 'scelta' });
            if (scelta.scelta == 0) {
            }
            else {
                yield this[scelta.scelta - 1].PrintMenuClasse();
                yield this.PrintListaClassi();
            }
        });
    }
    CercaConNome(nome) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.nome == nome)
                return element;
        }
        return undefined;
        //throw new Error("Errore mio !");
    }
    CercaConPath(path) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.GetPath == path)
                return element;
        }
        return undefined;
        //throw new Error("Errore mio !");
    }
    CercaConNomeSeNoAggiungi(nome) {
        /* poi la cerco */
        let classe = this.CercaConNome(nome);
        if (classe == undefined) {
            classe = new terminale_classe_1.TerminaleClasse(nome); //se il metodo non c'è lo creo
            this.AggiungiElemento(classe);
            terminale_classe_1.SalvaListaClasseMetaData(this);
        }
        return classe;
    }
    CercaMetodo() {
    }
    AggiungiElemento(item) {
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
        let stile = `
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
        `;
        let listaNomi = '';
        let bodyStart = `<div class="tab">`;
        let bodyEnd = '</div>';
        listaNomi = listaNomi + bodyStart;
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            const tmp = `<button class="tablinks" onclick="openCity(event, '${element.nome}')">${element.nome}</button>`;
            listaNomi = listaNomi + '\n' + tmp;
        }
        listaNomi = listaNomi + bodyEnd;
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            bodyStart = `<div id="${element.nome}" class="tabcontent">`;
            bodyEnd = '</div>';
            const tmp = element.GeneraHTML();
            listaNomi = listaNomi + '\n' + bodyStart + tmp + bodyEnd;
        }
        let ritorno = `
        <!DOCTYPE html>
        <html>

        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                ${stile}
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
    GeneraStruttura(path) {
        let listaNomi = '';
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            var dir = path + '/' + element.nome;
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir);
            }
            element.GeneraStruttura(dir);
        }
    }
}
exports.ListaTerminaleClasse = ListaTerminaleClasse;
ListaTerminaleClasse.nomeMetadataKeyTarget = "ListaTerminaleClasse";
//# sourceMappingURL=lista-terminale-classe.js.map