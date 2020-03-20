import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

export default class BestuurseenheidClassificatieSelect extends Component {
  @service store;

  @tracked selected = null;
  @tracked value = null; // id of selected record
  onSelectionChange = null;

  constructor() {
    super(...arguments);
    if (this.args.value) {
      this.selected = this.getBestuurseenheidClassificatiesFromId(this.args.value);
    }
    const options = this.store.query('bestuurseenheid-classificatie-code', {
      sort: 'label'
    });
    this.options = options;
  }

  @task(function* (term) {
    yield timeout(600);
    return this.store.query('bestuurseenheid-classificatie-code', {
      filter: { label: term }
    });
  })
  search;

  @action
  changeSelected(selected) {
    this.selected = selected;
    this.args.onSelectionChange(selected && selected.map(d => d.get('id')));
  }

  @action
  updateSelectedValue() {
    if (this.args.value && !this.selected) {
      this.selected = this.getBestuurseenheidClassificatiesFromId(this.args.value);
    } else if (!this.args.value) {
      this.selected = null;
    }
  }

  getBestuurseenheidClassificatiesFromId(id) {
    const bestuurseenheidClassificatieCode = this.store.query('bestuurseenheid-classificatie-code', {
      filter: { id: id },
      page: { size: id.split(",").length}
    });
    return bestuurseenheidClassificatieCode;
  }
}
