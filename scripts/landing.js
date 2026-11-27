// Home-page carousel: screenshots of the actual game.
// Prev / Next always move exactly one slide, pause or not, and a slide is visible at all times
// (the old version skipped clicks for 4 seconds and could leave the hero blank).

const slideInterval = 4500;
const fadeDuration = 220;
let slideTimer = null;
let slidePaused = false;

// Preload so a fade never waits on the network.
heroes.forEach(hero => { const pre = new Image(); pre.src = hero.image; });

function showSlide(index) {
    currentImgIdx = (index + heroes.length) % heroes.length;
    const hero = heroes[currentImgIdx];
    $imgLanding.stop(true, true).fadeTo(fadeDuration, 0.15, function () {
        $imgLanding.attr({ src: hero.image, alt: hero.alt });
        $('#slide-caption').text(hero.title);
        $imgLanding.fadeTo(fadeDuration, 1);
    });
}

function startSlides() {
    clearInterval(slideTimer);
    if (!slidePaused) {
        slideTimer = setInterval(() => showSlide(currentImgIdx + 1), slideInterval);
    }
}

$next.click(() => { showSlide(currentImgIdx + 1); startSlides(); });
$prev.click(() => { showSlide(currentImgIdx - 1); startSlides(); });

$pause.click(() => {
    slidePaused = true;
    clearInterval(slideTimer);
    $pause.addClass('hide');
    $resume.removeClass('hide');
});

$resume.click(() => {
    slidePaused = false;
    $resume.addClass('hide');
    $pause.removeClass('hide');
    startSlides();
});

// Respect reduced-motion: no auto-advance, the buttons still work.
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    slidePaused = true;
    $pause.addClass('hide');
    $resume.removeClass('hide');
}

showSlide(0);
startSlides();
