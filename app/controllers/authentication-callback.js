import Controller from '@ember/controller';

export default class AuthenticationCallbackController extends Controller {
  queryParams = ['code'];
}
