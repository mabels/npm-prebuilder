import { Invocation } from './invocation';

export interface InvokePackage {
  name: string;
  invocation: Invocation;
  localJs: string;
  globalJs: string;
}
