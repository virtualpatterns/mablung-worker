"use strict";

var _mablungConfiguration = require("@virtualpatterns/mablung-configuration");

(async () => {
  try {
    console.dir(_mablungConfiguration.Configuration.merge({
      'a': 1
    }, {
      'b': 2
    }));
  } catch (error) {
    console.error(error);
  }
})();
//# sourceMappingURL=uc.cjs.map