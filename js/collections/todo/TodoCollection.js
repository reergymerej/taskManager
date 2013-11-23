define([
  'jquery',
  'underscore',
  'backbone',
  'models/todo/TodoTaskModel'
], 
function (
  $, 
  _, 
  Backbone, 
  TodoTaskModel
){
    var TodoCollection = Backbone.Collection.extend({
      url: 'lib/resteasy/api/todotasks',
      model: TodoTaskModel,
      initialize: function(){
      },

      getDownstreamTasks: function (model) {
        var tasks = [];

        do {
          model = this.get(model.get('downstreamTaskId'));
          if (model) {
            tasks.push(model);
          }
        } while (model);
        
        return tasks;
      },

      getUpstreamTasks: function (model) {
        var tasks = [];
        this.each(function (task) {
         if (task.get('downstreamTaskId') === model.get('id')) {
          tasks.push(task);
         }
        });
        return tasks;
      }
    });

    return TodoCollection;
});