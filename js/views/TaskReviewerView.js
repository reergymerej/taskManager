define([
  'jquery',
  'underscore',
  'backbone',
  'models/TaskModel',
  'collections/TaskCollection',
  'text!templates/foo/taskReviewerTemplate.html'
],
  function (
    $,
    _,
    Backbone,
    TaskModel,
    TaskCollection,
    taskReviewerTemplate
  ) {

    var taskCollection = new TaskCollection();
    window.taskCollection = taskCollection;

    var TaskReviewerView = Backbone.View.extend({
      el: $("#page"),

      initialize: function () {
        this.$el.on('submit', 'form', function (event) {
          var form = $(this),
            from = form.find('[name="from"]').val(),
            to = form.find('[name="to"]').val();

          taskCollection.fetch({
            data: {
              from: from,
              to: to
            }
          });
          return false;
        });
      },

      render: function () {
        var compiledTemplate = _.template(taskReviewerTemplate, {});
        $('.menu li').removeClass('active');
        $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');
        this.$el.html(compiledTemplate);
      }
    });

    return TaskReviewerView;
  });