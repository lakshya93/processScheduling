$app = angular.module('FCFSController', []);

$app.controller('FCFSCtrl', function($scope) {
	var canvas = new fabric.StaticCanvas('canvas');
	$scope.colorsList = colorsList;
	$("#step").prop('disabled', true);
	$scope.at = [];
	$scope.bt = [];
	var newLeft, topTimerPos, i;
	var p = [];
	var rq = [];
	var scheduledProcess = {};

	$scope.assignValues = function() {
		$scope.timer = 0;
		newLeft = 25;
		$scope.waitTime = 0;
		$scope.turnAroundTime = 0;
		topTimerPos = 128;
		p = [];
		rq = [];

		canvasReset(canvas);

		for(var j=0;j<$scope.numberOfProcs;j++) {
			p.push(new Process(j,Number($scope.bt[j]),Number($scope.at[j]),3,colorsList[j%5]));
			if(p[j].at <= $scope.timer) {
				rq.push(p[j]);
				p[j].executed = 1;
			}
		}

		scheduledProcess = drawRQ(canvas, rq);

		$("#step").prop('disabled', false);
	}

	$scope.runIt = function() {

		$("#step").prop('disabled', true);


		$scope.waitTime += $scope.timer - rq[0].at;

		$scope.timer += rq[0].bt;

		$scope.turnAroundTime += $scope.timer - rq[0].at;

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

						// if(rq[0].bt<2) {
						// 	if(topTimerPos==128)
						// 		topTimerPos=150;
						// 	else
						// 		topTimerPos=128;
						// }
						// else
						// 	topTimerPos=128;

						canvas.add(new fabric.Text($scope.timer.toString(), {
						  fill: rq[0].color,
						  fontSize: 23,
						  fontWeight: 'Bold',
						  left: newLeft-10,
						  top: topTimerPos
						}));

						rq.splice(0,1);

						for(var j=0; j<$scope.numberOfProcs; j++) {
							if(p[j].at <= $scope.timer && !p[j].executed) {
								rq.push(p[j]);
								rq.sort(compareBy('at'));
								p[j].executed = 1;
							}
						}

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
