(function (Mel) {
  var BankCompany = Mel.Model.BankCompany = Backbone.Model.extend({
    type: 'BankCompany',

    idAttribute: '_id',

    defaults: function () {
      return {
        name: 'New Bank Company',
        info: 'Here is some info'
      };
    },

    initialize: function () {

    }
  });

  var BankCompanyList = Mel.Collection.BankCompany = Backbone.Collection.extend({

    model: BankCompany,

    url: '/admin/bank_companies',

    comparator: function (comp) {
      return comp.get('name');
    },

    search: function (query) {
      query = query.toLowerCase();
      return this.filter(function (bank) {
        return bank.get('name').toLowerCase().match(query);
      });
    }
  });

  // should probably separete out the mvc into different files
  var BankCompanyView = Mel.View.BankCompany = Backbone.View.extend({

    tagName: 'div',

    template: null,

    events: {
      'click .edit': 'edit',
      'click .delete': 'destroy'
    },

    initialize: function () {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
      this.$el.html(Mel.tmpl('bank_company', this.model.attributes));
      return this;
    },

    destroy: function () {
      var yep = confirm('Are you sure? Will it dream?');
      var self = this;
      if (yep) {
        this.model.destroy();
        this.$el.fadeOut(function () {
          self.remove();
        });
      }
    },

    edit: function () {
      this.trigger('edit', this.model);
    }
  });

  var BankCompanyFullView = Mel.View.BankCompanyFull = Backbone.View.extend({

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

      this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
      this.$el.hide().html(Mel.tmpl('bank_company_form', this.model.attributes)).show();
      return this;
    },

    save: function (e) {
      var data = this.$('form').serializeObject();

      e.preventDefault();

      this.model.save(data);
      this.close();
    },

    close: function () {
      var self = this;
      this.$el.animate({top: '+1000', opacity: 0}, 200, function () {
        self.remove();
      });
    },

    block: function (e) {
      e.stopPropagation();
    },
  });

}(Mel));

