// This displays the todo lists saved in the database.
// The purpose of this is to allow a user to choose which
// TodoList they want to work with.

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/todo/todoListCollectionTemplate.html',
  'models/todo/TodoListModel',
  'collections/todo/TodoList',
  'collections/todo/TodoListCollection'
],
  function (
    $,
    _,
    Backbone,
    todoListCollectionTemplate,
    TodoListModel,
    TodoList,
    TodoListCollection
  ) {

    var ListSelector = Backbone.View.extend({

      initialize: function () {
        var me = this;

        this.currentList = undefined;

        // These are all the todo lists saved in the db.
        this.todoLists = new TodoListCollection();
        this.todoLists.fetch({
          data: {
            archived: false
          },
          success: function (collection, response, options) {
            me.render();
          },
          error: function () {
            console.error('error loading TodoListCollection');
            me.render();
          }
        });

        this.todoLists.on('sync', function (collection, response, options) {
          me.render();
        });

        // This is the currently selected todo list.
        this.todoCollection = new TodoList();

        this.$el.on('change', '#todo-lists', function (event) {
          var id = parseInt($(this).val(), 10);
          me.currentList = id;
          me.trigger('todolist:selected', id);
        });

        this.$el.on('click', 'button#new-list', function (event) {
          var todoList = new TodoListModel();

          me.todoLists.add(todoList);
          todoList.save();

          // TODO These aren't firing for some reason.
          // todoList.save({
          //   success: function (model, response, options) {
          //     console.log('new list saved');
          //   },
          //   error: function (model, xhr, options) {
          //     console.error('unable to save model');
          //   }
          // });
        });
      },

      render: function () {
        var me = this,
          templateData = this.todoLists.toJSON(),
          compiledTemplate;

        if (me.currentList) {
          _.each(templateData, function (element, index, list) {
            if (element.id === me.currentList) {
              element.selected = 'selected="selected"';
            }
          });
        } else if (templateData[0]) {
          templateData[0].selected = 'selected="selected"';
          this.currentList = templateData[0].id;
          me.trigger('todolist:selected', this.currentList);
        }

        compiledTemplate = _.template(todoListCollectionTemplate, {
          data: templateData
        });

        // render the items in the collection
        this.$el.html(compiledTemplate);
      },

      swapCollection: function (todoListModel) {
        this.todoCollection.reset();
        this.todoCollection.id = todoListModel.get('id');
        this.render();
      }
    });

    return ListSelector;
  });