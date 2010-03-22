function HtmlUtil(){}

HtmlUtil.getCoords = function (el){
	el = $(el).get(0);
	var box = el.getBoundingClientRect(),
	doc = el.ownerDocument,
	body = doc.body,
	html = doc.documentElement,
	clientTop = html.clientTop || body.clientTop || 0,
	clientLeft = html.clientLeft || body.clientLeft || 0,
	top  = box.top  + (self.pageYOffset || html.scrollTop  ||  body.scrollTop ) - clientTop,
	left = box.left + (self.pageXOffset || html.scrollLeft ||  body.scrollLeft) - clientLeft;
	
	return { x: left, y: top };
}


HtmlUtil.mouseCoords = function (ev){
	if(ev.pageX || ev.pageY){
		return {x:ev.pageX, y:ev.pageY};
	}
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop  - document.body.clientTop
	};
}

HtmlUtil.getMouseOffset = function (target, ev){
	ev = ev || window.event;

	var docPos    = HtmlUtil.getCoords(target);
	var mousePos  = HtmlUtil.mouseCoords(ev);
	return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};
}

HtmlUtil.newElement = function (el){
	return $(el).get(0);
}

HtmlUtil.setHeight = function(el,h){
	$(el).height(h);
}

HtmlUtil.setWidth = function(el,w){
	$(el).width(w);
}


HtmlUtil.getHeight = function(el){
	return $(el).height();
}

HtmlUtil.getWidth = function(el){
	return $(el).width();
}

HtmlUtil.getDomElement = function(el){
	return $(el).get(0);
}

HtmlUtil.setPosition = function(el,p) {
	$(el).get(0).style.position = p;
}

HtmlUtil.setLeft = function(el,v){
	$(el).get(0).style.left = v;
}

HtmlUtil.setTop = function(el,v){
	$(el).get(0).style.top = v;
}

HtmlUtil.setRight = function(el,v){
	$(el).get(0).style.right = v;
}

HtmlUtil.setBottom = function(el,v){
	$(el).get(0).style.bottom = v;
}

HtmlUtil.append = function(target,obj){
	$(target).append($(obj));
}

HtmlUtil.prepend = function(target,obj){
	$(target).prepend($(obj));
}

HtmlUtil.after = function(target,obj){
	$(target).after($(obj));
}

HtmlUtil.show = function(el){
	
	$(el).show();
}

HtmlUtil.hide = function(el){
	$(el).hide();
}

HtmlUtil.remove = function(el){
	$(el).remove();
}
HtmlUtil.addClass = function(el,style){
	$(el).addClass(style);
}
HtmlUtil.removeClass = function(el,style){
	$(el).removeClass(style);
}
