import { Names } from './names';

export class Suffixes {
  public readonly values: string[];
  public readonly names: Names;
  public constructor(names: Names) {
    this.names = names;
    this.values = [names.invocationJson, names.npmPackage];
  }
}
