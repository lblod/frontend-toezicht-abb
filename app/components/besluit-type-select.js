import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

@classic
export default class BesluitTypeSelect extends Component {
  @service
  store;

  async init() {
    super.init(...arguments);
    const options = this.store.query('besluit-type', {
      sort: 'label',
      page: { size: 1000 }
    });
    this.set('options', options);
  }

  async didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);
    if (this.value && !this.selected) {
      const besluitTypes = this.store.query('besluit-type', {
        filter: { id: this.value },
        page: { size: this.value.split(",").length}
      });
      this.set('selected', besluitTypes);
      this.onInit(besluitTypes);
    } else if (!this.value) {
      this.set('selected', null);
    }
  }

  selected = null;
  value = null; // id of selected record
  onInit = null;
  onSelectionChange = null;

  @task(function* (term) {
    yield timeout(600);
    return this.store.query('besluit-type', {
      filter: { label: term }
    });
  })
  search;

  @action
  changeSelected(selected) {
    this.set('selected', selected);
    this.onSelectionChange(selected);
  }
}
