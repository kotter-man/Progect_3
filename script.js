const SMALL_SCREEN_MAX_SIZE = 768;
const MEDIUM_SCREEN_MAX_SIZE = 1000;

const SMALL_SCREEN = 'small';
const MEDIUM_SCREEN = 'medium';
const LARGE_SCREEN = 'large';

const STICKY_HEADER_CONFIG = {
    [MEDIUM_SCREEN]: {
        headerHeightPixels: 81,
        totalHeightOfStickyHeaderPixels: 110
    },
    [SMALL_SCREEN]: {
        headerHeightPixels: 50,
        totalHeightOfStickyHeaderPixels: 69
    }
}

function getCurrentWindowSize() {
    let windowInnerWidth = window.innerWidth;

    switch (true) {
        case windowInnerWidth > MEDIUM_SCREEN_MAX_SIZE:
            return LARGE_SCREEN
        case windowInnerWidth > SMALL_SCREEN_MAX_SIZE:
            return MEDIUM_SCREEN
        default:
            return SMALL_SCREEN
    }
}

function configForSizeExist(screenSize) {
    return STICKY_HEADER_CONFIG.hasOwnProperty(screenSize);
}

function getConfigForCurrentSize() {
    let currentWindowSize = getCurrentWindowSize();

    return configForSizeExist(currentWindowSize) ? STICKY_HEADER_CONFIG[currentWindowSize] : null;
}

function processResize() {
    let configForCurrentSize = getConfigForCurrentSize();

    return configForCurrentSize ? doStuff(configForCurrentSize) : removeAllStickyHeaders();
}

function removeAllStickyHeaders() {
    Array.from(document.getElementsByClassName('section-header sticky')).forEach(function (stickyHeader) {
        stickyHeader.remove();
    })
}

function doStuff(configForCurrentSize) {
    Array.from(document.getElementsByClassName('section-grid')).forEach(function (section) {
        let sectionPosition = section.getBoundingClientRect();

        let sectionHeader = section.querySelector('.section-header:not(.sticky)');
        let sectionHeaderPosition = sectionHeader.getBoundingClientRect();
        let stickyHeader = sectionHeader.parentElement.querySelector('.section-header.sticky') ?? null;

        let stickyHeaderShouldBeAdded = !stickyHeader
            && sectionHeaderPosition.top < configForCurrentSize.headerHeightPixels
            && sectionPosition.bottom >= configForCurrentSize.headerHeightPixels;

        let stickyHeaderShouldBeRemoved = stickyHeader
            && (sectionHeaderPosition.top >= configForCurrentSize.headerHeightPixels || sectionPosition.bottom < configForCurrentSize.headerHeightPixels);

        let stickyHeaderCreated = false;

        if (stickyHeaderShouldBeAdded) {
            stickyHeader = sectionHeader.cloneNode(true);
            stickyHeader.classList.add('sticky');
            stickyHeaderCreated = true;
        }

        if (stickyHeaderShouldBeRemoved) {
            removeAllStickyHeaders();

            return;
        }

        let stickyHeaderShouldBeRepositioned = stickyHeader
            && sectionPosition.bottom <= configForCurrentSize.headerHeightPixels + configForCurrentSize.totalHeightOfStickyHeaderPixels;

        if (stickyHeaderShouldBeRepositioned) {
            stickyHeader.style.top = `${sectionPosition.bottom - configForCurrentSize.totalHeightOfStickyHeaderPixels}px`
        }

        if (stickyHeaderCreated) {
            sectionHeader.parentElement.prepend(stickyHeader);
        }
    })
}

window.addEventListener('resize', processResize);


window.addEventListener('scroll', () => {
    let configForCurrentSize = getConfigForCurrentSize();

    if (!configForCurrentSize) {
        return;
    }

    doStuff(configForCurrentSize)
})