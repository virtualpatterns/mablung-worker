
ifeq ($(origin mablung-makefile-environment-path),undefined)
export mablung-makefile-environment-path := $(shell npx mablung-makefile-environment get-path)
endif

include $(mablung-makefile-environment-path)

ifndef current-build-folder

pre-cover::
	$(info - pre-cover --------------------------------------------------------------------)
	$(eval export MAKE_PATH = $(MAKE))

pre-test::
	$(info - pre-test ---------------------------------------------------------------------)
	$(eval export MAKE_PATH = $(MAKE))
	
endif