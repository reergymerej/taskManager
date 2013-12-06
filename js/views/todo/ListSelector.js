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

        // {Number}
        this.selectedListId = undefined;

        // These are all the todo lists saved in the db.
        this.todoLists = new TodoListCollection();
        this.todoLists.fetch({
          data: {
            archived: false
          },
          success: function (collection, response, options) {
            me.setActiveList(collection.models[0] && collection.models[0].get('id'));
          },
          error: function () {
            console.error('error loading TodoListCollection');
          }
        });

        this.todoLists.on('sync', function (collection, response, options) {
          me.render();
        });

        // This is the currently selected todo list.
        this.todoCollection = new TodoList();

        this.$el.on('change', '#todo-lists', function (event) {
          var id = parseInt($(this).val(), 10);
          me.setActiveList(id);
        });

        this.$el.on('click', '#new-list', function (event) {
          var todoList = new TodoListModel();

          me.todoLists.add(todoList);
          todoList.save({}, {
            success: function (model, response, options) {
              me.setActiveList(model.get('id'));
              me.render();
            },
            error: function (model, xhr, options) {
              console.error('unable to save model');
            }
          });
          event.preventDefault();
          event.stopPropagation();
        });
      },

      /**
      * Set the selected list.
      * @param {Number} id
      * @private
      */
      setActiveList: function (id) {
        if (typeof id !== 'number') {
          console.error('tried to set list with no id');
        } else {
          this.selectedListId = id;
          this.render();
          this.trigger('todolist:selected', this.selectedListId);
        }
      },

      render: function () {
        var me = this,
          templateData = this.todoLists.toJSON(),
          compiledTemplate;

        if (me.selectedListId === undefined) {
          console.error('need to know what list we are using');
        } else {
          _.each(templateData, function (element, index, list) {
            if (element.id === me.selectedListId) {
              element.selected = 'selected="selected"';
            }
          });
        }

        // if (me.selectedListId) {
        // } else if (templateData[0]) {
        //   templateData[0].selected = 'selected="selected"';
        //   me.setActiveList(templateData[0].id);
        // }

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