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

const heroes = [
    { id: 1, title: "Inspire and Transform Your Body with", image: "./resources/images/ff01.jpg" },
    { id: 2, title: "Explore and Discover New Levels with ", image: "./resources/images/ff02.jpg" },
    { id: 3, title: "Unleash Your Potentials with ", image: "./resources/images/ff03.jpg" },
    { id: 4, title: "Fuel Your Body, Transform Your Life with ", image: "./resources/images/ff04.jpg" },
    { id: 5, title: "Unleash Your Potentials with ", image: "./resources/images/ff05.jpg" },
    { id: 6, title: "Fuel Your Body, Transform Your Life with ", image: "./resources/images/ff06.jpg" }
];

const img = heroes[currentImgIdx].image;
