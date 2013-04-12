VERSION = 1.0.0

all: dist

distclean:
	rm -f pollymer-$(VERSION).js pollymer-$(VERSION).min.js

clean:

dist: pollymer-$(VERSION).min.js

pollymer-$(VERSION).js: pollymer.js
	cp pollymer.js pollymer-$(VERSION).js

pollymer-$(VERSION).min.js: pollymer-$(VERSION).js
	sed -e "s/DEBUG = true/DEBUG = false/g" pollymer-$(VERSION).js | ./compile.py > pollymer-$(VERSION).min.js.tmp
	mv pollymer-$(VERSION).min.js.tmp pollymer-$(VERSION).min.js
