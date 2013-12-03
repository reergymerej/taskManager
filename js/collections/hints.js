define([
  'jquery',
  'underscore',
  'backbone',
  'models/HintModel'
], 
function(
  $, 
  _, 
  Backbone,
  HintModel
){
  var HintCollection = Backbone.Collection.extend({
    url: 'lib/resteasy/api/hints',
    model: HintModel,
    initialize: function () {
      this.fetch({
        success: function (collection, response, options) {
        }
      });
    },

    /**
    * @param {String}
    * @return {String[]}
    */
    getHints: function (val) {
      var hints = [],
        regex = new RegExp(val, 'i');

      this.each(function (hint) {
        hint = hint.get('text');
        if (regex.test(hint)) {
          hints.push(hint);
        }
      });

      return hints;
    },

    /**
    * @param {String/String[]}
    */
    addHints: function (val) {

      console.log('add', val);
      var me = this;

      if (typeof val === 'string') {
        val = [val];
      }

      _.each(val, function (hint) {
        var exists;

        if (hint) {
          exists = me.some(function (val) {
            return val.get('text') === hint;
          });
          if (!exists) {
            me.add({ text: hint });
          }
        }
      });
    }
  });

  var hints = new HintCollection();
 
  return hints;
});