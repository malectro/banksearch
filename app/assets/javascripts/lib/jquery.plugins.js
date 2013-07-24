(function ($) {
  $.fn.serializeObject = function () {
    var ob = {};
    _.each(this.serializeArray(), function (field) {
      ob[field.name] = field.value;

      //kindof a hack. not sure if i should keep this.
      if (field.value === '0') {
        ob[field.name] = parseInt(field.value, 10);
      }
    });
    return ob;
  };

  $.fn.scrollTo = function ($el) {
    this.each(function () {
      var offset = $el.offset();
      this.scrollTo(offset.left, offset.top - 10);
    });
  };
}(jQuery))

