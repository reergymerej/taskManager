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
          todoCollectionId: undefined,
          taskOrder: 0
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
        var me = this,
          data = this.toJSON();

        if (this.collection) {
          _.extend(data, {
            cls: data.isComplete ? 'complete' : '',
            checked: data.isComplete ? 'checked="checked"' : '',
            downstreamCount: me.collection.getDownstreamTasks(me).length,

            // Highlight those with no upstream incomplete which are incomplete themselves.
            highlight: this.collection.getUpstreamIncomplete(this).length === 0 && !data.isComplete
          });
        } else {
          console.warn('no collection for this model');
        }

        return data;
      }
    });

    return TodoTaskModel;
});