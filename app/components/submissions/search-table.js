import Component from '@glimmer/component';
import {inject as service} from '@ember/service';


export default class SubmissionsSearchTableComponent extends Component {
  @service store

  constructor() {
    super(...arguments);

    // This should only be set once.
    // After intial set, this component should remain master over what data gets displayed in
    // search box. Else you have race conditions, and flickering behaviour for user.
    // if(!this._freeTextSearch){
    //   this._freeTextSearch = this.args.filter.search;
    // }
  }

  // NOTE: could be useful for custom search component

  // @tracked _freeTextSearch;

  // get hasAskedForFreeTextSearch(){
  //   return this._freeTextSearch && this._freeTextSearch.length;
  // }

  // @restartableTask
  // *search() {
  //   yield timeout(500);
  //   this.args.filter.search = this._freeTextSearch;
  //   this.args.onFilterChange();
  // }

}
