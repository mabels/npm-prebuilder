import * as execa from 'execa';
import { WatcherState } from './watcher-state';
import { writeComposedJs } from '../functions/write-composed-js';
import { lstEqual } from '../functions/lst-equal';
import { getArchives,
  createCombinedPackageJson,
  readPackageJsonFromArchives,
  extractArchives } from '../functions/packer';

export class Watcher {
  public prevPkgs: string[] = [];
  public started?: execa.ExecaChildProcess;
  public watcherState: WatcherState;
  public watcherSrc: string;
  public readonly watchDir: string;
  public readonly baseDir: string;
  public readonly pkgName: string;

  public constructor(pkgName: string, baseDir: string, watchDir: string) {
    this.pkgName = pkgName;
    this.baseDir = baseDir;
    this.watchDir = watchDir;
    this.watcherState = WatcherState.COULDSTARTED;
    this.dog = this.dog.bind(this);
  }

  private run(fname: string): void {
    const exec = execa('node', [fname]);
    console.log(`starting node ${fname}:${exec.pid}`);
    exec.stdout.pipe(process.stdout);
    exec.stderr.pipe(process.stderr);
    exec.catch(() => {
      console.log(`abort node got killed ${exec.pid}`);
    }).then(() => {
      console.log(`node got killed ${exec.pid} restarting`);
      this.run(fname);
    });
    this.started = exec;
  }

  private restartComposeJs(fname: string): void {
    if (this.started) {
      const started = this.started;
      // started.on('close', () => {
      //   console.log(`got close ${started.pid}`);
      //   this.run(fname);
      // });
      console.log(`doing kill node ${started.pid}`);
      started.kill();
    } else {
      this.run(fname);
    }
  }

  public restartDog(src: string): void {
    if (this.watcherState === WatcherState.RESTART) {
      this.dog(src);
      return;
    }
    this.watcherState = WatcherState.COULDSTARTED;
  }

  public dog(src: string): void {
    console.log(`source: ${src}:${this.watcherState}`);
    if (this.watcherState === WatcherState.RESTART) {
      this.watcherSrc = src;
      return;
    }
    this.watcherState = WatcherState.RESTART;

    getArchives(this.baseDir).then((archives) => {
      if (!archives) {
          return;
      }

      readPackageJsonFromArchives(archives).then((files) => {
        const packageJson = createCombinedPackageJson(files, this.baseDir);

        const pkgsNames: string[] = [];
        Object.keys(packageJson.dependencies).reduce((pkgs, dep) => { pkgs.push(dep); return pkgs; }, pkgsNames);
        Object.keys(packageJson.devDependencies).reduce((pkgs, dep) => { pkgs.push(dep); return pkgs; }, pkgsNames);

        if (!lstEqual(pkgsNames, this.prevPkgs)) {
          this.prevPkgs = pkgsNames;
          console.log(`Yarn Setup needed`);
          execa.sync('yarn', []);
        }
        extractArchives(archives, this.baseDir).then((pkgs) => {
          const composeJsFname = writeComposedJs(this.pkgName, this.baseDir, pkgs);
          this.restartComposeJs(composeJsFname);
          this.watcherState = WatcherState.COULDSTARTED;
          this.restartDog(this.watcherSrc);
        }).catch((e) => {
          console.error(e);
        });
      }).catch((e) => console.error(e));
    }).catch((e) => {
      console.error(e);
    });
  }

}
