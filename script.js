const HEADER_HEIGHT_PIXELS = 81;
const TOTAL_HEIGHT_OF_STICKY_HEADER_PIXELS = 110;

window.addEventListener('scroll', () => {
    Array.from(document.getElementsByClassName('section-grid')).forEach(function (section) {
        let sectionPosition = section.getBoundingClientRect();

        let sectionHeader = section.querySelector('.section-header:not(.sticky)');
        let sectionHeaderPosition = sectionHeader.getBoundingClientRect();
        let stickyHeader = sectionHeader.parentElement.querySelector('.section-header.sticky') ?? null;

        let stickyHeaderShouldBeAdded = !stickyHeader
            && sectionHeaderPosition.top < HEADER_HEIGHT_PIXELS
            && sectionPosition.bottom >= HEADER_HEIGHT_PIXELS;

        let stickyHeaderShouldBeRemoved = stickyHeader
            && (sectionHeaderPosition.top >= HEADER_HEIGHT_PIXELS || sectionPosition.bottom < HEADER_HEIGHT_PIXELS);

        let stickyHeaderCreated = false;

        if (stickyHeaderShouldBeAdded) {
            stickyHeader = sectionHeader.cloneNode(true);
            stickyHeader.classList.add('sticky');
            stickyHeaderCreated = true;
        }

        if (stickyHeaderShouldBeRemoved) {
            stickyHeader.remove();

            return;
        }

        let stickyHeaderShouldBeRepositioned = stickyHeader
            && sectionPosition.bottom <= HEADER_HEIGHT_PIXELS + TOTAL_HEIGHT_OF_STICKY_HEADER_PIXELS;

        if (stickyHeaderShouldBeRepositioned) {
            stickyHeader.style.top = `${sectionPosition.bottom - TOTAL_HEIGHT_OF_STICKY_HEADER_PIXELS}px`
        }

        if (stickyHeaderCreated) {
            sectionHeader.parentElement.prepend(stickyHeader);
        }
    })
})