// color scheme https://coolors.co/272d2d-a39ba8-b8c5d6-edf5fc-23ce6b

// button color of primative buttons
const buttonColor = "red";

// default fps
const defaultFPS = 30;
const subCanvasInnerSize = 2400;

// tick rate
const defaultTickRate = 20;
// how fast showcase snakes are run
const showcaseTickRate = 80;

// tick rate at which the evolving species are run
const speciesRunnerTickRate = 600;
// default scoring function, just returns score, no time sensitivity
const defaultScoreFunc = function (score, timeSinceLastApple) {
    return score;
};

// timeout(len) = (gridSize * this + gridsize * length)
const timeoutInitMultiplier = 8;

// color of the snake
const snakeColor = "#66FCF1";

// color of the ded snake
const snakeDedColor = "#FF3A00";

// color of the apple
const appleColor = "#c3ff00";

// id of the "gamePanel"
const gamePanelID = "gamePanel-1";
// id of the subCanvas
const subCanvasID = "snakeSubCanvas";

// max char count of snake names
const snakeNameChars = 32;

// max number of threads allowed
const maxNumThreads = 500;

// number of times per second the display for evolution updates
const evolutionUpdatePerSec = 2;

// amount of decimal points to show for generation stats
const scoreDisplayPrecision = 3;

// details
// grid val to string
const decodeTargetVal = function (val) {
    switch (val) {
        case 1:
            return "Body";
        case 2:
            return "Apple";
    }
};
// outline min width for drawing the net -- to small and some parts r invisible
const minOutlineWidth = 12;
// outline width if it is bigger than above, percentage of square size
const outlinePercent = 0.13;
// weight lines
const weightLineWidth = 10;
// big number: darker, small: lighter
const weightLineOpacityMultiplier = 1.3;
const weightLineMinOpacity = 0.04;

// typewriter speed
const typeWriteSpeed = 3.5;

const deconstructRC = function(val, gridSize){
    let r = Math.floor(val / (gridSize+2));
    // minus one to account for the padding
    let c = val % (gridSize+2) - 1;

    return [r, c];
};

let collapsePrefSnek = [true, true, true, true];
let collapsePrefEvolution = [true, true, true, true, true];