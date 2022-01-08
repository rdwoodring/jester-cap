class CommandBuilder {
    private str: string;

    constructor(command: string) {
        this.str = command;
    }

    addUnaryFlagOption(flagName: string) {
        this.str = `${this.str} --${flagName}`;
    }

    addBinaryFlagOption(flagName: string, value: string, flagValueDelimiter = '=') {
        this.str = `${this.str} --${flagName}${flagValueDelimiter}${value}`;
    }

    addNonOptionArgument(argument: string) {
        this.str = `${this.str} ${argument}`;
    }

    toString() {
        return this.str;
    }
}

export default CommandBuilder;