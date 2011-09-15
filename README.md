Strata is a fast, streaming web framework for node.js that is patterned after
time-honored and battle tested web application design principles pioneered in
the Python and Ruby communities (see WSGI and Rack). Using Strata, developers
can build highly performant web servers in a powerful, modular style that is
easy to maintain and takes full advantage of the streaming capabilities and
excellent I/O handling of node.js.

The core Strata distribution consists of three things:

  - A specification (see SPEC) for building applications and middleware
  - A library (see lib) with many useful utilities and middleware to aid
    developers in the common tasks of building applications that conform to
    the specification
  - An executable (see bin/strata) for running Strata applications from the
    command line

# Installation

Using npm:

``` bash
$ npm install strata
```

You are also free to browse or download the source at
https://github.com/mjijackson/strata.

# Manual

The doc directory contains a number of files that make up the Strata user
manual. Each file is a chapter of the manual written in JavaScript that contains
documentation about a certain feature of the framework and a code example.

Each chapter file is runnable using the Strata executable. For example, to run
the first chapter, you can use the following command (after installing Strata):

``` bash
$ strata doc/01_introduction.js
```

Then open your browser to http://localhost:1982/.

The manual is written in such a way that the topics and examples discussed in
higher numbered chapters build upon previous ones. Thus, it is recommended to
start with lower numbered chapters when getting started with Strata and work
your way up to higher ones.

# Tests

To run the tests, first install vows:

``` bash
$ npm install -g vows
```

Run all tests with:

``` bash
$ vows test/*_test.js
```

Otherwise, run the tests for a specific module with:

``` bash
$ vows test/utils_test.js
```

# Credits

Strata was inspired by similar efforts in the Python and Ruby communities,
namely WSGI and Rack. It borrows many code patterns from these libraries, as
well as the JSGI project.

Strata's multipart parser is based on the fast parser in the node-formidable
project written by Felix Geisendörfer. It is included in Strata under the terms
of the MIT license.

My sincere thanks to the authors of each of these libraries for the excellent
work they've done and graciously shared.
