// contants
var NUM_DIMENS = 4;
var PIXEL_SIZE = 600;
var PADDING = 5;

// set up method for drawing a rounded rect
// author @Grumdrig http://stackoverflow.com/a/7838871/485048
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
};

// game class
function Game(elem){
  // dom
  this.canvas = document.getElementById(elem);
  this.ctx = this.canvas.getContext("2d");
  // set canvas defaults
  this.canvas.width = PIXEL_SIZE;
  this.canvas.height = PIXEL_SIZE;
  this.ctx.font= "30px Arial";
  this.ctx.textBaseline="middle";
  // state variables
  this.board = [];
  this.numFreeSpaces = NUM_DIMENS * NUM_DIMENS;

  // create a tile at position with value
  this.createTile = function(x, y, value){
    this.board[x][y] = {
      value: 2
    };
  };

  // add a number at a random space
  this.addNumber = function(){
    // work out which nth free space to put the new tile in
    var where = Math.ceil(Math.random() * this.numFreeSpaces);
    // place the tile
    var cntr = 0;
    for(var x = 0; x < this.board.length; x++){
      for(var y = 0; y < this.board.length; y++){
        if(this.board[x][y] === null){
          cntr++;
          if(cntr == where){
            var num = (Math.random() < 0.5) ? 2 : 4;
            this.createTile(x, y, 2);
          }
        }
      }
    }
    // we now have one less free space
    this.numFreeSpaces--;
  };
  // draw the board
  this.render = function(){
    // draw background
    this.ctx.fillStyle = "#44bbff";
    this.ctx.fillRect(0, 0, PIXEL_SIZE, PIXEL_SIZE);
    // draw on item
    var size = PIXEL_SIZE / NUM_DIMENS - PADDING - (PADDING / NUM_DIMENS);
    for(var x = 0; x < this.board.length; x++){
      for(var y = 0; y < this.board.length; y++){
        // draw the background
        this.ctx.fillStyle = "#eee";
        var x_loc = PADDING + x * (size + PADDING);
        var y_loc = PADDING + y * (size + PADDING);
        this.ctx.roundRect(x_loc, y_loc, size, size, 10).fill();
        // draw the tile if it is there
        if(this.board[x][y] !== null){
          this.ctx.fillStyle = "#000";
          var txt = "" + this.board[x][y].value;
          var txtWidth = this.ctx.measureText(txt).width;
          this.ctx.fillText(txt, x_loc - txtWidth / 2 + size / 2, y_loc + size / 2);
        }
      }
    }
  };
  // setup function to clear the board
  this.clear = function(){
    // wipe the board
    this.board = [];
    this.numFreeSpaces = NUM_DIMENS * NUM_DIMENS;
    for(var cnt = 0; cnt < NUM_DIMENS; cnt++){
      var line = [];
      for(var cnt2 = 0; cnt2 < NUM_DIMENS; cnt2++){
        line.push(null);
      }
      this.board.push(line);
    }
    // add a single new tile
    this.addNumber();
    // draw the board
    this.render();
  };
  this.clear();
}

// set global handle
var game = null;
$(document).ready(function(){
  // start it onload
  game = new Game("board");
});
