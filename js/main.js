"use strict";

(function (listener) {
  "use strict";

  var body = document.querySelector('body'),
      isMobile = false,
      scrollTopPosition,
      browserYou,
      _winWidth = $(window).outerWidth();

  var genFunc = {
    initialized: false,
    initialize: function initialize() {
      if (this.initialized) return;
      this.initialized = true;
      this.build();
    },
    build: function build() {
      // browser
      browserYou = this.getBrowser();

      if (browserYou.platform == 'mobile') {
        isMobile = true;
        document.documentElement.classList.add('mobile');
      } else {
        document.documentElement.classList.add('desktop');
      }

      if (browserYou.browser == 'ie') {
        document.documentElement.classList.add('ie');
      }

      if (navigator.userAgent.indexOf("Edge") > -1) {
        document.documentElement.classList.add('edge');
      }

      if (navigator.userAgent.search(/Macintosh/) > -1) {
        document.documentElement.classList.add('macintosh');
      }

      if (browserYou.browser == 'ie' && browserYou.versionShort < 9 || (browserYou.browser == 'opera' || browserYou.browser == 'operaWebkit') && browserYou.versionShort < 18 || browserYou.browser == 'firefox' && browserYou.versionShort < 30) {
        alert('Обновите браузер');
      }

      if (document.querySelector('.yearN') !== null) {
        this.copyright();
      }
    },
    copyright: function copyright() {
      var yearBlock = document.querySelector('.yearN'),
          yearNow = new Date().getFullYear().toString();

      if (yearNow.length) {
        yearBlock.innerText = yearNow;
      }
    },
    getBrowser: function getBrowser() {
      var ua = navigator.userAgent;

      var bName = function () {
        if (ua.search(/Edge/) > -1) return "edge";
        if (ua.search(/MSIE/) > -1) return "ie";
        if (ua.search(/Trident/) > -1) return "ie11";
        if (ua.search(/Firefox/) > -1) return "firefox";
        if (ua.search(/Opera/) > -1) return "opera";
        if (ua.search(/OPR/) > -1) return "operaWebkit";
        if (ua.search(/YaBrowser/) > -1) return "yabrowser";
        if (ua.search(/Chrome/) > -1) return "chrome";
        if (ua.search(/Safari/) > -1) return "safari";
        if (ua.search(/maxHhon/) > -1) return "maxHhon";
      }();

      var version;

      switch (bName) {
        case "edge":
          version = ua.split("Edge")[1].split("/")[1];
          break;

        case "ie":
          version = ua.split("MSIE ")[1].split(";")[0];
          break;

        case "ie11":
          bName = "ie";
          version = ua.split("; rv:")[1].split(")")[0];
          break;

        case "firefox":
          version = ua.split("Firefox/")[1];
          break;

        case "opera":
          version = ua.split("Version/")[1];
          break;

        case "operaWebkit":
          bName = "opera";
          version = ua.split("OPR/")[1];
          break;

        case "yabrowser":
          version = ua.split("YaBrowser/")[1].split(" ")[0];
          break;

        case "chrome":
          version = ua.split("Chrome/")[1].split(" ")[0];
          break;

        case "safari":
          version = ua.split("Safari/")[1].split("")[0];
          break;

        case "maxHhon":
          version = ua.split("maxHhon/")[1];
          break;
      }

      var platform = 'desktop';
      if (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())) platform = 'mobile';
      var browsrObj;

      try {
        browsrObj = {
          platform: platform,
          browser: bName,
          versionFull: version,
          versionShort: version.split(".")[0]
        };
      } catch (err) {
        browsrObj = {
          platform: platform,
          browser: 'unknown',
          versionFull: 'unknown',
          versionShort: 'unknown'
        };
      }

      return browsrObj;
    }
  };
  genFunc.initialize();
  $(document).on("click", ".js_validate button[type=submit], .js_validate input[type=submit]", function () {
    var valid = validate($(this).parents(".js_validate"));

    if (valid == false) {
      return false;
    }
  });
  $('.js_validate input[type="file"]').on("change", function () {
    return readURL($(this));
  }); // validation start

  function validate(form) {
    var error_class = "error";
    var norma_class = "pass";
    var item = form.find("[required]");
    var e = 0;
    var reg = undefined;
    var pass = form.find('.password').val();
    var pass_1 = form.find('.password_1').val();
    var email = false;
    var password = false;

    function mark(object, expression) {
      if (expression) {
        object.parents('.input-group').addClass(error_class).removeClass('error-email').removeClass('error-pass').removeClass(norma_class).removeClass('error-pass');
        e++;

        if (email && object.val().length > 0) {
          object.parents('.input-group').addClass('error-email').removeClass(error_class);
        }

        if (password && object.val().length > 0) {
          object.parents('.input-group').addClass('error-pass').removeClass(error_class);
        }

        if (pass_1 !== pass) {
          object.parents('.input-group_pass-repeat').addClass('error-pass').removeClass(error_class);
        }
      } else object.parents('.input-group').addClass(norma_class).removeClass(error_class).removeClass('error-email').removeClass('error-pass');
    }

    form.find("[required]").each(function () {
      switch ($(this).attr("data-validate")) {
        case undefined:
          mark($(this), $.trim($(this).val()).length === 0);
          break;

        case "email":
          email = true;
          reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
          mark($(this), !reg.test($.trim($(this).val())));
          email = false;
          break;

        case "phone":
          reg = /[0-9 -()+]{10}$/;
          mark($(this), !reg.test($.trim($(this).val())));
          break;

        case "pass":
          password = true;
          reg = /^[a-zA-Z0-9_-]{6,}$/;
          mark($(this), !reg.test($.trim($(this).val())));
          password = false;
          break;

        case "pass1":
          mark($(this), pass_1 !== pass || $.trim($(this).val()).length === 0);
          break;

        case "date":
          reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
          mark($(this), !reg.test($.trim($(this).val())));
          break;

        default:
          reg = new RegExp($(this).attr("data-validate"), "g");
          mark($(this), !reg.test($.trim($(this).val())));
          break;
      }
    });
    form.find('.js_valid_radio').each(function () {
      var inp = $(this).find('input[required]');
      var rezalt = 0;

      for (var i = 0; i < inp.length; i++) {
        if ($(inp[i]).is(':checked') === true) {
          rezalt = 1;
          break;
        } else {
          rezalt = 0;
        }
      }

      ;

      if (rezalt === 0) {
        $(this).addClass(error_class).removeClass(norma_class);
        e = 1;
      } else {
        $(this).addClass(norma_class).removeClass(error_class);
      }
    });
    form.find('.js_valid_select').each(function () {
      var inp = $(this).find('.custom-option');
      var rezalt = 0;

      for (var i = 0; i < inp.length; i++) {
        console.log($(inp[i]).hasClass('selection'));

        if ($(inp[i]).hasClass('selection') === true) {
          rezalt = 1;
          break;
        } else {
          rezalt = 0;
        }
      }

      ;

      if (rezalt === 0) {
        $(this).addClass(error_class).removeClass(norma_class);
        e = 1;
      } else {
        $(this).addClass(norma_class).removeClass(error_class);
      }
    });

    if (e == 0) {
      return true;
    } else {
      form.find("." + error_class + " input:first").focus();
      return false;
    }
  }

  function readURL(input) {
    //let type   = ['.doc','.docx','.pdf','.rtf','.odt'];
    //let type   = ['image/tif','image/tiff','image/pdf','image/gif','image/jpg','image/jpeg','image/png', 'application/pdf', 'application/psd', 'application/cdr', 'application/ai', 'application/postscript', 'application/rtf', 'application/msword'];
    //let type   = ['.tif','.tiff','.pdf','.gif','.jpg','.jpeg','.png', '.pdf', '.psd', '.cdr', '.ai'];
    var type = ['.pdf'];
    var size = 5097152; // bytes

    var file = input[0].files[0];

    function errMsg(inputErrorType) {
      input.siblings(".text-error").text(inputErrorType);
      input.closest(".input-group-wrap").addClass("error"); //btn.prop('disabled', true);

      return false;
    }

    if (input[0].files.length !== 1) {
      errMsg(input.attr("data-error-existence"));
    } else {
      var fileType = file.name;

      if (file.size < size) {
        for (var i = 0; i < type.length; i++) {
          if (fileType.indexOf(type[i]) !== -1) {
            input.closest(".input-group-wrap").removeClass("error");
            input.siblings(".text-error").text(""); //btn.prop('disabled', false);

            break;
          } else {
            errMsg(input.attr("data-error-type"));
          }
        }
      } else {
        errMsg(input.attr("data-error-size"));
      }
    }
  } // validation end


  var mySwiperGalleryProduct = new Swiper('.js_gallery-product .swiper-container', {
    // Optional parameters
    loop: false,
    autoplay: true,
    pagination: false,
    slidesPerView: 1,
    watchOverflow: true,
    navigation: {
      nextEl: '.js_gallery-product .swiper-button-next',
      prevEl: '.js_gallery-product .swiper-button-prev'
    },
    scrollbar: {
      el: '.js_gallery-product .swiper-scrollbar',
      hide: false,
      dragSize: '733'
    }
  });
  var mySwiperGalleryPartners = new Swiper('.js_gallery-partners .swiper-container', {
    // Optional parameters
    //pagination: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    slidesPerView: 2.4,
    //centeredSlides: true,
    loop: true,
    watchOverflow: true,
    spaceBetween: 8,
    navigation: {
      nextEl: '.js_gallery-partners .swiper-button-next',
      prevEl: '.js_gallery-partners .swiper-button-prev'
    },
    breakpoints: {
      768: {
        pagination: false,
        slidesPerView: 8,
        spaceBetween: 0,
        //centeredSlides: false,
        loop: false,
        centeredSlides: false
      }
    }
  });
  $(".js__scroll").mCustomScrollbar({
    theme: "inset-dark"
  }); //swiper top text

  var SwiperTopText = new Swiper('.service-top_text .swiper-container', {
    pagination: {
      el: '.service-top_btn .swiper-pagination',
      type: 'fraction'
    },
    slidesPerView: 1,
    watchOverflow: true,
    autoHeight: true,
    navigation: {
      nextEl: '.service-top_btn .swiper-button-next',
      prevEl: '.service-top_btn .swiper-button-prev'
    } // scrollbar: {
    //     el: '.service-top_text .swiper-scrollbar',
    //     hide: false,
    //     draggable: true,
    // },

  }); //swiper top text
  // $(document).ready(function (listener) {
  //
  // });
})(); //swiper reviews


