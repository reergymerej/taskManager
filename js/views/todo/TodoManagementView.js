// This is the view for managing Todo Lists.
// It manages several child views.

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/todo/todoManagement.html',
  'collections/todo/TodoListCollection'
],
  function (
    $,
    _,
    Backbone,
    todoManagement,
    TodoListCollection
  ) {

    var collection = new TodoListCollection(),
      activeList;

    var TodoManagementView = Backbone.View.extend({
      el: $("#page"),

      initialize: function () {
        var me = this;

        collection = new TodoListCollection();
        collection.fetch({
          success: function () {
            me.render();
          }
        });

        $('.menu li').removeClass('active');
        $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');

        this.$el.empty().off();

        // Triggered when a list in #todo-lists is clicked.
        this.$el.on('click', '.list', function (event) {
          var $this = $(this),
            listId = me.getIdFromListEl($this);
          me.setActiveList(collection.get(listId));
        });

        // form delete button
        this.$el.on('click', '#form-delete', function (event) {
          console.log('delete');
          me.stop(event);
        });

        // form cancel button
        this.$el.on('click', '#form-cancel', function (event) {
          console.log('cancel');
          me.stop(event);
        });

        // Submit form to modify a list.
        this.$el.on('submit', '#info-form', function (event) {
          var $this = $(this);

          if (me.validateForm($this)) {

            // update model
            activeList.save(
              {
                name: $('#name').val(),
                archived: $('#archive').prop('checked')
              },
              {
                success: function (list) {
                  me.render();
                },
                error: function (list, xhr, options) {
                  console.error('Why does this think it didn\'t save?');
                  // console.log(list, xhr, options);
                  me.render();
                }
              }
            );
          }
          me.stop(event);
        });
      },

      render: function () {
        var me = this,
          templateData = {},
          compiledTemplate;

        templateData = {
          lists: collection.toJSON(),
          activeList: activeList && activeList.toJSON()
        };
        compiledTemplate = _.template(todoManagement, templateData);

        this.$el.html(compiledTemplate);
      },

      /**
      * Convenience method to stop $ events.
      * @param {$ event} event
      * @private
      */
      stop: function (event) {
        event.preventDefault();
        event.stopPropagation();
      },

      /**
      * Validate the form.  Adds error indicators.
      * @param {$} $form
      * @return {Boolean}
      */
      validateForm: function ($form) {
        // TODO add error indicators
        return $form.find('#name').val();
      },

      /**
      * Set the active list in #todo-lists.
      * @param {TodoListModel} list
      */
      setActiveList: function (list) {
        activeList = list;
        this.render();
      },
      
      /**
      * Get the model id from a list element (in #todo-lists).
      * @param {$} listEl
      * @return {Number}
      * @private
      */
      getIdFromListEl: function (listEl) {
        var idPrefix = 'list-',
          id = listEl.attr('id').replace(idPrefix, '');
        return parseInt(id, 10);
      }
    });

    return TodoManagementView;
  });