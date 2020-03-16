import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

@classic
export default class BestuurseenheidClassificatieSelect extends Component {
  @service
  store;

  async init() {
    super.init(...arguments);
    const options = this.store.query('bestuurseenheid-classificatie-code', {
      sort: 'label'
    });
    this.set('options', options);
  }

  async didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);
    if (this.value && !this.selected) {
      const classificaties = this.store.query('bestuurseenheid-classificatie-code', {
        filter: { id: this.value },
        page: { size: this.value.split(",").length}
      });
      this.set('selected', classificaties);
    } else if (!this.value) {
      this.set('selected', null);
    }
  }

  selected = null;
  value = null; // id of selected record
  onSelectionChange = null;

  @task(function* (term) {
    yield timeout(600);
    return this.store.query('bestuurseenheid-classificatie-code', {
      filter: { label: term }
    });
  })
  search;

  @action
  changeSelected(selected) {
    this.set('selected', selected);
    this.onSelectionChange(selected && selected.map(d => d.get('id')));
  }
}
