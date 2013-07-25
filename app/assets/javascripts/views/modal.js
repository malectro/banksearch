(function () {
  BS.View.Modal = Backbone.View.extend({
    tagName: 'div',

    events: {
      'click button': 'chooseLanguage'
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
    },

    chooseLanguage: function (e) {
      // we should switch the template copy here, but we haven't translated the site yet
      this.hide();
    }
  });
}());

