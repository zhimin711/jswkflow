function TaskNode(w,h,container){
	this.container = container;
	this.componentType = Constants.COMPONENT_TYPE_NODE;

	this.ui =  HtmlUtil.newElement('<div onselectstart="javascript:return false;" style="position:absolute;z-index:5;" class="workflow-node"></div>');

	HtmlUtil.setWidth(this.getUI(),w);
	HtmlUtil.setHeight(this.getUI(),h);

	this.rectDiv_top = new RectZone(this,Constants.RectZone_TOP,50,10);
	HtmlUtil.setLeft(this.rectDiv_top.getUI(),(Math.round(w/2)-Math.round(this.rectDiv_top.w/2))+"px");
	HtmlUtil.setTop(this.rectDiv_top.getUI(),"0px");

	this.rectDiv_left = new RectZone(this,Constants.RectZone_LEFT,10,20);
	HtmlUtil.setLeft(this.rectDiv_left.getUI(),"0px");
	HtmlUtil.setTop(this.rectDiv_left.getUI(),(Math.round(h/2)-Math.round(this.rectDiv_left.h/2))+"px");
	
	this.rectDiv_right = new RectZone(this,Constants.RectZone_RIGHT,10,20);
	HtmlUtil.setRight(this.rectDiv_right.getUI(),"0px");
	HtmlUtil.setTop(this.rectDiv_right.getUI(),(Math.round(h/2)-Math.round(this.rectDiv_right.h/2))+"px");
	
	this.rectDiv_bottom = new RectZone(this,Constants.RectZone_BOTTOM,50,10);
	HtmlUtil.setLeft(this.rectDiv_bottom.getUI(),(Math.round(w/2)-Math.round(this.rectDiv_bottom.w/2))+"px");
	HtmlUtil.setBottom(this.rectDiv_bottom.getUI(),"0px");


	HtmlUtil.append(this.getUI(),this.rectDiv_top.getUI());
	HtmlUtil.append(this.getUI(),this.rectDiv_left.getUI());
	HtmlUtil.append(this.getUI(),this.rectDiv_right.getUI());
	HtmlUtil.append(this.getUI(),this.rectDiv_bottom.getUI());

	new NodeListener(this);

	//从这个节点出去的线的集合
	this.beginLine = [];
	//指向这个节点的线的集合
	this.endLine = [];
	this.beginPolyLine = [];
	this.endPolyLine = [];

	// 删除UI 每个component都得有 node line polyline
	this.removeUI = function(){
		//节点本身删除
		HtmlUtil.remove(this.getUI());
		//删除节点上的热区
		this.rectDiv_top = null;
		this.rectDiv_left = null;
		this.rectDiv_right = null;
		this.rectDiv_bottom = null;
		//节点上的line删除
		for(var i =0,j=this.beginLine.length;i<j;i++){
			var line = this.beginLine[i];
			this.container.deleteComponent(line);
		}
		for(var i =0,j=this.endLine.length;i<j;i++){
			var line = this.endLine[i];
			this.container.deleteComponent(line);
		}
		for(var i =0,j=this.beginPolyLine.length;i<j;i++){
			var line = this.beginPolyLine[i];
			this.container.deleteComponent(line);
		}
		for(var i =0,j=this.endPolyLine.length;i<j;i++){
			var line = this.endPolyLine[i];
			this.container.deleteComponent(line);
		}
	}
}
TaskNode.prototype = UIComponent.prototype;

