function UIComponent(){
	
};
UIComponent.prototype.getPosition = function(context){
	return HtmlUtil.getCoords(this.getUI(),context);
};

UIComponent.prototype.getUI = function(){
	return this.ui;
};

