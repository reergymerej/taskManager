define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
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
		* @return {String}
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
		}
	};
});
