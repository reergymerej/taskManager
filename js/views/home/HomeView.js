define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/home/homeTemplate.html',
  'views/todo/TodoView',
  'views/doing/TaskAdderView'
],
  function (
    $,
    _,
    Backbone,
    homeTemplate,
    TodoView,
    TaskAdderView
  ) {

    var HomeView = Backbone.View.extend({
      el: $("#page"),

      initialize: function () {
      },

      render: function () {
        var compiledTemplate = _.template(homeTemplate, {}),
          todo,
          doing,
          done;

        $('.menu li').removeClass('active');
        $('.menu li a[href="#"]').parent().addClass('active');
        this.$el.html(compiledTemplate);

        todo = new TodoView({
          el: $('#todo')
        });

        doing = new TaskAdderView({
          el: $('#doing')
        });
        doing.render();
      }
    });

    return HomeView;
  });