define([
  'underscore',
  'backbone'
],
  function (
  	_,
  	Backbone
  ) {
  
    var HintModel = Backbone.Model.extend({
    	urlRoot: 'lib/resteasy/api/hints',
    	initialize: function () {}
    });

    return HintModel;
});