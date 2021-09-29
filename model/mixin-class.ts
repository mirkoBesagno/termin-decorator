

//applying mixing which iterates through properties of baseCtors classes  and copy them to the target class (derivedCtor)
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(derivedCtor.prototype, name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name)??''
            );
        });
    });
}