$("#menubtn").hide();
$(".menu-toggle").click(function() {
	$("#wrapper").toggleClass("toggled");
	$("#menubtn").toggle();
});

function Process (id, bt, at, prior, color, executed) {
	this.id = id;
	this.bt = bt;
	this.at = at || 0;
	this.prior = prior || 0;
	this.color = color;
	this.executed = executed || 0;
	this.arrived = 0;
	this.wt = 0;
	this.tt = 0;
}

// var colorsList = [
// 	"rgb(191, 114, 116)",
// 	"rgb(114, 153, 191)",
// 	"rgb(144, 191, 114)",
// 	"rgb(191, 114, 188)",
// 	"rgb(191, 184, 114)",
// 	"rgb(197, 120, 93)"
// ];

var colorsList = [
	"rgb(231, 76, 60)",
	"rgb(52, 152, 219)",
	"rgb(26, 188, 156)",
	"rgb(241, 196, 15)",
	"rgb(155, 89, 182)",
	"rgb(211, 84, 0)"
];

function compareBy (ch) {
	return function (a, b) {
	  if (a[ch] < b[ch])
	     return -1;
	  if (a[ch] > b[ch])
	    return 1;
	  return 0;
	}
}

function canvasReset(canvas) {
	canvas.clear();

	canvas.add(new fabric.Rect({
		left:25,
		top:200,
		fill: '#081A2C',
		stroke: '#f0f0f0',
		strokeWidth: 2,
		width: 75,
		height: 75,
	}));
	canvas.add(new fabric.Text("C P U", {
	  fill: '#f0f0f0',
	  fontSize: 15,
	  fontWeight: 'Bold',
	  left: 45,
	  top: 275
	}));
	canvas.add(new fabric.Text("0", {
	  fill: '#f0f0f0',
	  fontSize: 23,
	  fontWeight: 'Bold',
	  left: 25,
	  top: 128
	}));
}

function clearCPU(canvas) {

	canvas.add(new fabric.Rect({
		left: 89,
		top: 215,
		fill: '#081A2C',
		width: 0,
		height: 50
	}).animate('width', -50, {
			onChange: canvas.renderAll.bind(canvas),
	  	duration: 500,
		  easing: fabric.util.ease.easeOutCubic
	}));

}

function drawRQ(canvas, rq) {

	var newLeft = 270;
	var pno = "P"+rq[0].id;

	canvas.add(new fabric.Rect({
		left: 200,
		top: 215,
		fill: '#081A2C',
		stroke: '#f0f0f0',
		strokeWidth: 2,
		width: 800,
		height: 50
	}));

	var scheduledProcess = new fabric.Text(pno, {
		left: 220,
		top: 222,
		fill: rq[0].color,
		fontWeight: 'Bold',
		fontSize: 26
	});

	canvas.add(scheduledProcess);

	for(var i=1; i<rq.length; i++) {
		pno = "P"+rq[i].id;
		canvas.add(new fabric.Text(pno, {
			left: newLeft,
			top: 222,
			fill: rq[i].color,
			fontWeight: 'Bold',
			fontSize: 26
		}));
		newLeft += 50;
	}

	return scheduledProcess;
}

function chooseBurstSRTF(p, rq, t) {
	var p1 = [];
	for(var i=0;i<p.length;i++) {
		if(!p[i].arrived)
			p1.push(p[i]);
	}
	if(p1.length>0) {
		p1.sort(compareBy("at"));
		i=0;

		while(i<p1.length && rq[0].bt-(p1[i].at-t)<=p1[i].bt){
			i++;
		}
		if(i===p1.length){
			return rq[0].bt;
		}
		else
			return p1[i].at - t;
	}
	else
		return rq[0].bt;
}


function chooseBurstPrePrior(p, rq, t) {
	var p1 = [];
	for(var i=0;i<p.length;i++) {
		if(!p[i].arrived)
			p1.push(p[i]);
	}
	if(p1.length>0) {
		i=0;

		while(i<p1.length && rq[0].prior <= p1[i].prior){
			i++;
		}
		if(i===p1.length){
			return rq[0].bt;
		}
		else
			return p1[i].at - t;
	}
	else
		return rq[0].bt;
}


function init($scope)
{
	$scope.timer = 0;
	$scope.waitTime = 0;
	$scope.turnAroundTime = 0;
	$scope.wt = [];
	$scope.tt = [];
	//for(var i=0;i<$scope.numberOfProcs;i++)
	$scope.et = ['X','X','X','X','X','X','X','X','X','X'];
	$scope.st = ['X','X','X','X','X','X','X','X','X','X'];
	$scope.exec = [0,0,0,0,0,0,0,0,0,0];
	newLeft = 25;
	topTimerPos = 128;
	p = [];
	rq = [];
}

function setStepDisplayInfo($scope, rq)
{
	var curId = rq.id;
	p[curId].wt = $scope.timer - p[curId].at;

	$scope.wt[curId] = p[curId].wt;
	$scope.at[curId] = p[curId].at;
	$scope.st[curId] = $scope.timer;

	$scope.waitTime += $scope.timer - rq.at;

	$scope.timer += rq[0].bt;

	$scope.turnAroundTime += $scope.timer - rq.at;

	p[curId].tt = $scope.timer - p[curId].at;
	$scope.tt[curId] = p[curId].tt;
	$scope.et[curId] = $scope.timer;
}