var reviewgalleryThumbs = new Swiper('.js_reviews-slider-thumbs .swiper-container', {
  spaceBetween: 8,
  slidesPerView: 4,
  slideToClickedSlide: true,
  direction: 'vertical',
  loop: true,
  loopedSlides: 4,
  touchRatio: 0.2,
  autoHeight: true,
  breakpoints: {
    993: {
      slidesPerView: 5,
      spaceBetween: 24,
      direction: 'horizontal'
    }
  }
});
var reviewgalleryTop = new Swiper('.js_reviews-slider-top .swiper-container', {
  spaceBetween: 10,
  pagination: {
    el: '.reviews-slides-btn .swiper-pagination',
    type: 'fraction'
  },
  navigation: {
    nextEl: '.reviews-slider-nav .swiper-button-next',
    prevEl: '.reviews-slider-nav .swiper-button-prev'
  },
  loop: true,
  loopedSlides: 4,
  thumbs: {
    swiper: reviewgalleryThumbs
  }
}); // reviewgalleryTop.params.control = reviewgalleryThumbs;
// reviewgalleryThumbs.params.control = reviewgalleryTop;
//swiper reviews
// swiper timeline

$(document).ready(function () {
  "use strict";

  if ($('.js-form-label').length) {
    $('.js-form-label input, .js-form-label textarea').each(function () {
      if ($(this).val().length === 0) {
        $(this).attr('data-empty', 'true');
      } else {
        $(this).attr('data-empty', 'false');
      }
    });
    $('.js-form-label textarea, .js-form-label input').on('blur', function (e) {
      $(e.currentTarget).attr('data-empty', !e.currentTarget.value);
      console.log('rnj pflbm');
    });
  }

  if ($('.js-show-search').length) {
    $(document).on('click', '.js-show-search', function () {
      $('.search-block-wrap').toggleClass('show');
      $('body').toggleClass('show-search');
    });
    $(document).on('click', '.js-overlay-search, .search-close', function () {
      $('.search-block-wrap').removeClass('show');
      $('body').removeClass('show-search');
      $('.search-block .input-group').removeClass('error');
    });
    $('.js-search').on('input', function () {
      if ($(this).val().length > 2) {
        $('.search-block').addClass('show-delete-btn');
      } else {
        $('.search-block').removeClass('show-delete-btn');
      }
    });
    $(document).on('click', '.js-delete-val', function () {
      $('.js-search').val('');
      $('.search-block').removeClass('show-delete-btn');
    });

    if ($('.search-result__item').length > 1) {
      $('.js-overlay-search').addClass('show');
    }
  }
  /**
   * Swiper slider - Timeline
   */


  if ($('.js-timeline-contents').length > 0) {
    var container = $('.about-timeline');
    var timelineContents = new Swiper('.js-timeline-contents', {
      navigation: {
        nextEl: '.about-timeline-button--next',
        prevEl: '.about-timeline-button--prev'
      },
      grabCursor: true,
      spaceBetween: 0,
      autoHeight: true,
      slidesPerView: '1',
      centeredSlides: true
    });
    var timelineDates = new Swiper('.js-timeline-dates', {
      spaceBetween: 0,
      pagination: {
        el: '.about-timeline .swiper-pagination',
        clickable: true
      },
      centeredSlides: true,
      slidesPerView: '4',
      //loop: true,
      touchRatio: 0.2,
      slideToClickedSlide: true,
      breakpoints: {
        767: {
          slidesPerView: '5',
          pagination: false
        }
      }
    });
    timelineContents.controller.control = timelineDates;
    timelineDates.controller.control = timelineContents;
  } //swiper timeline end
  //contact page choose city


  function initialize() {
    var map,
        latlng,
        data = cities,
        mapLat = $('#map').data('maplat'),
        mapLng = $('#map').data('maplng');
    latlng = {
      lat: mapLat,
      lng: mapLng
    };
    var myOptions = {
      zoom: 5,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    data.forEach(function (mapData, idx) {
      var markerCoord = mapData.coordinates.split(','),
          infowindow = new google.maps.InfoWindow({
        content: mapData.address
      }),
          marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(markerCoord[0], markerCoord[1]),
        icon: {
          url: 'images/marker.svg',
          scaledSize: new google.maps.Size(50, 60)
        }
      });
      google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
        map.setZoom(17);
        map.panTo(marker.position);
      });
      var storeItem = $('.choose-city__item-wrap'),
          address = mapData.address,
          coord = mapData.coordinates,
          time = mapData.time,
          cityFilter = mapData.city_id;
      storeItem.find('.choose-city__adress').text(address);
      storeItem.find('.js-show-address').attr('data-coord', coord);
      storeItem.find('.choose-city__item').attr('data-city', cityFilter);
      $('.choose-city__item-wrap .schedule-col .schedule-row').remove();

      for (var key in time) {
        var daysTime = "<div class=\"schedule-row\">\n                  <div class=\"day\">".concat(key, "</div>\n                  <div class=\"time\">").concat(time[key], "</div>\n                </div>");
        storeItem.find('.schedule-col').append(daysTime);
      }

      $('.choose-city__wrap').append($('.choose-city__item-wrap').html());
    });
    $('.js-scroll-city').mCustomScrollbar({
      advanced: {
        autoExpandHorizontalScroll: false,
        updateOnContentResize: true
      }
    });

    function onChange() {
      var selectedCity = $('.js-select-city').find(':selected').attr('data-city'),
          //selectedChain = $('.js-chain-stores-filter').find(':selected').attr('data-chain'),
      filter = ".choose-city__item",
          allFilter = $(filter);

      if (selectedCity !== "all") {
        filter += '[data-city="' + selectedCity + '"]';
      } // if (selectedChain != "all") {
      //     filter += '[data-chain="' + selectedChain + '"]';
      // }


      var matching = allFilter.filter(filter);
      $(allFilter).not(matching).hide();
      matching.show();
      var heightWrap = $('.js-scroll-city .choose-city__wrap').height();

      if (heightWrap > 457) {
        $('.js-scroll-city').mCustomScrollbar();
      } else {
        $('.js-scroll-city').mCustomScrollbar("destroy");
      }
    }

    $(document).on("change", ".js-select-city", function () {
      var cityId = $(this).find(':selected').attr('data-coord').split(/\s*,\s*/),
          latlngNew = new google.maps.LatLng(parseFloat(cityId[0]), parseFloat(cityId[1]));
      map.setZoom(11);
      map.panTo(latlngNew);
      map.setCenter(latlngNew);

      if ($(this).find(':selected').hasClass('all-cities')) {
        map.setZoom(5);
        map.setCenter(latlng);
      }

      onChange();
    }); // $(document).on("change", ".js-chain-stores-filter", function () {
    //     onChange();
    // });
    // $(document).on('click', '.js-show-address', function () {
    //     var address = $(this).attr('data-coord').split(/\s*,\s*/),
    //         newCoord = new google.maps.LatLng(parseFloat(address[0]), parseFloat(address[1]));
    //     map.setZoom(17);
    //     map.panTo(newCoord);
    //     map.setCenter(newCoord);
    // });
  }

  if ($('#map').length) {
    initialize();
  } //end contact page choose city
  //select2


  if ($('.js-select').length) {
    $('.js-select').select2({
      minimumResultsForSearch: Infinity
    });
  } //select2 end

}); // function heightBlock() {
//     $('.js_height-block').each(function (i, e) {
//         console.log('1111');
//             var elH = e.getElementsByClassName('height');
//             var maxHeight = 0;
//             for (var i = 0; i < elH.length; ++i) {
//                 elH[i].style.height = "";
//                 if (maxHeight < elH[i].clientHeight) {
//                     maxHeight = elH[i].clientHeight;
//                 }
//             }
//             for (var i = 0; i < elH.length; ++i) {
//                 elH[i].style.height = maxHeight + "px";
//             }
//         }
//     )
// }

