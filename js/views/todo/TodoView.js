// This contains a view for managing todolists
// and a view for the todotasks in the selected todolist.

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/todo/todoTemplate.html',
  'views/todo/TodoListView',
  'models/todo/TodoListModel',
  'collections/todo/TodoCollection',
  'models/todo/TodoTaskModel',
  'views/todo/TodoTaskView'
],
  function (
    $,
    _,
    Backbone,
    todoTemplate,
    TodoListView,
    TodoListModel,
    TodoCollection,
    TodoTaskModel,
    TodoTaskView
  ) {

    var todoCollection = new TodoCollection();
    window.c = todoCollection;

    var TodoView = Backbone.View.extend({
      el: $("#page"),

      initialize: function () {
        var me = this;

        // load the collection (either load a saved one or create a new one)


        todoCollection.on('add remove', function (model, collection, options) {
          me.render();
        });

        this.$el.on('click', 'button.add', function (event) {
          if (todoCollection.id) {
            todoCollection.create({
              todoCollectionId: todoCollection.id
            });
          }
        });
      },

      render: function () {
        var me = this,
          compiledTemplate = _.template(todoTemplate, {}),
          todoListCollectionView;

        // render the items in the collection
        this.$el.html(compiledTemplate);

        todoListCollectionView = new TodoListView({
          el: $('#todoListCollection')
        });
        todoListCollectionView.render();
        todoListCollectionView.on('swaplist', function (id) {
          todoCollection.id = id;

          todoCollection.fetch({
            data: {
              todoCollectionId: id
            },
            success: function () {
              me.renderTasks();
            },
            error: function () {
              console.error('unable to fetch todo collection', id);
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

        todoCollection.each(function (model, index, collection) {
          me.attachTaskView(model);
        });

        // highlight those with no upstream
      },

      attachTaskView: function (model) {
        // find the parent
        var downstreamEl = this.getTaskElByModelId(model.get('downstreamTaskId')),
          el = $('<div />'),
          taskView = new TodoTaskView({
            el: el,
            model: model
          });

        if (downstreamEl) {
          downstreamEl.after(el);
        } else {
          $('.tasks', this.$el).append(el);
        }

        taskView.render();
      },

      getTaskElByModelId: function (id) {
        var el = $('#' + id, this.$el);
        return el.length > 0 ? el.parent() : null;
      }
    });

    return TodoView;
  });