
ifeq ($(origin project-path),undefined)
export project-path := $(CURDIR)
endif

ifeq ($(origin mablung-makefile-environment-path),undefined)
export mablung-makefile-environment-path := $(shell npx mablung-makefile-environment-path)
endif

include $(mablung-makefile-environment-path)
