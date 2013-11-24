define([
  'jquery',
  'underscore',
  'backbone',
  'models/doing/TaskModel',
  'collections/doing/TaskCollection',
  'text!templates/done/doneTemplate.html',
  'views/done/DoneTaskCollectionView'
],
  function (
    $,
    _,
    Backbone,
    TaskModel,
    TaskCollection,
    doneTemplate,
    DoneTaskCollectionView
  ) {

    var taskCollection = new TaskCollection();

    var DoneView = Backbone.View.extend({
      el: $("#page"),

      initialize: function () {
        var me = this;

        this.$el.empty().off();

        this.$el.on('submit', 'form', function (event) {
          var form = $(this),
            from = form.find('[name="from"]').val(),
            to = form.find('[name="to"]').val();

          from = new Date(from || null);
          to = to ? new Date(to) : new Date();

          // TODO validate form
          if (me.isValidDate(from) && me.isValidDate(to)) {
            from = from.getTime();
            to = to.getTime();

            if (from < to) {
              taskCollection.fetch({

                data: {
                  from: from,
                  to: to
                },

                success: function (collection, response, options) {
                  var view = new DoneTaskCollectionView({
                    el: me.$el.find('#tasks')[0],
                    collection: collection
                  });
                }
              });

            } else {
              console.error('invalid date range');
            }
          } else {
            console.error('invalid date range');
          }

          return false;
        });
      },

      render: function () {
        var compiledTemplate = _.template(doneTemplate, {});
        $('.menu li').removeClass('active');
        $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');
        this.$el.html(compiledTemplate);

        // apply date picker
        this.$el.find('.date').datepicker();
      },

      isValidDate: function (date) {
        return !isNaN(date.getTime());
      }
    });

    return DoneView;
  });