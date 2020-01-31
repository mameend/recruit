'use strict';

KURASHICOM.pageScript = KURASHICOM.pageScript || {
  init: {}
};

KURASHICOM.pageScript = function () {

  // 変数定義  =================================================================

  // コンストラクタ  =================================================================
  function init() {
    resizeEvent();
    scrollEvent();

    topInit();

    KURASHICOM.data.$window.on('resize', function () {
      resizeEvent();
    });
    KURASHICOM.data.$window.on('scroll', function () {
      scrollEvent();
    });
  }

  // functions  =================================================================
  /*
  *  topInit
  *
  */
  function topInit() {
    conceptMore();
    columnRoadCallback();
    conceptAnimation();

    KURASHICOM.common.countImgLoaded().done(function (data) {}).fail(function () {});
  }

  /*
  *  resizeEvent
  *
  */
  function resizeEvent() {
    mainvisualResize();
    conceptAnimationResize();
  }

  /*
  *  scrollEvent
  *
  */
  function scrollEvent() {}

  /*
  *  mainvisualResize
  *
  */
  function mainvisualResize() {
    if (KURASHICOM.data.$MQ == 'SP') {
      $('.mainvisual_img').css('height', KURASHICOM.data.winH - 60);
    } else {
      $('.mainvisual_img').css('height', '');
    }
  }

  /*
  *  conceptAnimation
  *
  */
  var conceptPos, conceptH;
  var xHalf, yHalf;
  var moveX, moveY;
  var xResult, yResult;
  function conceptAnimationResize() {
    conceptPos = $('.conceptSection').offset().top;
    conceptH = $('.conceptSection_inner').outerHeight();
    xHalf = Math.floor(KURASHICOM.data.winW - 60) / 2;
    yHalf = Math.floor(conceptH) / 2;
  }
  function conceptAnimation() {
    if (KURASHICOM.data.$MQ == 'SP') return;
    $('.conceptSection_inner').on('mousemove', function (e) {
      moveX = e.pageX;
      moveY = e.pageY - conceptPos;
      xResult = moveX > xHalf ? xHalf - moveX : -(moveX - xHalf);
      yResult = moveY > yHalf ? yHalf - moveY : -(moveY - yHalf);
      xResult = xResult > 15 ? 15 : xResult < -15 ? -15 : xResult;
      yResult = yResult > 15 ? 15 : yResult < -15 ? -15 : yResult;

      $('.conceptSection_bg').css(KURASHICOM.data.prefix, 'translate(' + xResult + 'px,' + yResult + 'px)');
    });
  }

  /*
  *  conceptMore
  *
  */
  function conceptMore() {
    $('.programDetail_moreButton').on('click', function () {
      var _this = $(this);
      if ($(this).closest('.programDetail').is('.opened')) {
        $(this).closest('.programDetail').removeClass('opened');
        setTimeout(function () {
          KURASHICOM.common.anchorLink(_this.closest('.programDetail'));
        }, 200);
      } else {
        $(this).closest('.programDetail').addClass('opened');
      }
      return false;
    });
  }

  /*
  *  columnRoad
  *
  */
  function columnRoad() {
    var defer = new $.Deferred();

    $.ajax({
      type: 'GET',
      dataType: 'xml',
      url: './xml/column.xml',
      success: defer.resolve,
      error: defer.reject
    });

    return defer.promise();
  }

  function columnRoadCallback() {
    columnRoad().done(function (data) {
      columnRoadAfter(data);
    }).fail(function (data) {});
  }

  function columnRoadAfter(data) {
    var columnSrc = '';
    $(data).find('item').each(function (i) {
      var title = $(this).find('title').text();
      var link = $(this).find('link').text();
      columnSrc += '<li><a href="' + link + '" target="_blank">' + title + '</a></li>';

      if (i == $(data).find('item').length - 1) {
        $('.columnSection_list').html(columnSrc);
      }
    });
  }

  return {
    init: init
  };
}();

KURASHICOM.common.init(KURASHICOM.pageScript.init);