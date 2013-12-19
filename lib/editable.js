(function ($) {
  $.fn.editable = function (args) {

    var me = this;

    args = $.extend({
      onBeforeEdit: notImplemented,
      getEditValue: notImplemented,
      getEditField: getEditFied,
      onBeforeBlur: notImplemented,
      getNewValue: notImplemented,
      getError: notImplemented,
      // Called when the edit is finished (whether it changed or not). Passed the last key as a Number.
      onFinish: notImplemented,
      errorStyle: {
        position: 'absolute',
        left: 0,
        top: 20,
        color: '#f00',
        backgroundColor: 'inherit'
      },
      onChanged: notImplemented
    }, args);

    var lastKey = null;

    var onClickHandler = function (event) {
      var el = $(this),
        editField,
        editValue;

      lastKey = null;

      // only apply to elements without children
      if (el.children().size() === 0 && args.onBeforeEdit.apply(el) !== false) {
        editValue = args.getEditValue.apply(el) || el.html();
        editField = getContainer.call(el, editValue);
        el.after(editField).hide();
        editField.find('input').select();
      }

      event.stopPropagation();
    };

    var onBlurHandler = function (event) {
      var el = $(this),
        val = el.val(),
        newValue,
        oldValue,
        error = args.getError.call(el, val),
        editableField;

      // if (args.onBeforeBlur.call(el, val) === false) {
      if (error) {
        el.next('.error').html(error);
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        el.focus().select();
      } else {

        editableField = el.parent().prev('.editable');
        newValue = args.getNewValue.call(editableField, val) || val;
        oldValue = editableField.html();
        editableField.html(newValue).show();
        args.onFinish.call(editableField, lastKey);
        el.off('blur', onBlurHandler).off('blur', onKeyDownHandler).parent().remove();
        if (oldValue !== newValue) {
          args.onChanged.call(editableField, newValue, oldValue);
        }
      }

    };

    var onKeyDownHandler = function (event) {
      lastKey = event.which;
      if (event.which === 27) {
        // esc
        $(this).val($(this).parent().prev('.editable').html()).trigger('blur');
      }
    };

    function getEditFied(value) {
      return $('<input />', {
        value: value,
        placeholder: value
      });
    }

    function getContainer(value) {
      var container,
        input,
        error;

      container = $('<span />', {
        'class': 'editContainer'
      }).css({
        position: 'relative'
      });

      input = args.getEditField.call(this, value);
      input.on('blur', onBlurHandler).on('keydown', onKeyDownHandler);

      error = $('<span />', {
        'class': 'error'
      }).css(args.errorStyle);

      container.append(input);
      container.append(error);

      return container;
    }

    function notImplemented() {}

    this.on('click', '.editable', onClickHandler);

    return this;
  };
}(jQuery));