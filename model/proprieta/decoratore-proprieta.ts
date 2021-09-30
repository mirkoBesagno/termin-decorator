import { IProprieta } from "../utility";
import { IstanzaProprieta } from "./istanza-proprieta";



function decoratoreProprieta(item?: IProprieta) {
    /* 

    propertyKey: nome parametro
    */
    return (target: Object, propertyKey: PropertyKey): any => {
        new IstanzaProprieta(target.constructor.name, propertyKey.toString(), item);
    };
}

export { decoratoreProprieta as mpProp };