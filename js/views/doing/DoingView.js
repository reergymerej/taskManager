define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/doing/doingTemplate.html',
  'views/doing/TaskView',
  'models/doing/TaskModel',
  'collections/doing/TaskCollection'
],
  function (
    $,
    _,
    Backbone,
    doingTemplate,
    TaskView,
    TaskModel,
    TaskCollection
  ) {

    var taskCollection,
      hints;

    require(['collections/hints'], function (h) {
      hints = h;
    });

    var DoingView = Backbone.View.extend({

      initialize: function () {
        var me = this;

        taskCollection = new TaskCollection();
        taskCollection.on('change add remove', function (model, options) {
          me.triggerChangeEvent();
        });

        this.$el.off().empty();

        this.$el.on('change', '#show-all-today, #show-in-progress', function (event) {
          me.fetchTasks();
        });

        // set up editable plugin
        this.$el.editable({
          onBeforeEdit: function () {
            return this.html() !== '';
          },
          getEditField: function (value) {
            var fieldName = this.attr('name'),
              editField = $('<input />', {
                value: value
              });

            if (this.is('.text')) {
              editField.autocomplete({
                source: me.getAutoComplete
              });
            }

            return editField;
          },
          getEditValue: function () {
            // if (this.is('.time')) {
            //   return TaskModel.getDateFromTimeString(this.html());
            // }
          },
          onBeforeBlur: function (value) {
            return value !== '';
          },
          getNewValue: function (value) {
            if (this.is('.time')) {
              return TaskModel.prototype.getDateFromTimeString(value);
            }
          },
          getError: function (value) {
            var error;
            if (value === '') {
              error = 'This is required.';
            }
            return error;
          },
          onChanged: function (value, oldValue) {
            var id = me.getTaskIdFromElement(this),
              taskModel = id && taskCollection.get(id),
              field = taskModel && this.attr('name');

            console.log('onChanged');
            if (field) {
              taskModel.set(field, value);
            }
          },
          onFinish: function (lastKey) {
            // If tab, don't change the value yet.
            if (lastKey === 9) {
              console.log(lastKey);
            }
          }
        });

        this.fetchTasks();



        this.$el.on('click', '#newTask', function (event) {
          me.newTask();
          event.preventDefault();
          event.stopPropagation();
        });

        this.$el.on('click', '.clone', function () {
          var id = me.getTaskIdFromElement(this),
            data = id && taskCollection.get(id).toJSON();

          if (data) {
            delete data.id;
            delete data.start;
            delete data.end;
            delete data.duration;
            me.newTask(data);
          }
        });

        this.$el.on('click', '.toolIcon', function () {
          var el = $(this);
          el.next('.tools').toggle();
        });

        $('.menu li').removeClass('active');
        $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');

        this.render();
      },

      render: function () {
        var me = this,
          compiledTemplate = _.template(doingTemplate, {});

        this.$el.html(compiledTemplate);

        this.renderTasks();
      },

      renderTasks: function () {
        var me = this;

        $('#taskHolder').empty().off();

        taskCollection.each(function (model, index, collection) {
          me.createTaskView(model);
        });
      },

      getTaskIdFromElement: function (el) {
        var taskEl, id;
        if (!(el instanceof $)) {
          el = $(el);
        }
        taskEl = el.closest('.task');
        id = taskEl.attr('id');
        return id ? parseInt(id, 10) : null;
      },

      getTaskElById: function (id) {
        return $('#' + id).parent();
      },

      newTask: function (modelData, viewEl) {
        var me = this,
          model = new TaskModel(modelData);

        model.save(undefined, {
          wait: true,
          success: function (model, response, options) {
            taskCollection.add(model);
            me.createTaskView(model);
          }
        });
      },

      createTaskView: function (taskModel) {
        var viewEl = $('<div>');

        viewEl.prependTo('#taskHolder');
        view = new TaskView({
          el: viewEl,
          model: taskModel
        });
      },

      /**
      * @param {Object} req
      * @param {Function} callback
      * @return {String[]}
      */
      getAutoComplete: function (req, callback) {
        var val = req.term,
          results = [];

        if (hints) {
          results = hints.getHints(val);
        }
        callback(results);
      },

      /**
      * fetch the current inprogress tasks
      */ 
      fetchTasks: function () {
        var me = this;

        taskCollection.fetch({
          data: {
            today: $('#show-all-today').prop('checked'),
            inProgress: $('#show-in-progress').prop('checked')
          },
          success: function (collection, response, options) {
            me.renderTasks();
            me.triggerChangeEvent();
          },
          error: function () {
            console.error('no data');
            me.renderTasks();
            me.triggerChangeEvent();
          }
        });
      },

      triggerChangeEvent: function () {
        this.trigger('change:view');   
      }
    });

    return DoingView;
  });