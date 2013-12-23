define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/account/accountSignupTemplate.html',
  'models/account/UserModel'
],
  function (
    $,
    _,
    Backbone,
    template,
    UserModel
  ) {

    var AccountSignupView = Backbone.View.extend({
      initialize: function () {
        var me = this;

        this.$el.empty().off();

        this.$el.on('keyup', '#email, #password', function (event) {
          var $this = $(this);
          if ($this.val()) {
            me.validateField($this);
          }
        });

        this.$el.on('submit', 'form', function (event) {

          event.stopPropagation();
          event.preventDefault();
          me.submitForm($(this));
        });

        this.render();
      },

      render: function () {
        this.$el.html(this.template());
        $('#email').focus();
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
          errorMessage = this.validatePassword(value);
        }

        this.showFieldError(field, errorMessage);

        return !errorMessage;
      },

      /**
      * @param {String} value
      * @return {String} error message
      */
      validateEmail: function (value) {

        if (!value) {
          return 'What the hell?';
        } else if (!/^[a-z]+@[a-z0-9]+\.[\w\.]+$/i.test(value)){
          return 'That doesn\'t appear to be real email.';
        }
      },

      /**
      * @param {String} value
      * @return {String} error message
      */
      validatePassword: function (value) {
        if (!value) {
          return 'That is not a very secure password.';
        }
      },

      /**
      * Show an error for a field.
      * @param {$} field
      * @param {String} [error] If undefined, clear error indicators.
      */
      showFieldError: function (field, error) {
        var $controlGroup = field.closest('.control-group'),
          $errorContainer = $controlGroup && $controlGroup.find('.help-inline');

        if ($controlGroup) {

          if (error) {
            $controlGroup.addClass('error');
          } else {
            $controlGroup.removeClass('error');
          }

          if ($errorContainer) {
            $errorContainer.html(error || '');
          }
        }
      },

      /**
      * Submits the form if it is valid.
      * @param {$} form
      */
      submitForm: function (form) {
        if (this.validateForm(form)) {
          var model = new UserModel({
            email: $('#email').val(),
            password: $('#password').val()
          });

          model.save({
            success: function () {
              console.log('do something now that we are saved');
            },
            error: function () {
              console.error('whoops');
            }
          });
        }
      },

      /**
      * Validate the form.
      * @param {$} form
      * @return {Boolean} is valid
      */
      validateForm: function (form) {
        var me = this,
          invalid = false,
          fields = ['email', 'password'],
          error;

        $.each(fields, function (index, fieldName) {
          
          var $field = $('#' + fieldName),
            value = $field.val();

          if ($field.is('#email')) {
            error = me.validateEmail(value);
          } else {
            error = me.validatePassword(value);
          }

          if (error) {
            me.showFieldError($field, error);
            invalid = true;
          }
        });


        return !invalid;
      }
    });

    return AccountSignupView;
  });