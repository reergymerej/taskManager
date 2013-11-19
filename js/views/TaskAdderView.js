define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/taskAdderTemplate.html',
  'views/TaskView',
  'models/TaskModel',
  'collections/TaskCollection'
],
  function (
    $,
    _,
    Backbone,
    taskAdderTemplate,
    TaskView,
    TaskModel,
    TaskCollection
  ) {

    var taskCollection = new TaskCollection();
    window.taskCollection = taskCollection;

    var TaskAdderView = Backbone.View.extend({
      el: $("#page"),

      initialize: function () {
        var me = this;

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

        this.$el.on('click', '.newChild', function () {
          var parentTaskEl = $(this).closest('.task'),
            parentId = me.getTaskIdFromElement(this),
            el = $('<div>');

          parentTaskEl.parent().after(el);
          me.newTask({ parentTaskId: parentId }, el);
        });

        this.$el.on('click', '.toolIcon', function () {
          var el = $(this);
          el.next('.tools').toggle();
        });
      },

      render: function () {
        var compiledTemplate = _.template(taskAdderTemplate, {});
        $('.menu li').removeClass('active');
        $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');
        this.$el.html(compiledTemplate);
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
        var model = new TaskModel(modelData),
          view,
          parentTaskEl;
        model.save();

        taskCollection.add(model);

        if (!viewEl) {
          viewEl = $('<div>');
          if (modelData && modelData.parentTaskId) {
            parentTaskEl = this.getTaskElById(modelData.parentTaskId);
            parentTaskEl.after(viewEl);
          } else {
            // viewEl.appendTo('#taskHolder');
            viewEl.prependTo('#taskHolder');
          }
        }

        view = new TaskView({
          el: viewEl,
          model: model
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

    return TaskAdderView;
  });