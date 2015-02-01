$app = angular.module('RROBINController', []);

$app.controller('RROBINCtrl', function($scope) {
	var canvas = new fabric.StaticCanvas('canvas');
	$scope.colorsList = colorsList;
	$("#step").prop('disabled', true);

	$scope.at = [];
	$scope.bt = [];
	$scope.wt = [];
	$scope.tt = [];
	$scope.exec = [0,0,0,0,0,0,0,0,0,0];
	$scope.et = ['X','X','X','X','X','X','X','X','X','X'];
	$scope.st = ['X','X','X','X','X','X','X','X','X','X'];

	$scope.burst;

	var newLeft, topTimerPos;
	var p = [];
	var rq = [];
	var scheduledProcess = {};

	$scope.assignValues = function() {
		$scope.timer = 0;
		$scope.waitTime = 0;
		$scope.turnAroundTime = 0;
		$scope.wt = [0,0,0,0,0,0,0,0,0,0];
		$scope.tt = [];
		$scope.et = ['X','X','X','X','X','X','X','X','X','X'];
		$scope.st = ['X','X','X','X','X','X','X','X','X','X'];
		$scope.exec = [0,0,0,0,0,0,0,0,0,0];

		$scope.burst = 0;

		newLeft = 25;
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
		p.sort(compareBy("at"));

		scheduledProcess = drawRQ(canvas, rq);

		$("#step").prop('disabled', false);
	}

	$scope.runIt = function() {

		$("#step").prop('disabled', true);

		var curId = rq[0].id;

		var burstLength = rq[0].bt>$scope.tq ? $scope.tq*30 : rq[0].bt*30;
		rq[0].bt -= burstLength/30;

		$scope.timer += burstLength/30;
		$scope.burst = burstLength/30;

		for(var i=1;i<rq.length;i++)
		{
			$scope.wt[rq[i].id] += burstLength/30;
			$scope.waitTime += burstLength/30;
		}

		if(rq[0].bt === 0)
		{
			$scope.tt[curId] = $scope.timer - rq[0].at;
			$scope.exec[curId] = 1;
			$scope.et[curId] = $scope.timer;
			$scope.turnAroundTime += $scope.timer - rq[0].at;
		}

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

						for(var j=0; j<$scope.numberOfProcs; j++) {
							if(p[j].at <= $scope.timer && !p[j].executed) {
								rq.push(p[j]);
								p[j].executed = 1;
								$scope.waitTime += $scope.timer - p[j].at;
							}
						}

						if(rq[0].bt === 0) {
							rq.splice(0,1);
						}
						else {
							var x=rq[0];
							rq.splice(0,1);
							rq.push(x);
						}

						for(var i=0; i<rq.length; i++)
						{
							if(rq[i].at > $scope.timer - burstLength/30)
							{
								$scope.wt[rq[i].id] = $scope.timer - rq[i].at;
								$scope.waitTime += $scope.timer - rq[i].at;
							}
						}
						
						clearCPU(canvas);

						if( rq[0].bt === 0 && rq.length === 1 ) {
							$("#step").prop('disabled', true);
							rq.splice(0,1);
						}

						scheduledProcess = drawRQ(canvas, rq);

						if( rq[0] )  {
							$("#step").prop('disabled', false);
						}
					}
				});
			}
		});
 	}
});
