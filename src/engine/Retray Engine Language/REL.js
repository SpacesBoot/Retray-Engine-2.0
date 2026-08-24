class Interpeter {
    constructor() {
        this.variables = {};
    }

    tokenize(code) {
        return code
        .replace(/\/\/.*/g, '')
        .match(/[a-zA-Z_]\w*|[0-9]+|[{}=;><]/g) || [];
    }

    execute(code) {
        const tokens = this.tokenize(code);
        let i = 0;

        while(i < tokens.length) {
            const token = tokens[i];

            if ( token === "set" ) {
                const name = tokens[i+1];
                const valor = parseInt(tokens[i+3]);

                this.variables[name] = valor;
                i += 5;
            } else if ( token === "write" ) {
                const valor = parseInt(tokens[i + 1]);
                i += 3;
                return valor;
            }
        }
    }
}