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
        // TODO This should represent an object in the db.
        this.id = Date.now();
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
      }
    });

    return TodoCollection;
});