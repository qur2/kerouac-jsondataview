# kerouac-jsondataview

kerouac-jsondataview is a plugin for [kerouac](https://github.com/jaredhanson/kerouac). It allows to render JSON files in their own view.

The way it achieves that is by handling independent front matter files. In the front matter, you specify a data file and a view and kerouac-jsondataview will do the rest. Then, the normal kerouac flow is applied, and the content will be embedded in a layout.

This process is similar to the native `content` plugin found in kerouac. One key difference is that it searches for a single type of file. This way, front matters can be in the same directory than data files and even views, if you want.


## Why isolate the front matter?

To be able to generate content based on JSON data, not written by a human. As the front matter is in its own file, the JSON file can be overwritten automatically and without any precaution.
Plus, it allows to reuse the same data in different views and different pages.


## Install

    $ npm install kerouac-jsondataview


## Usage

    var kerouac = require('kerouac');
    var site = kerouac();

    site.set('base url', 'http://www.example.com/');
    site.plug(require('./kerouac-jsondataview')('json-files'));
    site.assets('public');

    site.generate(function(err) {
      if (err) {
        console.error(err.message);
        console.error(err.stack);
        return;
      }
    });


## Structure example

To build the content, you need 3 files: the front matter, the JSON data and the view.

### numbers.fm

    ---
    data: json-files/numbers.json,json-files/letters.json
    view: views/word.ejs
    layout: main.ejs
    ---

### numbers.json

    {"numbers": [1, 2, 3]}

### letters.json

    {"letters": ['a', 'z']}

### word.ejs

    <ul>
    <% numbers.forEach(function (n) { %>
      <li><%= n %></li>
    <% }) %>
    </ul>
    <ul>
    <% letters.forEach(function (l) { %>
      <li><%= l %></li>
    <% }) %>
    </ul>

Using those 4 files, the plugin will build a chunk of HTML, which will later be rendered in its layout.


## Examples

The following site is built with kerouac and kerouac-jsondataview.

- [www.qur2.eu](http://www.qur2.eu/) — ([source](https://github.com/jaredhanson/www.qur2.eu))


## Tests

    // TODO
    $ npm install
    $ make test


## API changes

- 1.0.0: The data is injected using the json filename as a key instead of ``data``. Views have to be updated accordingly.


## Credits

  - [Aurélien Scoubeau](http://github.com/qur2)


## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2013 Aurélien Scoubeau <http://qur2.eu/>