$(document).ready(function () {
  var highestBox = 0;
  $('.js_height-block .height').each(function () {
    if ($(this).height() > highestBox) {
      highestBox = $(this).height();
    }
  });
  $('.js_height-block .height').height(highestBox);
  $(".banner__form--block .main-btn").on("click", function () {
    $(".banner__form--block").addClass("show");
  });
  $(".banner__form--block .banner__close").on("click", function () {
    $(".banner__form--block").removeClass("show");
  });
  $(".header__mn-close .btn-burger").on("click", function () {
    $("body").addClass("open-menu");
    $(".header__mn-open").addClass("show");
  });
  $(".header__mn-open .btn-burger--close").on("click", function () {
    $("body").removeClass("open-menu");
    $(".header__mn-open").removeClass("show");
  });
}); // $(".location .location-active").on("click", function () {
//     $("body").addClass("fooo");
//     $(".choose-city").addClass("show");
// });
// $(".location .location-active").on("click", function () {
//     $("body").removeClass("fooo");
//     $(".choose-city").removeClass("show");
// });

$('.icon-open--submenu').on('click', function () {
  $(this).parents('.js-item-with-submenu').toggleClass('active');
});
$('.upload').each(function () {
  var $t = $(this),
      $span = $t.siblings('span'),
      value;
  $t.change(function () {
    value = $t.val();
    $span.text(value);
  });
});
$(function () {
  var $filter = $('.price-filter');
  var $tab = $('.price-filter a');
  var $offers = $('.price-body .price-choice__wrap');
  var textAll = $('.js-all-price.active').text();
  $filter.on('click touch', '.js-all-price', function (e) {
    e.preventDefault();
    $tab.removeClass('active');
    $(this).addClass('active');
    $('.price-choice_name').text(textAll);
    $offers.hide();
    $offers.fadeIn(700);
  });
});
$('.price-filter__wrap .js-filter-price').click(function () {
  $('.js-all-price').removeClass('active');
  $('.price-filter__wrap .js-filter-price').removeClass('active').eq($(this).index()).addClass('active');
  $('.price-choice__wrap').hide().eq($(this).index()).fadeIn();
});
$('.js-filter-price').click(function () {
  var text = $('.js-filter-price.active').text();
  $('.price-choice_name').text(text);
});
$(".price-choice__wrap .input-price_variable").change(function () {
  if ($(this).prop('checked')) {
    $('.price-filter__wrap .js-filter-price').eq($(this).index()).addClass('checked-service');
    $('.price-choice__wrap').eq($(this).index());
  }
}); // $(document).ready(function() {
//     $(".js-select").select2();
// });

(function ($) {
  var truncate = function truncate(el) {
    var text = el.text(),
        height = el.height(),
        clone = el.clone();
    clone.css({
      position: 'absolute',
      visibility: 'hidden',
      height: 'auto'
    });
    el.after(clone);
    var l = text.length - 1;

    for (; l >= 0 && clone.height() > height; --l) {
      clone.text(text.substring(0, l) + '...');
    }

    el.text(clone.text());
    clone.remove();
  };

  $.fn.truncateText = function () {
    return this.each(function () {
      truncate($(this));
    });
  };
})(jQuery);

$(function () {
  $('.service-top_text .swiper-slide').truncateText();
});

function modal(id) {
  $.fancybox.open({
    src: id,
    type: "inline"
  });
}

$(function () {
  var dtToday = new Date();
  var month = dtToday.getMonth() + 1;
  var day = dtToday.getDate();
  var year = dtToday.getFullYear();
  if (month < 10) month = '0' + month.toString();
  if (day < 10) day = '0' + day.toString();
  var minDate = year + '-' + month + '-' + day;
  $('input[type=date]').attr('min', minDate);
});