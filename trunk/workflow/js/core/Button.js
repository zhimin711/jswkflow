function Button(toolbar,type){
	this.toolbar = toolbar;
	this.type = type;
	this.ui = HtmlUtil.newElement('<div class="workflow-btn '+ type +'" style="position:absolute;"></div>');
	new ButtonListener(this);
}
Button.prototype = new UIComponent();
Button.prototype.setLeft = function(l){
	HtmlUtil.setLeft(this.getUI(),l);
}
Button.prototype.setTop = function(t){
	HtmlUtil.setTop(this.getUI(),t);
}
Button.prototype.setPressed = function(){
	HtmlUtil.addClass(this.getUI(),"pressed");
}
Button.prototype.cancelPressed = function(){
	HtmlUtil.removeClass(this.getUI(),"pressed");
}
function ButtonListener(button){
	var onClick = function(e){
		button.toolbar.setPressed(button.type);
		button.setPressed();
	};

	$(button.getUI()).bind("click",onClick);
}

function DeleteButton(toolbar){
	this.toolbar = toolbar;
	this.type = Constants.BTN_DELETE_TYPE;
	this.ui = HtmlUtil.newElement('<div class="workflow-btn '+ this.type +'" style="position:absolute;"></div>');
	new DelButtonListener(this);

}
DeleteButton.prototype = Button.prototype;

function DelButtonListener(button){
	var onMouseDown = function(e){
		button.setPressed();
	};

	var onMouseUp = function(e){
		button.cancelPressed();
		var container = button.toolbar.container;
		container.deleteComponent(container.currentSelectedComponent);
	};
	
	$(button.getUI()).bind("mousedown",onMouseDown);
	$(button.getUI()).bind("mouseup",onMouseUp);
}