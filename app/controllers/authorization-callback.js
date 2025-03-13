import Controller from '@ember/controller';

export default class AuthorizationCallbackController extends Controller {
  queryParams = ['code'];
}
