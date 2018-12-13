import { AppComposer } from '../src/index';
import * as assert from 'assert';

describe('AppComposer', () => {

  it('new AppComposer', () => {
    const config = {
      port: 80
    };
    const ac = new AppComposer('hello', config);
    assert.equal(ac.baseUrl, 'hello');
    assert.ok(ac.express);
  });

});
