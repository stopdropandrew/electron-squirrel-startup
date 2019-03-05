var assert = require('assert');
var sinon = require('sinon');
var startup = require('../');
var app = require('electron').app;
var childProcess = require('child_process');

describe('electron-squirrel-startup', function() {
  beforeEach(function() {
    this.oldArgv = process.argv;
    this.quitStub = sinon.stub(app, 'quit');
  });

  afterEach(function() {
    process.argv = this.oldArgv;
    sinon.restore();
  });

  it('should return false by default', function() {
    assert.equal(startup(), false);
  });

  it('should return true for install', function() {
    process.argv = ['Setup.exe', '--squirrel-install'];
    assert.equal(startup(), true);
  });

  it('should call app.quit for install', function(done) {
    this.quitStub.callsFake(() => { done(); });
    process.argv = ['Setup.exe', '--squirrel-install'];
    startup();
  });

  it('should wait for additional work to finish', function(done) {
    const quitStub = this.quitStub;
    process.argv = ['Setup.exe', '--squirrel-install'];
    let resolve;
    let promise = new Promise((r) => resolve = r);

    startup({ install: () => {
      return promise;
    } });

    assert(!quitStub.called);
    resolve();
    setTimeout(function() {
      assert(quitStub.called);
      done();
    }, 20)
  });
});
