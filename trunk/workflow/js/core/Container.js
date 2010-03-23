function Container(){
	this.id = 1;
	this.operationMode = Constants.BTN_NODE_TYPE;
	this.fromNode = null;//线从哪个热区(RectZone)开始
	this.toNode = null;//线在哪个热区(RectZone)结束
	this.startDraw = false;
	this.ui = HtmlUtil.newElement('<div onselectstart="javascript:return false;" class="workflow-container" style="position:relative;top:35px;"></div>');
    this.lines = [];
	this.nodes = [];
	this.polyLines = [];
	this.currentSelectedComponent;

	this.addNode = function(node,mousePos){
		var containerPos = this.getPosition();
		HtmlUtil.setLeft(node.getUI(),(mousePos.x-containerPos.x)+"px");
		HtmlUtil.setTop(node.getUI(),(mousePos.y-containerPos.y)+"px");
		HtmlUtil.prepend(this.getUI(),node.getUI()); 
		this.nodes.push(node);
	}

	this.addLine = function(line,mousePos){
		var fromNodePos = this.fromNode.node.getPosition();//开始拖拽的节点的绝对位置
		log.error("fromZonePos.x:"+fromNodePos.x+" fromZonePos.y:"+fromNodePos.y)
		var containerPos = this.getPosition();//获得container的绝对位置
		//目前由于线是在node下方，所以起始位置就用fromRect的位置（左上角）
		var fromPos = container.fromNode.getEdgePos(mousePos,container);
		log.error("mousePos.x:"+mousePos.x+" mousePos.y:"+mousePos.y)
		log.error("fromPos.x:"+fromPos.x+" fromPos.y:"+fromPos.y)
		line.setFrom(fromPos.x,fromPos.y);
		line.setTo(fromPos.x,fromPos.y);
		//设置线在起始节点上的相对位置，以便以后节点移动时更新
		line.beginPosOffset = {x:fromPos.x-fromNodePos.x+containerPos.x,y:fromPos.y-fromNodePos.y+containerPos.y};
		HtmlUtil.prepend(this.getUI(),line.getUI());
		this.lines.push(line);
		return {x:mousePos.x,y:mousePos.y};
	}

	this.addPolyLine = function(polyLine){
		HtmlUtil.prepend(this.getUI(),polyLine.getUI());
		this.polyLines.push(polyLine);
	}

	this.deleteComponent = function(component){
		if(!component){
			return;
		}
		component.removeUI();
		switch(component.componentType){
			case Constants.COMPONENT_TYPE_LINE:
				this.lines.removeObj(component);
				break;
			case Constants.COMPONENT_TYPE_NODE:
				this.nodes.removeObj(component);
				break;
			case Constants.COMPONENT_TYPE_POLYLINE:
				this.polyLines.removeObj(component);
				break;
		}
		component = null;
	}

	this.unSelectAll = function(){
		this.currentSelectedComponent = null;
		for(var i = 0,j=this.lines.length;i<j;i++){
			this.lines[i].hideController();
		};
		for(var i = 0,j=this.nodes.length;i<j;i++){
			this.nodes[i].hideController();
		};
		for(var i = 0,j=this.polyLines.length;i<j;i++){
			this.polyLines[i].hideController();
		}
	}
	new ContainerListener(this);
}
Container.prototype =  new UIComponent();

