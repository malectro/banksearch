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

    url: '/admin/banks',

    comparator: function (bank) {
      return bank.get('name');
    },

    search: function (query) {
      query = query.toLowerCase();
      return this.filter(function (bank) {
        return bank.get('name').toLowerCase().match(query) || bank.get('address').toLowerCase().match(query);
      });
    }
  });

  // should probably separete out the mvc into different files
  var BankView = Mel.View.Bank = Backbone.View.extend({

    tagName: 'div',

    template: null,

    events: {
      'click .edit': 'edit',
      'click .delete': 'destroy'
    },

    initialize: function () {

    },

    render: function () {
      this.$el.html(Mel.tmpl('bank', this.model.attributes));
      return this;
    },

    destroy: function () {
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

    events: {
      'submit form': 'save',
      'click': 'block'
    },

    template: null,

    initialize: function () {
      var self = this;
      _.defer(function () {
        self.listenTo(Mel.App, 'anyClick', self.close);
      });
    },

    render: function () {
      this.$el.hide().html(Mel.tmpl('bank_form', this.model.attributes));
      return this;
    },

    save: function (e) {
      e.preventDefault();
      this.model.save(this.$('form').serializeObject());
      this.close();
    },

    close: function () {
      var self = this;
      this.$el.animate({top: '+1000'}, 200, function () {
        self.remove();
      });
    },

    block: function (e) {
      e.stopPropagation();
    }

  });

}(Mel));

