import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

@classic
export default class ToezichtRegulationTypeSelect extends Component {
  @service
  store;

  async init() {
    super.init(...arguments);
    const options = this.store.query('toezicht-regulation-type', {
      sort: 'label',
      page: { size: 1000 }
    });
    this.set('options', options);
  }

  async didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);
    if (this.value && !this.selected) {
      const toezichtRegulationType = this.store.findRecord('toezicht-regulation-type', this.value);
      this.set('selected', toezichtRegulationType);
    } else if (!this.value) {
      this.set('selected', null);
    }
  }

  selected = null;
  value = null; // id of selected record
  onSelectionChange = null;

  @task(function* (term) {
    yield timeout(600);
    return this.store.query('toezicht-regulation-type', {
      filter: { label: term }
    });
  })
  search;

  @action
  changeSelected(selected) {
    this.set('selected', selected);
    this.onSelectionChange(selected && selected.id);
  }
}
