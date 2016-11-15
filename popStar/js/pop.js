var pop={
	RN:10,
	CN:10,
	CSIZE:35,
	OFFSET:187,
	pg:null,
	cell:null,
	wall:null,
	select:null,
	score:0,
	target:1000,
	level:1,
	n:0,
	state:1,
	RUNNING:1,
	GAMEOVER:0,
	PAUSE:2,
	start:function(){
		console.log(this.score);
		this.state=this.RUNNING;
		this.pg=document.getElementsByClassName("playground")[0];
		document.getElementById("success").style.display='none';
		document.getElementById("fail").style.display='none';
		document.getElementById('bonus').innerHTML=null;
		this.wall=[];
		for(var r=0;r<this.RN;r++){
			this.wall[r]=[];
			for(var c=0;c<this.CN;c++){
				this.cell=this.randomCell();
				this.wall[r][c]=this.cell;
			}
		}
		console.log('2:'+this.score);
		this.paint();
		console.log(this.score);
		this.select=[];
		for(var r=0;r<this.RN;r++){
			this.select.push(new Array(this.CN));
		}
		document.ondblclick=this.deleteCells.bind(this);
	},
	randomCell:function(){
		var i=Math.floor(Math.random()*5);
		switch(i){
			case 0:return new Blue();
			case 1:return new Red();
			case 2:return new Green();
			case 3:return new Yellow();
			case 4:return new Pink();
		}
	},
	addLeft:function(r,c){
		if(this.select[r][c-1]||!this.wall[r][c-1]){
			return;
		}
		if(c>0&&this.wall[r][c-1].src==this.wall[r][c].src){
			this.select[r][c-1]=this.wall[r][c-1];
			this.n++;
			this.chooseCells(r,c-1);
		}
	},
	addRight:function(r,c){
		if(this.select[r][c+1]||!this.wall[r][c+1]){
			return;
		}
		if(c<this.CN-1&&this.wall[r][c+1].src==this.wall[r][c].src){
			this.select[r][c+1]=this.wall[r][c+1];
			this.n++;
			this.chooseCells(r,c+1);
		}
	},
	addUp:function(r,c){
		if(this.select[r-1]){
			if(this.select[r-1][c]){
				return;
			}
		}
		if(!this.wall[r-1]||!this.wall[r-1][c]){
			return;
		}
		if(r>0&&this.wall[r-1][c].src==this.wall[r][c].src){
			this.select[r-1][c]=this.wall[r-1][c];
			this.n++;
			this.chooseCells(r-1,c);
		}
	},
	addDown:function(r,c){
		if(this.select[r+1]){
			if(this.select[r+1][c]){
				return;
			}
		}
		if(!this.wall[r+1]||!this.wall[r+1][c]){
			return;
		}
		if(r<this.RN-1&&this.wall[r+1][c].src==this.wall[r][c].src){
			this.select[r+1][c]=this.wall[r+1][c];
			this.n++;
			this.chooseCells(r+1,c);
		}
	},
	chooseCells:function(r,c){
		this.addLeft(r,c);
		this.addRight(r,c);
		this.addUp(r,c);
		this.addDown(r,c);
	},
	chooseDeleteCells:function(r,c){
		this.select[r][c]=this.wall[r][c];
		this.n=1;
		this.chooseCells(r,c);
	},
	deleteCells:function(e){
		if(e.target.nodeName=="IMG"){
			var r=(parseFloat(getComputedStyle(e.target).top)-this.OFFSET)/this.CSIZE;
			var c=parseFloat(getComputedStyle(e.target).left)/this.CSIZE;
			this.chooseDeleteCells(r,c);
		}
		if(this.n<=1){
			this.select=[];
			for(var r=0;r<this.RN;r++){
				this.select.push(new Array(this.CN));
			}
			return;
		}
		for(var c=0;c<this.CN;c++){
			for(var r=0;r<this.RN;r++){
				if(this.wall[r][c]==this.select[r][c]){
					this.wall[r][c]=null;
				}
			}
		}
		this.fallDown();
		this.turnLeft();
		this.select=[];
		for(var r=0;r<this.RN;r++){
			this.select.push(new Array(this.CN));
		}
		this.paint();
		this.isOver();
	},
	fallDown:function(){
		for(var c=0;c<this.CN;c++){
			for(var r=this.RN-1;r>0;r--){
				if(this.wall[r][c]===null){
					for(var j=r;j>=0;j--){
						if(this.wall[j][c]!=null){break;}
					}
					if(j<0){break;}
					for(var i=r;i>0;i--){
						this.wall[i][c]=this.wall[i-1][c];
					}
					this.wall[0][c]=null;
					r++;
				}	
			}
		}
	},
	turnLeft:function(){
		for(var c=0;c<this.CN;c++){
			for(var m=c;m<this.CN;m++){
				for(var n=0;n<this.RN;n++){
					if(this.wall[n][m]){
						break;
					}
				}
				if(n!=this.RN){
					break;
				}
			}
			if(m==this.CN){
				return;
			}
			for(var r=0;r<this.RN;r++){
				if(this.wall[r][c]!=null){
					break;
				}
			}
			if(r==this.RN){
				for(var i=c;i<this.CN;i++){
					for(var j=0;j<this.RN;j++){
						this.wall[j][i]=this.wall[j][i+1];
					}
				}
				c--;
			}
		}
	},
	isOver:function(){
		for(var c=0;c<=this.CN;c++){
			for(var r=0;r<this.RN;r++){
				if(this.wall[r]){
					if(this.wall[r][c]){
						this.chooseDeleteCells(r,c);
						if(this.n!=1){
							this.select=[];
							for(var r=0;r<this.RN;r++){
								this.select.push(new Array(this.CN));
							}
							return;
						}
					}
				}
			}
		}
		if(this.score<this.target){
			this.restart();
		}else{
			this.levelUp();
		}
		//this.wall=[];
	},
	restart:function(){
		this.score=0;
		this.target=1000;
		this.level=1;
		document.getElementById("fail").style.display='block';
		setTimeout(this.start.bind(this),3000);
	},
	levelUp:function(){
		this.level++;
		this.target=1100*this.level-100;
		this.bonus();
		console.log(this.score);
		document.getElementById("success").style.display='block';
		setTimeout(this.start.bind(this),3000);
	},
	bonus:function(){
		var count=0;
		for(var r=0;r<this.RN;r++){
			if(this.wall[r]){
				for(var c=0;c<this.CN;c++){
					if(this.wall[r][c]){
						count++;
					}
				}
			}
		}
		if(count>=10){return;}
		var bonus=2000-count*count*20;
		if(bonus>0){
			this.score+=bonus;
			document.getElementById('bonus').innerHTML='+'+bonus;
			this.paintScore();
		}
	},
	paint:function(){
		this.pg.innerHTML=this.pg.innerHTML.replace(/<img\s[^>]+>/g,"");
		this.paintWall();
		this.paintScore();
		this.paintLevel();
	},
	paintLevel:function(){
		var level=document.getElementById('level');
		level.innerHTML=this.level;
		var target=document.getElementById('target');
		target.innerHTML=this.target;
	},
	paintScore:function(){
		if(this.n!=1) {
			this.score += this.n * this.n * 5;
		}
		var score=document.getElementById('score');
		score.innerHTML=this.score;
	},
	paintCell:function(cell,frag,r,c){
		var img=new Image();
		img.src=cell.src;
		img.style.width=this.CSIZE+"px";
		img.style.top=this.CSIZE*r+this.OFFSET+"px";
		img.style.left=this.CSIZE*c+"px";
		frag.appendChild(img);
		return img;
	},
	paintWall:function(){
		var frag=document.createDocumentFragment();
		for(var r=this.wall.length-1;r>=0;r--){
			for(var c=0;c<this.CN;c++){
				if(this.wall[r][c]!=null){
					this.paintCell(this.wall[r][c],frag,r,c);
				}
			}
		}
		this.pg.appendChild(frag);
	}
};
pop.start();
