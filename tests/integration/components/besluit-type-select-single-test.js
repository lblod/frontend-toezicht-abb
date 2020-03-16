import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | besluit-type-select-single', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<BesluitTypeSelectSingle />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <BesluitTypeSelectSingle>
        template block text
      </BesluitTypeSelectSingle>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
