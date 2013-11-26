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
          var upstream = this.collection.getUpstreamTasks(model);
          _.each(upstream, function (taskModel) {
            taskModel.destroy();
          });
        });
      },

      getTemplateData: function () {
        var data = this.toJSON();
        return _.extend(data, {
          cls: data.isComplete ? 'complete' : '',
          checked: data.isComplete ? 'checked="checked"' : '',
          downstreamCount: this.collection.getDownstreamTasks(this).length,
          upstreamCount: this.collection.getUpstreamTasks(this).length,
          upstreamIncomplete: this.collection.getUpstreamIncomplete(this).length
        });
      }
    });

    return TodoTaskModel;
});