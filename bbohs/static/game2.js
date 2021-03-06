var start = document.getElementById("start");
var c = document.getElementById("playground");
var ctx = c.getContext("2d");
var comm = document.getElementById("comm");
var haul = document.getElementById("haul");

var upgrades=[[0,0],[0,0],[0,0],[0,0]];
var getInfo=function(){
    var xhttp=new XMLHttpRequest();
    var u;
    xhttp.onreadystatechange=function(){
	if (xhttp.readyState == 4) {
	    u=this.responseText;
	    console.log('getInfo called',u);
	    u=JSON.parse(u);
	    console.log('modified u',u);
	    upgrades=u;
	}
    };
    xhttp.open("POST","/",false);
    xhttp.send();

    return u;
};

getInfo();
console.log('upg',upgrades);
var extraBall=upgrades[0][1];
var explosiveBall=upgrades[1][1];
var rocketBall=upgrades[2][1];
var inMultiplier=upgrades[3][1];


var counter=0;
//variables
var blocks=15;
var numrows=15;
var radius = 10;
var block_fertility=.3;
var birthHP=3+extraBall*2+4*rocketBall;//max hp at birth
var maxHp = birthHP;
var blockGrowth=.2;//value of HP added each time it falls down
var lives=5;
var points=00000;

var loss = false;
var id;

var canHitX = true;
var canHitY = true;

var firstBall = true;

var width=c.width;
var height=c.height;

var rectWidth = width/blocks;
var rectHeight =height/numrows;

var X = 0;

var balls=[]
var ballid=1;
var blockid=0;
var rects = []//[{'id':,x':70,'y':20,'hp':2, 'hit':false},{'x':170,'y':20,'hp':1, 'hit':false}]
var rectCoors=[]

var addBall=function(n){
  rock=rocketBall;
    while (n>0){
      if(firstBall){
        xVel = 0;
        yVel = 10;
        x = c.width/2;
        y = c.height/2;
        firstBall = false;
      }
      else{
        x = balls[0]['x'];
        y = balls[0]['y'];
        xVel = balls[0]['xVel'];
  	    yVel = balls[0]['yVel'];
      }
	b2={'x':x,
	    'y':y,
	    'xVel':xVel,
	    'yVel':yVel,
	    'isDead':false,
	    'id':ballid,
	    'wait':ballid,
	    'type':'n'//for normal
	   };

  if (rock >0){
      b2['type']='r';//for rocket
      rock-=1;
  }


	balls.push(b2);
	n-=1;
	ballid+=1;
    }

}
addBall(1+extraBall);

