VERSION = 1.0.0

all: dist

distclean:
	rm -f polldance-$(VERSION).js polldance-$(VERSION).min.js

clean:

dist: polldance-$(VERSION).min.js

polldance-$(VERSION).js: polldance.js
	cp polldance.js polldance-$(VERSION).js

polldance-$(VERSION).min.js: polldance-$(VERSION).js
	sed -e "s/DEBUG = true/DEBUG = false/g" polldance-$(VERSION).js | ./compile.py > polldance-$(VERSION).min.js.tmp
	mv polldance-$(VERSION).min.js.tmp polldance-$(VERSION).min.js
