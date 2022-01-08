import {
    exec
} from 'child_process';

import {
    promisify
} from 'util';

const execAsync = promisify(exec);

async function runCommand(...args: Parameters<typeof execAsync>) {
    const [
            command,
            options
        ] = args,
        commandResult = await execAsync(command, options);

    if (commandResult.stderr.toString()) {
        throw new Error(commandResult.stderr.toString());
    }

    return commandResult.stdout.toString();
}

export {
    runCommand
};