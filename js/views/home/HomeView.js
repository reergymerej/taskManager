define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/home/homeTemplate.html',
  'views/todo/TodoView',
  'views/doing/DoingView',
  'views/done/DoneView'
],
  function (
    $,
    _,
    Backbone,
    homeTemplate,
    TodoView,
    DoingView,
    DoneView
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

        
        this.$el.html(compiledTemplate);

        todo = new TodoView({
          el: $('#todo')
        });
        todo.render();

        doing = new DoingView({
          el: $('#doing')
        });
        doing.render();

        done = new DoneView({
          el: $('#done')
        });
        done.render();

        $('.menu li').removeClass('active');
        $('.menu li a[href="#"]').parent().addClass('active');
      }
    });

    return HomeView;
  });