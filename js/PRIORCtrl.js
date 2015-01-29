$app = angular.module('PRIORController', []);

$app.controller('PRIORCtrl', function($scope) {
	var canvas = new fabric.StaticCanvas('canvas');
	$scope.colorsList = colorsList;
	$("#step").prop('disabled', true);
	
	$scope.at = [];
	$scope.bt = [];
	$scope.prior = [];
	$scope.wt = [];
	$scope.tt = [];
	$scope.exec = [];
	$scope.et = ['X','X','X','X','X','X','X','X','X','X'];
	$scope.st = ['X','X','X','X','X','X','X','X','X','X'];

	var newLeft, topTimerPos;
	var p = [];
	var rq = [];
	var scheduledProcess = {};

	$scope.assignValues = function() {
		$scope.timer = 0;
		$scope.waitTime = 0;
		$scope.turnAroundTime = 0;
		$scope.wt = [];
		$scope.tt = [];
		$scope.et = ['X','X','X','X','X','X','X','X','X','X'];
		$scope.st = ['X','X','X','X','X','X','X','X','X','X'];
		$scope.exec = [];
		newLeft = 25;
		topTimerPos = 128;
		p = [];
		rq = [];

		canvasReset(canvas);

		for(var j=0;j<$scope.numberOfProcs;j++) {
			p.push(new Process(j,Number($scope.bt[j]),Number($scope.at[j]),Number($scope.prior[j]),colorsList[j%5]));
			if(p[j].at <= $scope.timer) {
					rq.push(p[j]);
					p[j].executed = 1;
				}
		}

		rq.sort(compareBy("prior"));

		scheduledProcess = drawRQ(canvas, rq);

		$("#step").prop('disabled', false);
	}

	$scope.runIt = function() {

		$("#step").prop('disabled', true);

		$scope.waitTime += $scope.timer - rq[0].at;

		var curId = rq[0].id;
		p[curId].wt = $scope.timer - p[curId].at;

		$scope.wt[curId] = p[curId].wt;
		$scope.at[curId] = p[curId].at;
		$scope.st[curId] = $scope.timer;

		$scope.timer += rq[0].bt;

		$scope.turnAroundTime += $scope.timer - rq[0].at;
		
		p[curId].tt = $scope.timer - p[curId].at;
		$scope.tt[curId] = p[curId].tt;
		$scope.et[curId] = $scope.timer;

		var burstLength = rq[0].bt*30;

		var bar = new fabric.Rect({
			left:newLeft,
			top:50,
			fill: rq[0].color,
			width: 0,
			height: 75,
		});

		canvas.add(bar);

		newLeft += burstLength+1;

		scheduledProcess.animate('left', 50, {
			onChange: canvas.renderAll.bind(canvas),
	  	duration: 500,
		  easing: fabric.util.ease.easeOutCubic,
		  onComplete: function(){
		  	bar.animate('width', burstLength, {
					onChange: canvas.renderAll.bind(canvas),
			  	duration: rq[0].bt*150,
				  easing: fabric.util.ease.easeOutCubic,
					onComplete: function(){

						canvas.add(new fabric.Text($scope.timer.toString(), {
						  fill: rq[0].color,
						  fontSize: 23,
						  fontWeight: 'Bold',
						  left: newLeft-10,
						  top: topTimerPos
						}));

						p[curId].executed = 1;
						$scope.exec[curId] = 1;

						rq.splice(0,1);

						for(var j=0; j<$scope.numberOfProcs; j++) {
							if(p[j].at <= $scope.timer && !p[j].executed) {
								rq.push(p[j]);
								rq.sort(compareBy("at"));
								p[j].executed = 1;
							}
						}

						rq.sort(compareBy("prior"));

						clearCPU(canvas);

						if(rq[0]) {
							scheduledProcess = drawRQ(canvas, rq);
							$("#step").prop('disabled', false);
						}
						else {
							scheduledProcess = drawRQ(canvas, rq);
						}
					}
				});
			}
		});
 	}

});
