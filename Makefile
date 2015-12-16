PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

source_files := src/ti-auth.js $(wildcard src/lib/*.js)
build_files := $(source_files:%.js=build/%.js)
app := build/ti-auth.js

test_files := test/ti-auth_test.js $(wildcard test/lib/*_test.js)
test_build := $(test_files:%.js=build/%.js)
tests := build/tests.js

.PHONY: all watch test clean

all: $(app) $(tests)

build/%.js: %.js
	mkdir -p $(dir $@)
	babel $< -o $@

$(app): $(build_files)
	browserify $< -s TiAuth > $@

$(tests): $(test_build)
	browserify $^ -o $@

watch: $(source_files) $(test_files)
	chokidar $^ --silent -c "make"

test: all
	testem

clean:
	rm -rf build
