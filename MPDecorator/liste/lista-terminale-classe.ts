import { TerminaleClasse } from "../classi/terminale-classe";

        export class ListaTerminaleClasse extends Array<TerminaleClasse> {
            static nomeMetadataKeyTarget = "ListaTerminaleClasse";
            constructor() {
                super();
            }
            PrintMenu() {        
                const tab = '\t';        
                console.log(tab+"ListaTerminaleClasse"+'->'+'PrintMenu');                
                for (let index = 0; index < this.length; index++) {
                    const element = this[index];
                    element.PrintMenu();
                }
            }
            CercaConNome(nome: string): TerminaleClasse | undefined {
                for (let index = 0; index < this.length; index++) {
                    const element = this[index];
                    if (element.nome == nome) return element;
                }
                return undefined;
                //throw new Error("Errore mio !");

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
        }