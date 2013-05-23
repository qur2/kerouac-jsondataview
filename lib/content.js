/**
 * Module dependencies.
 */
var path = require('path')
  , diveSync = require('diveSync')
  , kerouac = require('kerouac')
  , merge = require('kerouac/lib/utils').merge
  , loadContent = require('./loadContent');


exports = module.exports = function(dir, options) {
  dir = dir || 'json-content';
  var opts = merge({
    ext: 'fm'
  }, options);

  return function assets(site, pages) {
    var adir = path.resolve(process.cwd(), dir)
      , rfile
      , rdir
      , comps
      , url;

    diveSync(adir, function(err, file) {
      if (err) { throw err; }

      rfile = path.relative(adir, file);

      // TODO: Automatically determine output type based on extension (and allow override option).
      // TODO: Implement pretty URLs as middleware.

      rdir = path.dirname(rfile);
      comps = path.basename(rfile).split('.');
      if (opts.ext === comps[1]) {
        url = path.join(rdir, comps[0]) + '.html';

        // TODO: Make prettyURLs optional (possible passing it as an argument).
        site.page(url, kerouac.prettyURL()
                     , kerouac.url()
                     , loadContent(file)
                     , kerouac.render());
      }
    });
  }
}
