define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/account/loginTemplate.html',
  'util'
],
  function (
    $,
    _,
    Backbone,
    template,
    util
  ) {

    var LoginView = Backbone.View.extend({
      initialize: function () {
        var me = this;

        this.$el.empty().off();

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
          return 'Nope.';
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
          return 'I don\'t think that\'s really your password.';
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
        var me = this;

        if (this.validateForm(form)) {

          $.ajax({
            method: 'POST',
            url: 'php/authenticate.php',
            data: {
              email: $('#email').val(),
              password: $('#password').val()
            },
            dataType: 'json',
            success: function (response) {
              util.setCookie('token', response.token, response.days);
              util.setCookie('uid', response.uid, response.days);
            },
            error: function () {
              console.log('boo', arguments);
            },
            complete: function () {
              console.log('complete', arguments);
            }
          });
          console.log(email, password);
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

          me.showFieldError($field, error);
          if (error) {
            invalid = true;
          }
        });


        return !invalid;
      },

      /**
      * @param {String} name
      * @param {String} value
      * @param {Number} expiration ms from now
      */
      setCookie: function (name, val, expiration) {
        document.cookie = name + '=' + val + '; expires=' + new Date(Date.now() + expiration).toGMTString();
      }
    });

    return LoginView;
  });