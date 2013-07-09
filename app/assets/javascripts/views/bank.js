(function () {
  var BankView = BS.View.Bank = Backbone.View.extend({

    bank: new BS.Model.Bank,

    initialize: function (options) {
      this.bank = options.bank || this.bank;
    },

    render: function () {
      this.$el.hide().html(BS.tmpl('bank_info', this.bank.fattributes()));
      return this;
    },

    show: function () {
      this.$el.slideDown(200);
    },

    hideAndRemove: function () {
      this.$el.slideUp(200, function() {
        this.remove();
      });
    }
  });

}());

