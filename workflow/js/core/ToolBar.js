function ToolBar(container){
	this.ui = HtmlUtil.newElement('<div class="workflow-toolbar" style="position:absolute;"></div>');
	this.container = container;
	var btns = [];

	var btn_select = new Button(this,Constants.BTN_SELECT_TYPE);
	btn_select.setTop("5px");
	btn_select.setLeft("2px");
	btns.push(btn_select);

	var btn_line = new Button(this,Constants.BTN_LINE_TYPE);
	btn_line.setTop("5px");
	btn_line.setLeft("27px");
	btns.push(btn_line);

	var btn_polyline = new Button(this,Constants.BTN_POLYLINE_TYPE);
	btn_polyline.setTop("5px");
	btn_polyline.setLeft("52px");
	btns.push(btn_polyline);

	var btn_node = new Button(this,Constants.BTN_NODE_TYPE);
	btn_node.setTop("5px");
	btn_node.setLeft("77px");
	btns.push(btn_node);

	var btn_startnode = new Button(this,Constants.BTN_STARTNODE_TYPE);
	btn_startnode.setTop("5px");
	btn_startnode.setLeft("102px");
	btns.push(btn_startnode);

	var btn_endnode = new Button(this,Constants.BTN_ENDNODE_TYPE);
	btn_endnode.setTop("5px");
	btn_endnode.setLeft("127px");
	btns.push(btn_endnode);

	var btn_delete = new DeleteButton(this);
	btn_delete.setTop("5px");
	btn_delete.setLeft("152px");
	btns.push(btn_delete);

	HtmlUtil.append(this.getUI(),btn_select.getUI());
	HtmlUtil.append(this.getUI(),btn_line.getUI());
	HtmlUtil.append(this.getUI(),btn_polyline.getUI());
	HtmlUtil.append(this.getUI(),btn_node.getUI());
	HtmlUtil.append(this.getUI(),btn_startnode.getUI());
	HtmlUtil.append(this.getUI(),btn_endnode.getUI());
	HtmlUtil.append(this.getUI(),btn_delete.getUI());

	this.setPressed = function(type){
		this.container.operationMode = type;
		if(this.container.operationMode == Constants.BTN_POLYLINE_TYPE || this.container.operationMode == Constants.BTN_LINE_TYPE){
			$(this.container.getUI()).get(0).style.cursor = "crosshair";
		}else{
			$(this.container.getUI()).get(0).style.cursor = "default";
		}
		for(var i =0,j=btns.length;i<j;i++){
			btns[i].cancelPressed();
		}
	}
}

ToolBar.prototype = new UIComponent();
