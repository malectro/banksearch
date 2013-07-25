(function () {
  BS.View.Modal = Backbone.View.extend({
    tagName: 'div',

    events: {
      'click .bg': 'hide'
    },

    initialize: function () {

    },

    render: function () {
      this.$el.hide().addClass('modal')
        .html(BS.tmpl('intro')).append('<div class="bg"/>')
        .appendTo(document.body).fadeIn(200);

      return this;
    },

    hide: function () {
      var self = this;

      this.$el.fadeOut(200, function () {
        self.destroy();
      });
    }
  });
}());

