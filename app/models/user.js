import Model from 'ember-data/model';
import attr from 'ember-data/attr';

import { computed, get } from '@ember/object';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  user_id: attr('string'),

  name: attr('string'),
  nickname: attr('string'),
  picture: attr('string'),
  email: attr('string'),
  email_verified: attr('boolean'),

  identities: attr(),

  updated_at: attr('string'),
  created_at: attr('string'),
});
