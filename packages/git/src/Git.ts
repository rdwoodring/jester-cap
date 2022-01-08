import path from 'path';
import {
    exec
} from 'child_process';

import {
    promisify
} from 'util';

import lsFiles from './interrogations/lsFiles';

const execAsync = promisify(exec);

class Git {
    // private repoRoot: ReturnType<typeof path.parse>;

    async getRepoRoot() {
        // git rev-parse --show-toplevel

        // try {
        //     const result = await exec('git rev-parse --show-toplevel');

        // } catch (e) {

        // }

        const result = await execAsync('git rev-parse --show-toplevel');

        if (result.stderr?.toString()) {
            throw new Error(result.stderr.toString());
        }

        // return result.stdout.toString();
        return path.normalize(result.stdout?.toString().trim() || '');
    }

    async lsFiles(options: Parameters<typeof lsFiles>[0]) {
        // const command
        const repoRoot = await this.getRepoRoot();

        return lsFiles(options, repoRoot);
    }
}

export default Git;