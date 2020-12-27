import { Configuration } from '@virtualpatterns/mablung-configuration'
// import Source from 'source-map-support'

// Source.install({ 'handleUncaughtExceptions': false })
;
(async () => {

  try {
    console.dir(Configuration.merge({ 'a': 1 }, { 'b': 2 }));
  } catch (error) {
    console.error(error);
  }

})();
//# sourceMappingURL=uc.js.map