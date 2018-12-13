import * as path from 'path';
import { PackageJson } from '../types/package-json';
import { extractor } from './extractor';
import { writeComposedJs } from './write-composed-js';
import { Names } from '../types/names';
import { getPackageJsonFromArchive } from './archive-reader';

export async function getArchives(basePath: string): Promise<string[]> {
    // tslint:disable-next-line: no-var-requires no-require-imports
    const globby = require('globby');
    const globFiles = `${basePath}/**/*tgz`;
    const globExcludeNodeModules = `!${basePath}/node_modules`;

    return await globby([globFiles, globExcludeNodeModules]);
}

export function extractArchives(archives: string[], destination: string): Promise<Names[]> {
    return extractor(path.join(destination, 'node_modules'), createNames(archives));
}

function createNames(archives: string[]): Names[] {
    return archives.map((archive) => {
        return {
            package: '',
            invocationJson: '',
            npmPackage: archive
        };
    });
}

export function createCombinedPackageJson(packageFiles: PackageJson[], basePath: string): PackageJson {
    let result = PackageJson.read(basePath);

    packageFiles.forEach((pkg) => {
        result = result.mergeDependencies(pkg);
    });

    result = result.removeDependencies(packageFiles.map((p) => p.name));
    result.write(path.join(basePath, 'package.json'));
    return result;
}

function createStartupScript(names: Names[], basePath: string): void {
    console.log(`write startup script to ${basePath}`);
    writeComposedJs('composed', basePath, names);
}

export function readPackageJsonFromArchives(archives: string[]): Promise<PackageJson[]> {
    return Promise.all(archives.map((a) => getPackageJsonFromArchive(a)));
}

export function createBuildPack(basePath: string): void {
    getArchives(basePath).then((archives) => {
        if (!archives) {
            return;
        }

        readPackageJsonFromArchives(archives).then((files) => {
            createCombinedPackageJson(files, basePath);
        }).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
}

export function createStartup(basePath: string): void {
    getArchives(basePath).then((archives) => {
        if (!archives) {
            return;
        }

        readPackageJsonFromArchives(archives).then((files) => {
            extractArchives(archives, basePath)
            .then((names) => createStartupScript(names, basePath))
            .catch((e) => console.error(e));
        }).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
}
