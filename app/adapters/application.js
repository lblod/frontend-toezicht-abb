import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  // TODO: ajax is a private method, so we should find a different solution
  // Based on: https://github.com/lblod/frontend-gelinkt-notuleren/blob/b237330ac000e5b4a6cbf80639d416bf66c51f01/app/adapters/application.js
  async ajax(url, method) {
    if (method !== 'GET') return super.ajax(...arguments);

    return retryOnError(super.ajax.bind(this), arguments);
  }
}

async function retryOnError(ajax, ajaxArgs, retryCount = 0) {
  const MAX_RETRIES = 5;

  try {
    return await ajax(...ajaxArgs);
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await sleep(250 * (retryCount + 1));
      return retryOnError(ajax, ajaxArgs, retryCount + 1);
    } else {
      throw new Error(error);
    }
  }
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(() => resolve(true), time));
}
