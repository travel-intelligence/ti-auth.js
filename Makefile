PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

source_files := src/ti-auth.js $(wildcard src/lib/*.js)
build_files := $(source_files:%.js=build/%.js)
app := build/ti-auth.js

test_source := $(wildcard test/lib/*.js)
test_build := $(test_source:%.js=build/%.js)
tests := build/tests.js

.PHONY: all watch test clean

all: $(app) $(tests)

build/%.js: %.js
	mkdir -p $(dir $@)
	babel $< -o $@

$(app): $(build_files)
	browserify $< -o $@

$(tests): $(test_build)
	browserify $^ -o $@

watch: $(source_files) $(test_source)
	chokidar $^ --silent -c "make"

test: all
	testem

clean:
	rm -rf build
