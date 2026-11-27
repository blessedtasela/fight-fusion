const player01Canvas = document.getElementById('player01');
// const ctx = player01Canvas.getContext('2d');

const $imgLanding = $('#img-landing');
const $slideWait = $('#slide-wait');
const $resume = $('#resume');
const $pause = $('#pause');
const $next = $('#next');
const $prev = $('#prev');
const $imgElement = $('.fixed-size')
let isMaxImg = false;
let isMinImg = false;
let isAnimationStarted = true;
let isAnimationRunning = false;
let isAnimationRight = false;
let isPauseClicked = null;
const minImg = 1;
const maxImg = 4;
const minIdx = 0;
const moveDelay = 2000;
const slideDelay = 4000;
let slideLastClickTime = 0;
let landingSlideAnimation;
let currentImgIdx = 0;

const $toggleMenu = $('#toggleMenu');
const $menu = $('#menu');
const $x = $('#x');
const $menuContents = $('#menu-contents');
const $navItems = $('#nav-items');
const $scrollToTop = $('#scroll-to-top');

// Carousel slides: screenshots of Fight Fusion itself (original artwork).
const heroes = [
    { id: 1, title: "Land a punch: get in range, then strike.", image: "./resources/screens/ff-punch.webp", alt: "Fight Fusion: the orange fighter punches, the blue fighter loses 1 life" },
    { id: 2, title: "Jump to clear a kick, crouch to duck a punch.", image: "./resources/screens/ff-kick.webp", alt: "Fight Fusion: the orange fighter jumps over a kick from the blue fighter" },
    { id: 3, title: "Save your combos: 3 damage, 15 per round.", image: "./resources/screens/ff-combo.webp", alt: "Fight Fusion: the orange fighter lands a combo for 3 damage" }
];

