define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/foo/taskTemplate.html'
],
  function (
    $,
    _,
    Backbone,
    taskTemplate
  ) {

    var TaskView = Backbone.View.extend({

      inEditMode: false,

      initialize: function (config) {
        var me = this;

        this.$el.on('click', '.stop', function () {
          var time = Date.now();

          me.model.set({
            end: time
          });
        });

        this.$el.on('click', '.delete', function () {
          me.model.destroy();
          me.remove();
        });

        this.model.on('change', function () {
          if (!me.inEditMode) {
            this.save();
            me.render();
          }
        });

        this.render();
      },

      render: function () {
        this.$el.html(_.template(taskTemplate, {
          data: this.model.getTemplateData()
        }));
      }
    });

    return TaskView;
  });