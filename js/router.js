// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/TaskAdderView',
  'views/TaskReviewerView'
],
  function (
    $,
    _,
    Backbone,
    TaskAdderView,
    TaskReviewerView
  ) {

    var AppRouter = Backbone.Router.extend({
      routes: {
        taskAdder: 'showTaskAdder',
        taskViewer: 'showTaskReviewer',
        // Default
        '*actions': 'showTaskAdder'
      }
    });

    var initialize = function () {
      var app_router = new AppRouter();

      app_router.on('route:showTaskAdder', function () {
        var taskAdderView = new TaskAdderView();
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