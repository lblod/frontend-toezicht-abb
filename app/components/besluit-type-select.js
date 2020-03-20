import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

export default class BesluitTypeSelect extends Component {
  @service store;

  @tracked selected = null;
  @tracked value = null; // id of selected record
  onSelectionChange = null;

  constructor() {
    super(...arguments);
    if (this.args.value) {
      this.selected = this.getBesluitTypesFromId(this.args.value);
    }
    const options = this.store.query('besluit-type', {
      sort: 'label',
      page: { size: 1000 }
    });
    this.options = options;
  }

  @task(function* (term) {
    yield timeout(600);
    return this.store.query('besluit-type', {
      filter: { label: term }
    });
  })
  search;

  @action
  changeSelected(selected) {
    this.selected = selected;
    this.args.onSelectionChange(selected);
  }

  @action
  updateSelectedValue() {
    if (this.args.value && !this.selected) {
      this.selected = this.getBesluitTypesFromId(this.args.value);
    } else if (!this.args.value) {
      this.selected = null;
    }
  }

  getBesluitTypesFromId(id) {
    const besluitTypes = this.store.query('besluit-type', {
      filter: { id: id },
      page: { size: id.split(",").length}
    });
    return besluitTypes;
  }
}
