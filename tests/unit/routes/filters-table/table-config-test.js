import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | filters-table/table-config', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:filters-table/table-config');
    assert.ok(route);
  });
});
