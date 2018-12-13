import { AppComposer } from './app-composer';

export interface Invokeable {
  name: string;
  create: () => AppComposer;
}
