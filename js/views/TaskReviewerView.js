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