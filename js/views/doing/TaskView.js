define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/doing/doingTaskTemplate.html'
],
  function (
    $,
    _,
    Backbone,
    doingTaskTemplate
  ) {

    var TaskView = Backbone.View.extend({

      inEditMode: false,
      cachedValues: {},

      initialize: function (config) {
        var me = this;

        this.$el.on('click', '.stop', function () {
          var time = Date.now();

          me.model.set({
            end: time,
            inProgress: false
          });
        });

        this.$el.on('click', '.delete', function () {
          me.model.destroy();
          me.remove();
        });

        this.model.on('change', function (model, options) {
          if (!options.changes.id) {
            if (!me.inEditMode) {
              this.save();
              me.render();
            }
          }
        });

        this.render();
      },

      render: function () {
        this.$el.html(_.template(doingTaskTemplate, {
          data: this.model.getTemplateData()
        }));
      }
    });

    return TaskView;
  });