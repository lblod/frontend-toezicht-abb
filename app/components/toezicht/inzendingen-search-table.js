import Component from '@glimmer/component';

export default class InzendingenSearchTableComponent extends Component {
  get target() {
    return this.args.targetRoute || "toezicht.inzendingen.show";
  }
}
