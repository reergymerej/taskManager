define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/account/accountSignupTemplate.html'
],
  function (
    $,
    _,
    Backbone,
    template
  ) {

    var AccountSignupView = Backbone.View.extend({
      initialize: function () {
        var me = this;

        this.$el.empty().off();

        this.$el.on('keyup', '#email, #password', function (event) {
          me.validateField($(this));
        });

        this.render();
      },

      render: function () {
        this.$el.html(this.template());
      },

      /**
      * @return {String}
      */
      template: function () {
        var compiledTemplate = '',
          data = {};

        try {
          compiledTemplate = _.template(template, data);
        } catch (e) {
          compiledTemplate = String(e);
        }

        return compiledTemplate;
      },

      /**
      * Adds error if field is invalid.
      * @param {$} field
      * @return {Boolean}
      */
      validateField: function (field) {
        var errorMessage,
          value = field.val();

        if (field.is('#email')) {
          errorMessage = this.validateEmail(value);
        } else {
          console.log('validate pw');
        }

        if (!errorMessage) {
          this.showFieldError(field, errorMessage);
        }

        // Disable the submit button.


        return !errorMessage;
      },

      /**
      * @param {String} value
      * @return {String} error message
      */
      validateEmail: function (value) {
        console.log('validate', value);
        if (!value) {
          return 'What the hell?';
        }
      },

      /**
      * Show an error for a field.
      * @param {$} field
      * @param {String} error
      */
      showFieldError: function (field, error) {
        // console.log('showFieldError', field, error);
      },

      validateForm: function () {
        // this.validateEmail()
      }
    });

    return AccountSignupView;
  });