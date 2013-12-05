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
  ) {
    var TodoList = Backbone.Collection.extend({
      url: 'lib/resteasy/api/todotasks',
      model: TodoTaskModel,

      initialize: function () {},

      // TODO These should be optimized or maybe even cached.
      getDownstreamTasks: function (model) {
        var tasks = [],
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

      // TODO These should be optimized or maybe even cached.
      getUpstreamTasks: function (model) {
        var tasks = [];
        this.each(function (task) {
          if (task.get('downstreamTaskId') === model.get('id')) {
            tasks.push(task);
          }
        });
        return tasks;
      },

      getUpstreamIncomplete: function (model) {
        var upstream = this.getUpstreamTasks(model),
          incomplete = [];
        _.each(upstream, function (task, index, collection) {
          if (!task.get('isComplete')) {
            incomplete.push(task);
          }
        });
        return incomplete;
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
      },

      // returns an array of all up and downstream tasks
      getRelatedTasks: function (model) {
        var related = [];
        related = related.concat(this.getUpstreamTasks(model));
        related = related.concat(this.getDownstreamTasks(model));
        return related;
      },

      /**
      * Load the specified collection.
      * @param {Number} config.id
      * @param {Function} config.success
      * @param {Function} config.error
      */
      loadList: function (config) {
        this.id = config.id;
        delete config.id;
        config.data = {
          todoCollectionId: this.id
        };
        
        this.fetch(config, { reset: true });
      }
    });

    return TodoList;
  });