import { helper } from '@ember/component/helper';

export default helper(function sharedMarLabel([concept]/*, hash*/) {
  return `MAR${concept.notation} - ${concept.label}`;
});
