function TaskNode(w,h,container){
	this.container = container;
	var ui =  HtmlUtil.newElement('<div onselectstart="javascript:return false;" style="position:absolute;z-index:5;" class="workflow-node"></div>');

	HtmlUtil.setWidth(ui,w);
	HtmlUtil.setHeight(ui,h);

	this.rectDiv_top = new RectZone(this,RectZone.TOP,50,10);
	HtmlUtil.setLeft(this.rectDiv_top.getUI(),(Math.round(w/2)-Math.round(this.rectDiv_top.w/2))+"px");
	HtmlUtil.setTop(this.rectDiv_top.getUI(),"0px");

	this.rectDiv_left = new RectZone(this,RectZone.LEFT,10,20);
	HtmlUtil.setLeft(this.rectDiv_left.getUI(),"0px");
	HtmlUtil.setTop(this.rectDiv_left.getUI(),(Math.round(h/2)-Math.round(this.rectDiv_left.h/2))+"px");
	
	this.rectDiv_right = new RectZone(this,RectZone.RIGHT,10,20);
	HtmlUtil.setRight(this.rectDiv_right.getUI(),"0px");
	HtmlUtil.setTop(this.rectDiv_right.getUI(),(Math.round(h/2)-Math.round(this.rectDiv_right.h/2))+"px");
	
	this.rectDiv_bottom = new RectZone(this,RectZone.BOTTOM,50,10);
	HtmlUtil.setLeft(this.rectDiv_bottom.getUI(),(Math.round(w/2)-Math.round(this.rectDiv_bottom.w/2))+"px");
	HtmlUtil.setBottom(this.rectDiv_bottom.getUI(),"0px");


	HtmlUtil.append(ui,this.rectDiv_top.getUI());
	HtmlUtil.append(ui,this.rectDiv_left.getUI());
	HtmlUtil.append(ui,this.rectDiv_right.getUI());
	HtmlUtil.append(ui,this.rectDiv_bottom.getUI());
	
	this.getUI = function(){
		return ui;
	}

	this.getPosition = function(){
		return HtmlUtil.getCoords(this.getUI());
	}

	new NodeListener(this);

	//从这个节点出去的线的集合
	this.beginLine = [];
	//指向这个节点的线的集合
	this.endLine = [];

	this.beginPolyLine = [];
	this.endPolyLine = [];
}

function NodeListener(node){
	var mouseOffset;
	var container = node.container;
	var containerPosition = container.getPosition();
	//log.info(containerPosition.x+" : "+containerPosition.y);


	function onClick(e){
		HtmlUtil.show(node.rectDiv_top.getUI());
		HtmlUtil.show(node.rectDiv_left.getUI());
		HtmlUtil.show(node.rectDiv_right.getUI());
		HtmlUtil.show(node.rectDiv_bottom.getUI());
		e.stopPropagation();
	}

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
		if(container.operationMode == Container.CHOSEN_MOD || container.operationMode == Container.NODE_MOD){//如果是画节点模式下
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
		
		$(node.getUI()).unbind('mousemove',onMouseMove);
		$(node.getUI()).unbind('mouseup',onMouseUp);
		e.stopPropagation();
		node.getUI().releaseCapture();
	}

	$(node.getUI()).bind('mousedown',onMouseDown);
	$(node.getUI()).bind('mouseover',onMouseOver);
	$(node.getUI()).bind('mouseout',onMouseOut);
	$(node.getUI()).bind('click',onClick);
}




