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

      initialize: function () {
        this.on('remove', function (model, collection) {
          collection.shiftTaskOrderAfterTaskRemoved(model);
        });
      },

      comparator: function (a, b) {
        var aDsTask = a.get('downstreamTaskId'),
          bDsTask = b.get('downstreamTaskId');
        
        if (aDsTask === bDsTask) {
          return a.get('taskOrder') < b.get('taskOrder') ? -1 : 1;
        } else {
          return aDsTask < bDsTask ? -1 : 1;
        }
      },

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
      },

      /**
      * Get an array of sibling tasks (those with the same immediate downstream task)
      * @param {TodoTaskModel} task
      * @return {TodoTaskModel[]}
      */
      getSiblingTasks: function (task) {
        var siblings = [],
          downstreamId = task.get('downstreamTaskId');

        this.each(function (t) {
          if (t.get('downstreamTaskId') === downstreamId && t !== task) {
            siblings.push(t);
          }
        });

        return siblings;
      },

      /**
      * Get an array of tasks by one or more attributes.
      * TODO This will not be needed after upgrading backbone since
      * we'll be able to use findWhere.
      * @param {Object} attributes
      * @return {TodoTaskModel[]}
      */
      getTasksByAttrs: function (attributes) {
        var tasks = [];

        this.forEach(function (task, index, collection) {
          var i,
            isMatch = true;
          
          for (i in attributes) {
            if (isMatch && attributes.hasOwnProperty(i)) {
              isMatch = task.get(i) === attributes[i];
            }
          }

          if (isMatch) {
            tasks.push(task);
          }
        });

        return tasks;
      },

      /**
      * Get the next taskOrder based on a downstream task.
      * @param {TodoTaskModel/Number} dsTask task or task id
      * @return {TodoTaskModel[]}
      */
      getNextTaskOrder: function (dsTask) {
        if (typeof dsTask !== 'number') {
          dsTask = dsTask.get('downstreamTaskId');
        }
        return this.getTasksByAttrs({downstreamTaskId: dsTask}).length;
      },

      /**
      * Update the taskOrder for any tasks affected by one being removed.
      * Sibling tasks with taskOrder after the removed task's taskOrder
      * are shifted down to fill the hole.
      * @param {TodoTaskModel} removedTask
      */
      shiftTaskOrderAfterTaskRemoved: function (removedTask) {
        var siblings = this.getSiblingTasks(removedTask),
          removedTaskOrder = removedTask.get('taskOrder');

        _.each(siblings, function (task, index, collection) {
          var taskOrder = task.get('taskOrder');
          if (taskOrder > removedTaskOrder) {
            task.set('taskOrder', taskOrder - 1);
          }
        });
      },

      refreshTaskOrders: function (dsTaskId) {
        var tasks = this.getTasksByAttrs({downstreamTaskId: dsTaskId}),
          missingOrder,
          orders = [],
          i;

        if (tasks.length > 0) {
          _.each(tasks, function (t) {
            orders.push(t.get('taskOrder'));
          });

          orders.sort();

          for (i = 0; i < orders.length; i++) {
            if (orders[i] !== i) {
              missingOrder = i;
            }
          }

          if (missingOrder !== undefined) {
            _.each(tasks, function (t) {
              var order = t.get('taskOrder');
              if (order > missingOrder) {
                t.set('taskOrder', order - 1);
              }
            });
          }
        }
      },

      /**
      * Move a task (by taskOrder) up or down.  Moves sibling tasks as well.
      * @param {TodoTaskModel} task
      * @param {Number} direction -1 or 1
      */
      changeOrder: function (task, direction) {
        var siblings = this.getSiblingTasks(task),
          canChange = false,
          originalTaskOrder = task.get('taskOrder'),
          newTaskOrder;

        canChange = direction === -1 && originalTaskOrder > 0 || direction === 1 && originalTaskOrder < siblings.length;

        if (canChange) {
          newTaskOrder = originalTaskOrder + direction;
          task.set('taskOrder', newTaskOrder);

          // update the sibling this one displaced
          // TODO upgrade backbone so we can use findWhere on the collection
          _.each(siblings, function (sibling) {
            var taskOrder = sibling.get('taskOrder');
            if (taskOrder === newTaskOrder) {
              sibling.set('taskOrder', taskOrder - direction);
            }
          });
        }
      }
    });

    return TodoList;
  });