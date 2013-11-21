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
    TodoCollection,
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

        this.$el.on('change', 'input[type="checkbox"]', function (event) {
          me.model.set({
            isComplete: $(this).prop('checked')
          });
        });

        this.model.on('change', function (model, options) {
          model.save();
          me.render();
        });
      },

      render: function () {
        var templateData = this.model.getTemplateData(),
          compiledTemplate;

        compiledTemplate = _.template(todoTaskTemplate, {
          data: templateData
        });

        // render the items in the collection
        this.$el.html(compiledTemplate);

        // add event listeners



        // $('.menu li').removeClass('active');
        // $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');

      }
    });

    return TodoTaskView;
  });