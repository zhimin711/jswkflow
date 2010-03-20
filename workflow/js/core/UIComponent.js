function UIComponent(){
	
}
UIComponent.prototype.getPosition = function(){
	return HtmlUtil.getCoords(this.getUI());
}

UIComponent.prototype.getUI = function(){
	return this.ui;
}

