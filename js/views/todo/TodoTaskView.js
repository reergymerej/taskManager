// This is the view for a single TodoTask.

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/todo/todoTaskTemplate.html',
  'models/todo/TodoTaskModel'
],
  function (
    $,
    _,
    Backbone,
    todoTaskTemplate,
    TodoList,
    TodoTaskModel
  ) {

    var TodoTaskView = Backbone.View.extend({

      initialize: function () {
        var me = this;

        // TODO This should probably be moved to a higher view to
        // prevent so many listeners being added.
        this.$el.editable({
          getError: function (value) {
            var error;
            if (value === '') {
              error = 'This is required.';
            }
            return error;
          },
          onChanged: function (value, oldValue) {
            me.model.set({
              label: value
            });
          }
        });

        this.$el.on('click', 'button.destroy', function (event) {
          me.model.destroy();
        });

        this.$el.on('click', 'button.upstream', function (event) {
          me.model.collection.create({
            downstreamTaskId: me.model.get('id'),
            todoCollectionId: me.model.get('todoCollectionId')
          });
        });

        // Create a new model in place of this one.  Add this model
        // as an upstream model.
        this.$el.on('click', 'button.downstream', function (event) {

          require(['models/todo/TodoTaskModel'], function (TodoTaskModel) {
            var newModel = new TodoTaskModel();

            newModel.save(
              {
                downstreamTaskId: me.model.get('downstreamTaskId'),
                todoCollectionId: me.model.get('todoCollectionId')
              },
              {
                success: function (model) {
                  me.model.set({
                    downstreamTaskId: model.get('id')
                  });

                  me.model.collection.add(model);
                }
              }
            );
          });
        });

        this.$el.on('change', 'input[type="checkbox"]', function (event) {
          me.model.set({
            isComplete: $(this).prop('checked')
          });

          me.renderRelatedTasks();
        });

        this.model.on('change', function (model, options) {
          model.save();
          me.render();
        });

        this.model.on('request:rerender', function (model) {
          me.render();
        });
      },

      render: function () {
        var templateData = this.model.getTemplateData(),
          compiledTemplate;

        compiledTemplate = _.template(todoTaskTemplate, {
          data: templateData
        });

        this.$el.html(compiledTemplate);
      },

      renderRelatedTasks: function () {
        // me.model.collection.getUpstreamTasks(me.model)
        var taskModels = this.model.collection.getRelatedTasks(this.model);
        _.each(taskModels, function (taskModel) {
          taskModel.trigger('request:rerender', taskModel);
        });
      }
    });

    return TodoTaskView;
  });