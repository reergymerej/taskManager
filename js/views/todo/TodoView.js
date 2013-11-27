// This contains a view for managing todolists
// and a view for the todotasks in the selected todolist.

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/todo/todoTemplate.html',
  'views/todo/TodoListView',
  'collections/todo/TodoCollection',
  'models/todo/TodoTaskModel'
],
  function (
    $,
    _,
    Backbone,
    todoTemplate,
    TodoListView,
    TodoCollection,
    TodoTaskModel
  ) {

    var todoCollection = new TodoCollection();

    var TodoView = Backbone.View.extend({
      el: $("#page"),

      initialize: function () {
        var me = this;

        this.$el.empty().off();

        // load the collection (either load a saved one or create a new one)


        todoCollection.on('add remove', function (model, collection, options) {
          me.renderTasks();
        });

        this.$el.on('click', 'button.add', function (event) {
          if (todoCollection.id) {
            todoCollection.create(
              {
                todoCollectionId: todoCollection.id
              },
              {
                wait: true
              }
            );
          }
        });

        this.$el.on('change', '[name="hide-complete"]', function (event) {
          me.setVisibilityForCompleted(!$(this).prop('checked'));
        });
      },

      render: function () {
        var me = this,
          compiledTemplate = _.template(todoTemplate, {}),
          todoListCollectionView;

        $('.menu li').removeClass('active');
        $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');

        // render the items in the collection
        this.$el.html(compiledTemplate);

        todoListCollectionView = new TodoListView({
          el: $('#todoListCollection')
        });

        todoListCollectionView.on('loaded:todolists', function (todoListCollectionView) {
          todoListCollectionView.render();
        });

        todoListCollectionView.on('swaplist', function (id) {
          todoCollection.id = id;

          todoCollection.fetch({
            data: {
              todoCollectionId: id
            },
            success: function () {
              console.log('collection reloaded');
              window.todoCollection = todoCollection;
              me.renderTasks();
            },
            error: function (collection) {
              // TODO This is probably a new list.  For now, let's
              // just assume this is the case and the fetch tasks
              // response returned a 404.
              collection.reset();
              me.renderTasks();
            }
          }, {
            reset: true
          });
        });

        me.renderTasks();
      },

      // renders the TodoTasks for the current TodoList
      renderTasks: function () {
        var me = this;

        // empty existing
        $('.tasks', this.$el).empty();

        this.describeCollection(todoCollection);
        _.each(me.sortCollectionWithDownstreamFirst(), function (model) {
          me.attachTaskView(model);
        });
        this.describeCollection(todoCollection);

      },

      // DEBUG
      describeCollection: function (collection) {
        collection.each(function (model, index) {
          console.log(index, model.get('id'), model.get('downstreamTaskId'));
        });
      },

      describe: function (arr) {
        _.each(arr, function (model, index) {
          console.log(index, model.get('id'), model.get('downstreamTaskId'));
        });
      },

      sortCollectionWithDownstreamFirst: function () {
        // In order to append elements in the right location, a task's downstream task must already
        // be present.  To ensure this, sort the collection with the downstream tasks first.

        var me = this,
          sorted = [];

        console.log('need to fix sorting');
        this.describeCollection(todoCollection);

        todoCollection.each(function (model) {
          // var modelsDownstreamTaskId = model.get('downstreamTaskId'),
          //   index = 0;

          // if (modelsDownstreamTaskId !== 0) {
          //   // Is this task's downstream already sorted?
          //   _.each(sorted, function (task, i) {
          //     var id = task.get('id');
          //     if (id === modelsDownstreamTaskId) {
          //       index = i + 1;
          //       return false;
          //     }
          //   });
          // }

          // sorted.splice(index, 0, model);
          sorted.push(model);
        });

        if (!this.areAllDownstreamFirst(sorted)) {

          _.each(sorted, function (model, index, sorted) {
            // What is this tasks downstream id?
            var downstreamTaskId = model.get('downstreamTaskId'),
              downstreamTaskIndex;

            // Where is this downstream task?
            _.each(sorted, function (model, index) {
              if (downstreamTaskIndex === undefined) {
                if (model.get('id') === downstreamTaskId) {
                  downstreamTaskIndex = index;
                }
              }
            });

            if (downstreamTaskIndex !== undefined) {
              if (index < downstreamTaskIndex) {
                console.log('We need to move the downstream task before the upstream.');
                me.describe(sorted);
                me.swapPositions(sorted, index, downstreamTaskIndex);
                me.describe(sorted);
              }
            }
          });
        }

        return sorted;
      },

      // returns true if all dowstream tasks are listed before
      // their upstream references
      // @param {TaskModel[]} tasks
      areAllDownstreamFirst: function (tasks) {
        var result = true;

        _.each(tasks, function (task, index) {
          var downstreamTaskId,
            downstreamTaskIndex;

          if (result) {
            downstreamTaskId = task.get('downstreamTaskId');

            _.each(tasks, function (task, index) {
              if (downstreamTaskIndex === undefined) {
                if (task.get('id') === downstreamTaskId) {
                  downstreamTaskIndex = index;
                }
              }
            });

            // Is this task after its downstream?
            if (downstreamTaskIndex !== undefined) {
              result = index > downstreamTaskIndex;
            }
          }
        });

        return result;
      },

      // Swap the position of two items in an array.
      swapPositions: function (arr, indexA, indexB) {
        var itemA, itemB;

        if (indexA < indexB) {
          itemB = arr.splice(indexB, 1);
          itemA = arr.splice(indexA, 1);
          arr.splice(indexA, 0, itemB[0]);
          arr.splice(indexB, 0, itemA[0]);
        } else {
          itemA = arr.splice(indexA, 1);
          itemB = arr.splice(indexB, 1);
          arr.splice(indexB, 0, itemA[0]);
          arr.splice(indexA, 0, itemB[0]);
        }

        return arr;  
      },

      // This adds a TodoTaskView relative to its parent's view.
      attachTaskView: function (model) {

        var me = this;

        require(['views/todo/TodoTaskView'], function (TodoTaskView) {
          // find the parent
          var downstreamEl = me.getTaskElByModelId(model.get('downstreamTaskId')),
            el = $('<div />').addClass('todoTaskEl'),
            taskView = new TodoTaskView({
              el: el,
              model: model
            });

          if (downstreamEl) {
            downstreamEl.after(el);
          } else {
            if (model.get('downstreamTaskId')) {
              console.error('unable to find the downstream task');
              debugger;
            }
            $('.tasks', me.$el).append(el);
          }

          taskView.render();

          // configure draggable
          taskView.$el.draggable({
            revert: 'invalid'
          });

          taskView.$el.droppable({
            drop: function (event, ui) {
              var targetTaskId = $(this).find('.todoTask').attr('id'),
                droppedTaskId = ui.draggable.find('.todoTask').attr('id'),
                droppedTaskModel,
                taskPath;

              targetTaskId = parseInt(targetTaskId, 10);
              droppedTaskId = parseInt(droppedTaskId, 10);

              if (!isNaN(targetTaskId) && !isNaN(droppedTaskId)) {

                // Make sure we didn't just drop a task on one of it's upstream tasks.
                droppedTaskModel = todoCollection.get(droppedTaskId);
                taskPath = todoCollection.getTaskPath(targetTaskId);

                if (taskPath.indexOf(droppedTaskId) === -1) {
                  droppedTaskModel.set('downstreamTaskId', targetTaskId);
                  me.renderTasks();
                } else {
                  console.error('You cannot drop it on its own upstream task.');
                  // TODO change this to revert.
                  ui.draggable.css({top: 0, left: 0});
                }
              }
            },
            accept: '.todoTaskEl'
          });
        });
      },

      getTaskElByModelId: function (id) {
        var el = $('#' + id, this.$el);
        return el.length > 0 ? el.parent() : null;
      },

      setVisibilityForCompleted: function (visible) {
        var me = this;
        todoCollection.each(function (model) {
          if (model.get('isComplete')) {
            if (visible) {
              me.getTaskElByModelId(model.get('id')).show();
            } else {
              me.getTaskElByModelId(model.get('id')).hide();
            }
          }
        });
      }
    });

    return TodoView;
  });