function NodeListener(node){
	var mouseOffset;
	var container = node.container;
	var containerPosition = container.getPosition();

	function onMouseOver(e){
		HtmlUtil.show(node.rectDiv_top.getUI());
		HtmlUtil.show(node.rectDiv_left.getUI());
		HtmlUtil.show(node.rectDiv_right.getUI());
		HtmlUtil.show(node.rectDiv_bottom.getUI());
		e.stopPropagation();
	}

	function onMouseOut(e){
		HtmlUtil.hide(node.rectDiv_top.getUI());
		HtmlUtil.hide(node.rectDiv_left.getUI());
		HtmlUtil.hide(node.rectDiv_right.getUI());
		HtmlUtil.hide(node.rectDiv_bottom.getUI());
		e.stopPropagation();
	}

	function onMouseMove(e){
		e  = e || window.event;
		var mousePos = HtmlUtil.mouseCoords(e);	
		var top = Math.max((mousePos.y - mouseOffset.y - containerPosition.y),0);
		HtmlUtil.setTop(node.getUI(),top + 'px');

		var left = Math.max((mousePos.x - mouseOffset.x - containerPosition.x),0);
		HtmlUtil.setLeft(node.getUI(),left + 'px');

		//将连接在该节点上的线的起止坐标更新
		//从节点延伸出去的线，更新from
		for(var i=0,j=node.beginLine.length;i<j;i++){
			var line = node.beginLine[i];
			var lineOffset = line.beginPosOffset;
			line.setFrom(lineOffset.x+left,lineOffset.y+top);
		}
		//连接到节点的线，更新to
		for(var i=0,j=node.endLine.length;i<j;i++){
			var line = node.endLine[i];
			//log.dir(line.endPosOffset)
			//log.info(left+":"+top);
			var lineOffset = line.endPosOffset;
			line.setTo(lineOffset.x+left,lineOffset.y+top);
		}

		//从节点延伸出去的线，更新from
		for(var i=0,j=node.beginPolyLine.length;i<j;i++){
			var pline = node.beginPolyLine[i];
			var lineOffset = pline.beginPosOffset;
			pline.setFrom(lineOffset.x+left,lineOffset.y+top);
		}
		//连接到节点的线，更新to
		for(var i=0,j=node.endPolyLine.length;i<j;i++){
			var pline = node.endPolyLine[i];
			var lineOffset = pline.endPosOffset;
			pline.setTo(lineOffset.x+left,lineOffset.y+top);
		}
		e.stopPropagation();
	}

	function onMouseDown(e){
		//将container上所有选中的取消选中
		container.unSelectAll();
		container.currentSelectedComponent = node;
		if(container.operationMode == Constants.CHOSEN_MOD || container.operationMode == Constants.NODE_MOD){//如果是画节点模式下
			//log.info("node mouse down......"+container.operationMode)
			$(node.getUI()).bind('mousemove',onMouseMove);
			$(node.getUI()).bind('mouseup',onMouseUp);
			mouseOffset = HtmlUtil.getMouseOffset(node.getUI(),e);
			//e.stopPropagation();
			node.getUI().setCapture();
		}else{
			$(node.getUI()).unbind('mousemove',onMouseMove);
			$(node.getUI()).unbind('mouseup',onMouseUp);
		}
	}

	function onMouseUp(e){
		//将连接在该节点上的线的起止坐标更新
		//从节点延伸出去的直线，更新from
		for(var i=0,j=node.beginLine.length;i<j;i++){
			var line = node.beginLine[i];
			line.setControllerPosition();
		}
		//连接到节点的直线，更新to
		for(var i=0,j=node.endLine.length;i<j;i++){
			var line = node.endLine[i];
			line.setControllerPosition();
		}
		//从节点延伸出去的折线，更新from
		for(var i=0,j=node.beginPolyLine.length;i<j;i++){
			var line = node.beginPolyLine[i];
			line.setControllerPosition();
		}
		//连接到节点的折线，更新to
		for(var i=0,j=node.endPolyLine.length;i<j;i++){
			var line = node.endPolyLine[i];
			line.setControllerPosition();
		}
		$(node.getUI()).unbind('mousemove',onMouseMove);
		$(node.getUI()).unbind('mouseup',onMouseUp);
		e.stopPropagation();
		node.getUI().releaseCapture();
	}

	$(node.getUI()).bind('mousedown',onMouseDown);
	$(node.getUI()).bind('mouseover',onMouseOver);
	$(node.getUI()).bind('mouseout',onMouseOut);
}