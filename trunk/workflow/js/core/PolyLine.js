function PolyLine(container,id){
	Line.call(this,container,id);
	this.componentType = Constants.COMPONENT_TYPE_POLYLINE;
	this.controller;//中间的控制点
	this.ui = HtmlUtil.newElement('<v:polyline filled="false" style="position:absolute;z-index:11;"></v:polyline>');
	this.arrow = HtmlUtil.newElement('<v:Stroke dashstyle="solid" endarrow="classic"/>');
	this.middlePos;
	this.direction;

	this.setFrom = function(x,y){
		this.fromPos = x + "," + y;
		this.getUI().points.value = this.fromPos + " " + this.middlePos +" "+ this.toPos;
	}

	this.getFrom = function(){
		var fromArr = this.fromPos.split(",");
		return {x:parseInt(fromArr[0],10),y:parseInt(fromArr[1],10)};
	}
	
	this.setMiddle = function(x,y){
		this.middlePos = x + "," + y;
		this.getUI().points.value = this.fromPos + " " + this.middlePos +" "+ this.toPos;
	}

	this.getMiddle = function(){
		var middleArr = this.middlePos.split(",");
		return {x:parseInt(middleArr[0],10),y:parseInt(middleArr[1],10)};
	}

	this.setTo = function(x,y){
		this.toPos = x + "," + y;
		this.getUI().points.value = this.fromPos + " " + this.middlePos +" "+ this.toPos;
	}

	this.getTo = function(){
		var toArr = this.toPos.split(",");
		return {x:parseInt(toArr[0],10),y:parseInt(toArr[1],10)};
	}	

	this.addController = function(container){
		this.controller = new PolyLineController(container,this,5,5);
		HtmlUtil.setLeft(this.controller.getUI(),this.getMiddle().x-Math.round(this.controller.w/2)+"px");
		HtmlUtil.setTop(this.controller.getUI(),this.getMiddle().y-Math.round(this.controller.h/2)+"px");
		HtmlUtil.after(this.getUI(),this.controller.getUI());
	}

	// 删除UI 每个component都得有 node line polyline
	this.removeUI = function(){
		HtmlUtil.remove(this.getUI());
		HtmlUtil.remove(this.controller.getUI());
		this.controller=null;	
	}
	
	new LineListener(this);
}

PolyLine.prototype = new Line(); 

function PolyLineController(container,pline,w,h){
	this.pline = pline;
	this.w = w;
	this.h= h;
	this.container = container;
	
	this.ui =  HtmlUtil.newElement('<div onselectstart="javascript:return false;" class="rect-zone" style="position:absolute;z-index:12;"></div>');

	HtmlUtil.setWidth(this.getUI(),this.w);
	HtmlUtil.setHeight(this.getUI(),this.h);

	new PolyLineControllerListener(this);
}
PolyLineController.prototype = new UIComponent();


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
		if(container.operationMode == Constants.CHOSEN_MOD){//如果是选择模式下
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