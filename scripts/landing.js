
function mainImgFtn(img) {
    $imgLanding.attr({
        'src': `${img}`,
        'alt': `${img}`
    });
}


function slideAnimationRace() {

    if (isAnimationRunning) {
        return;
    }

    currentImgIdx++;

    if (currentImgIdx === heroes.length) {
        isMaxImg = true;
        isMinImg = false;
        currentImgIdx = 0;
    }

    $imgElement.css({
        'display': 'none',
        'overflow': 'hidden'
    })

    $imgElement.show("slide", { direction: "left", }, moveDelay);
    $imgElement.hide("slide", { direction: "right", }, moveDelay);
    console.log('moving right');


    console.log('imgIdx: ', currentImgIdx)


    // Continue the animation with a slideDelay
    setTimeout(function () {
        landingSlideAnimation = requestAnimationFrame(slideAnimationRace);
    }, slideDelay);

    mainImgFtn(`${heroes[currentImgIdx].image}`);
}

// Function to stop the image slide
$pause.click(function pauseSlide() {

    const now = Date.now();
    if (now - slideLastClickTime <= slideDelay) {
        const nowInMilliseconds = Date.now();
        const nowInSeconds = Math.floor(nowInMilliseconds / 1000);

        // Get the number of seconds past the last full minute
        let seconds = nowInSeconds % 60;
        console.log('Button clicked too soon, ignoring for..... ', nowInSeconds, 'secs');
        return;
    }

    // Update the last click time
    slideLastClickTime = now;

    isPauseClicked = true;

    cancelAnimationFrame(landingSlideAnimation);
    $imgElement.stop(true, true);

    // isAnimationStarted = false;
    isAnimationRunning = true;

    $imgElement.show("slide", { direction: "right", }, 500);

    setTimeout(() => {
        console.log('to handle duration of showing pause or resume logic')
    }, slideDelay);

    $slideWait.addClass('hide');
    $pause.addClass('hide');
    $resume.removeClass('hide');

});


$next.click(function () {
    const now = Date.now();
    if (now - slideLastClickTime <= slideDelay) {
        const nowInSeconds = Math.floor(now / 1000);
        let seconds = nowInSeconds % 60;
        console.log('Button clicked too soon, ignoring for..... ', seconds, 'secs');
        return;
    }

    slideLastClickTime = now;

    if (currentImgIdx === heroes.length - 1) {
        currentImgIdx = minIdx;
    } else {
        currentImgIdx++;
    }

    resetAnimationState();

    $imgElement.show("slide", { direction: "left", }, moveDelay);
    $imgElement.hide("slide", { direction: "right", }, moveDelay);
    mainImgFtn(`${heroes[currentImgIdx].image}`);

    $imgElement.show("slide", { direction: "right", }, moveDelay);
})

$prev.click(function () {

    const now = Date.now();
    if (now - slideLastClickTime <= slideDelay) {
        const nowInSeconds = Math.floor(now / 1000);
        let seconds = nowInSeconds % 60;
        console.log('Button clicked too soon, ignoring for..... ', seconds, 'secs');
        return;
    }

    slideLastClickTime = now;

    if (currentImgIdx === minIdx) {
        currentImgIdx = heroes.length - 1;
    } else {
        currentImgIdx--;
    }

    resetAnimationState();

    $imgElement.show("slide", { direction: "left", }, moveDelay);
    $imgElement.hide("slide", { direction: "right", }, moveDelay);
    console.log('moving left');

    mainImgFtn(`${heroes[currentImgIdx].image}`);
})

function resetAnimationState() {
    $imgElement.stop(true, true);
    cancelAnimationFrame(landingSlideAnimation);
    $imgElement.css('display', 'block');
}


// Event listener for the resume button
$resume.click(function () {

    const now = Date.now();
    if (now - slideLastClickTime <= slideDelay) {
        const nowInMilliseconds = Date.now();
        const nowInSeconds = Math.floor(nowInMilliseconds / 1000);

        // Get the number of seconds past the last full minute
        let seconds = nowInSeconds % 60;
        console.log('Button clicked too soon, ignoring for..... ', nowInSeconds, 'secs');
        return;
    }

    // Update the last click time
    slideLastClickTime = now;
    isPauseClicked = false;

    console.log('resume clicked')
    if (!isAnimationRunning) {
        return;
    }

    isAnimationRunning = false;


    landingSlideAnimation = requestAnimationFrame(slideAnimationRace);


    $slideWait.addClass('hide');
    $resume.addClass('hide');
    $pause.removeClass('hide');

});
