
# ifndef mablung-makefile-environment-path
# export mablung-makefile-environment-path := $(shell npx mablung-makefile-environment get-path)
# endif

# include $(mablung-makefile-environment-path)

include node_modules/@virtualpatterns/mablung-makefile-environment/makefile

ifneq ($(is-building),true)
ifneq ($(is-cleaning),true)

pre-build::
	$(info - pre-build ----------------------------)
	@npx shx cp -u node_modules/@virtualpatterns/mablung-makefile-environment/source/esmodule/test/library/create-random-id.js source/esmodule/library
	@npx shx sed -i "s/import Is from '@pwn\/is'/import { Is } from '@virtualpatterns\/mablung-is'/g" source/esmodule/library/create-random-id.js >> /dev/null

endif
endif