var liveCount=balls.length;

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
var deductLife=function(){
    lives-=1;
    if (lives<=0){
	//window.cancelAnimationFrame(id);
	endGame();
    }
};
var down=function(){
    for (i=0;i<rects.length;i++){
	rects[i]['y']+=rectHeight;
	rectCoors[i][1]+=rectHeight;
	rects[i]['hp']+=blockGrowth;
	if (rects[i]['y']>=height-rectHeight){
	    console.log('deduct point at',rects['y'],height-rectHeight);
	    deductLife();
	}
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
		    d['hp']=1+ Math.floor(maxHP*Math.random());
		    d['x']=i*rectWidth;
		    d['y']=j*rectHeight;
		    d['points']=parseInt(Math.random()*20);
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
var coll = function(rect,ball){
    // y collide
    xVel=ball['xVel']
    yVel=ball['yVel']
    ballX=ball['x']
    ballY=ball['y']
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
		if (ball['type']!='r'){
		    ball['xVel']*=-1;
		}
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
		if (ball['type']!='r'){

		    ball['yVel']*=-1;
		}
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

    var skin = new Image();
    skin.src = "static/skin.png";

    document.getElementById('start').disabled=true;

    newGame();


    rects = [];



    //var xVel = 1;
    //var yVel = 2;

    var dvd_mover = function(){
	window.cancelAnimationFrame(id);
	clear();

	for (b=0;b<balls.length;b++){
	    ball=balls[b];
	    if(ball['wait'] > 0){
		ball['wait']--;
	    }else{
		ball['x'] += ball['xVel'];
		ball['y']+= ball['yVel'];
	    }
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
		else if(coll(block,ball)){
		    ctx.fillStyle = "green";
		    console.log('hp',block['hp'],'xy',block['x'],block['y']);
		    block["hp"]--;
		    console.log(block['id'], ' hit!');
		}
		hp=block['hp'];
		if(hp>0){
		  //   if(hp<=3){
			// ctx.fillStyle='cadetblue';
		  //   }
		  //   if(hp<=5){
			// ctx.fillStyle='red';
		  //   }
      //   else if (hp<10){
			// ctx.fillStyle='orange';
		  //   }
		  //   else if (hp<15){
			// ctx.fillStyle='yellow';
		  //   }
		  //   else if (hp<20){
			// ctx.fillStyle='green';
		  //   }
		  //   else if (hp<25){
			// ctx.fillStyle='blue';
		  //   }
		  //   else if (hp<30){
			// ctx.fillStyle='indigo';
		  //   }
		  //   else if (hp<35){
			// ctx.fillStyle='purple';
		  //   }
		  //   else{
			// ctx.fillStyle='black';
		  //   }
      ctx.fillStyle = 'rgb(' + Math.floor(255 - 42.5 * (hp-1)) + ', 14, 14)';
		    ctx.fillRect(block["x"],block["y"], rectWidth, rectHeight);
        ctx.drawImage(skin, block["x"],block["y"], rectWidth, rectHeight);
		}
		else{
		    ctx.fillRect(block["x"],block["y"], rectWidth, rectHeight);
		    points+=4*(1+inMultiplier)*(Math.exp(counter/(Math.max(20-counter,4))));
        X += 1;
		    toRemove.push(i);
      //   if(Math.random() > .3){
      //   comm.innerHTML = "" + Math.random()+'\n points:'+points;
      // }
		}
		while (toRemove.length!=0){
		    var j=toRemove.pop();
		    rects.splice(j,1);
		    rectCoors.splice(j,1);
		}
	    }

	}

	//console.log('xvel',xVel,'yvel',yVel);


	for (b=0;b<balls.length;b++){
	    ball=balls[b]
	    ctx.fillStyle = "blue";
      if(ball['type'] == 'r'){
        ctx.fillStyle = "red";
      }
	    ctx.beginPath();
	    ctx.arc(ball['x'],ball['y'],radius,0,2*Math.PI);
	    ctx.stroke();
	    ctx.fill();

	    // reflection
	    if(ball['x'] - radius <= 0 || ball['x'] + radius >= c.width){
		ball['xVel'] *= -1;
	    }
	    else if(ball['y'] - 2*radius <= 0){
		ball['yVel'] *= -1;
	    }
	    else if(ball['y']+radius+ball['yVel']>= c.height){
		if (liveCount==1 && !ball['isDead']){
		    counter+=1;
        newScenario();
		    newRow();
		    var ctr =parseInt(Math.log10(counter))-1;
		    while (ctr>0){
			newRow();
		    }

		    console.log(rects);
        ball['y']=c.height-radius;
    		ball['yVel']=ball['xVel']=0;
		}
		if (!ball['isDead']){
		    liveCount-=1;
		}
		ball['isDead'] = true;
    ball['y']=c.height-radius;
		//console.log(liveCount);
		ball['xVel'] = 0;
		ball['yVel'] = 0;
	    }
	    if (ball['y']<0){
		ball['y']=c.height-radius;
		ball['yVel']=ball['xVel']=0;
	    }
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
    if(liveCount==0){
	block_fertility+=0.01;
	maxHP+=0.04;
	for (b=0;b<balls.length;b++){
	    ball=balls[b];
	    ball['xVel'] = e.offsetX - ball['x'];
	    ball['yVel'] = e.offsetY - ball['y'];
	    var ratio = Math.sqrt(100/(ball['xVel']*ball['xVel'] + ball['yVel']*ball['yVel']));
	    //console.log(xVel + ":x,y:" + yVel);
	    ball['xVel'] *= ratio;
	    ball['yVel'] *= ratio;
      ball['wait'] = ball['id']*4;
	    //console.log(xVel + ":x,y: " + yVel);
	    ball['isDead'] = false;

	}
	liveCount=balls.length;
    }
    X = 0;
});

//stop
var stopIt=function(){
    window.cancelAnimationFrame(id);
};

var endGame=function(){



    window.cancelAnimationFrame(id);
    document.getElementById('start').disabled=false;
    clear();


    balls=[]
    ballid=1;
    blockid=0;
    rects = [];
    rectCoors=[];


    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
	if (xhttp.readyState == 4) {
	    console.log('done');
	}
    };
    xhttp.open("POST","/endgame");
    xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    points=parseInt(points);
    xhttp.send(encodeURIComponent('gains')+'='+encodeURIComponent(points));
    //window.cancelAnimationFrame(id);
    //clear();
};

//stop.addEventListener('click',stopIt);

start.addEventListener("click", dvdLogoSetup);

var ballsDown=function(){
    for (b=0;b<balls.length;b++){
	balls[b]['y']=height-radius;
	balls[b]['x']=width/2;
    }
}

var newScenario=function(){
  var keys = Object.keys(scenarios);
  var scenkey = keys[Math.floor(Math.random()*keys.length)];
  var input = scenkey.replace(/X/g, X)
  comm.innerHTML = input;
  if(scenkey[scenkey.length-1] == " "){
    points += scenarios[scenkey] + X;
  }
  else if (scenarios[scenkey] < 0) {
    points += scenarios[scenkey];
  }
  else{
    points += scenarios[scenkey]*X;
  }
  if(points < 0){
    points = 0;
  }
  haul.innerHTML = "" + Math.floor(points);
}

var newGame=function(){
    getInfo();

    extraBall=upgrades[0][1];
    explosiveBall=upgrades[1][1];
    rocketBall=upgrades[2][1];
    inMultiplier=upgrades[3][1];

    blocks=15;    numrows=15;
    radius = 10;
    block_fertility=.3;    blockGrowth=.2;
    maxHP=maxHP=3+extraBall*2+4*rocketBall;

    id=null;
    lives=5;    points=00000;

    counter=0;
    loss = false;

    canHitX = true;    canHitY = true;

    firstBall = true;

    width=c.width;    height=c.height;

    rectWidth = width/blocks;    rectHeight =height/numrows;

    balls=[];ballid=1;blockid=0;    rects = [];    rectCoors=[];

    addBall(1+extraBall);

    liveCount=balls.length;

};
