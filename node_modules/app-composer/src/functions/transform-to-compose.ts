import { EntryPoint } from '../types/entry-point';
// tslint:disable-next-line: no-any
export function transformToCompose(pjs: any, appComposer: any): Map<string, EntryPoint[]> {
  const perCompose = new Map<string, EntryPoint[]>();
  Object.keys(appComposer).forEach((epName) => {
    console.log(`entryPoint=${epName}`);
    const ep = appComposer[epName];
    const key = ep['compose'] || epName;
    let add = perCompose.get(key);
    if (!add) {
      add = [];
      perCompose.set(key, add);
    }
    ep['entry-point'] = ep['entry-point'] || key;
    ep['app-name'] = ep['app-name'] || key;
    add.push(new EntryPoint(pjs, ep));
  });
  return perCompose;
}
