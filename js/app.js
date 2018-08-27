// Global movement modifiers from engine.js, where rows are multiplied by 83, and columns by 101

const rowSize = 83;
const colSize = 101;
const tileOffset = 56;

// Enemy Prototype

let Enemy = function(x,y,speed) {
    // Defines base x, y, and speed for each constructed enemy

    this.x = x;
    this.y = y + tileOffset;
    this.speed = speed;

    // The image/sprite for our enemies
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Defines the movable area for the enemies row movement
    if (this.x < colSize * 5) {
        this.x += this.speed * dt;
    }
    // loop the enemy back to the "off screen" position to start again
    else {
        this.x = -colSize;
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player
class Player {
    // Constructor
    constructor() {
        // properties
        this.InitialX = colSize * 2;
        this.InitialY = (rowSize * 4) + tileOffset;
        this.x = this.InitialX;
        this.y = this.InitialY;
        this.sprite = 'images/char-horn-girl.png';
    }
    // Check for if the player wins, and if not, if there is a collision
    update() {
        // Check for win
        if (this.y < tileOffset) {
            $('#winModal').modal('show');
            this.reset();
        // Check for collision if game is not won
        } else {
            for(let bug of allEnemies) {
                if (this.y === bug.y && (bug.x + 50 > this.x && bug.x < this.x + 50)) {
                    $('#loseModal').modal('show');
                    this.reset();
                }
            }
        }
    };
    // Render function for player sprite
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    // Check if player would still be on screen before allowing movement, to keep game contained
    handleInput(keyStroke) {
        // Checks if modals are open to prevent movement if they are
        if(!($("#winModal").data('bs.modal') || {})._isShown && !($("#loseModal").data('bs.modal') || {})._isShown) {
            // Moves the player on keypress if it is a valid move
            if (keyStroke === 'up') {
                if (this.y > 0) {
                    this.y -= rowSize;
                }
            } else if (keyStroke === 'down') {
                if (this.y < rowSize * 4) {
                    this.y += rowSize;
                }
            } else if(keyStroke === 'left') {
                if (this.x > 0) {
                    this.x -= colSize;
                }
            } else if (keyStroke === 'right') {
                if (this.x < colSize * 4) {
                    this.x += colSize;
                }
            // Alerts the player of invalid keypress, and what keys are valid
            } else {
                alert('Please use your arrow keys to move the character');
            }
        }
    };
    // reset player to starting position when game is won or player collides with a bug
    reset() {
        this.x = this.InitialX;
        this.y = this.InitialY;
    }
}

const allEnemies = [];
const enemy1 = new Enemy(-colSize, 0, 125);
const enemy2 = new Enemy(-colSize * 3, 0, 250);
const enemy3 = new Enemy(-colSize * 2, rowSize, 225);
const enemy4 = new Enemy(-colSize * 2, rowSize, 100);
const enemy5 = new Enemy(-colSize, rowSize * 2, 275);
const enemy6 = new Enemy(-colSize, rowSize * 2, 500);
allEnemies.push(enemy1, enemy2, enemy3, enemy4, enemy5, enemy6);
const player = new Player();

// This listens for key presses and sends the keys to the Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);

});
