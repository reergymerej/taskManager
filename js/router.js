// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/home/HomeView',
  'views/todo/TodoView',
  'views/doing/TaskAdderView',
  'views/done/TaskReviewerView'
],
  function (
    $,
    _,
    Backbone,
    HomeView,
    TodoView,
    TaskAdderView,
    TaskReviewerView
  ) {

    var AppRouter = Backbone.Router.extend({
      routes: {
        home: 'showHome',
        todo: 'showTodo',
        taskAdder: 'showTaskAdder',
        taskViewer: 'showTaskReviewer',
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
        var taskAdderView = new TaskAdderView({
          el: $('#page')
        });
        taskAdderView.render();
      });

      app_router.on('route:showTaskReviewer', function () {
        var view = new TaskReviewerView();
        view.render();
      });

      Backbone.history.start();
    };
    return {
      initialize: initialize
    };
  });