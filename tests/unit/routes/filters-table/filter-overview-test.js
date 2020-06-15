import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | filters-table/filter-overview', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:filters-table/filter-overview');
    assert.ok(route);
  });
});
