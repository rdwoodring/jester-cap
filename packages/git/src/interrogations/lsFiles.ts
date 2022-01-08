import {
    paramCase
} from 'change-case';

import {
    arrayifyPrimitive,
    transformIfDefined
} from 'utils';

import CommandBuilder from '../command-builders/CommandBuilder';
import {
    runCommand
} from '../command-runners/runCommand';

type FileTypes = 'cached' | 'deleted' | 'others' | 'ignored' | 'stage' | 'unmerged' | 'killed' | 'modified';

interface Options {
    abbrev?: number,
    debug?: boolean,
    errorUnmatch?: boolean,
    exclude?: string | string[],
    excludeFrom?: string | string[],
    excludePerDirectory?: string | string[],
    excludeStandard?: boolean,
    files?: string[],
    fullName?: boolean
}

interface OptionsWithTree extends Options {
    errorUnmatch: true,
    fileTypes?: Exclude<FileTypes, 'stage' | 'unmerged'>[],
    withTree: string
}

interface OptionsWithoutTree extends Options {
    fileTypes?: FileTypes[]
}

function arrayifyIfDefined(item?: string | number | boolean | (string | number | boolean)[]) {
    return transformIfDefined(item, arrayifyPrimitive);
}

// git ls-files -mo --directory --exclude-from=.gitignore

const unaryOptions = [
        'debug',
        'errorUnmatch',
        'excludeStandard',
        'fullName'
    ];

async function lsFiles(options: OptionsWithTree | OptionsWithoutTree, repoRoot: string) {
    const arrayifiedOptions = {
            ...options,
            exclude: arrayifyIfDefined(options.exclude),
            excludeFrom: arrayifyIfDefined(options.excludeFrom),
            excludePerDirectory: arrayifyIfDefined(options.excludePerDirectory)
        },
        {
            files,
            fileTypes,
            ...nonSpecialOptions
        } = arrayifiedOptions,
        commandBuilder = new CommandBuilder('git ls-files');

    Object.entries(nonSpecialOptions)
        .forEach((entry) => {
            const [
                optionKey,
                optionValue
            ] = entry;

            if (unaryOptions.includes(optionKey) && optionValue === true) {
                commandBuilder.addUnaryFlagOption(paramCase(optionKey));
            } else if (optionValue?.length) {
                commandBuilder.addBinaryFlagOption(paramCase(optionKey), Array.isArray(optionValue) ? optionValue.join(',') : optionValue);
            }
        });

    if (fileTypes) {
        fileTypes.forEach((fileType) => {
            commandBuilder.addUnaryFlagOption(fileType);
        });
    }

    if (files) {
        commandBuilder.addUnaryFlagOption('');

        files.forEach((file) => {
            commandBuilder.addNonOptionArgument(file);
        });
    }

    return runCommand(commandBuilder.toString(), {
        cwd: repoRoot
    });
}

export default lsFiles;