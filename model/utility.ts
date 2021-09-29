
export type tipo = "number" | "text" | "date" | "array" | "object" | "boolean" | "any";

export type TypeDovePossoTrovarlo = TypeInterazone | "qui" | 'non-qui';

export const targetTerminale = { name: 'Terminale' };

export interface IGestorePercorsiPath {
    percorsi: IRaccoltaPercorsi;
}

/**
 * questa interfaccia aggrega le varie parti di un percorso
 */
export interface IRaccoltaPercorsi {
    pathGlobal: string, patheader: string, porta: number
}
export interface IContieneRaccoltaPercorsi {
    percorsi: IRaccoltaPercorsi;
}

export type TypeInterazone = "rotta" | "middleware" | 'ambo';

export interface IHtml {
    path: string,
    percorsoIndipendente?: boolean,

    htmlPath?: string,
    html?: string,
    contenuto: string
}

/*!!!
si potrebbe mettere un trovati cosi da averlo in questo caso e
 ìn tutti gli altri quando si vanno ad estrarre i parametri. 
 */
export interface IReturn {
    // eslint-disable-next-line @typescript-eslint/ban-types
    body: object | string;
    stato: number;
    nonTrovati?: INonTrovato[];
    inErrore?: IRitornoValidatore[];
    attore?: any;
}

export interface INonTrovato {
    nome: string, posizioneParametro: number
}

export interface IRitornoValidatore {
    // eslint-disable-next-line @typescript-eslint/ban-types
    body?: object | string,
    approvato: boolean,
    messaggio: string,
    stato?: number,
    terminale?: IParametro
}


export interface IParametro {
    /** nome del parametro, in pratica il nome della variabile o un nome assonante (parlante)*/
    nome?: string,
    /** la posizione rispetto alla chiamata, ovvero: "body" | "query" | "header" */
    posizione?: TypePosizione,
    /** fa riferimento al tipo di base, ovvero: "number" | "text" | "date" */
    tipo?: tipo,
    /** descrizione lunga */
    descrizione?: string,
    /** descrizione breve */
    sommario?: string,
    /*indica se il parametro è controllato nel metodo corrente o in un 'altro metodo per esempio in un middleware */
    dovePossoTrovarlo?: TypeDovePossoTrovarlo,
    /*indica se il paramtro è un autenticatore, per esempio come un barrer token o un username, questo puo essere reperito facimente in ListaTerminaleParametro o IParametriEstratti */
    autenticatore?: boolean,

    obbligatorio?: boolean;

    Validatore?: (parametro: any) => IRitornoValidatore

    schemaSwagger?: {
        nome: string,
        valoreEsempio: string,
        tipo: string
    }[]
}

export interface IRitornoValidatore {
    // eslint-disable-next-line @typescript-eslint/ban-types
    body?: object | string,
    approvato: boolean,
    stato?: number,
    messaggio: string,
    terminale?: IParametro
}

export interface IDescrivibile {
    descrizione?: string;
    sommario?: string;
}

export interface ILogbase {
    data: Date;
    // eslint-disable-next-line @typescript-eslint/ban-types
    body: object;
    // eslint-disable-next-line @typescript-eslint/ban-types
    params: object;
    // eslint-disable-next-line @typescript-eslint/ban-types
    header: object;
    local: string;
    remote: string;
    url: string;
    nomeMetodo?: string
}

export type TypePosizione = "body" | "query" | 'header';

export interface IParametriEstratti {
    valoriParametri: any[], nontrovato: INonTrovato[], errori: IRitornoValidatore[]
}

export interface IParametriEstratti {
    valoriParametri: any[], nontrovato: INonTrovato[], errori: IRitornoValidatore[]
}