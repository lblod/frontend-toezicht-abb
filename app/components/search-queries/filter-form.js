import SearchQueriesFormComponent from "./form";

const UUID = 'e025a601-b50b-4abd-a6de-d0c3b619795c'

export default class SearchQueriesConfigFormComponent extends SearchQueriesFormComponent {

  formUUID = UUID;

  constructor(owner, args) {
    super({form: {uuid: UUID}}, owner, args);
  }

  resetFilters() {
  }
}
