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

    markers: [],

    initialize: function () {
      this.$mapFrame = $('.g-map-frame');

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

      var $win = $(window),
          width = $win.width(),
          height = $win.height(),
          ratioLat = (bounds.ne.lat - bounds.sw.lat) / this.$mapFrame.height(),
          ratioLng = (bounds.ne.lng - bounds.sw.lng) / this.$mapFrame.width(),
          pos = this.$mapFrame.position(),
          ne, sw;

      //hack
      pos.left += 20;

      bounds.ne.lng += (width - this.$mapFrame.width() - pos.left) * ratioLng;
      bounds.sw.lng -= pos.left * ratioLng;
      bounds.ne.lat += pos.top * ratioLat;
      bounds.sw.lat -= (height - this.$mapFrame.height() - pos.top) * ratioLat;

      ne = new Gmaps.LatLng(bounds.ne.lat, bounds.ne.lng);
      sw = new Gmaps.LatLng(bounds.sw.lat, bounds.sw.lng);

      this.gmap.fitBounds(new Gmaps.LatLngBounds(sw, ne));
    },

    updateBounds: function () {
      this.setBounds(BS.App.filteredBanks.geoBounds());
      this.updateMarkers();
    },

    updateMarkers: function () {
      var self = this;

      _.each(this.markers, function (marker) {
        marker.setMap(null);
      });

      this.markers = [];

      BS.App.filteredBanks.each(function (bank) {
        var geo = bank.get('geo'),
            marker = new Gmaps.Marker({
              map: self.gmap,
              position: new Gmaps.LatLng(geo.lat, geo.lng)
            });

        self.markers.push(marker);
      });
    }
  });

}());

