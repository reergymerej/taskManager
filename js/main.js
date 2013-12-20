require.config({
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    // backbone: 'libs/backbone/backbone',
    templates: '../templates'
  },
  urlArgs: (window.location.search.match('bust')) ? ('bust=' + Date.now()) : undefined
});

require(['app'], function (App) {
  App.initialize();
});