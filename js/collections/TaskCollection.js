define([
  'jquery',
  'underscore',
  'backbone',
  'models/TaskModel'
], 
function(
  $, 
  _, 
  Backbone, 
  TaskModel
){
  var TaskCollection = Backbone.Collection.extend({
    model: TaskModel,
    initialize: function(){}
  });
 
  return TaskCollection;
});