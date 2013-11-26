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

        // Group the collection by downstreamTaskId so attachTaskView
        // is able to find what it's looking for.
        _.each(me.sortCollectionWithDownstreamFirst(), function (model) {
          me.attachTaskView(model);
        });

        // highlight those with no upstream
      },

      sortCollectionWithDownstreamFirst: function () {
        var sorted = [];

        todoCollection.each(function (model) {
          var modelsDownstreamTaskId = model.get('downstreamTaskId'),
            index = 0;

          // Is this task's downstream already sorted?
          _.each(sorted, function (task, i) {
            var id = task.get('id');
            if (id === modelsDownstreamTaskId) {
              index = i + 1;
              return false;
            }
          });

          sorted.splice(index, 0, model);
        });

        return sorted;
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
        console.log('setVisibilityForCompleted', visible);
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