function ContainerListener(container){
	var line;
	var containerPosition;
	var startPos;

	function onClick(e){
		var mousePos = HtmlUtil.mouseCoords(e,container.getUI());	
		container.unSelectAll();//清空选中的组件，除了当前点击的组件外
		switch(container.operationMode){
			case Constants.BTN_SELECT_TYPE:			
				break;
			case Constants.BTN_NODE_TYPE:
				//如果出于添加节点模式，单击后创建一个node，然后加到鼠标位置
				var node = new TaskNode(100,40,container,container.id);
				container.id ++;
				container.addNode(node,mousePos);
				break;
			case Constants.BTN_STARTNODE_TYPE:
				var node = new StartNode(100,40,container,container.id);
				container.id ++;
				container.addNode(node,mousePos);
				break;
			case Constants.BTN_ENDNODE_TYPE:
				var node = new EndNode(100,40,container,container.id);
				container.id ++;
				container.addNode(node,mousePos);
				break;
			case Constants.BTN_LINE_TYPE:
				break;
		}
	}

	function onMouseDown(e){
		//如果是画线模式下
		if(container.operationMode == Constants.BTN_LINE_TYPE || container.operationMode == Constants.BTN_POLYLINE_TYPE){
			//如果fromnode有值，说明可以开始画线
			if(container.fromNode != null){
				line = new Line(container,container.id);
				container.id ++;
				var mousePos = HtmlUtil.mouseCoords(e,container.getUI());
				startPos = container.addLine(line,mousePos);//设置鼠标开始画线的位置
				container.startDraw = true;//将container设为开始画线
				$(container.getUI()).bind('mousemove',onMouseMove);
				$(container.getUI()).bind('mouseup',onMouseUp);
				containerPosition = container.getPosition();
			}
		}
	}

	function onMouseMove(e){
		e  = e || window.event;
		var mousePos = HtmlUtil.mouseCoords(e,container.getUI());
		//log.error("when move ("+(mousePos.x-containerPosition.x)+","+(mousePos.y-containerPosition.y)+")");
		if(mousePos.x<=startPos.x){
			line.setTo(mousePos.x-containerPosition.x+3,mousePos.y-containerPosition.y+2);
		}else{
			line.setTo(mousePos.x-containerPosition.x-3,mousePos.y-containerPosition.y-2);
		}
	}

	function onMouseUp(e){
		e  = e || window.event;
		var mousePos = HtmlUtil.mouseCoords(e,container.getUI());
		//如果松开鼠标的位置是画线区，即toNode有值的话，画线，否则，删除line
		if(container.toNode == null || !container.toNode.node.canAddLine(container.fromNode.node)){
			container.deleteComponent(line);
		}else{
			var toPos = container.toNode.getEdgePos(mousePos,container);
			line.setTo(toPos.x,toPos.y);
			//设置线在结束节点上的相对位置，以便以后节点移动时更新
			var toNodePos = container.toNode.node.getPosition();//结束线所在节点的绝对位置
			var containerPos = container.getPosition();//获得container的绝对位置
			line.endPosOffset = {x:toPos.x-(toNodePos.x-containerPos.x),y:toPos.y-(toNodePos.y-containerPos.y)};
			if(container.operationMode == Constants.BTN_LINE_TYPE){//如果是画直线模式下
				line.finishLine();
				//将线分别赋值给连接的两端node的beginLine和endLine
				container.fromNode.addBeginLine(line);
				container.toNode.addEndLine(line);
				line.beginNode = container.fromNode.node;
				line.endNode = container.toNode.node;
			}
			if(container.operationMode == Constants.BTN_POLYLINE_TYPE){//如果是画折线的模式
				//根据fromZone来获得from to middle的坐标
				var middlePos = container.fromNode.getMiddlePoints(line.getFrom(),line.getTo());
				//构造折线，将折线画在container上
				var polyLine = new PolyLine(container,container.id);
				container.id ++;
				container.addPolyLine(polyLine);
				polyLine.setFrom(line.getFrom().x,line.getFrom().y);
				polyLine.setTo(line.getTo().x,line.getTo().y);
				polyLine.setMiddle(middlePos.x,middlePos.y);
				polyLine.beginPosOffset = line.beginPosOffset;
				polyLine.endPosOffset = line.endPosOffset;
				polyLine.finishLine();
				polyLine.addController(container);
				//然后删除line
				container.deleteComponent(line);
				container.fromNode.addBeginPolyLine(polyLine);
				container.toNode.addEndPolyLine(polyLine);
				polyLine.beginNode = container.fromNode.node;
				polyLine.endNode = container.toNode.node;
			}
		}

		$(container.getUI()).unbind('mousemove');
		$(container.getUI()).unbind('mouseup');
		container.toNode = null;
		container.fromNode = null;
		container.startDraw = false;
		e.stopPropagation();
	}

	$(container.getUI()).bind('click',onClick);
	$(container.getUI()).bind('mousedown',onMouseDown);
}