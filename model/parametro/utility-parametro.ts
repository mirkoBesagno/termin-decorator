import { INonTrovato, IRitornoValidatore } from "../utility";



export interface IParametriEstratti {
    valoriParametri: any[], nontrovato: INonTrovato[], errori: IRitornoValidatore[]
}

export interface IParametri {
    body: string, query: string, header: string
}