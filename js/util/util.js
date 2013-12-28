define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/util/message.html',
], function ($, _, Backbone, messageTemplate) {
	return {
		test: true,

		/**
		* @param {String} name
		* @param {String} value
		* @param {Number} days
		*/
		setCookie: function (name, val, days) {
			var expiration = 1000 * 60 * 60 * 24 * days;
		  document.cookie = name + '=' + val + '; expires=' + new Date(Date.now() + expiration).toGMTString();
		},

		/**
		* @param {String} name
		* @return {Object} Attempts to convert value from string.
		*/
		getCookie: function (name) {
			var c = document.cookie,
				regex = /^([^=]+)\=(.*)$/,
				val;

			$.each(c.split('; '), function (index, value) {
				var pair = regex.exec(value);
				if (pair.length && pair[1] === name) {
					val = pair[2];
					return false;
				}
			});

			if (val) {
				try {
					val = JSON.parse(val);
				} catch (e) {}
			}

			return val;
		},

		/**
		* Save to localStorage.
		* @param {String} name
		* @param {String} value
		*/		
		set: function (name, value) {
			if (value !== undefined && value !== null) {
				localStorage.setItem(name, value);
			} else {
				localStorage.removeItem(name);
			}
		},

		/**
		* Save to localStorage.
		* @param {String} name
		* @return {Object} Attempts to convert value.
		*/		
		get: function (name) {
			var val = localStorage.getItem(name);
			if (val) {
				try {
					val = JSON.parse(val);
				} catch (e) {}
			}
			return val;
		},

		/**
		* @param {String} text
		* @param {String} title
		*/
		dialog: function (text, title) {
			$('<div>', {
				html: text
			}).dialog({
				title: title,
				modal: true,
				dialogClass: 'dialog',
				buttons: [
					{
						text: 'Ok',
						click: function () {
							$(this).dialog('close');
						}
					}
				],
				close: function () {
					$(this).dialog('destroy').remove();
				}
			});
		},

		/**
		* Show a message to the user.
		* @param {String} text
		* @param {String} [title]
		*/
		message: function (text, title) {

			// TODO Change this to use a proper view
			var msg = $('<div />', {
				id: 'message',
				class: 'message',
				html: _.template(messageTemplate, {
					title: title || 'Message for you, sir...',
					message: text
				})
			});

			msg.appendTo('body');
			setTimeout(function () {
				msg.slideUp('slow', function () {
					msg.remove();
				});
			}, 3000);
		}
	};
});
