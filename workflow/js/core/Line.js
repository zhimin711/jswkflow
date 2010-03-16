function Line(){
	var ui = HtmlUtil.newElement('<v:line style="position:absolute;z-index:90"><v:Stroke dashstyle="solid" endarrow="classic"/></v:line>');

	this.getUI = function(){
		return ui;
	}

	this.setFrom = function(x,y){
		this.getUI().from = x + ',' + y;
	}

	this.setTo = function(x,y){
		this.getUI().to = x + ',' + y;
	}

}

