function Line(){
	var ui = HtmlUtil.newElement('<v:line style="position:absolute;z-index:11"></v:line>');

	var arrow = HtmlUtil.newElement('<v:Stroke dashstyle="solid" endarrow="classic"/>');

	this.getUI = function(){
		return ui;
	}
	//线分两端，begin端和end端，这里的两个属性用来记录线的这两端在各自的node上的偏移量，用于当node拖拽时重新定义线的位置
	this.beginPosOffset;
	this.endPosOffset;

	this.setFrom = function(x,y){
		this.getUI().from = x + ',' + y;
	}

	this.setTo = function(x,y){
		this.getUI().to = x + ',' + y;
	}

	this.setArrow = function(){
		HtmlUtil.append(ui,arrow);
	}

}

