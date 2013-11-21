define([
  'underscore',
  'backbone'
],
  function (
  	_,
  	Backbone
  ) {
  
    var TodoListModel = Backbone.Model.extend({
    	urlRoot: 'lib/resteasy/api/todolists',

    	defaults: function () {
    		return {
    			created: Date.now()
    		};
    	},

    	initialize: function () {
      }
    });

    return TodoListModel;
});