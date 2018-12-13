import * as path from 'path';

function snakeToCamel(s: string): string {
  return s.replace(/(\-\w)/g, (m) => m[1].toUpperCase());
}

export class EntryPoint {
  // tslint:disable-next-line: no-any
  public readonly cfg: any;
  public readonly entryPointFile: string;
  public readonly entryPoint: string;
  public readonly appName: string;
  public readonly compose: string;
  // tslint:disable-next-line: no-any
  public readonly packageJson: any;

  // tslint:disable-next-line: no-any
  public constructor(pjs: any, ep: any) {
    this.cfg = ep;
    this.packageJson = pjs;
    this.entryPointFile = ep['entry-point-file'];
    // if (!ep['entry-point-file']) {
    //  throw new Error('entry-point-file has to set');
    // }
    this.compose = ep['compose'] || ep['entry-point'];
    this.entryPoint = ep['entry-point'];
    this.appName = ep['app-name'];
  }
  public jsEntryPoint(): string {
    return snakeToCamel(path.basename(this.entryPoint));
  }
  public jsAppName(): string {
    return snakeToCamel(path.basename(this.packageJson.name));
  }
}
