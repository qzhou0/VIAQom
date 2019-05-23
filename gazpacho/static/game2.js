var start = document.getElementById("start");
var c = document.getElementById("playground");
var ctx = c.getContext("2d");
//var stop = document.getElementById("stop");

//variables
var blocks=9;
var numrows=20;
var radius = 10;
var block_fertility=.3;

var loss = false;
var id;

var growing = true;
var xVel = 0;
var yVel = 10;
var ballX = c.width/2;
var ballY = c.height/2;
var isDead = false;
var canHitX = true;
var canHitY = true;

var blockid=0;



var width=c.width;
var height=c.height;

var rectWidth = width/blocks;
var rectHeight =height/numrows;

var rects = []//[{'x':70,'y':20,'hp':2, 'hit':false},{'x':170,'y':20,'hp':1, 'hit':false}]
var rectCoors=[]

var grid = function(){
    //clear();
    var i = 0;
    while (i<rects.length){
	//console.log(empty[i][0],empty[i][1]);
	ctx.fillStyle="red";
	ctx.fillRect(rects[i]['x'],rects[i]['y'],rectWidth,rectHeight);
	i+=1;
    }
};
var down=function(){
    for (i=0;i<rects.length;i++){
	rects[i]['y']+=rectHeight;
	rectCoors[i][1]+=rectHeight;
    }
};
var newRow=function(range=1){//each time this is called, refreshes board with the addition of boards in RANGE rows, and all other rows move down
    var rate=block_fertility;
    down()
    var countadded=0;
    for (j=0;j<range;j++){

	for (i=0;i<blocks;i++){
	    if (!([i*rectWidth,j*rectHeight] in rectCoors)){
		if (Math.random()<rate){
		    d={};
		    d['id']=blockid;
		    d['hp']=1+ Math.floor(2*Math.random());
		    d['x']=i*rectWidth;
		    d['y']=j*rectHeight;

		    d['hit']=false;
		    countadded++;
		    blockid++;
		    rects.push(d);
		    rectCoors.push([d['x'],d['y']]);
		}
	    }
	}
    }
    console.log('added ',countadded);
    //grid();
};


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
    // dot(rect['x']-radius,rect['y']-radius);
    // dot(rect['x']+radius+rectWidth,rect['y']+radius+rectHeight);
    // dot(rect['x']-radius,rect['y']+radius+rectHeight);
    // dot(rect['x']+radius+rectWidth,rect['y']-radius);
    // dot(ballX,ballY);
    if ((ballY>rect['y']-radius &&
	 ballY<rect['y']+rectHeight+radius)){
	if (ballX>rect['x']-radius-epsilonX &&
	    ballX<rect['x']+rectWidth+radius+epsilonX){

	    //yVel*=-1;
      if(canHitX){
	    xVel*=-1;
      }
	    rect['hit'] = true;
      canHitX = false;
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
      if(canHitY){
	       yVel*=-1;
      }
	    circles.push([ballX,ballY]);

	    rect['hit']=true;
      canHitY = false;
	    return true;
	}
    }
    rect['hit']=false;

    return false;

}


var dvdLogoSetup = function(){
    window.cancelAnimationFrame(id);
    rects = [];



    //var xVel = 1;
    //var yVel = 2;

    var dvd_mover = function(){
	window.cancelAnimationFrame(id);
	clear();


	ballX += xVel;
	ballY += yVel;
  canHitX = true;
  canHitY = true;
	//ctx.fillRect( ballX, ballY, rectWidth, rectHeight);
	//ctx.fillRect(ballX, ballY, rectWidth, rectHeight)
	ctx.fillStyle = "red";
	toRemove=[]
	for(i=0; i<rects.length; i++){
      
	    block = rects[i];
	    //if(block["hp"]>0){
	    if (block['hp']<=0){
		rects.pop(i);
		rectCoors.pop(i);
		continue;
	    }
	    else if(coll(block)){
		ctx.fillStyle = "green";
		console.log('hp',block['hp'],'xy',block['x'],block['y']);
		block["hp"]--;
		console.log(block['id'], ' hit!');
	    }
	    hp=block['hp'];
	    if(hp>0){
		if (hp==1){
		    ctx.fillStyle='red';
		}
		else if (hp==2){
		    ctx.fillStyle='purple';
		}
		else{
		    ctx.fillStyle='black';
		}
		ctx.fillRect(block["x"],block["y"], rectWidth, rectHeight);
	    }
	    else{
		ctx.fillRect(block["x"],block["y"], rectWidth, rectHeight);
		toRemove.push(i);

	    }
	    //}
	}
	while (toRemove.length!=0){
	    var j=toRemove.pop();
	    rects.splice(j,1);
	    rectCoors.splice(j,1);
	}
	//console.log('xvel',xVel,'yvel',yVel);



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
	else if(ballY+radius+yVel>= c.height){
	    if (! isDead){
		newRow();
		console.log(rects);
	    }
	    isDead = true;
	    xVel = 0;
	    yVel = 0;


	}

	//for (i=0;i<circles.length;i++){
	//    dot(circles[i][0],circles[i][1]);
	//}


	id = window.requestAnimationFrame(dvd_mover);
    }

    dvd_mover()
}

c.addEventListener("click",function(e){
    //console.log('click',xVel , ":x,y:" , yVel);
    if(isDead){

	xVel = e.offsetX - ballX;
	yVel = e.offsetY - ballY;
	var ratio = Math.sqrt(100/(xVel*xVel + yVel*yVel));
	//console.log(xVel + ":x,y:" + yVel);
	xVel *= ratio;
	yVel *= ratio;
	//console.log(xVel + ":x,y: " + yVel);
	isDead = false;
    }
});

//stop
var stopIt=function(){
  window.cancelAnimationFrame(id);
};

//stop.addEventListener('click',stopIt);

start.addEventListener("click", dvdLogoSetup);
