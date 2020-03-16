import { computed } from '@ember/object';
import Component from '@ember/component';

export default class InzendingenSearchTableComponent extends Component {
  @computed( "args.targetRoute" )
  get target() {
    return this.targetRoute || "toezicht.inzendingen.show";
  }
}
