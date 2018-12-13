import * as path from 'path';
import * as fs from 'fs';

import { AppComposerConfig } from '../types/app-composer-config';
import { InvokableArgs } from '../types/invokable-args';

const constFileName = 'app-composer.config';

function findConfig(basePath: string): string {
    if (basePath == '/' || basePath == '.') {
        return null;
    }

    const filePath = path.join(basePath, constFileName);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return filePath;
    }

    return findConfig(path.dirname(basePath));
}

function loadInvokationArgs(identifier: string): InvokableArgs {
    try {
        return require(identifier);
    } catch (e) {
        throw Error('unable to load invokation args');
    }
}

export function loadConfig(basePath: string): AppComposerConfig {
    const configPath = findConfig(basePath);
    if (!configPath) {
        throw Error('loadConfig: unable to find app composer config.');
    }
    const config = JSON.parse(fs.readFileSync(configPath).toString());
    return {
        invokationArgs: loadInvokationArgs(config['invokation-args'])
    };
}
