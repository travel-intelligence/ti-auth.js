PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

source_files := src/ti-auth.js $(wildcard src/lib/*.js)
dist_files := $(source_files:%.js=dist/%.js)
bundle := dist/ti-auth.js

.PHONY: all watch clean

all: $(bundle)

dist/%.js: %.js
	mkdir -p $(dir $@)
	babel $< -o $@

$(bundle): $(dist_files)
	browserify $< -o $@

watch:
	chokidar $(source_files) --silent -c "make"

clean:
	rm -rf dist
