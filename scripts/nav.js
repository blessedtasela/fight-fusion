$menu.click(function () {
    $navItems.slideToggle(800);
    $x.toggleClass('toggle-menu');
    $menu.toggleClass('hide');
})

$x.click(function () {
    $navItems.slideToggle(800);
    $x.toggleClass('toggle-menu');
    $menu.toggleClass('hide');
})

feather.replace();

$(window).scroll(function () {
    if ($(this).scrollTop() > 1500) {
        $scrollToTop.fadeIn();
    } else {
        $scrollToTop.fadeOut();
    }
});

// Smooth scroll to the top when button is clicked
$scrollToTop.click(function () {
    $('html, body').animate({ scrollTop: 0 }, 'smooth');
});

