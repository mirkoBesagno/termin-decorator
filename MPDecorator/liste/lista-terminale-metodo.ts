import { Router } from "express";
import { TerminaleMetodo } from "../classi/terminale-metodo";

        export class ListaTerminaleMetodo extends Array<TerminaleMetodo> {
            static nomeMetadataKeyTarget = "ListaTerminaleMetodo";
            rotte: Router;
            constructor(rotte: Router) {
                super();
                this.rotte = rotte;
            }
            CercaConNome(nome: string, classePath:string): TerminaleMetodo | undefined {
                for (let index = 0; index < this.length; index++) {
                    const element = this[index];
                    if (element.nome == nome && element.classePath == classePath) return element;
                }
                return undefined;
                //throw new Error("Errore mio !");

            }
            AggiungiElemento(item: TerminaleMetodo) {
                for (let index = 0; index < this.length; index++) {
                    const element = this[index];
                    if (element.nome == item.nome && element.classePath == item.classePath) {
                        this[index] = item;
                        this.rotte = item.ConfiguraRotta(this.rotte);
                        return item;
                    }
                }
                this.push(item);
                this.rotte = item.ConfiguraRotta(this.rotte);
                return item;
            }
        }