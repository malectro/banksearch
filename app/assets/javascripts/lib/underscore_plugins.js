(function () {
  var root = this;

  var _ = root._;

  _.findIndex = function (array, iterator) {
    for (var i = 0, l = array.length; i < l; i++) {
      if (iterator(array[i])) {
        return i;
      }
    }

    return -1;
  };

}.call(this));

