var currentBanner = 0;
var rotateInterval = setInterval(nextBanner, 10);

$(document).ready(function() {
    showBanner(0);
    setTimeout(nextBanner, 5000); // Inicia a rotação após 2 segundos
});

function showBanner(num) {
    if (currentBanner == num) {
        return;
    }
    $('#banners a').hide();
    $('#banner_thumbs li').removeClass('selected');
    currentBanner = num;

    $('#banners a:eq(' + currentBanner + ')').fadeIn();
    $('#banner_thumbs li:eq(' + currentBanner + ')').addClass('selected');
    clearInterval(rotateInterval);
    rotateInterval = setInterval(nextBanner, 7000);
}

function nextBanner() {
    var nextNum = currentBanner == 3 ? 0 : currentBanner + 1;
    showBanner(nextNum);
}
