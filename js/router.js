// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/home/HomeView',
  'views/todo/TodoView',
  'views/todo/TodoManagementView',
  'views/doing/DoingView',
  'views/done/DoneView',
  'collections/hints'
],
  function (
    $,
    _,
    Backbone,
    HomeView,
    TodoView,
    TodoManagementView,
    DoingView,
    DoneView,
    hints
  ) {

    var AppRouter = Backbone.Router.extend({
      routes: {
        home: 'showHome',
        todo: 'showTodo',
        doing: 'showTaskAdder',
        done: 'showTaskReviewer',
        'manage-todo': 'showManageTodo',

        // Default
        '*actions': 'showHome'
      }
    });

    var initialize = function () {
      var app_router = new AppRouter();

      app_router.on('route:showHome', function () {
        var view = new HomeView();
        view.render();
      });

      app_router.on('route:showTodo', function () {
        var view = new TodoView();
        view.render();
      });

      app_router.on('route:showTaskAdder', function () {
        var doingView = new DoingView({
          el: $('#page')
        });
      });

      app_router.on('route:showTaskReviewer', function () {
        var view = new DoneView();
        view.render();
      });

      app_router.on('route:showManageTodo', function () {
        var view = new TodoManagementView();
      });

      Backbone.history.start();
    };
    return {
      initialize: initialize
    };
  });