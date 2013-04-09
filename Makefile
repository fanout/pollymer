VERSION = 1.0.1

all: dist

distclean:
	rm -f polling-place-$(VERSION).js polling-place-$(VERSION).min.js

clean:

dist: polling-place-$(VERSION).min.js

polling-place-$(VERSION).js: polling-place.js
	cp polling-place.js polling-place-$(VERSION).js

polling-place-$(VERSION).min.js: polling-place-$(VERSION).js
	sed -e "s/DEBUG = true/DEBUG = false/g" polling-place-$(VERSION).js | ./compile.py > polling-place-$(VERSION).min.js.tmp
	mv polling-place-$(VERSION).min.js.tmp polling-place-$(VERSION).min.js
