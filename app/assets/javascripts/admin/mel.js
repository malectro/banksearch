(function (window) {
  var Mel = window.Mel = {
    Model: {}, View: {}, Collection: {}
  };

  Mel.tmpl = function (name, context) {
    return JST['admin/templates/' + name](context);
  };

  $(function () {
    var MelView = Mel.View.Mel = Backbone.View.extend({

      el: $('main'),

      events: {
        'click button': 'create'
      },

      initialize: function () {
        this.setSource('Bank');
      },

      render: function () {

      },

      setSource: function (model) {
        this.dataList = new Mel.Collection[model];
        this.dataRowView = Mel.View[model];

        this.listenTo(this.dataList, 'add', this.addOne);
        this.listenTo(this.dataList, 'reset', this.addAll);
        this.listenTo(this.dataList, 'all', this.render);

        this.dataList.fetch();
      },

      addOne: function (ob) {
        var view = new this.dataRowView({model: ob});
        this.$('data').append(view.render().el);
      },

      addAll: function () {
        this.dataList.each(this.addOne, this);
      },

      create: function () {
        console.log('hi');
        this.dataList.create();
      }
    });

    Backbone.history.start({pushState: true, root: '/admin/'});
    Mel.App = new Mel.View.Mel;
  });

}(window));

