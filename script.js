const HEADER_HEIGHT_PIXELS = 81;

window.addEventListener('scroll', () => {
    Array.from(document.getElementsByClassName('section-grid')).forEach(function (section) {
        let sectionPosition = section.getBoundingClientRect();
        let sectionHeader = section.getElementsByClassName('section-header');

        if (!sectionHeader.length) {
            return;
        }

        sectionHeader = sectionHeader[0];

        sectionPosition.top < HEADER_HEIGHT_PIXELS
            ? sectionHeader.classList.add('sticky')
            : sectionHeader.classList.remove('sticky');
    })
})