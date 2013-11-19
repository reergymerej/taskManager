define([
  'jquery',
  'underscore',
  'backbone',
  'models/TaskModel',
  'collections/TaskCollection',
  'text!templates/taskReviewerTemplate.html',
  'views/TaskCollectionView'
],
  function (
    $,
    _,
    Backbone,
    TaskModel,
    TaskCollection,
    taskReviewerTemplate,
    TaskCollectionView
  ) {

    var taskCollection = new TaskCollection();
    

    var TaskReviewerView = Backbone.View.extend({
      el: $("#page"),

      initialize: function () {
        var me = this;

        this.$el.on('submit', 'form', function (event) {
          var form = $(this),
            from = form.find('[name="from"]').val(),
            to = form.find('[name="to"]').val();

          taskCollection.fetch({
            data: {
              from: from,
              to: to
            },
            success: function (collection, response, options) {
              var view = new TaskCollectionView({
                el: me.$el.find('#tasks')[0],
                collection: collection
              });
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