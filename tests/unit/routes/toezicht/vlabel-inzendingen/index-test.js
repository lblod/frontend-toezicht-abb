import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | toezicht/vlabel-inzendingen/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:toezicht/vlabel-inzendingen/index');
    assert.ok(route);
  });
});
