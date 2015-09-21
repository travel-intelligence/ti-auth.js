PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

source_files := src/ti-auth.js $(wildcard src/lib/*.js)
dist_files := $(source_files:%.js=dist/%.js)
app := dist/ti-auth.js

test_source := $(wildcard test/*.js)
test_dist := $(test_source:%.js=dist/%.js)
tests := dist/tests.js

.PHONY: all watch test clean

all: $(app) $(tests)

dist/%.js: %.js
	mkdir -p $(dir $@)
	babel $< -o $@

$(app): $(dist_files)
	browserify $< -o $@

$(tests): $(test_dist)
	browserify $< -o $@

watch: $(source_files) $(test_source)
	chokidar $^ --silent -c "make"

test: all
	testem

clean:
	rm -rf dist
