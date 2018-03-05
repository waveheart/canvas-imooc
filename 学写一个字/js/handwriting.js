


;(function () {

	var ismousedown = false;
	var lastloc = {x:0,y:0};
	var lastTimestamp = 0;
	var lastLineWidth = -1;

	var strokeColor = "black";

	var canvasWidth = Math.min(800, $(window).width() - 20);
	var canvasHeight = canvasWidth;

	var canvas = $('#canvas')[0];
	var ctx = canvas.getContext('2d');

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;


	$('#controller').css('width', canvasWidth+'px');
	drawGrid();

	$('.color_btn').click(function(event) {
		$('.color_btn').removeClass('color_btn_selected');
		$(this).addClass('color_btn_selected');
		strokeColor = $(this).css('background-color');
	});

	$('#clear_btn').click(function(event) {
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		drawGrid();
	});

	function beginStroke(point){
		ismousedown = true;
		//console.log('down')
		lastloc = windowToCanvas(point.x, point.y);
		lastTimestamp = new Date().getTime();

	}

	function endStroke(){
		ismousedown = false;
	}

	function moveStroke(point){
		console.log('move')//
		var curTimestamp = new Date().getTime();
		var curloc = windowToCanvas(point.x, point.y);
		var s = calcDistance(curloc,lastloc);
		var t = curTimestamp - lastTimestamp;

		console.log(s,t);

		var lineWidth = calcLineWidth(t,s);
		console.log(lineWidth);

		//draw
		ctx.beginPath();
		ctx.moveTo(lastloc.x, lastloc.y);
		ctx.lineTo(curloc.x, curloc.y);

		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = lineWidth;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.stroke();
		
		lastloc = curloc;
		lastTimestamp = curTimestamp;
		lastLineWidth = lineWidth;
	}

	canvas.onmousedown = function(e){
		e.preventDefault();
		beginStroke({x:e.clientX, y:e.clientY});
		
	}
	canvas.onmouseup = function(e){
		e.preventDefault();
		endStroke();
		//console.log('up')
	}
	canvas.onmouseout = function(e){
		e.preventDefault();
		endStroke();
		//console.log('out')
	}
	canvas.onmousemove = function(e){
		e.preventDefault();
		if(ismousedown){
			moveStroke({x:e.clientX, y:e.clientY});

		}
	}

	canvas.addEventListener('touchstart',function (e) {
		e.preventDefault();
		touch = e.touches[0];
		beginStroke({x:touch.pageX, y:touch.pageY});
		
	})

	canvas.addEventListener('touchmove',function (e) {
		e.preventDefault();
		if(ismousedown){
			touch = e.touches[0];
			moveStroke({x:touch.pageX, y:touch.pageY});

		}
	})

	canvas.addEventListener('touchend',function (e) {
		e.preventDefault();
		endStroke();
	})

	var maxLineWidth = 30;
	var minLineWidth = 1;
	var maxStrokeV = 10;
	var minStrokeV = 0.1;


	function calcLineWidth(t,s){
		var v = s/t;
		console.log(v);

		var resultLinwidth;
		if(v<minStrokeV){
			resultLinwidth = maxLineWidth;
		}
		else if(v>=maxStrokeV){
			resultLinwidth = minLineWidth;
		}
		else{
			resultLinwidth = maxLineWidth - (maxLineWidth-minLineWidth)*(v-minStrokeV)/(maxStrokeV-minStrokeV)
		}

		if(lastLineWidth == -1){
			return resultLinwidth;
		}

		return lastLineWidth*2/3 + resultLinwidth*1/3;
	}

	function calcDistance(loc1,loc2){
		return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x)+(loc1.y-loc2.y)*(loc1.y-loc2.y))
	}

	function windowToCanvas(x,y){
		var bbox = canvas.getBoundingClientRect();
		return {x:Math.round(x-bbox.left), y:Math.round(y-bbox.top)}
	}

	function drawGrid(){
		ctx.save();

		ctx.strokeStyle = "rgb(230,11,9)";
		ctx.beginPath();
		ctx.lineWidth = 6;
		

		ctx.strokeRect(3, 3, canvasWidth-6, canvasHeight-6);
		ctx.stroke();


		ctx.lineWidth = 1;

		ctx.beginPath();

		ctx.moveTo(0, 0);
		ctx.lineTo(canvasWidth, canvasHeight);

		ctx.moveTo(canvasWidth, 0);
		ctx.lineTo(0, canvasHeight);

		ctx.moveTo(canvasWidth/2, 0);
		ctx.lineTo(canvasWidth/2, canvasHeight);

		ctx.moveTo(0, canvasHeight/2);
		ctx.lineTo(canvasWidth, canvasHeight/2);

		ctx.stroke();
		ctx.restore();
	}

})();

