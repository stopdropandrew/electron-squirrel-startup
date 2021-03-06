var path = require('path');
var spawn = require('child_process').spawn;
var debug = require('debug')('electron-squirrel-startup');
var app = require('electron').app;

var run = function(args, done, additionalWork) {
  var updatePromise = new Promise((resolve, reject) => {
    var updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
    debug('Spawning `%s` with args `%s`', updateExe, args);
    spawn(updateExe, args, {
      detached: true
    }).on('close', resolve());
  });

  var promises = [updatePromise];
  if(additionalWork) { promises.push(additionalWork()) };

  console.log(promises);
  console.log('all promises');
  var allPromises = Promise.all(promises);
  console.log(allPromises);
  allPromises.then(done);
};

var check = function(additionalWork = {}) {
  if (process.platform === 'win32') {
    var cmd = process.argv[1];
    debug('processing squirrel command `%s`', cmd);
    var target = path.basename(process.execPath);

    if (cmd === '--squirrel-install' || cmd === '--squirrel-updated') {
      run(['--createShortcut=' + target + ''], app.quit, additionalWork.install);
      return true;
    }
    if (cmd === '--squirrel-uninstall') {
      run(['--removeShortcut=' + target + ''], app.quit);
      return true;
    }
    if (cmd === '--squirrel-obsolete') {
      app.quit();
      return true;
    }
  }
  return false;
};

module.exports = check;
