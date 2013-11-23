define([
  'jquery',
  'underscore',
  'backbone',
  'models/doing/TaskModel'
], 
function(
  $, 
  _, 
  Backbone, 
  TaskModel
){
  var TaskCollection = Backbone.Collection.extend({
    url: 'lib/resteasy/api/tasks',
    model: TaskModel,
    initialize: function(){}
  });
 
  return TaskCollection;
});