$(".slider-for").slick({
  autoplay: true,
  autoplaySpeed: 2000,
  pauseOnHover: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  asNavFor: ".slider-nav",
});

$(".slider-nav").slick({
  slidesToShow: 5,
  slidesToScroll: 1,
  asNavFor: ".slider-for",
  centerMode: true,
  focusOnSelect: true,
  centerPadding: "0",
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 500,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
});

$(".hero-for").slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  asNavFor: ".hero-nav",
});

$(".hero-nav").slick({
  slidesToShow: 5,
  slidesToScroll: 1,
  asNavFor: ".hero-for",
  centerMode: true,
  centerPadding: "0",
  focusOnSelect: true,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 500,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
});

$(".buttonDrop").click(function () {
  $("." + $(this).attr("data-class")).toggleClass("active");
  $(this).toggleClass("active");
});

$(".newsTab-button").click(function () {
  $(".newsTab-button").removeClass("active");
  $(this).addClass("active");
  $(".newsTabBlock").removeClass("active");
  $("#" + $(this).attr("data-tab")).addClass("active");
});

$(".topTab-button").click(function () {
  $(".topTab-button").removeClass("active");
  $(this).addClass("active");
  $(".topTabBlock").removeClass("active");
  $("#" + $(this).attr("data-tab")).addClass("active");
});

$(document).ready(function () {
  var overlay = $("#overlay");
  var open_modal = $(".open_modal");
  var close = $(".modal_close, #overlay");
  var modal = $(".modal_div");
  open_modal.click(function (event) {
    event.preventDefault();
    var div = $(this).attr("href");
    overlay.fadeIn(200, function () {
      $(div).css("display", "block").animate({ opacity: 1, top: "0px" }, 200);
      $(div).find('#loginBox1').focus();
    });
  });

  close.click(function () {
    modal.animate({ opacity: 0, top: "0px" }, 200, function () {
      $(this).css("display", "none");
      overlay.fadeOut(200);
    });
  });
});

$(document).ready(function () {
  $(".circlestat canvas").remove();
  $(".circlestat").circliful({
    dimension: 105,
    width: 5,
  });
/*  if (window.innerWidth < 992) {
    $(".circlestat canvas").remove();
    $(".circlestat").circliful({
      dimension: 65,
      width: 3,
    });
  }*/
});

$(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() != 0) {
      $(".to-top").fadeIn();
    } else {
      $(".to-top").fadeOut();
    }
  });
  $(".to-top").click(function () {
    $("body,html").animate({ scrollTop: 0 }, 800);
  });
});

$(function () {
  function ScrolClass() {
    if ($(this).scrollTop() != 0) {
      $(".top-panel-bg").addClass("active");
    } else {
      $(".top-panel-bg").removeClass("active");
    }
  }
  $(window).scroll(function () {
    ScrolClass();
  });
  $(document).ready(function () {
    ScrolClass();
  });
});

/*$(document).ready(function() {
  var page = window.location.pathname;

  if (page && page != "/") {
    $('html, body').stop().animate({ 'scrollTop': $(".page-wrapper").offset().top - 60 }, 800, 'swing');
  }
});*/
