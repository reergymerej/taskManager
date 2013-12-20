define([
  'jquery',
  'underscore',
  'backbone',
  'views/home/HomeView',
  'views/todo/TodoView',
  'views/todo/TodoManagementView',
  'views/todo/TodoTaskTreeView',
  'views/doing/DoingView',
  'views/done/DoneView',
  'collections/hints',
  'views/account/AccountSignupView'
],
  function (
    $,
    _,
    Backbone,
    HomeView,
    TodoView,
    TodoManagementView,
    TodoTaskTreeView,
    DoingView,
    DoneView,
    hints,
    AccountSignupView
  ) {

    var AppRouter = Backbone.Router.extend({
      routes: {
        home: 'showHome',
        todo: 'showTodo',
        doing: 'showTaskAdder',
        done: 'showTaskReviewer',
        'manage-todo': 'showManageTodo',
        'account-signup': 'showAccountSignup',

        // Default
        '*actions': 'showHome'
      }
    });

    var initialize = function () {
      var router = new AppRouter();

      router.on('route:showHome', function () {
        var view = new HomeView();
        view.render();
      });

      router.on('route:showTodo', function () {
        var view = new TodoView();
      });

      router.on('route:showTaskAdder', function () {
        var doingView = new DoingView({
          el: $('#page')
        });
      });

      router.on('route:showTaskReviewer', function () {
        var view = new DoneView();
        view.render();
      });

      router.on('route:showManageTodo', function () {
        var view = new TodoManagementView();
      });

      router.on('route:showAccountSignup', function () {
        var view = new AccountSignupView({
          el: $('#container')
        });
      });

      Backbone.history.start();
    };
    return {
      initialize: initialize
    };
  });