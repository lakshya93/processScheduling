function Process (bt, at, prior, color) {
	this.bt = bt;
	this.at = at || 0;
	this.prior = prior;
	this.color = color;
	this.bar = new fabric.Rect({
		left:0,
		top:50,
		fill: this.color,
		width: 0,
		height: 75,
	});
}

var colorsList = [
	"rgb(191, 114, 116)",
	"rgb(114, 153, 191)",
	"rgb(144, 191, 114)",
	"rgb(191, 114, 188)",
	"rgb(191, 184, 114)",
	"rgb(197, 120, 93)"
];

$app = angular.module('pSchedulingControllers', []);

$app.filter('range', function() {
  return function(val, range) {
    range = parseInt(range);
    for (var i=0; i<range; i++)
      val.push(i);
    return val;
  };
});

$app.controller('FCFSCtrl', function($scope) {
	$scope.colorsList = colorsList;
	console.log($scope.colorsList);
	var canvas = new fabric.StaticCanvas('can');
	$scope.at = [];
	$scope.bt = [];
	var newLeft, topTimerPos, i;
	var p = [];
	$("#next").prop('disabled', true);

	$scope.assignValues = function() {
		$scope.timer = 0;
		newLeft = 25;
		$scope.waitTime = 0;
		$scope.turnAroundTime = 0;
		topTimerPos = 128;
		p = [];
		i=0;
		canvas.clear();

		for(var j=0;j<$scope.numberOfProcs;j++) {
			p.push(new Process(Number($scope.bt[j]),Number($scope.at[j]),3,colorsList[j%5]));
			canvas.add(p[j].bar);
		}
		canvas.add(new fabric.Text("0", {
		  fill: '#f0f0f0',
		  fontSize: 23,
		  fontFamily: 'Lucida Console',
		  fontWeight: 'Bold',
		  left: newLeft,
		  top: topTimerPos
		}));

		$("#next").prop('disabled', false);
	}

	$scope.runIt = function() {

		$("#next").prop('disabled', true);

		$scope.waitTime += $scope.timer;

		$scope.timer += p[i].bt;

		$scope.turnAroundTime += $scope.timer;

		var burstLength = p[i].bt*25;


		p[i].bar.set('left',newLeft);

		newLeft += p[i].bar.getWidth()+burstLength+1;

		p[i].bar.animate('width', burstLength, {
			onChange: canvas.renderAll.bind(canvas),
	  	duration: p[i].bt*150,
		  easing: fabric.util.ease.easeOutCubic,
			onComplete: function(){

				console.log(topTimerPos);

				if(p[i].bt<2) {
					if(topTimerPos==128)
						topTimerPos=150;
					else
						topTimerPos=128;
				}
				else
					topTimerPos=128;

				canvas.add(new fabric.Text($scope.timer.toString(), {
				  fill: p[i].color,
				  fontSize: 23,
				  fontFamily: 'Lucida Console',
				  fontWeight: 'Bold',
				  left: newLeft-10,
				  top: topTimerPos
				}));

				if(p[i+1]) {
					i++;
					$("#next").prop('disabled', false);
				}
			}
		});
 	}

});
