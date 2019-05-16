var dvd = document.getElementById("start");
var c = document.getElementById("playground");
var ctx = c.getContext("2d");

var width=c.width;
var height=c.height;
var blocks=9;
var numrows=12;
var iconst=width/blocks;
var jconst=height/numrows;
// var empty=[];
// var i=0;
// while (i<blocks){
//     var j=0;
//     while (j<numrows){
// 	empty.push([i*iconst,j*jconst]);
// 	j+=1;
//     }
//     i+=1
// }
//console.log(empty);

var clear = function(e){
    ctx.clearRect(0, 0, c.width, c.height);
}
var filled=[];
var grid = function(){
    clear();
    var i = 0;
    while (i<filled.length){
	//console.log(empty[i][0],empty[i][1]);
	ctx.fillStyle="red";
	ctx.fillRect(filled[i][0],filled[i][1],iconst,jconst);
	i+=1;
    }
};

var down=function(){
    for (i=0;i<filled.length;i++){
	filled[i][1]+=jconst;
    }
};
var newRow=function(range=1){//each time this is called, refreshes board with the addition of boards in RANGE rows, and all other rows move down
    var rate=0.5;
    down()
    for (j=0;j<range;j++){
	
	for (i=0;i<blocks;i++){
	    if (!([i*iconst,j*jconst] in filled)){
		if (Math.random()>rate){
		    filled.push([i*iconst,j*jconst]);
		}
	    }
	}
    }
    grid()
};
