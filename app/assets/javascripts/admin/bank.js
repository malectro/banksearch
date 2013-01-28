(function (Mel) {
  var Bank = Mel.Model.Bank = Backbone.Model.extend({
    defaults: function () {
      return {
        name: 'New Bank',
        address: ''
      };
    },

    initialize: function () {

    }
  });

  var BankList = Mel.Collection.Bank = Backbone.Collection.extend({

    model: Bank,

    url: '/admin/banks'

  });

  // should probably separete out the mvc into different files
  var BankView = Mel.View.Bank = Backbone.View.extend({

    tagName: 'div',

    template: null,

    initialize: function () {

    },

    render: function () {
      this.$el.html(Mel.tmpl('bank', this.model.attributes));
      return this;
    }
  });


}(Mel));

