import * as fs from 'fs';
import * as path from 'path';
import { PackageJson } from '../types/package-json';
import { transformToCompose } from './transform-to-compose';
import { invokePackage } from './invoke-package';

export function startApp(basePath: string = './'): void {
  const packageJson = PackageJson.read(basePath);
  if (!PackageJson.isComposable(packageJson)) {
    return;
  }
  const appComposer = packageJson['app-composer'];
  const perCompose = transformToCompose(packageJson, appComposer);
  perCompose.forEach((entryPoints, packageName) => {
    const ip = invokePackage(basePath, path.basename(packageName), entryPoints);
    fs.writeFileSync(ip.name, ip.localJs);
    // tslint:disable-next-line: no-eval
    // (() => { eval(js.js); })();
    require(ip.name);
  });
}
