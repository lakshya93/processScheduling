$app = angular.module('PREPRIORController', []);

$app.controller('PREPRIORCtrl', function($scope) {
	var canvas = new fabric.StaticCanvas('canvas');
	$scope.colorsList = colorsList;
	$("#step").prop('disabled', true);
	$scope.at = [];
	$scope.bt = [];
	$scope.prior = [];
	var newLeft, topTimerPos;
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
			p.push(new Process(j,Number($scope.bt[j]),Number($scope.at[j]),Number($scope.prior[j]),colorsList[j%5]));
			if(p[j].at <= $scope.timer) {
					rq.push(p[j]);
					p[j].executed = 1;
					p[j].arrived = 1;
				}
		}

		rq.sort(compareBy("prior"));

		scheduledProcess = drawRQ(canvas, rq);

		$("#step").prop('disabled', false);
	}

	$scope.runIt = function() {

		$("#step").prop('disabled', true);


		var burstLength = chooseBurstPrePrior(p,rq,$scope.timer);
		rq[0].bt -= burstLength;
		burstLength*=30;

		$scope.timer += burstLength/30;

		if(rq.length)
		for(var i=1;i<rq.length;i++)
			$scope.waitTime += burstLength/30;

		if(rq[0].bt === 0)
			$scope.turnAroundTime += $scope.timer - rq[0].at;

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

						if(rq[0].bt === 0) {
							rq.splice(0,1);
						}

						for(var j=0; j<$scope.numberOfProcs; j++) {
							if(p[j].at <= $scope.timer && !p[j].arrived) {
								rq.push(p[j]);
								p[j].arrived = 1;
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
