function RectZone(node,type,w,h){
	this.node = node;
	this.type = type;
	this.w = w;
	this.h= h;
	this.ui =  HtmlUtil.newElement('<div onselectstart="javascript:return false;" class="rect-zone" style="position:absolute;z-index:6;display:none;"></div>');
	HtmlUtil.setWidth(this.getUI(),this.w);
	HtmlUtil.setHeight(this.getUI(),this.h);

	this.getEdgePos = function(mousePos,container){
		var borderWidth = 1;
		var containerPos = container.getPosition();
		var recPos = this.getPosition();
		var result = {x:0,y:0};
		switch(this.type){
			case Constants.RectZone_TOP:
				result.x = mousePos.x-containerPos.x ;
				result.y = recPos.y-containerPos.y - borderWidth;
				break;
			case Constants.RectZone_RIGHT:
				result.x = recPos.x-containerPos.x+this.w;
				result.y = mousePos.y-containerPos.y;
				break;
			case Constants.RectZone_BOTTOM:
				result.x = mousePos.x-containerPos.x;
				result.y = recPos.y-containerPos.y + this.h;
				break;
			case Constants.RectZone_LEFT:
				result.x = recPos.x-containerPos.x - borderWidth;
				result.y = mousePos.y-containerPos.y;
				break;
		}
		return result;
	}

	this.addBeginLine = function(line){
		this.node.beginLine.push(line);
	}

	this.addEndLine = function(line){
		this.node.endLine.push(line);
	}

	this.addBeginPolyLine = function(polyline){
		this.node.beginPolyLine.push(polyline);
	}

	this.addEndPolyLine = function(polyline){
		this.node.endPolyLine.push(polyline);
	}

	this.getMiddlePoints = function(fromPos,toPos){
		if(this.type == Constants.RectZone_TOP || this.type == Constants.RectZone_BOTTOM){//top和bottom热区
			return  {x:parseInt(fromPos.x,10),y:parseInt(toPos.y,10)};//中间点x不变，y由toPos定
		}else{//left right 热区
			return  {x:parseInt(toPos.x,10),y:parseInt(fromPos.y,10)};//中间点y不变，x由fromPos定
		}
	}
	new RectZoneListener(this);
}
RectZone.prototype =  new UIComponent();

function RectZoneListener(rect){
	var container = rect.node.container;

	function onMouseOver(e){
		if(!container.startDraw){
			container.fromNode = rect;
		}else{
			container.toNode = rect;
		}
	}

	function onMouseOut(e){
		if(!container.startDraw){
			container.fromNode = null;
		}else{
			container.toNode = null;
		}
	}
	$(rect.getUI()).bind('mouseover',onMouseOver);
	$(rect.getUI()).bind('mouseout',onMouseOut);
}