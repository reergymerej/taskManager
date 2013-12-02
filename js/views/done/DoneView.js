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

          if (me.isValidDate(from) && me.isValidDate(to)) {
            from = from.getTime();
            to = to.getTime();

            if (from < to) {
              me.loadDoneCollection(from, to);
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
        var compiledTemplate = _.template(doneTemplate, {}),
          day,
          month,
          year,
          today = new Date();

        $('.menu li').removeClass('active');
        $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');
        this.$el.html(compiledTemplate);

        // apply date picker
        this.$el.find('.date').datepicker();

        // set default date
        day = this.pad(today.getDate());
        month = this.pad(today.getMonth() + 1);
        year = today.getFullYear();

        this.$el.find('[name="from"]').val(month + '/' + day + '/' + year);
      },

      pad: function (val) {
        val = String(val);
        while (val.length > 2) {
          val = '0' + val;
        }
        return val;
      },

      isValidDate: function (date) {
        return !isNaN(date.getTime());
      },

      /**
      * Loads a set of tasks and renders them.
      * @param {Number} [from]
      * @param {Number} [to]
      */
      loadDoneCollection: function (from, to) {
        var me = this;

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
      }
    });

    return DoneView;
  });