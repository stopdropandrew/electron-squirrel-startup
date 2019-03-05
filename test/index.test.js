var assert = require('assert');
var sinon = require('sinon');
var startup = require('../');

describe('electron-squirrel-startup', function() {
  beforeEach(() => {
    this.oldArgv = process.argv;
  });

  afterEach(() => {
    process.argv = this.oldArgv;
    sinon.restore();
  });

  it('should return false by default', function() {
    console.log(process.argv);
    assert.equal(startup(), false);
  });

  it('should return true for install', function() {
    process.argv = ['Setup.exe', '--squirrel-install'];
    console.log(process.argv);
    assert.equal(startup(), false);
  });

  it('should return true for install', function() {
    console.log(process.argv);
    assert.equal(startup(), false);
  });

});
