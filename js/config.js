function Process (bt, at, prior, color, executed) {
	this.bt = bt;
	this.at = at || 0;
	this.prior = prior;
	this.color = color;
	this.executed = executed || 0;
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

function compareAt (a,b) {
  if (a.at < b.at)
     return -1;
  if (a.at > b.at)
    return 1;
  return 0;
}