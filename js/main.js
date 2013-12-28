require.config({
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    // backbone: 'libs/backbone/backbone',
    templates: '../templates',
    util: 'util/util'
  },
  urlArgs: (window.location.search.match('bust')) ? ('bust=' + Date.now()) : undefined
});

require(['app', 'util'], function (App, util) {
  $(document).ajaxError(function (event, jqXhr, ajaxSettings, thrownError) {
    console.error('ajax error', event, jqXhr, ajaxSettings, thrownError);
    util.message(thrownError, 'AJAX error');
  });
  App.initialize();
});