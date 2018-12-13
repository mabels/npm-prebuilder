import * as assert from 'assert';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { Invocation, EntryPoint } from '../src/index';

describe('Invokation', () => {

  const projectName = 'awesome';

  function createEntryPoint(): EntryPoint {
    const packageJson = {'name': projectName};
    const ep = {
        'entry-point-file': './lib/api-controller',
        'compose': '../../.composed/app-server'
    };
    return new EntryPoint(packageJson, ep);
  }

  it('write invokation', () => {
    const invocation = new Invocation('foo');
    invocation.add(createEntryPoint());
    const tmpFile = `/tmp/${uuid.v4()}`;
    fs.writeFileSync(tmpFile, invocation.build(invocation.jsGlobalRequires));
    const data = fs.readFileSync(tmpFile, 'utf-8');

    assert.equal(data.indexOf(`${projectName} = require(`) >= 0, true, `'projectName' not in generated code`);
    assert.equal(data.indexOf('appServer.addInvokable') >= 0, true, `'addInvokeable' not in generated code`);
    assert.equal(data.indexOf('8080') >= 0, true, `expected default port 8080 in generated code`);
  });

});
