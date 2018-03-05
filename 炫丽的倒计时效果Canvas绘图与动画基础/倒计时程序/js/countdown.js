var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;


var endTime = new Date();
endTime.setTime(endTime.getTime()+3600*1000);

var CurShowTimeSeconds = 0;

var balls = [];
const colors = ["#f3989b","#de98b8","#98a4de","#98dade","#989dde","#98debb","#a6de98","#ffc586","#ffc586","#23f3eb"]

;(function(){
	console.log(window.screen.availHeight);
	WINDOW_HEIGHT=document.documentElement.clientHeight-20;
	WINDOW_WIDTH=document.documentElement.clientWidth-20;

	MARGIN_LEFT = parseInt(WINDOW_WIDTH/10);
	RADIUS = Math.round(WINDOW_WIDTH*0.8/108)-1
	MARGIN_TOP = WINDOW_HEIGHT*0.1;


	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

	CurShowTimeSeconds = getCurShowTimeSeconds()

	var timer = setInterval(function(){
		
		render(ctx);
		update();
	},50)

	
})();

function render (ctx) {

	ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

	var hours = Math.floor(CurShowTimeSeconds/3600);
	var minutes = Math.floor(CurShowTimeSeconds/60%60);
	var seconds = Math.floor(CurShowTimeSeconds%60);

	renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10),ctx);
	renderDigit(MARGIN_LEFT+15*1*(RADIUS+1),MARGIN_TOP,(hours%10), ctx);
	renderDigit(MARGIN_LEFT+15*2*(RADIUS+1),MARGIN_TOP, 10 , ctx);

	renderDigit(MARGIN_LEFT+15*3*(RADIUS+1)-6*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10),ctx);
	renderDigit(MARGIN_LEFT+15*4*(RADIUS+1)-6*(RADIUS+1),MARGIN_TOP,(minutes%10), ctx);
	renderDigit(MARGIN_LEFT+15*5*(RADIUS+1)-6*(RADIUS+1),MARGIN_TOP, 10 , ctx);

	renderDigit(MARGIN_LEFT+15*6*(RADIUS+1)-12*(RADIUS+1), MARGIN_TOP, parseInt(seconds/10),ctx);
	renderDigit(MARGIN_LEFT+15*7*(RADIUS+1)-12*(RADIUS+1),MARGIN_TOP,(seconds%10), ctx);
	
	for(var i = 0; i< balls.length; i++){
		ctx.fillStyle = balls[i].color;
		ctx.beginPath();
		ctx.arc(balls[i].x, balls[i].y, RADIUS, 0, Math.PI*2);
		ctx.closePath();

		ctx.fill();
	}

}

function renderDigit(x, y, num, ctx) {
	for(var i = 0; i< digit[num].length; i++){
		for(var j = 0 ;j<digit[num][i].length; j++){
			if(digit[num][i][j] == 1){
				ctx.beginPath();
				ctx.arc(x+2*(RADIUS+1)*j+(RADIUS+1),y+2*(RADIUS+1)*i+(RADIUS+1),RADIUS,0,2*Math.PI);
				ctx.closePath();

				ctx.fillStyle = "rgb(0,102,153)";	
				ctx.fill()
			}
		}
	}
}

function getCurShowTimeSeconds() {
	var curTime = new Date();
	var remainTime = endTime.getTime() - curTime.getTime();
	remainTime = Math.round(remainTime/1000);

	return remainTime>0? remainTime:0;
}

function update(){
	var nextShowTimeSeconds = getCurShowTimeSeconds();

	var nexthours = Math.floor(nextShowTimeSeconds/3600);
	var nextminutes = Math.floor(nextShowTimeSeconds/60%60);
	var nextseconds = Math.floor(nextShowTimeSeconds%60);

	var curhours = Math.floor(CurShowTimeSeconds/3600);
	var curminutes = Math.floor(CurShowTimeSeconds/60%60);
	var curseconds = Math.floor(CurShowTimeSeconds%60);

	if(nextseconds != curseconds){
		if(parseInt(nexthours/10) != parseInt(curhours/10)){
			addballs(MARGIN_LEFT,MARGIN_TOP,parseInt(nexthours/10));
		}

		if(nexthours%10 != curhours%10){
			addballs(MARGIN_LEFT+15*1*(RADIUS+1),MARGIN_TOP,nexthours%10);
		}

		if(parseInt(nextminutes/10) != parseInt(curminutes/10)){
			addballs(MARGIN_LEFT+15*3*(RADIUS+1)-6*(RADIUS+1),MARGIN_TOP,parseInt(nextminutes/10));
		}
		if(nextminutes%10 != curminutes%10){
			addballs(MARGIN_LEFT+15*4*(RADIUS+1)-6*(RADIUS+1),MARGIN_TOP,nextminutes%10);
		}

		if(parseInt(nextseconds/10) != parseInt(curseconds/10)){
			addballs(MARGIN_LEFT+15*6*(RADIUS+1)-12*(RADIUS+1),MARGIN_TOP,parseInt(nextseconds/10));
		}
		if(nextseconds%10 != curseconds%10){
			addballs(MARGIN_LEFT+15*7*(RADIUS+1)-12*(RADIUS+1),MARGIN_TOP,nextseconds%10);
		}

		CurShowTimeSeconds = nextShowTimeSeconds;


	}


	updateBalls();
	console.log(balls.length);
}

function updateBalls(){

	var cnt = 0;
	for(var i = 0 ; i< balls.length; i++){
		if(balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH){
			balls[cnt++] = balls[i]
		}
	}

	while(balls.length > Math.min(300,cnt)) {
		balls.pop();
	}


	for(var i = 0; i < balls.length; i++){
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		if(balls[i].y >= WINDOW_HEIGHT - RADIUS){
			balls[i].y = WINDOW_HEIGHT - RADIUS;
			balls[i].vy = -balls[i].vy*0.75;
		}
	}


	
}


function addballs(x,y,num){
	for(var i = 0; i< digit[num].length; i++){
		for(var j = 0 ;j<digit[num][i].length; j++){
			if(digit[num][i][j] == 1){
				var aball = {
					x:x + j*2*(RADIUS+1)+(RADIUS+1),
					y:y + i*2*(RADIUS+1)+(RADIUS+1),
					g:1.5 + Math.random(),
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
					vy:-8,
					color:colors[Math.floor(Math.random()*colors.length)]
				}

				balls.push(aball);
			}
		}
	}
		
}