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

    var taskCollection;

    var DoingView = Backbone.View.extend({

      initialize: function () {
        var me = this;

        taskCollection = new TaskCollection();
        taskCollection.on('change add remove', function (model, options) {
          me.trigger('change:view');
        });

        console.log('initialize DoingView');
        this.$el.off().empty();

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

            // TODO Change this to use getAutoComplete
            if (this.is('.text')) {
              editField.autocomplete({
                source: _.uniq(taskCollection.pluck(fieldName)).sort()
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

            if (field) {
              taskModel.set(field, value);
            }
          }
        });

        // fetch the current inprogress tasks
        taskCollection.fetch({
          data: {
            inProgress: true
          },
          success: function (collection, response, options) {
            me.render();
          },
          error: function () {
            console.error('no data');
            me.render();
          }
        });

        this.$el.on('click', '#newTask', function () {
          me.newTask();
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
      },

      render: function () {
        var me = this,
          compiledTemplate = _.template(doingTemplate, {});

        this.$el.html(compiledTemplate);

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
      * @param {String} field
      * @return {String[]}
      */
      getAutoComplete: function (field) {
        return ['a', 'aa', 'bbb', 'aaaa'];
        // return taskCollection.pluck(field);
      }
    });

    return DoingView;
  });