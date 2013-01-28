(function (Mel) {
  var Bank = Mel.Model.Bank = Backbone.Model.extend({
    type: 'Bank',
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

    events: {
      'click .edit': 'edit',
      'click .delete': 'remove'
    },

    initialize: function () {

    },

    render: function () {
      this.$el.html(Mel.tmpl('bank', this.model.attributes));
      return this;
    },

    remove: function () {
      var yep = confirm('Are you sure? Such is this ephemeral life.');
      if (yep) {
        this.model.destroy();
      }
    },

    edit: function () {
      this.trigger('edit', this.model);
    }
  });

  var BankFullView = Mel.View.BankFull = Backbone.View.extend({

    tagName: 'panel',

    template: null,

    events: {
    },

    initialize: function () {

    },

    render: function () {
      this.$el.html(Mel.tmpl('bank_form', this.model.attributes));
      return this;
    },


  });

}(Mel));

