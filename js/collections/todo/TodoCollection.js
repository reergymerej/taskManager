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
        var tasks = []
          emergency = 100;

        do {
          model = this.get(model.get('downstreamTaskId'));
          if (model) {
            tasks.push(model);
          }
          emergency--;
        } while (model && emergency);
        
        if (!emergency) {
          console.error('What the hell?');
        }
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
      },

      // returns a delimited string of task ids from a task all the way to root
      getTaskPath: function (id, delimiter) {
        var downstream = [],
          model = this.get(id);

        delimiter = delimiter || '/';
        if (model) {
          downstream = this.getDownstreamTasks(model);
          _.each(downstream, function (model, index, collection) {
            collection[index] = model.get('id');
          });
        }

        return downstream.join(delimiter);
      }
    });

    return TodoCollection;
});