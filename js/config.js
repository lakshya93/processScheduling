$(".menu-toggle").click(function() {
		$("#wrapper").toggleClass("toggled");
});

function Process (id, bt, at, prior, color, executed) {
	this.id = id;
	this.bt = bt;
	this.at = at || 0;
	this.prior = prior || 0;
	this.color = color;
	this.executed = executed || 0;
}

var colorsList = [
	"rgb(191, 114, 116)",
	"rgb(114, 153, 191)",
	"rgb(144, 191, 114)",
	"rgb(191, 114, 188)",
	"rgb(191, 184, 114)",
	"rgb(197, 120, 93)"
];

function compareAt (a, b) {
  if (a.at < b.at)
     return -1;
  if (a.at > b.at)
    return 1;
  return 0;
}

function canvasReset(canvas) {
	canvas.clear();

	canvas.add(new fabric.Rect({
		left:25,
		top:200,
		stroke: '#f0f0f0',
		strokeWidth: 3,
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
		fill: '#000',
		width: 0,
		height: 50
	}).animate('width', -50, {
			onChange: canvas.renderAll.bind(canvas),
	  	duration: 250,
		  easing: fabric.util.ease.easeOutCubic
	}));

}

function drawRQ(canvas, rq) {

	var newLeft = 235;
	var pno = "P"+rq[0].id;

	canvas.add(new fabric.Rect({
		left: 180,
		top: 220,
		fill: '#000',
		width: 800,
		height: 50
	}));

	var cpugets = new fabric.Text(pno, {
		left: 180,
		top: 220,
		fill: rq[0].color,
		fontWeight: 'Bold',
		fontSize: 26
	});

	canvas.add(cpugets);

	for(var i=1; i<rq.length; i++) {
		pno = "P"+rq[i].id;
		canvas.add(new fabric.Text(pno, {
			left: newLeft,
			top: 220,
			fill: rq[i].color,
			fontWeight: 'Bold',
			fontSize: 26
		}));
		newLeft += 55;
	}

	cpugets.animate('left', 50, {
			onChange: canvas.renderAll.bind(canvas),
	  	duration: 1000,
		  easing: fabric.util.ease.easeOutCubic
	});
}