function Line(container,id){
	this.id = id;
	this.componentType = Constants.COMPONENT_TYPE_LINE;
	this.container = container;
	this.arrow = HtmlUtil.newElement('<v:shape fillcolor=blue type="#arrow" style="position:absolute;width:10px;height:10px;z-index:11" />')
	this.ui = HtmlUtil.newElement('<v:line style="position:absolute;z-index:11;"></v:line>');
	//线分两端，begin端和end端，这里的两个属性用来记录线的这两端在各自的node上的偏移量，用于当node拖拽时重新定义线的位置
	this.beginPosOffset;
	this.endPosOffset;
	this.fromPos;//注意，是相对于container的坐标
	this.toPos;//注意，是相对于container的坐标
	this.beginController;
	this.endController;
	this.beginNode;
	this.endNode;

	//begin和endcontroller 设置,根据方向来计算begin和endcontroller的top和left(相对line而不是相对container)
	this.setControllerPosition = function(){
		if(!this.beginController || !this.endController){
			return;
		}
		var direction = Line._getDirection(this.getFrom(),this.getTo());
		switch(direction){
			case Constants.DIRECTION_LT:
				HtmlUtil.setLeft(this.endController.getUI(),0+"px");
				HtmlUtil.setTop(this.endController.getUI(),0+"px");
				HtmlUtil.setLeft(this.beginController.getUI(),Math.abs(this.getFrom().x-this.getTo().x)+"px");
				HtmlUtil.setTop(this.beginController.getUI(),Math.abs(this.getFrom().y-this.getTo().y)+"px");
				break;
			case Constants.DIRECTION_RT:
				HtmlUtil.setLeft(this.beginController.getUI(),0+"px");
				HtmlUtil.setTop(this.beginController.getUI(),Math.abs(this.getFrom().y-this.getTo().y)+"px");
				HtmlUtil.setLeft(this.endController.getUI(),Math.abs(this.getFrom().x-this.getTo().x)+"px");
				HtmlUtil.setTop(this.endController.getUI(),0+"px");
				break;
			case Constants.DIRECTION_LB:
				HtmlUtil.setLeft(this.endController.getUI(),0+"px");
				HtmlUtil.setTop(this.endController.getUI(),Math.abs(this.getFrom().y-this.getTo().y)+"px");
				HtmlUtil.setLeft(this.beginController.getUI(),Math.abs(this.getFrom().x-this.getTo().x)+"px");
				HtmlUtil.setTop(this.beginController.getUI(),0+"px");
				break;
			case Constants.DIRECTION_RB:
				HtmlUtil.setLeft(this.beginController.getUI(),0+"px");
				HtmlUtil.setTop(this.beginController.getUI(),0+"px");
				HtmlUtil.setLeft(this.endController.getUI(),Math.abs(this.getFrom().x-this.getTo().x)+"px");
				HtmlUtil.setTop(this.endController.getUI(),Math.abs(this.getFrom().y-this.getTo().y)+"px");
				break;
		}

	}
	new LineListener(this);

	this.getPosition = function(){
		return HtmlUtil.getCoords(this.getUI(),this.container.getUI());
	}

}
Line.prototype = new UIComponent();

Line.prototype.setFrom = function(x,y){
	this.fromPos = {x:parseInt(x,10),y:parseInt(y,10)};
	this.getUI().from = x + ',' + y;	
}
Line.prototype.getFrom = function(){
	return this.fromPos;
}
Line.prototype.setTo = function(x,y){
	this.toPos = {x:parseInt(x,10),y:parseInt(y,10)};
	this.getUI().to = x + ',' + y;
}
Line.prototype.getTo = function(){
	return this.toPos;
}
Line.prototype.showController = function(){
	HtmlUtil.show(this.beginController.getUI());
	HtmlUtil.show(this.endController.getUI());
}
Line.prototype.hideController = function(){
	HtmlUtil.hide(this.beginController.getUI());
	HtmlUtil.hide(this.endController.getUI());
}
//删除UI
Line.prototype.removeUI = function(){
	HtmlUtil.remove(this.getUI());
	//将beginNode上的beginLine里的自己删除
	if(this.beginNode){
		this.beginNode.beginLine.removeObj(this);
		//从beforeNode的nextNode里删除line.endNode
		this.beginNode.nextNode.removeObj(this.endNode);
	}
    //将endNode上的endLine里的自己删除
	if(this.endNode){
		this.endNode.endLine.removeObj(this);
		//从endNode的beforeNode里删除line.beginNode
		this.endNode.beforeNode.removeObj(this.beginNode);
	}
}
Line.prototype.finishLine = function(){
	//给线画上箭头，加上控制点
	//箭头的left top赋值
	var to = this.getTo();
	var from = this.getFrom();
	var dx = to.x - from.x;
	var dy = to.y - from.y;
	HtmlUtil.setLeft(this.arrow,(from.x+to.x)/2);
	HtmlUtil.setTop(this.arrow,(from.y+to.y)/2)
	//箭头的方向
	log.dir(from);
	log.dir(to);
	var radians = Math.atan2(dy,dx);
	var rotation = radians*180/Math.PI;
	this.arrow.style.rotation = rotation;
	HtmlUtil.before(this.getUI(),this.arrow);
	this.beginController = new LineController(this.container,this,5,5);
	this.endController = new LineController(this.container,this,5,5);
	HtmlUtil.append(this.getUI(),this.beginController.getUI());
	HtmlUtil.append(this.getUI(),this.endController.getUI());
	this.setControllerPosition();
}


Line._getDirection = function(beginPos,endPos){
	if((endPos.x>=beginPos.x) && (endPos.y<=beginPos.y)){
		return Constants.DIRECTION_RT;
	};
	if((endPos.x>=beginPos.x) && (endPos.y>=beginPos.y)){
		return Constants.DIRECTION_RB;
	};
	if((endPos.x<beginPos.x) && (endPos.y<beginPos.y)){
		return Constants.DIRECTION_LT;
	};
	if((endPos.x<beginPos.x) && (endPos.y>beginPos.y)){
		return Constants.DIRECTION_LB;
	};
}

function LineController(container,line,w,h){
	this.line = line;
	this.w = w;
	this.h= h;
	this.container = container;

	this.ui =  HtmlUtil.newElement('<div onselectstart="javascript:return false;" class="controller-zone" style="position:absolute;z-index:12;display:none;"></div>');

	HtmlUtil.setWidth(this.getUI(),this.w);
	HtmlUtil.setHeight(this.getUI(),this.h);

	this.getPosition = function(){
		return HtmlUtil.getCoords(this.getUI(),this.line.container.getUI());
	}

}
LineController.prototype = new UIComponent();

function LineListener(line){
    var onClick = function(e){
		line.container.unSelectAll();
		line.container.currentSelectedComponent = line;
		line.showController();
		e.stopPropagation();
	};
	$(line.getUI()).bind('click',onClick);
}