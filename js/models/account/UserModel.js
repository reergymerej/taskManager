define([
  'underscore',
  'backbone'
], function(
	_,
	Backbone
) {

  var UserModel = Backbone.Model.extend({
  	urlRoot: 'lib/resteasy/api/users',
  });

  return UserModel;
});