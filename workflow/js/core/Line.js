function Line(){
	var ui = HtmlUtil.newElement('<v:line style="position:absolute;z-index:11;"></v:line>');

	var arrow = HtmlUtil.newElement('<v:Stroke dashstyle="solid" endarrow="classic"/>');

	this.getUI = function(){
		return ui;
	}
	//线分两端，begin端和end端，这里的两个属性用来记录线的这两端在各自的node上的偏移量，用于当node拖拽时重新定义线的位置
	this.beginPosOffset;
	this.endPosOffset;
	this.fromPos;//注意，是相对于container的坐标
	this.toPos;//注意，是相对于container的坐标

	this.setFrom = function(x,y){
		this.fromPos = {x:x,y:y};
		this.getUI().from = x + ',' + y;
	}

	this.setTo = function(x,y){
		this.toPos = {x:x,y:y};
		this.getUI().to = x + ',' + y;
	}

	this.setArrow = function(){
		HtmlUtil.append(ui,arrow);
	}

}


function PolyLine(){
	var ui = HtmlUtil.newElement('<v:polyline filled="false" style="position:absolute;z-index:11;"></v:polyline>');
	var arrow = HtmlUtil.newElement('<v:Stroke dashstyle="solid" endarrow="classic"/>');

	var fromPos;
	var toPos;
	var middlePos;

	this.direction;

	this.getUI = function(){
		return ui;
	}

	//线分两端，begin端和end端，这里的两个属性用来记录线的这两端在各自的node上的偏移量，用于当node拖拽时重新定义线的位置
	this.beginPosOffset;
	this.endPosOffset;

	this.setFrom = function(x,y){
		fromPos = x + "," + y;
		ui.points.value = fromPos + " " + middlePos +" "+ toPos;
	}

	this.getFrom = function(){
		var fromArr = fromPos.split(",");
		return {x:fromArr[0],y:fromArr[1]};
	}

	
	this.setMiddle = function(x,y){
		middlePos = x + "," + y;
		ui.points.value = fromPos + " " + middlePos +" "+ toPos;
	}

	this.getMiddle = function(){
		var middleArr = middlePos.split(",");
		return {x:middleArr[0],y:middleArr[1]};
	}

	this.setTo = function(x,y){
		toPos = x + "," + y;
		ui.points.value = fromPos + " " + middlePos +" "+ toPos;
	}

	this.getTo = function(){
		var toArr = toPos.split(",");
		return {x:toArr[0],y:toArr[1]};
	}

	this.setArrow = function(){
		HtmlUtil.append(ui,arrow);
	}
	
	

	this.addController = function(container){
		this.controller = new PolyLineController(container,this,5,5);
		//log.error("add controller...."+this.getMiddle().x)
		HtmlUtil.setLeft(this.controller.getUI(),this.getMiddle().x-Math.round(this.controller.w/2)+"px");
		HtmlUtil.setTop(this.controller.getUI(),this.getMiddle().y-Math.round(this.controller.h/2)+"px");
		HtmlUtil.after(ui,this.controller.getUI());
	}
	
}



PolyLine.DIRECTION_LT = 1;//left top
PolyLine.DIRECTION_RT = 2;//right top
PolyLine.DIRECTION_LB = 3;//left bottom
PolyLine.DIRECTION_RB = 4;//right bottom

function PolyLineController(container,pline,w,h){
	this.pline = pline;
	this.w = w;
	this.h= h;
	this.container = container;

	var ui =  HtmlUtil.newElement('<div onselectstart="javascript:return false;" class="rect-zone" style="position:absolute;z-index:12;"></div>');
	HtmlUtil.setWidth(ui,this.w);
	HtmlUtil.setHeight(ui,this.h);
	this.getUI = function(){
		return ui;
	}

	this.getPosition = function(){
		return HtmlUtil.getCoords(this.getUI());
	}

	new PolyLineControllerListener(this);
}


function PolyLineControllerListener(controller){
	var mouseOffset;
	var container = controller.container;
	var containerPosition = container.getPosition();

	
	function onMouseMove(e){
		e  = e || window.event;
		var mousePos = HtmlUtil.mouseCoords(e);	
		var top = Math.max((mousePos.y - mouseOffset.y - containerPosition.y),0);
		HtmlUtil.setTop(controller.getUI(),top + 'px');

		var left = Math.max((mousePos.x - mouseOffset.x - containerPosition.x),0);
		HtmlUtil.setLeft(controller.getUI(),left + 'px');

		//移动的同时，更新polyline的middlePoint坐标
		controller.pline.setMiddle(left,top);
		e.stopPropagation();
	}

	function onMouseDown(e){
		if(container.operationMode == Container.CHOSEN_MOD){//如果是选择模式下
			//log.info("node mouse down......"+container.operationMode)
			$(controller.getUI()).bind('mousemove',onMouseMove);
			$(controller.getUI()).bind('mouseup',onMouseUp);
			mouseOffset = HtmlUtil.getMouseOffset(controller.getUI(),e);
			controller.getUI().setCapture();
		}else{
			$(controller.getUI()).unbind('mousemove',onMouseMove);
			$(controller.getUI()).unbind('mouseup',onMouseUp);
		}
		e.stopPropagation();
	}

	function onMouseUp(e){
		
		$(controller.getUI()).unbind('mousemove',onMouseMove);
		$(controller.getUI()).unbind('mouseup',onMouseUp);
		e.stopPropagation();
		controller.getUI().releaseCapture();
	}

	$(controller.getUI()).bind('mousedown',onMouseDown);
}



