define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/done/taskCollectionTemplate.html'
],
  function (
    $,
    _,
    Backbone,
    taskCollectionTemplate
  ) {

    var DoneTaskCollectionView = Backbone.View.extend({

      initialize: function (config) {
        var me = this;

        // this.$el.on('click', '.stop', function () {
        // });

        this.render();
      },

      render: function () {
        var data = this.collection.toJSON();
        console.log(data);

        this.collection.each(function (model, index, collection) {
          // console.log(arguments);
          // console.log(model.getTemplateData());
        });

        this.$el.html(_.template(taskCollectionTemplate, {
          collection: this.collection
        }));
      }
    });

    return DoneTaskCollectionView;
  });