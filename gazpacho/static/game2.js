var start = document.getElementById("start");
var c = document.getElementById("playground");
var ctx = c.getContext("2d");
var stop = document.getElementById("stop");



var id;
var radius = 10;
var growing = true;
var xVel = 0;
var yVel = 3;
var ballX = c.width/2;
var ballY = c.height/2;
var isDead = true;

var rectWidth = 100;
var rectHeight = 50;
var rects = [{'x':70,'y':20,'hp':2, 'hit':false},{'x':170,'y':20,'hp':1, 'hit':false}]
var circles=[]


var clear = function(e){
    ctx.clearRect(0, 0, c.width, c.height);
}
var dot=function(x,y){
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
}
var coll = function(rect){
    // y collide
    var epsilonX=Math.abs(xVel);
    var epsilonY=Math.abs(yVel);
    dot(rect['x']-radius,rect['y']-radius);
    dot(rect['x']+radius+rectWidth,rect['y']+radius+rectHeight);
    dot(rect['x']-radius,rect['y']+radius+rectHeight);
    dot(rect['x']+radius+rectWidth,rect['y']-radius);
    dot(ballX,ballY);
    if ((ballY>rect['y']-radius &&
	 ballY<rect['y']+rectHeight+radius)){
	if (ballX>rect['x']-radius-epsilonX &&
	    ballX<rect['x']+rectWidth+radius+epsilonX){
	    
	    //yVel*=-1;
	    xVel*=-1;
	    rect['hit'] = true;
	    circles.push([ballX,ballY]);
	    return true;
	}
    }
    //x collide
    if ((ballX>rect['x']-radius &&
	 ballX<rect['x']+rectWidth+radius)){
	if (ballY>rect['y']-radius-epsilonY &&
	 ballY<rect['y']+rectHeight+radius+epsilonY){
	    //xVel*=-1;
	    yVel*=-1;
	    circles.push([ballX,ballY]);
	
	    rect['hit']=true;
	    return true;
	}
    }
    rect['hit']=false;
    
    return false;

}


var dvdLogoSetup = function(){
    window.cancelAnimationFrame(id);
    rects = [{'x':70,'y':20,'hp':1, 'hit':false},{'x':270,'y':70,'hp':1, 'hit':false}]



    //var xVel = 1;
    //var yVel = 2;

    var dvd_mover = function(){
	window.cancelAnimationFrame(id);
	clear();


	ballX += xVel;
	ballY += yVel;

	//ctx.fillRect( ballX, ballY, rectWidth, rectHeight);
	//ctx.fillRect(ballX, ballY, rectWidth, rectHeight)
	ctx.fillStyle = "red";
	for(i=0; i<rects.length; i++){
	    block = rects[i];
	    if(block["hp"]>0){
		if(coll(block)){
		    ctx.fillStyle = "white";
		    console.log('hp',block['hp']);
		    block["hp"]--;
		}
		if(block["hp"]>0){
		    ctx.fillRect(block["x"],block["y"], rectWidth, rectHeight);
		}
	    }
	}
	console.log('xvel',xVel,'yvel',yVel);


	
	ctx.fillStyle = "blue";
	ctx.beginPath();
	ctx.arc(ballX,ballY,radius,0,2*Math.PI);
	ctx.stroke();
	ctx.fill();


	
	if(ballX - radius <= 0 || ballX + radius >= c.width){
	    xVel *= -1;
	}
	else if(ballY - 2*radius <= 0){
	    yVel *= -1;
	}
	else if(ballY+radius>= c.height){
	    isDead = true;
	    xVel = 0;
	    yVel = 0;
	}

	for (i=0;i<circles.length;i++){
	    dot(circles[i][0],circles[i][1]);
	}


	id = window.requestAnimationFrame(dvd_mover);
    }

    dvd_mover()
}

c.addEventListener("click",function(e){
    console.log('click',xVel , ":x,y:" , yVel);
    if(isDead){
	xVel = e.offsetX - ballX;
	yVel = e.offsetY - ballY;
	var ratio = Math.sqrt(100/(xVel*xVel + yVel*yVel));
	console.log(xVel + ":x,y:" + yVel);
	xVel *= ratio;
	yVel *= ratio;
	console.log(xVel + ":x,y: " + yVel);
	isDead = false;
    }
});

//stop
var stopIt=function(){
  window.cancelAnimationFrame(id);
};

stop.addEventListener('click',stopIt);

start.addEventListener("click", dvdLogoSetup);
