define([
  'underscore',
  'backbone'
],
  function (
  	_,
  	Backbone
  ) {
  
    var TodoTaskModel = Backbone.Model.extend({
    	urlRoot: 'lib/resteasy/api/todotasks',

    	defaults: function () {
    		return {
    			label: 'label',
    			notes: '',
    			created: Date.now(),
          isComplete: false,
    			downstreamTaskId: undefined,
          todoCollectionId: undefined
    		};
    	},

    	initialize: function () {
        this.on('destroy', function (model, collection, options) {
          console.warn('need to destroy upstream');
        });        
      },

      getTemplateData: function () {
        var data = this.toJSON();
        return _.extend(data, {
          cls: data.isComplete ? 'complete' : '',
          checked: data.isComplete ? 'checked="checked"' : '',
          parentCount: this.collection.getDownstreamTasks(this).length
        });
      }
    });

    return TodoTaskModel;
});