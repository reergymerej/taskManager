// This displays a collection of TodoTasks as a tree.
// It requires a collection to use, but it does not own
// it.  Monitor the collection for updates.

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/todo/taskViewer.html'
],
  function (
    $,
    _,
    Backbone,
    taskViewer
  ) {

    var TodoView = Backbone.View.extend({
      // el: $("#page"),

      /**
      * This is the collection this is displaying.
      * @property {TodoList} collection
      */

      initialize: function () {
        var me = this;

        this.$el.empty().off();

        if (this.collection) {
          this.setupCollection();
        }
        

        // add new task on click
        this.$el.on('click', 'button.add', function (event) {
          if (me.collection.id) {
            me.collection.create(
              {
                todoCollectionId: me.collection.id
              },
              {
                wait: true
              }
            );
          }
        });

        // toggle visibility of completed tasks
        this.$el.on('change', '#hide-complete', function (event) {
          me.setVisibilityForCompleted(!$(this).prop('checked'));
        });

        this.render();
      },

      render: function () {
        var me = this,
          compiledTemplate = _.template(taskViewer, {});

        // render the items in the collection
        this.$el.html(compiledTemplate);

        me.renderTasks();
      },

      setCollection: function (c) {
        this.collection = c;
        this.setupCollection();
      },

      // Add the listeners to the collection.
      setupCollection: function () {
        var me = this;
        // rerender the tasks when the collection changes
        this.collection.on('add remove reset', function (model, collection, options) {
          me.renderTasks();
        });
      },

      // renders the TodoTasks for the current TodoList
      renderTasks: function () {
        var me = this;

        if (this.collection) {
          // empty existing
          $('.tasks', this.$el).empty();

          _.each(me.sortCollectionWithDownstreamFirst(), function (model) {
            me.attachTaskView(model);
          });
        }
      },

      // TODO ================================================
      // All this sorting stuff should go in the collection,
      // not the view.
      sortCollectionWithDownstreamFirst: function () {
        // In order to append elements in the right location, a task's downstream task must already
        // be present.  To ensure this, sort the collection with the downstream tasks first.

        var me = this,
          sorted = [],
          emergency = 10;

        this.collection.each(function (model) {
          sorted.push(model);
        });

        while (!this.areAllDownstreamFirst(sorted) && emergency) {
          emergency--;
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
                me.swapPositions(sorted, index, downstreamTaskIndex);
              }
            }
          });
        }

        if (!emergency) {
          console.error('Something went wrong with sorting these by downstream first.');
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
      // ================================================


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
                droppedTaskModel = me.collection.get(droppedTaskId);
                taskPath = me.collection.getTaskPath(targetTaskId);

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
        var taskContainer = this.$el.find('.tasks'),
          visiblityClass = 'hide-complete';
        if (visible) {
          taskContainer.removeClass(visiblityClass);
        } else {
          taskContainer.addClass(visiblityClass);
        }
      }
    });

    return TodoView;
  });