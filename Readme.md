# buster-static

[![Build status](https://secure.travis-ci.org/busterjs/buster-static.png?branch=master)](http://travis-ci.org/busterjs/buster-static)
[![Build status](https://ci.appveyor.com/api/projects/status/github/busterjs/buster-static?branch=master&svg=true)](https://ci.appveyor.com/project/dominykas/buster-static)

QUnit style test runner for Buster.JS, without the manual HTML scaffolding.

##Changelog

**0.7.0** (2016-Jan-03)

* Updated all dependencies, likely BREAKING with `when@3.x`
* Resource filenames no longer use hardcoded version
* BREAKING: added an engine requirement (node LTS) in package.json

**0.6.5** (2014-Oct-27)

* fix for issue [#279 - buster static fails on IE 8](https://github.com/busterjs/buster/issues/279)

**0.6.4** (2014-May-14)

* fix for issue [#53 - buster static: generating output doesn't work](https://github.com/busterjs/buster/issues/53)

**0.6.3** (2014-May-05)

* [References to runtime throttler removed](https://github.com/busterjs/buster-static/commit/f5c3c0185ac83d9270620dee7e8a80fa511b836a)
* fix for issue [#395 - buster-static is not executing extensions](https://github.com/busterjs/buster/issues/395)
