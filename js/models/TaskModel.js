define([
  'underscore',
  'backbone'
], function(
	_,
	Backbone
) {
  
  var TaskModel = Backbone.Model.extend({
  	urlRoot: 'lib/resteasy/api/tasks',

  	defaults: function () {
  		return {
  			category: 'category',
  			description: 'description',
  			start: Date.now(),
  			end: undefined,
  			duration: 0,
  			parentTaskId: undefined
  		};
  	},

  	initialize: function () {
  		// DEBUG
  		window.task = this;

      this.on('change', function (model, changeInfo) {
        var end = this.get('end');

        if (changeInfo.start || changeInfo.end) {
          if (end) {
            this.set('duration', end - this.get('start'));
          }
        }
      });
  	},

  	// @return {String}
  	getDateTimeString: function (num) {
  		var d,
  			h,
  			m;

  		if (num) {
	  		d = new Date(num);
			h = d.getHours();
			m = d.getMinutes();
	  		return this.pad(h) + ':' + this.pad(m);
  		}
  	},

  	pad: function (num) {
  		num = String(num);
  		while (num.length < 2) {
  			num = '0' + num;
  		}
  		return num;
  	},

  	// @return {Number}
  	getDateFromTimeString: function (timeString) {
  		var d = new Date(),
  			timeParts = timeString.split(':');

  		timeParts[0] = parseInt(timeParts[0], 10);
  		timeParts[1] = parseInt(timeParts[1], 10);
  		d.setHours(timeParts[0]);
  		d.setMinutes(timeParts[1]);
  		return d.getTime();
  	},

  	// @return {Object}
  	getTemplateData: function () {
  		var data = this.toJSON();

  		data.duration = data.end && this.getTimeDiff(data.start, data.end);
  		data.start = this.getDateTimeString(data.start);
  		data.end = this.getDateTimeString(data.end);
  		data.parentCount = this.getParentCount();
  		return data;
  	},

    getParentCount: function () {
      var count = 0,
        task = this,
        parentTaskId;

      do {
        parentTaskId = task.get('parentTaskId');
        if (parentTaskId) {
          count++;
          task = this.collection.get(parentTaskId);
        }
      } while (parentTaskId && task);

      return count;
    },

  	// @return {String}
  	getTimeDiff: function (timeInt1, timeInt2) {
  		var diff = Math.abs(timeInt1 - timeInt2),
  			s = diff / 1000,
  			h = Math.floor(s / (60 * 60)),
  			m;

  		s = s % (60 * 60);
  		m = Math.floor(s / 60);
  		s = Math.round(s % 60);

  		return this.pad(h) + ':' + this.pad(m) + ':' + this.pad(s);
  	}
  });

  return TaskModel;

});
