/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var path = require("path");
var async = require("async");
var NodeOutputFileSystem = require('webpack/lib/node/NodeOutputFileSystem')

function ForceOutputPlugin() {
}

module.exports = ForceOutputPlugin;

ForceOutputPlugin.prototype.apply = function(compiler) {
  const outputFileSystem = new NodeOutputFileSystem()
	compiler.plugin("emit", function(compilation, callback) {
    const outputPath = compilation.getPath(this.outputPath);
    outputFileSystem.mkdirp(outputPath, emitFiles.bind(this));

    function emitFiles(err) {
      if(err) return callback(err);

      async.forEach(Object.keys(compilation.assets), function(file, callback) {

        var targetFile = file;
        var queryStringIdx = targetFile.indexOf("?");
        if(queryStringIdx >= 0) {
          targetFile = targetFile.substr(0, queryStringIdx);
        }

        if(targetFile.match(/\/|\\/)) {
          var dir = path.dirname(targetFile);
          outputFileSystem.mkdirp(outputFileSystem.join(outputPath, dir), writeOut.bind(this));
        } else writeOut.call(this);

        function writeOut(err) {
          if(err) return callback(err);
          var targetPath = outputFileSystem.join(outputPath, targetFile);
          var source = compilation.assets[file];
          var content = source.source();

          if(!Buffer.isBuffer(content)) {
            content = new Buffer(content, "utf8"); //eslint-disable-line
          }
          outputFileSystem.writeFile(targetPath, content, callback);
        }
      }.bind(this), function(err) {
        if(err) return callback(err);
        callback()
      }.bind(this));
    }
	})
};