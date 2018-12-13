import * as path from 'path';
import * as fs from 'fs';
import { Names } from './names';

export interface PackageJsonAppComposer {
  'entry-point-file': string;
  compose: string;
}

export interface PackageJsonSchema {
  name: string;
  version: string;
  main: string;
  license: string;
  author: string;
  scripts: {
    [id: string]: string
  };
  dependencies?: { [id: string]: string };
  devDependencies?: { [id: string]: string };
  'app-composer'?: { [id: string]: PackageJsonAppComposer };
}

export class PackageJson implements PackageJsonSchema {
  public readonly name: string;
  public readonly version: string;
  public readonly main: string;
  public readonly license: string;
  public readonly author: string;

  public readonly scripts: {};

  public readonly dependencies?: { [id: string]: string };
  public readonly devDependencies?: { [id: string]: string };
  public readonly 'app-composer'?: { [id: string]: PackageJsonAppComposer };

  public static read(basePath: string, startPath = ''): PackageJson {
    basePath = path.resolve(basePath);
    startPath = startPath == '' ? basePath : startPath;
    const packageJsonFname = basePath.endsWith('package.json') ? basePath : path.join(basePath, 'package.json');

    if (fs.existsSync(packageJsonFname)) {
      return new PackageJson(JSON.parse(fs.readFileSync(packageJsonFname).toString()));
    }

    if (path.dirname(basePath) == basePath) {
      throw Error(`Unable to find package.json in '${startPath}'`);
    }

    return this.read(path.dirname(basePath), startPath);
  }

  public static writeDummy(pkgName: string, directory: string, pkgs: Names[]): string {
    const packagesJson: PackageJsonSchema = {
      name: pkgName,
      version: '99.98.97',
      main: './lib/index.js',
      license: 'UNLICENSED',
      author: 'composer',
      scripts: {
        start: 'exec node index.js',
        watch: "node -e 'require(\"app-composer\").startWatchComposer(process.cwd())'",
        bootstrap: [
         'echo "add app-composer dependency"',
         'yarn add app-composer@1.5.10 --dev --pure-lockfile',
         'echo "app-composer create buildpack"',
         'node -e \'require("app-composer").createBuildPack(process.cwd());\'',
         'echo "install dependencies ..."',
         'yarn install --pure-lockfile',
         'echo "install local dependencies and create startup script ..."',
         'node -e \'require("app-composer").createStartup(process.cwd());\'',
        ].join(' ; ')
      },
      devDependencies: {},
      dependencies: {}
    };
    pkgs.forEach((names) => {
      packagesJson.dependencies[names.packageJson.name] = `${names.packageJson.version}`;
    });
    const packageJsonFname = path.join(directory, 'package.json');
    fs.writeFileSync(packageJsonFname, JSON.stringify(packagesJson, null, 2));
    return packageJsonFname;
  }

  public static findPathTo(str: string): string {
    if (str.length === 0) { return null; }
    const stat = fs.statSync(str);
    if (!stat) {
      throw new Error(`this must be somewhere ${str}`);
    }
    let pjson: string;
    let base: string;
    if (stat.isDirectory()) {
      base = str;
      pjson = path.join(base, 'package.json');
    } else {
      base = path.dirname(str);
      pjson = path.join(base, 'package.json');
    }
    const ret = fs.existsSync(pjson);
    if (!ret) {
      if (base != path.dirname(base)) {
        return this.findPathTo(path.dirname(base));
      } else {
        return null;
      }
    }
    return base;
  }

  public static isComposable(schema: PackageJsonSchema): boolean {
    return typeof schema !== 'undefined' && !!schema['app-composer'];
  }

  public constructor(schema: PackageJsonSchema) {
    this.name = schema.name;
    this.version = schema.version;
    this.main = schema.main;
    this.license = schema.license;
    this.author = schema.author;
    this.scripts = schema.scripts;
    this.dependencies = schema.dependencies;
    this.devDependencies = schema.devDependencies;
    this['app-composer'] = schema['app-composer'];
  }

  public write(destination: string): void {
    try {
      fs.writeFileSync(destination, JSON.stringify(this, null, 2), 'utf8');
    } catch (e) {
      console.log(`unable to write package json to ${destination}`, e);
      throw e;
    }
  }

  public mergeDependencies(pkgJson: PackageJson): PackageJson {
    return new PackageJson({
      name: this.name,
      version: this.version,
      main: this.main,
      license: this.license,
      author: this.author,
      scripts: this.scripts,
      devDependencies: { ...this.devDependencies, ...pkgJson.devDependencies },
      dependencies: { ...this.dependencies, ...pkgJson.dependencies }
    });
  }

  public removeDependencies(packageNames: string[]): PackageJson {
    const dependencies: { [id: string]: string } = {};
    const devDependencies: { [id: string]: string } = {};

    Object.keys(this.dependencies).forEach((depName) => {
      if (packageNames.indexOf(depName) < 0) {
        dependencies[depName] = this.dependencies[depName];
        devDependencies[depName] = this.devDependencies[depName];
      }
    });

    return new PackageJson({
      name: this.name,
      version: this.version,
      main: this.main,
      license: this.license,
      author: this.author,
      scripts: this.scripts,
      devDependencies: devDependencies,
      dependencies: dependencies
    });
  }
}
