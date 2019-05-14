var dvd = document.getElementById("start");
var c = document.getElementById("playground");
var ctx = c.getContext("2d");

var id;
var radius = 25;
var growing = true;
var xVel = 1;
var yVel = 2;
var rectX = c.width/2;
var rectY = c.height/2;
var isDead = true;

ctx.fillStyle = "blue";

var clear = function(e){
    ctx.clearRect(0, 0, c.width, c.height);
}

var dvdLogoSetup = function(){
  window.cancelAnimationFrame(id);
  var rectWidth = 50;
  var rectHeight = 50;



  //var xVel = 1;
  //var yVel = 2;

  var dvd_mover = function(){
    window.cancelAnimationFrame(id);
    clear();
    //ctx.fillRect( rectX, rectY, rectWidth, rectHeight);
    //ctx.fillRect(rectX, rectY, rectWidth, rectHeight)
    ctx.beginPath();
    ctx.arc(rectX,rectY-radius,radius,0,2*Math.PI);
    ctx.stroke();
    ctx.fill();
    rectX += xVel;
    rectY += yVel;

    if(rectX - radius <= 0 || rectX + radius >= c.width){
      xVel *= -1;
    }
    if(rectY - 2*radius <= 0){
      yVel *= -1;
    }
    if(rectY  >= c.height){
      isDead = true;
      xVel = 0;
      yVel = 0;
    }

    id = window.requestAnimationFrame(dvd_mover);
  }

  dvd_mover()
}

c.addEventListener("click",
  function(e){
    if(isDead){
    xVel = e.offsetX - rectX;
    yVel = e.offsetY - rectY;
    var ratio = Math.sqrt(4/(xVel*xVel + yVel*yVel));
    console.log(xVel + " " + yVel);
    xVel *= ratio;
    yVel *= ratio;
    console.log(xVel + " " + yVel);
    isDead = false;
  }
  }
);

start.addEventListener("click", dvdLogoSetup);
