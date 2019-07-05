import DS from 'ember-data';
import DataTableSerializerMixin from 'ember-data-table/mixins/serializer';
import { underscore } from '@ember/string';


export default DS.JSONAPISerializer.extend(DataTableSerializerMixin, {

});
