import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import UsesNonce from '../mixins/models/nonce';

import { belongsTo } from 'ember-data/relationships';

export default Model.extend(UsesNonce, {
  state: attr('string'),
  otp_expires: attr('isodate'),
  account: belongsTo('account', { inverse: null }),
});
