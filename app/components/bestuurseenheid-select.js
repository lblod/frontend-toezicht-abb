import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

export default class BestuurseenheidSelect extends Component {
  @service store;

  @tracked selected = null;

  constructor() {
    super(...arguments);
    if (this.args.value) {
      this.selected = this.getBestuurseenhedenFromId(this.args.value);
    }
    const options = this.store.query('bestuurseenheid', {
      sort: 'naam',
      include: ['classificatie']
    });
    this.options = options;
  }

  @task(function* (term) {
    yield timeout(600);
    return this.store.query('bestuurseenheid', {
      sort: 'naam',
      include: ['classificatie'],
      filter: term
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
      this.selected = this.getBestuurseenhedenFromId(this.args.value);
    } else if (!this.args.value) {
      this.selected = null;
    }
  }

  getBestuurseenhedenFromId(id) {
    const bestuurseenheden = this.store.query('bestuurseenheid', {
      filter: { id: id },
      page: { size: id.split(",").length}
    });
    return bestuurseenheden;
  }
}
