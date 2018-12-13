import * as mkdirp from '../src/functions/folder-creator';
import * as assert from 'assert';
import * as mock from 'mock-fs';
import * as fs from 'fs';
describe('FolderCreation', () => {
  beforeEach(function (): void {
    mock({
      'path/to/file.txt': 'file content here'
    });
  });

  afterEach(function (): void {
    mock.restore();
  });

  it('should create a new folder', () => {
    const dir = 'test';
    mkdirp.sync(dir);
    assert.doesNotThrow(
      function (): void { mkdirp.sync(dir); },
      'Error was thrown on directory creation!'
    );
    assert.equal(fs.existsSync(dir), true, 'file should exist');
    const fileStats: fs.Stats = fs.lstatSync(dir);
    assert.equal(fileStats.isFile(), false, `${dir} unexpectedly is a file`);
    assert.equal(fileStats.isSymbolicLink(), false, `${dir} unexpectedly is a symbolic link`);
    assert.equal(fileStats.isDirectory(), true, `${dir} unexpectedly is not a directory`);
  });

  it('should do nothing on already existing folder', () => {
    const dir = 'path/to';
    mkdirp.sync(dir);
    assert.doesNotThrow(
      function (): void { mkdirp.sync(dir); },
      'Error was thrown on directory creation!'
    );
    assert.equal(fs.existsSync(dir), true, 'file should exist');
    const fileStats: fs.Stats = fs.lstatSync(dir);
    assert.equal(fileStats.isFile(), false, `${dir} unexpectedly is a file`);
    assert.equal(fileStats.isSymbolicLink(), false, `${dir} unexpectedly is a symbolic link`);
    assert.equal(fileStats.isDirectory(), true, `${dir} unexpectedly is not a directory`);
  });

  it('should throw an exception if a file with the name of the folder already exists', () => {
    mock({
      'file': 'file content here'
    });
    const file = 'file';
    assert.throws(function (): void { mkdirp.sync(file); }, 'No error was thrown on directory creation!');
    assert.equal(fs.existsSync(file), true, `${file} should exist`);
    const fileStats: fs.Stats = fs.lstatSync(file);
    assert.equal(fileStats.isFile(), true, `${file} should be of type file`);
    assert.equal(fileStats.isSymbolicLink(), false, `${file} unexpectedly is a symbolic link`);
    assert.equal(fileStats.isDirectory(), false, `${file} unexpectedly ia a directory`);
  });

  it('should synchronously remove a symlink with identical name and create a folder', () => {
    mock({
      'dir': {
        'file': 'file contents',
        'symlink': mock.symlink({
          path: 'file'
        })
      }
    });
    const directory = 'dir/symlink';
    const initialStats: fs.Stats = fs.lstatSync(directory);
    assert.equal(initialStats.isSymbolicLink(), true, `initially ${directory} should be a symlink`);
    assert.doesNotThrow(
      function (): void { mkdirp.sync(directory); },
      'Error was thrown on directory creation!'
    );
    assert.equal(fs.existsSync(directory), true, `${directory} should exist`);
    const fileStats: fs.Stats = fs.lstatSync(directory);
    assert.equal(fileStats.isFile(), false, `${directory} unexpectedly is a file`);
    assert.equal(fileStats.isSymbolicLink(), false, `${directory} unexpectedly is a symbolic link`);
    assert.equal(fileStats.isDirectory(), true, `${directory} unexpectedly is not a directory`);
  });

  it('should asynchronously remove a symlink with identical name and create a folder', () => {
    mock({
      'dir': {
        'file': 'file contents',
        'symlink': mock.symlink({
          path: 'file'
        })
      }
    });
    const directory = 'dir/symlink';
    const initialStats: fs.Stats = fs.lstatSync(directory);
    assert.equal(initialStats.isSymbolicLink(), true, `initially ${directory} should be a symlink`);

    mkdirp(directory, undefined, (err) => {
      if (err) {
        assert.fail('mkdrip not allowed to fail');
        return;
      }

      assert.equal(fs.existsSync(directory), true, `${directory} should exist`);
      const fileStats: fs.Stats = fs.lstatSync(directory);
      assert.equal(fileStats.isFile(), false, `${directory} unexpectedly is a file`);
      assert.equal(fileStats.isSymbolicLink(), false, `${directory} unexpectedly is a symbolic link`);
      assert.equal(fileStats.isDirectory(), true, `${directory} unexpectedly is not a directory`);
    });
  });
});
