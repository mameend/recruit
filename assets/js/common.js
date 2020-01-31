'use strict';

var KURASHICOM = KURASHICOM || {
  data: {
    ua: '',
    firstLoad: true,
    url: '',
    $body: $('body'),
    $window: $(window),
    $MQ: 'PC',
    scrollTop: 0,
    scrollTop_: undefined,
    winW: '',
    winH: '',
    jqXHR: '',
    prefix: ''
  },
  common: {
    init: {}
  }
};

KURASHICOM.common = function (pageScript) {
  var oldMQ;

  // init  =================================================================
  function init(pageScript) {
    sessionJudge();
    setBrowser();
    introAnimation();

    resizeEvent();
    scrollEvent();

    getLocationHref();
    anchorClickEvent();
    globalAnchor();
    headerOpen();
    headerSubmenuOpen();

    imgCallback();

    KURASHICOM.data.prefix = getPropertyName('transform');

    KURASHICOM.data.$window.on('resize', function () {
      resizeEvent();
    });
    KURASHICOM.data.$window.on('scroll', function () {
      scrollEvent();
    });

    pageScript && pageScript();
  }

  /*
  * resizeEvent
  *
  */
  function resizeEvent(target) {
    checkScreenSize();
    getScreenSize();
    positionGet();
    imgChange();
  }

  /*
  * scrollEvent
  *
  */
  function scrollEvent(target) {
    headerChange();
    getScrollTop();
    pagetopButton();
  }

  /*
  * sessionJudge
  *
  */
  function sessionJudge(target) {
    if (window.sessionStorage) {
      var str = window.sessionStorage.getItem("load_key");
      if (str == 'second') {
        KURASHICOM.data.firstLoad = false;
        $('body').addClass('secondLoad');
      } else {
        $('body').addClass('firstLoad');
        try {
          window.sessionStorage.setItem("load_key", 'second');
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  /*
  * introAnimation
  *
  */
  function introAnimation() {
    $('.intro').stop(true, true).fadeOut(600);
    // countImgLoaded()
    // .done(function(data) {
    //   if(KURASHICOM.data.firstLoad){
    //   }else{
    //   }
    // }).fail(function () {
    //   if(KURASHICOM.data.firstLoad){
    //   }else{
    //   }
    // });
  }

  /*
  * countImgLoaded
  *
  */
  function countImgLoaded(target) {
    var defer = new $.Deferred();

    var $img = target ? target.find('img[src]') : $('img[src]');
    var total = $img.length;
    var count = 0;

    $img.each(function () {
      var myImg = new Image();
      myImg.src = $(this).attr('src');
      myImg.onload = function () {
        count++;
        $('.itemDetail_line').css('width', count / total * 150 + '%');
        if (count == total) {
          defer.resolve();
        }
      };
      myImg.onerror = function () {
        defer.reject();
      };
    });

    if (total == 0) {
      defer.resolve();
    }

    return defer.promise();
  }

  // functions  =================================================================
  /*
  *  setBrowser
  *
  */
  function setBrowser() {
    KURASHICOM.data.ua = {
      Safari: typeof window.chrome == 'undefined' && 'WebkitAppearance' in document.documentElement.style,
      Firefox: 'MozAppearance' in document.documentElement.style,
      IE: window.navigator.userAgent.toLowerCase().indexOf('msie') !== -1 || window.navigator.userAgent.toLowerCase().indexOf('trident') !== -1,
      IE9: window.navigator.appVersion.toLowerCase().indexOf('msie 9.') !== -1,
      ltIE9: typeof window.addEventListener === 'undefined' && typeof document.getElementsByClassName === 'undefined',
      Touch: typeof document.ontouchstart !== "undefined",
      Pointer: window.navigator.pointerEnabled,
      MSPoniter: window.navigator.msPointerEnabled,
      Windows: window.navigator.userAgent.toLowerCase().indexOf('win') !== -1,
      Mac: window.navigator.userAgent.toLowerCase().indexOf('mac') !== -1,
      iPhone: window.navigator.userAgent.indexOf('iPhone') > 0,
      iPad: window.navigator.userAgent.indexOf('iPad') !== -1,
      android: window.navigator.userAgent.indexOf('Android') !== -1
    };
    if (KURASHICOM.data.ua.Safari) {
      $('html').addClass('safari');
    }
    if (KURASHICOM.data.ua.Firefox) {
      $('html').addClass('firefox');
    }
    if (KURASHICOM.data.ua.IE) {
      $('html').addClass('ie');
    }
    if (KURASHICOM.data.ua.IE9) {
      $('html').addClass('ie9');
    }
    if (KURASHICOM.data.ua.ltIE9) {
      $('html').addClass('ie8');
    }
    if (KURASHICOM.data.ua.Touch) {
      $('html').addClass('touchDevice');
    }
    if (KURASHICOM.data.ua.iPhone) {
      $('html').addClass('iPhone');
    }
    if (KURASHICOM.data.ua.iPad) {
      $('html').addClass('iPad');
    }
    if (KURASHICOM.data.ua.android) {
      $('html').addClass('android');
    }

    /* Defining touch events */
    if (KURASHICOM.data.ua.Touch) {
      $('html').addClass('tablet');
      touchDeviceDirectionJudge();
      $(window).on('orientationchange', function () {
        touchDeviceDirectionJudge();
      });
    }
  }

  function touchDeviceDirectionJudge() {
    if (Math.abs(window.orientation) !== 90) {
      $('html').removeClass('landscape').addClass('portrait');
    } else {
      $('html').removeClass('portrait').addClass('landscape');
    }
  }

  /*
  *  deviceWidth縺訓C縺鬼P縺句愛螳�
  *
  */
  function checkScreenSize() {
    var mWidth = $("body").css("min-width");
    switch (mWidth) {
      case "2px":
        KURASHICOM.data.$MQ = "SP";
        break;
      default:
        KURASHICOM.data.$MQ = "PC";
    }

    if (oldMQ && oldMQ !== KURASHICOM.data.$MQ) {
      KURASHICOM.data.$window.trigger("onBreakpointChange");
    }

    $('body').attr('data-device', KURASHICOM.data.$MQ);

    oldMQ = KURASHICOM.data.$MQ;
  }

  /*
  *  getScreenSize
  *
  */
  function getScreenSize() {
    KURASHICOM.data.winW = KURASHICOM.data.$window.width();
    KURASHICOM.data.winH = KURASHICOM.data.$window.height();
  }

  /*
  *  getScrollTop
  *
  */
  function getScrollTop() {
    KURASHICOM.data.scrollTop = KURASHICOM.data.$window.scrollTop();
  }

  /*
  *  getLocationHref
  *
  */
  function getLocationHref() {
    KURASHICOM.data.url = location.href;
  }

  /*
  *  anchorLink
  *
  */
  function anchorLink(target) {
    var speed = 400;
    // var offset = KURASHICOM.data.$MQ == 'SP' ? 50 : 60;
    if (target == $('html')) {
      var position = 0;
    } else {
      var position = target.offset().top;
    }
    $('body,html').animate({ scrollTop: position }, speed, 'swing');
  }
  function anchorClickEvent() {
    $(document).on('click', '.anchorLink', function () {
      var href = $(this).attr("href");
      var target = $(href == "#" || href == "" ? 'html' : href);
      anchorLink(target);
      return false;
    });
  }

  /*
  *  globalAnchor
  *
  */
  function globalAnchor() {
    $('.anchorControl').on('click', function () {
      var hrefSlug = $(this).attr('href');
      if ($('body').is('[data-page="item"]')) {
        if ($('body').is('.RIDE_scrollRockFixed')) {
          $('.header_main_menu').click();
        }
        var bodyID = $('body').attr('data-anchorbase');
        if (hrefSlug.indexOf(bodyID) !== -1) {
          anchorLink($('#' + hrefSlug.split('#')[1]));
        } else {
          location.href = hrefSlug;
        }
        return false;
      }
    });
  };

  /*
  *  positionGet
  *
  */
  function positionGet() {
    if ($('.footer').length) {
      KURASHICOM.data.footerPos = $('.footer').offset().top - KURASHICOM.data.winH;
    }
  }

  /*
  *  pagetopButton
  *
  */
  var saveScroll;
  function pagetopButton() {
    if (KURASHICOM.data.scrollTop < 100) {
      $('.pageTop').addClass('hide');
    } else if (KURASHICOM.data.scrollTop > saveScroll) {
      $('.pageTop').addClass('hide');
    } else {
      $('.pageTop').removeClass('hide');
    }
    saveScroll = KURASHICOM.data.scrollTop;
  }

  /*
  *  check prefix
  *
  */
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }
  function toCamelCase(hyphenated, isLower) {
    var components = hyphenated.split('-');
    for (var i = 0; i < components.length; i++) {
      if (!(isLower && i === 0)) {
        components[i] = capitalize(components[i]);
      }
    }
    return components.join('');
  }
  function getPropertyName(propertyName, elem) {
    elem = elem || document.body;
    // Check without prefix
    var lowerCamel = toCamelCase(propertyName, true);
    if (typeof elem.style[lowerCamel] === 'string') {
      return lowerCamel;
    }
    // Check prefixes
    var upperCamel = toCamelCase(propertyName);
    var prefixes = ['', 'Webkit', 'Moz', 'O', 'ms'];
    for (var i = 0; i < prefixes.length; i++) {
      var candidate = prefixes[i] + upperCamel;
      if (typeof elem.style[candidate] === 'string') {
        return candidate;
      }
    }
  }

  /*
  *  imgChange
  *
  */
  function imgChange() {
    if (KURASHICOM.data.$MQ == 'SP') {
      $('.imgChange').each(function () {
        $(this).attr('src', $(this).attr('src').replace('_pc', '_sp'));
      });
    } else {
      $('.imgChange').each(function () {
        $(this).attr('src', $(this).attr('src').replace('_sp', '_pc'));
      });
    }
  }

  /*
  *  headerOpen
  *
  */
  function headerChange() {
    if (!$('body').is('[data-page="top"]')) return;
    var judgePos = KURASHICOM.data.winH;
    if (KURASHICOM.data.scrollTop > judgePos) {
      $('body').addClass('headerFixed');
    } else {
      $('body').removeClass('headerFixed');
    }

    if (KURASHICOM.data.scrollTop > judgePos) {
      $('body').removeClass('headerHide');
    } else if (KURASHICOM.data.scrollTop > judgePos / 2) {
      $('body').addClass('headerHide');
    } else {
      $('body').removeClass('headerHide');
    }
  }

  /*
  *  headerOpen
  *
  */
  function headerOpen() {
    $('.header_main_menu').on('click', function () {
      if ($('body').is('.headerOpen')) {
        $('body').removeClass('headerOpen');
        $('body').scrollRock('release');
      } else {
        $('body').addClass('headerOpen');
        $('body').scrollRock('rock');
      }
    });

    $('.header a, .header_navlist-level2').on('mouseenter', function () {
      $('body').removeClass('headerTransparent');
    });
    $('.header a, .header_navlist-level2').on('mouseleave', function () {
      $('body').addClass('headerTransparent');
    });
  };

  /*
  *  headerSubmenu
  *
  */
  function headerSubmenuOpen() {
    if (KURASHICOM.data.ua.Touch) {
      $('.header_navlist_node.submenu > a').on('click', function () {
        if ($(this).closest('li').is('.open')) {
          $(this).closest('li').removeClass('open');
          $(this).closest('li').find('.header_navlist-level2').stop().slideUp(300);
        } else {
          $('.header_navlist_node.submenu').removeClass('open');
          $(this).closest('li').addClass('open');
          $(this).closest('li').find('.header_navlist-level2').stop().slideDown(300);
        }
        return false;
      });
    } else {
      $('.header_navlist_node.submenu').on('mouseenter', function () {
        $('.header_navlist_node.submenu').removeClass('open');
        $(this).addClass('open');
      });
      $('.header_navlist_node.submenu').on('mouseleave', function () {
        $('.header_navlist_node.submenu').removeClass('open');
      });
    }
  };

  /*
  *  styleOrderSet
  *
  */
  var $styleNode = $('.styleSection_list_node');
  var $styleNode_before = $('.styleSection_list.before');
  var $styleNode_after = $('.styleSection_list.after');
  var $styleNode_allStyle = $('.styleSection_list.allStyle');
  var styleLength = $styleNode.length;
  var randomTimer;
  var activeClearTimer;

  function styleRandomSwitch() {
    var activeNode = Math.floor(Math.random() * styleLength);
    $styleNode.eq(activeNode).addClass('switch');
    activeClearTimer = setTimeout(function () {
      $styleNode.eq(activeNode).removeClass('switch');
    }, 2800);
  }
  function styleRandomTimer() {
    if (!$styleNode[0]) return;
    randomTimer = setInterval(function () {
      styleRandomSwitch();
    }, 700);
  }

  function styleOrderSet() {
    var arr = [];
    if (!$styleNode[0]) return;
    var halfLength = Math.floor(styleLength / 2);

    $styleNode.each(function () {
      arr.push($(this));
    });
    for (var i = 0; i < arr.length; i++) {
      if ($styleNode_before[0]) {
        if (i < halfLength) {
          $styleNode_before.append(arr[i]);
        } else {
          $styleNode_after.append(arr[i]);
        }
      } else {
        $styleNode_allStyle.append(arr[i]);
      }
    }
    $('.styleSection_list.org').remove();

    if ($styleNode_before[0]) {
      styleSliderInit($styleNode_before);
      styleSliderInit($styleNode_after);
    }
  };

  function styleSliderInit(target) {
    var sliderOption = {
      arrows: false,
      dots: false,
      infinite: true,
      slidesToShow: 6,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 0,
      speed: 4000,
      cssEase: 'linear',
      rtl: target == $styleNode_before ? true : false,
      responsive: [{
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          focusOnSelect: false
        }
      }]
    };

    target.slick(sliderOption);
  }

  /*
  *  triangleMove
  *
  */
  function triangleMove() {}

  /*
  *  imgCallback
  *
  */
  function imgCallback() {
    countImgLoaded().done(function (data) {
      imgCallbackEvent();
    }).fail(function () {
      imgCallbackEvent();
    });
  }

  function imgCallbackEvent() {
    inview_set();
    delayimgLoad_set();
  }

  /*==================================
   縲inview
   ==================================*/
  function inview_set() {
    $('.c-inview').each(function (i) {
      new inview(i, $(this));
    });
  }

  function inview(id, target) {
    this.id = id;
    this.target = target;
    this.scrollTop = this.target.offset().top - KURASHICOM.data.winH * 0.9;
    this.inviewFlag = true;
    this.init();
  }

  inview.prototype.init = function () {
    this.scrollEvent();
    this.viewJudge();
  };
  inview.prototype.viewJudge = function () {
    var _this = this;
    if (KURASHICOM.data.scrollTop_) {
      if (_this.scrollTop < KURASHICOM.data.scrollTop_) {
        this.posMove();
      }
    } else {
      if (_this.scrollTop < KURASHICOM.data.scrollTop) {
        this.posMove();
      }
    }
  };
  inview.prototype.scrollEvent = function () {
    var _this = this;
    $('.wrapper').on('scroll', function () {
      _this.viewJudge();
    });
    KURASHICOM.data.$window.on('scroll', function () {
      _this.viewJudge();
    });
  };
  inview.prototype.posMove = function () {
    var _this = this;
    if (!_this.inviewFlag) return;
    _this.target.removeClass('hide');
    _this.inviewFlag = false;
  };

  /*==================================
   縲delayimgLoad
   ==================================*/
  function delayimgLoad_set() {
    $('[data-delaysrc]').each(function (i) {
      new delayimgLoad($(this));
    });
  }

  function delayimgLoad(target) {
    this.target = target;
    this.scrollTop = this.target.offset().top - (KURASHICOM.data.winH + 100);
    this.targetSrc = this.target.attr('data-delaysrc');
    this.delayimgLoadFlag = true;
    this.init();
  }

  delayimgLoad.prototype.init = function () {
    this.positionJudge();
    this.scrollEvent();
  };

  delayimgLoad.prototype.scrollEvent = function () {
    var _this = this;
    $('.wrapper').on('scroll', function () {
      if (_this.delayimgLoadFlag) {
        _this.positionJudge();
      }
    });
    KURASHICOM.data.$window.on('scroll', function () {
      if (_this.delayimgLoadFlag) {
        _this.positionJudge();
      }
    });
  };

  delayimgLoad.prototype.positionJudge = function () {
    var _this = this;
    if (KURASHICOM.data.scrollTop_) {
      if (KURASHICOM.data.scrollTop_ > this.scrollTop) {
        this.imgAppend();
      }
    } else {
      if (KURASHICOM.data.scrollTop > this.scrollTop) {
        this.imgAppend();
      }
    }
  };

  delayimgLoad.prototype.imgAppend = function () {
    var _this = this;
    this.target.on('load', function () {
      $(this).closest('.delayload').addClass('show');
      _this.delayimgLoadFlag = false;
    }).attr('src', this.targetSrc);
  };

  return {
    countImgLoaded: countImgLoaded,
    getScrollTop: getScrollTop,
    getLocationHref: getLocationHref,
    positionGet: positionGet,
    anchorLink: anchorLink,
    init: init
  };
}();