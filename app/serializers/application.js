import classic from 'ember-classic-decorator';
import JSONAPISerializer from '@ember-data/serializer/json-api';
import DataTableSerializerMixin from 'ember-data-table/mixins/serializer';

@classic
export default class Application extends JSONAPISerializer.extend(DataTableSerializerMixin) {}
