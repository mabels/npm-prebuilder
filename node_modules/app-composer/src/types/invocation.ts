import { EntryPoint } from './entry-point';
import { InvokableArgs } from './invokable-args';
import { loadConfig } from '../functions/config-loader';

export class Invocation {
  public readonly packageName: string;
  public readonly jsEntryPoints: string[];
  public readonly jsLocalRequires: string[];
  public readonly jsGlobalRequires: string[];
  private invokableArgs: InvokableArgs;

  // tslint:disable-next-line: no-any
  public static fill(obj: any): Invocation {
    return new Invocation(obj.packageName, obj.jsEntryPoints,
      obj.jsLocalRequires, obj.jsGlobalRequires);
  }

  public constructor(packageName: string,
    jeps: string[] = [], jlrs: string[] = [], jgrs: string[] = []) {
    this.packageName = packageName;
    this.jsEntryPoints = jeps;
    this.jsLocalRequires = jlrs;
    this.jsGlobalRequires = jgrs;
  }

  public merge(other: Invocation): void {
    this.jsEntryPoints.push.apply(this.jsEntryPoints, other.jsEntryPoints);
    this.jsLocalRequires.push.apply(this.jsLocalRequires, other.jsLocalRequires);
    this.jsGlobalRequires.push.apply(this.jsGlobalRequires, other.jsGlobalRequires);
  }

  private getInvokableArgs(): InvokableArgs {
    if (!this.invokableArgs) {
      try {
        this.invokableArgs = loadConfig(process.cwd()).invokationArgs;
      } catch (e) {
        console.warn('could not load invokation args. Using stub args.');
        this.invokableArgs = {
          preamble: () => ['// preamble'],
          createServer: () => ['// create server'],
          startServer: () => ['// start server'],
          appServerConfig: () => { return { port: '8080' }; }
        };
      }
    }
    return this.invokableArgs;
  }

  private createServer(): string[] {
    return this.getInvokableArgs().createServer();
  }

  public add(entryPoint: EntryPoint): void {
    // console.log(`XXX:${JSON.stringify(entryPoint, null, 2)}`);
    if (entryPoint.entryPointFile) {
      const jsEntryPoint = `entryPoint${entryPoint.jsAppName()}`;
      this.jsLocalRequires.push(`const ${jsEntryPoint} = require('${entryPoint.entryPointFile}');`);
      this.jsGlobalRequires.push(
        `const ${jsEntryPoint} = require('${entryPoint.packageJson.name}/${entryPoint.entryPointFile}');`);
      this.jsEntryPoints.push(`appServer.addInvokable(${jsEntryPoint}.factory())`);
    }
  }

  private startServer(): string[] {
    return this.getInvokableArgs().startServer();
  }

  private preamble(): string[] {
    return this.getInvokableArgs().preamble();
  }

  private initAppServer(): string[] {
    return [
      'const appServer = new AppServer();',
      `const appServerConfig = ${JSON.stringify(this.getInvokableArgs().appServerConfig())};`,
    ];
  }

  public build(reqs: string[]): string {
    const js = this.preamble()
      .concat(reqs)
      .concat(this.createServer())
      .concat(this.initAppServer())
      .concat(this.jsEntryPoints)
      .concat(this.startServer());
    return js.join('\n');
  }

}
