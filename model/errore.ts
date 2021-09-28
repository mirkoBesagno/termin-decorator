
/**
 * @messaggio : inserisci qui il messaggio  sara incontenuto del body o del testo nel .send() di express
 * @codiceErrore inserisci qui l'errore che sara posi messo nello stato della risposta express
 * @nomeClasse inserire solo se si alla creazione ovvero nel throw new ErroreMio(....)
 * @nomeFunzione inserire solo se si alla creazione ovvero nel throw new ErroreMio(....)
 * @percorsoErrore campo gestito dala classe GestioneErrore, se proprio si vuole inserire solo se si è nella fase di rilancio di un errore
 */
export interface IErroreMio {
    messaggio: string,
    codiceErrore: number,
    nomeClasse?: string,
    nomeFunzione?: string,
    percorsoErrore?: string
}

export class ErroreMio extends Error {
    codiceErrore: number;
    percorsoErrore?: string;
    private nomeClasse?: string;
    private nomeFunzione?: string;
    constructor(item: IErroreMio) {
        super(item.messaggio);
        this.codiceErrore = item.codiceErrore;
        if (item.percorsoErrore) {
            this.percorsoErrore = item.percorsoErrore;
        }
        if (item.nomeClasse) {
            this.nomeClasse = item.nomeClasse;
            this.percorsoErrore = this.percorsoErrore + '_CLASSE_->' + this.nomeClasse
        }
        if (item.nomeFunzione) {
            this.nomeFunzione = item.nomeFunzione;
            this.percorsoErrore = this.percorsoErrore + '_FUNZIONE_->' + this.nomeFunzione
        }
    }
}


export interface IGestioneErrore {
    error: Error,
    nomeClasse?: string,
    nomeFunzione?: string
}


export function GestioneErrore(item: IGestioneErrore): ErroreMio {
    let errore: ErroreMio;
    const messaggio = '_CLASSE_->' + item.nomeClasse ?? '' + '_FUNZIONE_->' + item.nomeFunzione;
    if (item.error instanceof ErroreMio) {
        const tmp: ErroreMio = <ErroreMio>item.error;
        tmp.percorsoErrore = messaggio + '->' + tmp.percorsoErrore;
        errore = tmp;
    }
    else {
        errore = new ErroreMio({
            codiceErrore: 499,
            messaggio: '' + item.error,
            percorsoErrore: messaggio
        });
    }
    return errore;
}