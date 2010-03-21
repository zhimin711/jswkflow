function Button(toolbar,type){
	this.toolbar = toolbar;
	this.type = type;
	this.ui = HtmlUtil.newElement('<div class="workflow-btn '+ type +'" sytle="position:absolute;"></div>');
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
	}

	$(button.getUI()).bind("click",onClick);
}