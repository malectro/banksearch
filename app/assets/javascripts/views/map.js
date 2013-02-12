(function () {
  var Gmaps;
  if (typeof google === 'undefined') {
    Gmaps = null;
  }
  else {
    Gmaps = google.maps;
  }

  var Map = BS.View.Map = Backbone.View.extend({

    geoStart: {
      lat: 40.68661,
      lng: -73.96506509999999
    },

    initialize: function () {
      if (Gmaps) {
        this.gmap = new Gmaps.Map(this.$('div')[0], {
          center: new Gmaps.LatLng(this.geoStart.lat, this.geoStart.lng),
          zoom: 11,
          mapTypeId: Gmaps.MapTypeId.ROADMAP
        });

        this.geoPosition();
      }

      this.listenTo(this.options.app, 'filtered', _.debounce(this.updateBounds, 1000));
    },

    geoPosition: function () {
      if (!Gmaps) {
        return;
      }

      var self = this;

      if (navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition) {
        navigator.geolocation.getCurrentPosition(function (pos) {
          self.gmap.setCenter(new Gmaps.LatLng(pos.coords.latitude, pos.coords.longitude));
        });
      }
    },

    setBounds: function (bounds) {
      if (!Gmaps) {
        return;
      }

      var ne = new Gmaps.LatLng(bounds.ne.lat, bounds.ne.lng),
          sw = new Gmaps.LatLng(bounds.sw.lat, bounds.sw.lng);

      this.gmap.fitBounds(new Gmaps.LatLngBounds(sw, ne));
    },

    updateBounds: function () {
      this.setBounds(BS.App.filteredBanks.geoBounds());
    }
  });

}());

