// This contains a view for managing todolists
// and a view for the todotasks in the selected todolist.

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/todo/todoTemplate.html',
  'views/todo/ListSelector',
  'views/todo/TodoTaskTreeView',
  'collections/todo/TodoList'
],
  function (
    $,
    _,
    Backbone,
    todoTemplate,
    ListSelector,
    TodoTaskTreeView,
    TodoList
  ) {

    // This is the current collection of TodoTasks.
    var currentTodoCollection = new TodoList();

    var TodoView = Backbone.View.extend({
      el: $("#page"),

      /**
      * @property
      * This view allows the user to select which TodoCollection to 
      * work with.
      */
      listSelector: undefined,

      /**
      * @property
      * This view shows the tasks in the active TodoCollection.
      */
      taskViewer: undefined,

      initialize: function () {
        var me = this;
        this.$el.empty().off();
        this.render();
      },

      render: function () {
        var me = this,
          compiledTemplate = _.template(todoTemplate, {});

        $('.menu li').removeClass('active');
        $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');

        this.$el.html(compiledTemplate);

        this.setupListSelector();
        this.setupTaskViewer();
      },

      setupListSelector: function () {
        var me = this;
        
        this.listSelector = new ListSelector({
          el: $('#todoListCollection')
        });

        this.listSelector.on('todolist:selected', function (id) {
          currentTodoCollection.loadList({
            id: id,
            success: function () {
              me.triggerViewChange()
            },
            error: function (collection) {
              console.error('unable to load collection');
              me.triggerViewChange();
            }
          });
        });
      },

      setupTaskViewer: function () {
        this.taskViewer = new TodoTaskTreeView({
          el: $('#taskViewer'),
          collection: currentTodoCollection
        });
      },

      /**
      * Trigger a view change event.
      * @private
      */
      triggerViewChange: function () {
        this.trigger('change:view');
      }
    });

    return TodoView;
  });