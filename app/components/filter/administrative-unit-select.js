import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import {dropTask, task, timeout, restartableTask} from 'ember-concurrency';

export default class FilterAdministrativeUnitSelectComponent extends Component {
  @service store

  @tracked selected = null
  @tracked preloadedOptions
  @tracked searchData;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  get isSearching() {
    return Boolean(this.searchData);
  }

  get options() {
    return this.isSearching ? this.searchData.results : this.preloadedOptions;
  }

  @task
  * loadData() {
    const options = yield this.store.query('bestuurseenheid', {
      sort: 'naam',
      include: ['classificatie']
    });
    this.preloadedOptions = options;

    this.updateSelectedValue();
  }

  @restartableTask
  *search(term) {
    yield timeout(600);

    let results = yield this.fetchAdministrativeUnits({
      filter: term,
    });

    this.searchData = new SearchData({
      totalResultAmount: results.meta.count,
      searchTerm: term,
      results: results.toArray(),
    });
  }

  @dropTask
  *loadMoreSearchResults() {
    if (this.isSearching) {
      let results = yield this.fetchAdministrativeUnits({
        filter: this.searchData.searchTerm,
        "page[number]": ++this.searchData.currentPage,
      });

      this.searchData.addSearchResults(results.toArray());
    }
  }

  @action
  changeSelected(selected) {
    this.selected = selected;
    this.args.onSelectionChange(selected && selected.map(d => d.get('id')));
  }

  @action
  async updateSelectedValue() {
    if (this.args.value && !this.selected) {
        this.selected = await this.store.query('bestuurseenheid', {
          filter: {id: this.args.value},
          page: {size: this.args.value.split(',').length}
        });
    } else if (!this.args.value) {
      this.selected = null;
    }
  }

  @action
  registerAPI(api) {
    // PowerSelect doesn't have an action to let us know when the search data is reset, so we use the registerAPI as a workaround.
    // It get's called everytime any internal state has changed, so we can use it to detect when the searchText has cleared.
    if (!api.searchText && this.searchData) {
      this.searchData = null;
    }
  }

  async fetchAdministrativeUnits(searchQuery = {}) {
    return this.store.query('bestuurseenheid', {
      sort: "naam",
      include: "classificatie",
      "page[number]": 0,
      ...searchQuery,
    });
  }

  optionTemplate(option) {
    return `${option.naam} (${option.classificatie.label})`;
  }
}

class SearchData {
  @tracked results = [];
  currentPage = 0;

  constructor({ totalResultAmount, searchTerm, results }) {
    this.totalResultAmount = totalResultAmount;
    this.searchTerm = searchTerm;
    this.results = results;
  }

  get canLoadMoreSearchResults() {
    return this.totalResultAmount > this.results.length;
  }

  addSearchResults(newResults = []) {
    this.results = [...this.results, ...newResults];
  }
}
