import { PackageJson } from '../src/index';
import * as assert from 'assert';

describe('PackageJson', () => {

    function createDummy(dependencies: { [id: string]: string }): PackageJson {
        return new PackageJson({
            name: 'test',
            version: '99.98.97',
            main: './lib/index.js',
            license: 'UNLICENSED',
            author: 'composer',
            scripts: {
              dev: ''
            },
            devDependencies: {},
            dependencies: dependencies
        });
    }

  it('mergeDependencies', () => {
    const origPackageJson = new PackageJson(createDummy({'foo': '1.2.3'}));
    const addPackageJson = new PackageJson(createDummy({'bar': '1.0.0'}));
    const newPackageJson = origPackageJson.mergeDependencies(addPackageJson);

    assert.equal(Object.keys(newPackageJson.dependencies).length, 2);
    assert.equal(newPackageJson.dependencies['foo'], '1.2.3');
    assert.equal(newPackageJson.dependencies['bar'], '1.0.0');
  });

  it('removeDependencies', () => {
    const origPackageJson = new PackageJson(createDummy({'foo': '1.2.3', 'bar': '*'}));
    let newPackageJson = origPackageJson.removeDependencies(['foo']);

    assert.equal(Object.keys(newPackageJson.dependencies).length, 1);
    assert.equal(newPackageJson.dependencies['bar'], '*');

    newPackageJson = newPackageJson.removeDependencies(['bar']);
    assert.equal(Object.keys(newPackageJson.dependencies).length, 0);
  });
});
