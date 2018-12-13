import { getPackageJsonFromArchive } from '../src/functions/archive-reader';
import * as assert from 'assert';
import * as path from 'path';

describe('getPackageJsonFromArchive', () => {
  it('read', async () => {
      return new Promise((rs, rj) => {
        getPackageJsonFromArchive(path.resolve('./test/data/test-1.5.0.tgz')).then((pkgJson) => {
            assert.equal(pkgJson.name, 'test');
            rs('success');
          }).catch((e) =>  {
              try {
                assert.fail(e);
              } catch (e) {
                  rj(e);
              }
          });
      });

  });
});
