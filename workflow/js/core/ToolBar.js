function ToolBar(container){
	this.ui = HtmlUtil.newElement('<div class="workflow-toolbar" style="position:absolute;z-index:20;"></div>');
	var btns = [];

	var btn_select = new Button(this,Constants.BTN_SELECT_TYPE);
	btn_select.setTop(0);
	btn_select.setLeft(0);
	btns.push(btn_select);

	var btn_line = new Button(this,Constants.BTN_LINE_TYPE);
	btn_line.setTop(0);
	btn_line.setLeft(25);
	btns.push(btn_line);

	var btn_polyline = new Button(this,Constants.BTN_POLYLINE_TYPE);
	btn_polyline.setTop(0);
	btn_polyline.setLeft(50);
	btns.push(btn_polyline);

	var btn_node = new Button(this,Constants.BTN_NODE_TYPE);
	btn_node.setTop(0);
	btn_node.setLeft(75);
	btns.push(btn_node);

	var btn_startnode = new Button(this,Constants.BTN_STARTNODE_TYPE);
	btn_startnode.setTop(0);
	btn_startnode.setLeft(100);
	btns.push(btn_startnode);

	var btn_endnode = new Button(this,Constants.BTN_ENDNODE_TYPE);
	btn_endnode.setTop(0);
	btn_endnode.setLeft(125);
	btns.push(btn_endnode);

	var btn_delete = new Button(this,Constants.BTN_DELETE_TYPE);
	btn_delete.setTop(0);
	btn_delete.setLeft(150);
	btns.push(btn_delete);

	HtmlUtil.append(this.getUI(),btn_select.getUI());
	HtmlUtil.append(this.getUI(),btn_line.getUI());
	HtmlUtil.append(this.getUI(),btn_polyline.getUI());
	HtmlUtil.append(this.getUI(),btn_node.getUI());
	HtmlUtil.append(this.getUI(),btn_startnode.getUI());
	HtmlUtil.append(this.getUI(),btn_endnode.getUI());

	this.setPressed = function(type){
		container.operationMode = type;
		for(var i =0,j=btns.length;i<j;i++){
			btns[i].cancelPressed();
		}
	}
}

ToolBar.prototype = new UIComponent();
