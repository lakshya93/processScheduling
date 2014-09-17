$app = angular.module('FCFSController', []);

$app.controller('FCFSCtrl', function($scope) {
	$scope.colorsList = colorsList;
	var canvas = new fabric.StaticCanvas('canvas');
	$scope.at = [];
	$scope.bt = [];
	var newLeft, topTimerPos, i;
	var p = [];
	var rq = [];
	$("#step").prop('disabled', true);

	$scope.assignValues = function() {
		$scope.timer = 0;
		newLeft = 25;
		$scope.waitTime = 0;
		$scope.turnAroundTime = 0;
		topTimerPos = 128;
		p = [];
		rq = [];
		i=0;
		canvas.clear();

		for(var j=0;j<$scope.numberOfProcs;j++) {
			p.push(new Process(Number($scope.bt[j]),Number($scope.at[j]),3,colorsList[j%5]));
			canvas.add(p[j].bar);
			if(p[j].at <= $scope.timer) {
				rq.push(p[j]);
				p[j].executed = 1;
			}
		}

		canvas.add(new fabric.Text("0", {
		  fill: '#f0f0f0',
		  fontSize: 23,
		  fontWeight: 'Bold',
		  left: newLeft,
		  top: topTimerPos
		}));

		$("#step").prop('disabled', false);
	}

	$scope.runIt = function() {

		$("#step").prop('disabled', true);

		$scope.waitTime += $scope.timer - rq[0].at;

		$scope.timer += rq[0].bt;

		$scope.turnAroundTime += $scope.timer - rq[0].at;

		var burstLength = rq[i].bt*25;

		rq[i].bar.set('left',newLeft);

		newLeft += rq[i].bar.getWidth()+burstLength+1;

		rq[i].bar.animate('width', burstLength, {
			onChange: canvas.renderAll.bind(canvas),
	  	duration: rq[i].bt*150,
		  easing: fabric.util.ease.easeOutCubic,
			onComplete: function(){

				if(rq[i].bt<2) {
					if(topTimerPos==128)
						topTimerPos=150;
					else
						topTimerPos=128;
				}
				else
					topTimerPos=128;

				canvas.add(new fabric.Text($scope.timer.toString(), {
				  fill: rq[i].color,
				  fontSize: 23,
				  fontWeight: 'Bold',
				  left: newLeft-10,
				  top: topTimerPos
				}));

				rq.splice(0,1);

				for(var j=0; j<$scope.numberOfProcs; j++) {
					if(p[j].at <= $scope.timer && !p[j].executed) {
						rq.push(p[j]);
						rq.sort(compareAt);
						p[j].executed = 1;
					}
				}

				if(rq[0]) {
					$("#step").prop('disabled', false);
				}
			}
		});
 	}

});
