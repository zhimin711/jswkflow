function Line(container,id){
	this.id = id;
	this.componentType = Constants.COMPONENT_TYPE_LINE;
	this.container = container;
	this.ui = HtmlUtil.newElement('<v:line style="position:absolute;z-index:11;"></v:line>');
	this.arrow = HtmlUtil.newElement('<v:Stroke dashstyle="solid" endarrow="classic"/>');
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
// 删除UI
Line.prototype.removeUI = function(){
	HtmlUtil.remove(this.getUI());
}
Line.prototype.finishLine = function(){
	//给线画上箭头，加上控制点
	HtmlUtil.append(this.getUI(),this.arrow);
	this.beginController = new LineController(this.container,this,5,5);
	this.endController = new LineController(this.container,this,5,5);
	HtmlUtil.append(this.getUI(),this.beginController.getUI());
	HtmlUtil.append(this.getUI(),this.endController.getUI());
	this.setControllerPosition();
}


Line._getDirection = function(beginPos,endPos){
	if((endPos.x>=beginPos.x) && (endPos.y<=beginPos.y)){
		return Constants.DIRECTION_RT;
	}
	if((endPos.x>=beginPos.x) && (endPos.y>=beginPos.y)){
		return Constants.DIRECTION_RB;
	}
	if((endPos.x<beginPos.x) && (endPos.y<beginPos.y)){
		return Constants.DIRECTION_LT;
	}
	if((endPos.x<beginPos.x) && (endPos.y>beginPos.y)){
		return Constants.DIRECTION_LB;
	}
}

function LineController(container,line,w,h){
	this.line = line;
	this.w = w;
	this.h= h;
	this.container = container;

	this.ui =  HtmlUtil.newElement('<div onselectstart="javascript:return false;" class="rect-zone" style="position:absolute;z-index:12;display:none;"></div>');
	this.getUI = function(){
		return this.ui;
	}

	HtmlUtil.setWidth(this.getUI(),this.w);
	HtmlUtil.setHeight(this.getUI(),this.h);

	this.getPosition = function(){
		return HtmlUtil.getCoords(this.getUI());
	}
}

function LineListener(line){
    var onClick = function(e){
		line.container.unSelectAll();
		line.container.currentSelectedComponent = line;
		line.showController();
		e.stopPropagation();
	} 
	$(line.getUI()).bind('click',onClick);
}