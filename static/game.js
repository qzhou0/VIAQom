var dvd = document.getElementById("start");
var c = document.getElementById("playground");
var ctx = c.getContext("2d");

var id;
var radius = 1;
var growing = true;

ctx.fillStyle = "blue";

var clear = function(e){
    ctx.clearRect(0, 0, c.width, c.height);
}

var dvdLogoSetup = function(){
  window.cancelAnimationFrame(id);
  var rectWidth = 100;
  var rectHeight = 50;

  var rectX = Math.floor(Math.random() * (c.width-rectWidth));
  var rectY =  Math.floor(Math.random() * (c.height-rectHeight));

  var xVel = 2;
  var yVel = 2;
  var logo = new Image();
  logo.src = "logo_dvd.jpg"

  var dvd_mover = function(){
    window.cancelAnimationFrame(id);
    clear();
    //ctx.fillRect( rectX, rectY, rectWidth, rectHeight);
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight)
    rectX += xVel;
    rectY += yVel;

    if(rectX <= 0 || rectX  + rectWidth >= c.width){
      xVel *= -1;
    }
    if(rectY <= 0 || rectY  + rectHeight >= c.height){
      yVel *= -1;
    }

    id = window.requestAnimationFrame(dvd_mover);
  }

  dvd_mover()
}

start.addEventListener("click", dvdLogoSetup);
