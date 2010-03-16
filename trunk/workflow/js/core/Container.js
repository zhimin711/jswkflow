function Container(){
	this.operationMode = Container.NODE_MOD;
	
	this.fromNode = null;
	this.toNode = null;
	this.startDraw = false;

	var ui = HtmlUtil.newElement('<div onselectstart="javascript:return false;" class="workflow-container" style="position:relative;"></div>');
	var canvas = HtmlUtil.newElement('<v:group style="position:absolute;left:0;top:0;z-index:1;width:600px;height:600px;" coordsize="600,600"></v:group>');

	HtmlUtil.append(ui,canvas);
	
	this.getUI = function(){
		return ui;
	}


	this.addNode = function(node,mousePos){
		var containerPos = this.getPosition();
		HtmlUtil.setLeft(node.getUI(),(mousePos.x-containerPos.x)+"px");
		HtmlUtil.setTop(node.getUI(),(mousePos.y-containerPos.y)+"px");
		HtmlUtil.prepend(ui,node.getUI()); 
	}

	this.addLine = function(line){
		log.info("add line..........");
		var fromPos = this.fromNode.getPosition();
		var containerPos = this.getPosition();
		line.setFrom(fromPos.x-containerPos.x,fromPos.y-containerPos.y);
		line.setTo(fromPos.x-containerPos.x,fromPos.y-containerPos.y);
		HtmlUtil.prepend(canvas,line.getUI()); 
	}

	this.deleteLine = function(line){
		$(line.getUI()).remove();
		line = null;//删除line对象
	}

	this.getPosition = function(){
		return HtmlUtil.getCoords(this.getUI());
	}
	new ContainerListener(this);
}

Container.CHOSEN_MOD = 0;
Container.NODE_MOD = 1;
Container.LINE_MOD = 2;

function ContainerListener(container){
	var line;
	var containerPosition;
	

	function onClick(e){
		var mousePos = HtmlUtil.mouseCoords(e);	
		switch(container.operationMode){
			case Container.CHOSEN_MOD:
				
				break;
			case Container.NODE_MOD:
				//如果出于添加节点模式，单击后创建一个node，然后加到鼠标位置
				var node = new TaskNode(100,40,container);
				container.addNode(node,mousePos);
				break;
			case Container.LINE_MOD:

				break;
			
		}
	}

	function onMouseDown(e){
		
		if(container.operationMode == Container.LINE_MOD){//如果是画线模式下
			//如果fromnode有值，说明可以开始画线
			if(container.fromNode != null){
				log.info("canvas mouse down....."+container.fromNode);
				line = new Line();
				container.addLine(line);
				container.startDraw = true;
				$(container.getUI()).bind('mousemove',onMouseMove);
				$(container.getUI()).bind('mouseup',onMouseUp);
				containerPosition = container.getPosition();
			}
		}
		
		e.stopPropagation();
		
	}

	function onMouseMove(e){
		e  = e || window.event;
		var mousePos = HtmlUtil.mouseCoords(e);
		line.setTo(mousePos.x-containerPosition.x,mousePos.y-containerPosition.y);
		e.stopPropagation();
	}

	function onMouseUp(e){
		log.info("canvas mouse up....."+container.toNode);
		e  = e || window.event;
		var mousePos = HtmlUtil.mouseCoords(e);
		//如果松开鼠标的位置是画线区，即toNode有值的话，画线，否则，删除line
		if(container.toNode == null){
			container.deleteLine(line);
		}else{
			var toPos = container.toNode.getToPos(mousePos,container);
			line.setTo(toPos.x,toPos.y);
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