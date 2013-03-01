(function (Mel) {
  var Bank = Mel.Model.Bank = Backbone.Model.extend({
    type: 'Bank',

    idAttribute: '_id',

    defaults: function () {
      return {
        name: 'New Bank',
        address: ''
      };
    },

    initialize: function () {

    },

    geocode: function (callback) {
      if (typeof google === 'undefined') {
        alert('You\'ll need internet access to geocode banks.');
        return false;
      }

      var self = this,
          geocoder = new google.maps.Geocoder;

      geocoder.geocode({
        address: this.get('address') + ', ' + this.get('zip')
      }, function (results, status) {
        if (status === 'OK') {
          self.set('geo', {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          });
          self.save();
        }

        callback();
      });

      return true;
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
      this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
      this.$el.html(Mel.tmpl('bank', this.model.attributes));
      return this;
    },

    destroy: function () {
      var yep = confirm('Are you sure? Such is this ephemeral life.');
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

  var BankFullView = Mel.View.BankFull = Backbone.View.extend({

    tagName: 'panel',

    events: {
      'submit form': 'save',
      'click .bank-geocode': 'geocode',
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
      this.$el.hide().html(Mel.tmpl('bank_form', this.model.attributes)).show();
      return this;
    },

    save: function (e) {
      var data = this.$('form').serializeObject();

      e.preventDefault();

      // fix geodata attributes
      // probably should abstract this
      if (data['geo:lat']) {
        data['geo'] = {
          lat: data['geo:lat'],
          lng: data['geo:lng']
        }
        delete data['geo:lat'];
        delete data['geo:lng'];
      }

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

    geocode: function (e) {
      var $button = this.$('.bank-geocode'),
          good;

      good = this.model.geocode(function () {
        $button.attr('disabled', false).text('Geocode');
      });

      if (good) {
        $button.attr('disabled', true).text('Geocoding...');
      }

      e.preventDefault();
      e.stopPropagation();
      return false;
    }

  });

}(Mel));

