function Cell(src){
	this.src=src;
}
Cell.prototype={
	IMGS:{
		Blue:"img/blue.png",
		Red:"img/red.png",
		Green:"img/green.png",
		Yellow:"img/yellow.png",
		Pink:"img/pink.png"
	}
}
function Blue(){
	Cell.call(this,this.IMGS.Blue);
}
Object.setPrototypeOf(Blue.prototype,Cell.prototype);
function Red(){
	Cell.call(this,this.IMGS.Red);
}
Object.setPrototypeOf(Red.prototype,Cell.prototype);
function Yellow(){
	Cell.call(this,this.IMGS.Yellow);
}
Object.setPrototypeOf(Yellow.prototype,Cell.prototype);
function Green(){
	Cell.call(this,this.IMGS.Green);
}
Object.setPrototypeOf(Green.prototype,Cell.prototype);
function Pink(){
	Cell.call(this,this.IMGS.Pink);
}
Object.setPrototypeOf(Pink.prototype,Cell.prototype);