var fs = require('fs')
  , merge = require('kerouac/lib/utils').merge
  , async = require('async')
  , extname = require('path').extname;

module.exports = function(path) {
  // Parse the front matter from the content.
  // Drops any non-metadata as this should be used to load
  // external front matter only.
  function extractFM(str) {
    var fm ='';

    // check for front matter
    if ('---' === str.slice(0, 3)) {
      var eol = '\n';
      if ('---\r\n' === str.slice(0, 5)) {
        eol = '\r\n'; // Windows
        str = str.substr(5);
      } else {
        eol = '\n'; // UNIX
        str = str.substr(4);
      }

      // make sure the last line is read correctly, even without
      // an empty line at the end of the file.
      if ('\n' !== str[-1]) {
        str += eol;
      }

      var i = str.indexOf(eol)
        , line;
      while (-1 != i) {
        line = str.slice(0, i + eol.length);
        str = str.substr(i + eol.length);

        if ('---' !== line.slice(0, 3)) {
          fm += line;
        }

        i = str.indexOf(eol);
      }
    }
    return fm;
  }

  // TODO provide view & data folder config
  // TODO provide view & data file name defaults based on fm filename
  function loadFMFile(page, fn) {
    var site = page.site;

    fs.readFile(path, 'utf8', function(err, str) {
      if (err) { return fn(err); }
      var fm = extractFM(str);
      if (!fm) {
        return fn('trying to load empty front matter at ' + page.path);
      }
      var metadata = site.fm(fm) || {};
      merge(page.locals, metadata);
      if (metadata.layout) { page.layout = metadata.layout; }
      fn(null);
    });
  }

  function loadData(page, fn) {
    fs.readFile(page.locals.data, 'utf8', function(err, str) {
      if (err) { return fn(err); }
      data = JSON.parse(str);
      fn(null, data);
    });
  }

  function render(page, data, fn) {
    var site = page.site
      , ext = extname(path);
    // manual view rendering of the data
    site.render(page.locals.view, { data: data }, function(err, out) {
      if (err) { return fn(err); }
      page.locals.data = data;
      page.locals.content = out;
      fn();
    }, true);
  }

  return function loadContent(page, next) {
    async.waterfall([
      loadFMFile.bind(loadFMFile, page),
      loadData.bind(loadData, page),
      render.bind(render, page)
    ], next);
  };
};
