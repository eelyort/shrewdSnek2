// color scheme https://coolors.co/272d2d-a39ba8-b8c5d6-edf5fc-23ce6b

// button color of primative buttons
const buttonColor = "red";

// default fps
const defaultFPS = 30;
const subCanvasInnerSize = 2400;

// tick rate at which the evolving species are run
const speciesRunnerTickRate = 600;
// default scoring function, just returns score, no time sensitivity
const defaultScoreFunc = function (score, timeSinceLastApple) {
    return score;
};

// color of the snake
const snakeColor = "#ff00f2";

// color of the ded snake
const snakeDedColor = "#ff0000";

// color of the apple
const appleColor = "#000fff";

// id of the "gamePanel"
const gamePanelID = "gamePanel-1";
// id of the subCanvas
const subCanvasID = "snakeSubCanvas";

// max char count of snake names
const snakeNameChars = 32;

// max number of threads allowed
const maxNumThreads = 500;

// number of times per second the display for evolution updates
const evolutionUpdatePerSec = 1;

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