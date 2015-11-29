VERSION = 1.1.3

all: clean build lib

clean:
	- rm -r dist/
	- rm -r lib/

build:
	mkdir dist
	jspm bundle-sfx browser.js dist/pollymer-${VERSION}.js
	./node_modules/.bin/uglifyjs dist/pollymer-${VERSION}.js -o dist/pollymer-${VERSION}.min.js

lib:
	mkdir lib
	./node_modules/.bin/babel --presets es2015 -d lib/ src/

