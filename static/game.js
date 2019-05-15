var start = document.getElementById("start");
var c = document.getElementById("playground");
var ctx = c.getContext("2d");

var id;
var radius = 25;
var growing = true;
var xVel = 0;
var yVel = 3;
var ballX = c.width/2;
var ballY = c.height/2;
var isDead = true;

var rectWidth = 100;
var rectHeight = 50;
var rects = [{'x':70,'y':20,'hp':1}]



var clear = function(e){
    ctx.clearRect(0, 0, c.width, c.height);
}

function blockCollision(rect){
    var distX = Math.abs(ballX - rect["x"]-rectWidth/2);
    var distY = Math.abs(ballY - rect["y"]-rectHeight/2);

    if (distX > (rectWidth/2 + radius)) { return false; }
    if (distY > (rectHeight/2 + radius)) { return false; }

    if (distX <= (rectWidth/2)) { return true; }
    if (distY <= (rectHeight/2)) { return true; }

    var dx=distX-rectWidth/2;
    var dy=distY-rectHeight/2;
    return (dx*dx+dy*dy<=(radius*radius));
}


var dvdLogoSetup = function(){
  window.cancelAnimationFrame(id);




  //var xVel = 1;
  //var yVel = 2;

  var dvd_mover = function(){
    window.cancelAnimationFrame(id);
    clear();
    //ctx.fillRect( ballX, ballY, rectWidth, rectHeight);
    //ctx.fillRect(ballX, ballY, rectWidth, rectHeight)
    ctx.fillStyle = "red";
    for(i=0; i<rects.length; i++){
      block = rects[i];
      if(block["hp"]>0){
      if(blockCollision(block)){
        ctx.fillStyle = "green";
        block["hp"]--;
        xVel*=-1;
        yVel*=-1;
      }
      ctx.fillRect(block["x"],block["y"], rectWidth, rectHeight);
    }
    }

    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(ballX,ballY-radius,radius,0,2*Math.PI);
    ctx.stroke();
    ctx.fill();
    ballX += xVel;
    ballY += yVel;

    if(ballX - radius <= 0 || ballX + radius >= c.width){
      xVel *= -1;
    }
    if(ballY - 2*radius <= 0){
      yVel *= -1;
    }
    if(ballY  >= c.height){
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
    xVel = e.offsetX - ballX;
    yVel = e.offsetY - ballY;
    var ratio = Math.sqrt(9/(xVel*xVel + yVel*yVel));
    console.log(xVel + " " + yVel);
    xVel *= ratio;
    yVel *= ratio;
    console.log(xVel + " " + yVel);
    isDead = false;
  }
  }
);

start.addEventListener("click", dvdLogoSetup);
