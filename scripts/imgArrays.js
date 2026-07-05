// Each piece: { img, name, medium, category, date, link? }
//   category: '2d' | '3d' | 'electronic'
//   date: yyyymmdd
//   link: optional URL — if set, clicking the piece navigates here instead of
//         opening the image full-screen
let pieces = [
    // --- 2D work ---
    {
        img: '/assets/2d/tab-penny.jpg',
        name: 'etched pennies',
        medium: 'copper penny, asphaltum',
        category: '2d',
        date: 20240514
    },
    {
        img: '/assets/2d/tab-book.jpg',
        name: 'tab spomenik',
        medium: 'digital print, embossed tiny book',
        category: '2d',
        date: 20231217
    },
    {
        img: '/assets/2d/tab-spomenik-intaglio.jpg',
        name: 'tab spomenik',
        medium: 'copper plate intaglio',
        category: '2d',
        date: 20231217
    },
    {
        img: '/assets/2d/dark-is-the-night.jpg',
        name: 'dark is the night',
        medium: 'screen print',
        category: '2d',
        date: 20240118
    },
    {
        img: '/assets/2d/twoCabinets.PNG',
        name: 'two cabinets',
        medium: 'woodcut',
        category: '2d',
        date: 20231103
    },
    // { img: '/assets/2d/cabinetDoor.PNG', name: 'cabinetdDoor', medium: 'woodcut', category: '2d', date: null },
    {
        img: '/assets/2d/minimalistKitchen.JPG',
        name: 'minimalist kitchen',
        medium: 'woodcut',
        category: '2d',
        date: 20231011
    },
    {
        img: '/assets/2d/qqq.PNG',
        name: '���',
        medium: 'lithograph',
        category: '2d',
        date: 20231103
    },
    {
        img: '/assets/2d/theTeacherIs.png',
        name: 'the teacher is ofcourse an artist',
        medium: 'risograph',
        category: '2d',
        date: 20230418
    },
    {
        img: '/assets/2d/ec9.png',
        name: 'empty classrooms #9',
        medium: 'acrylic on canvas',
        category: '2d',
        date: 20230518
    },
    {
        img: '/assets/2d/ec10.png',
        name: 'empty classrooms #10',
        medium: 'acrylic on canvas',
        category: '2d',
        date: 20230518
    },
    {
        img: '/assets/2d/ec11.png',
        name: 'empty classrooms #11',
        medium: 'acrylic on panel',
        category: '2d',
        date: 20230518
    },
    {
        img: '/assets/2d/chrisBoard.jpg',
        name: 'unlucky',
        medium: 'spray paint',
        category: '2d',
        date: 20220512
    },

    // --- 3D work ---
    {
        img: '/assets/3d/semel.png',
        name: 'סֵמֶל (semel)',
        medium: 'hardwood, riso on dictionary paper',
        category: '3d',
        date: 20230519
    },
    {
        img: '/assets/3d/hearTheMovement.png',
        name: 'hear the movement',
        medium: 'rfid balaklava',
        category: '3d',
        date: 20221203
    },
    {
        img: '/assets/3d/boat.JPG',
        name: 'boat',
        medium: 'wood, metal, electric motor',
        category: '3d',
        date: 20221210
    },
    {
        img: '/assets/3d/redwoodPipe.JPG',
        name: 'redwood pipe',
        medium: 'hand carved redwood',
        category: '3d',
        date: 20230630
    },
    {
        img: '/assets/3d/lumbarPipe.JPG',
        name: 'lumbar pipe',
        medium: 'preasure treated lumbar',
        category: '3d',
        date: 20230630
    },
    {
        img: '/assets/3d/dinnerTable.JPG',
        name: 'dinner table',
        medium: 'found logs, plastic bags, plates and cutlery',
        category: '3d',
        date: 20230314
    },
    {
        img: '/assets/3d/forYou.jpg',
        name: 'for you',
        medium: 'digital photograph',
        category: '3d',
        date: 20230913
    },
    {
        img: '/assets/3d/soundbox.jpg',
        name: 'soundbox',
        medium: 'acrylic, arduino, p5 sketch',
        category: '3d',
        date: 20220505
    },
    {
        img: '/assets/3d/walkInTheForest.JPG',
        name: 'a walk in the forest',
        medium: 'woodcut prints, charcoal on cardstock',
        category: '3d',
        date: 20231116
    },
    {
        img: '/assets/3d/thisBox.jpg',
        name: 'this box will make you sexy',
        medium: 'acrylic, printed acetate, LEDs',
        category: '3d',
        date: 20221023
    },
    {
        img: '/assets/3d/waves.jpg',
        name: 'waves',
        medium: 'wooden toy',
        category: '3d',
        date: 20220517
    },

    // --- Electronic work ---
    {
        img: '/assets/electronic/penny-space.jpg',
        name: '$10.89',
        medium: 'pennies organized via umap',
        category: 'electronic',
        date: 20241126
    },
    {
        img: '/assets/electronic/liminal.gif',
        name: 'liminal (2024)',
        medium: 'website',
        category: 'electronic',
        date: 20240101
    },
    {
        img: '/assets/electronic/morii.gif',
        name: 'morii (2023)',
        medium: 'website',
        category: 'electronic',
        date: 20230101
    },
    {
        img: '/assets/electronic/noisySquare.png',
        name: 'noisy square',
        medium: 'p5 sketch',
        category: 'electronic',
        date: 20221025
    },
    {
        img: '/assets/electronic/chimes.gif',
        name: 'chimes',
        medium: 'grasshopper data visualization',
        category: 'electronic',
        date: 20221023
    },
    {
        img: '/assets/electronic/circuit.png',
        name: 'circuit',
        medium: 'p5 sketch',
        category: 'electronic',
        date: 20221025
    },
    {
        img: '/assets/electronic/selfPortrait.jpg',
        name: 'self portrait',
        medium: 'p5 sketch',
        category: 'electronic',
        date: 20220505
    },
    {
        img: '/assets/electronic/scales.png',
        name: 'scales',
        medium: 'grasshopper model',
        category: 'electronic',
        date: 20221023
    },
    {
        img: '/assets/electronic/soundRandomness.gif',
        name: 'parametric #1',
        medium: 'p5 sketch',
        category: 'electronic',
        date: 20220505
    }
];

// display labels for each category, in the order they should appear when sorting by type
const categoryLabels = {
    '2d': '2D work',
    '3d': '3D work',
    'electronic': 'Electronic work'
};