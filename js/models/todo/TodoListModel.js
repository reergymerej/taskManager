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
        var now = Date.now();
    		return {
    			created: now,
          name: 'list - ' + now,
          archived: false
    		};
    	},

    	initialize: function () {}
    });

    return TodoListModel;
});