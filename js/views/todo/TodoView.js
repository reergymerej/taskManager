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
        _.each(todoCollection.sortBy('downstreamTaskId'), function (model, index, collection) {
          me.attachTaskView(model);
        });

        // highlight those with no upstream
      },

      // This adds a TodoTaskView relative to its parent's view.
      attachTaskView: function (model) {

        var me = this;

        require(['views/todo/TodoTaskView'], function (TodoTaskView) {
          // find the parent
          var downstreamEl = me.getTaskElByModelId(model.get('downstreamTaskId')),
            el = $('<div />'),
            taskView = new TodoTaskView({
              el: el,
              model: model
            });

          if (downstreamEl) {
            downstreamEl.after(el);
          } else {
            $('.tasks', me.$el).append(el);
          }

          taskView.render();
        });
      },

      getTaskElByModelId: function (id) {
        var el = $('#' + id, this.$el);
        return el.length > 0 ? el.parent() : null;
      }
    });

    return TodoView;
  });