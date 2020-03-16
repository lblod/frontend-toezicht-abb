import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

@classic
export default class BestuurseenheidSelect extends Component {
  @service
  store;

  async init() {
    super.init(...arguments);
    const options = this.store.query('bestuurseenheid', {
      sort: 'naam',
      include: ['classificatie']
    });
    this.set('options', options);
  }

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);
    if (this.value && !this.selected) {
      const bestuurseenheden = this.store.query('bestuurseenheid', {
        filter: { id: this.value },
        page: { size: this.value.split(",").length}
      });
      this.set('selected', bestuurseenheden);
    } else if (!this.value) {
      this.set('selected', null);
    }
  }

  selected = null;
  value = null; // id of selected record
  onSelectionChange = null;

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
    this.set('selected', selected);
    this.onSelectionChange(selected && selected.map(d => d.get('id')));
  }
}
