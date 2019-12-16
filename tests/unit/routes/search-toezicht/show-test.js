import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | search-toezicht/show', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:search-toezicht/show');
    assert.ok(route);
  });
});
