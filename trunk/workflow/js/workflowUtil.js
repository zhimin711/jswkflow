function HtmlUtil(){}

HtmlUtil.getCoords = function (el,context){
	el = $(el).get(0);
	var box = el.getBoundingClientRect(),
	doc = el.ownerDocument,
	body = doc.body,
	html = doc.documentElement,
	clientTop = html.clientTop || body.clientTop || 0,
	clientLeft = html.clientLeft || body.clientLeft || 0;

	var contextScroll = {
		scrollLeft:0,
		scrollTop:0
	};
	if(context){
		contextScroll = $(context).get(0);
	}
	
	var top  = box.top  + (self.pageYOffset || html.scrollTop  ||  body.scrollTop ) - clientTop + contextScroll.scrollTop;
	var left = box.left + (self.pageXOffset || html.scrollLeft ||  body.scrollLeft) - clientLeft +  contextScroll.scrollLeft;

	return { x: left, y: top };
}


HtmlUtil.mouseCoords = function (ev,context){
	
	/*if(ev.pageX || ev.pageY){
		
		return {x:ev.pageX, y:ev.pageY};
	}*/
	var contextScroll = {
		scrollLeft:0,
		scrollTop:0
	}
	if(context){
		contextScroll = $(context).get(0);
	}
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft + contextScroll.scrollLeft,
		y:ev.clientY + document.body.scrollTop  - document.body.clientTop + contextScroll.scrollTop
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
var Logger = function (className){
	var loggerHtml;

	var createLogArea = function(){
		var logObj = $("#system-log-div");
		if(logObj.size()==0){
			var tmp = $("<div id=\"system-log-div\" style=\"position:absolute;left:80%;top:20px;z-index:9999;border:1px solid blue;width:300px;height:500px;overflow:auto;\"></div>");
			$("body").append(tmp);
			return tmp;
		}else{
			return logObj;
		}
	}
	loggerHtml = createLogArea();// create log area html
	
	this.info = function(msg){
		msg = "[INFO]" + className+":"+msg;
		output(msg,SystemContext.LOG_LEVEL_INFO);
	}

	this.error = function(msg){
		msg = "[ERROR]" + className+":"+msg;
		output(msg,SystemContext.LOG_LEVEL_ERROR);
	}
	
	this.warn = function(msg){
		msg = "[WARN]" + className+":"+msg;
		output(msg,SystemContext.LOG_LEVEL_WARN);
	}

	this.debug = function(msg){
		msg = "[DEBUG]" + className+":"+msg;
		output(msg,SystemContext.LOG_LEVEL_DEBUG);
	}

	var output = function(msg,level){
		var sysLevel = SystemContext.LOG_LEVEL;
		if(level<=sysLevel){
			loggerHtml.get(0).innerHTML += (msg+"<br/>");
		}
	}

	this.clear = function(){
		$("#system-log-div").html("");
	}

	this.dir = function(obj){
		var str = obj+":<br/>";
		for(var i in obj){
			str += i+":"+obj[i]+"<br/>";
		}
		$("#system-log-div").html($("#system-log-div").html()+str);
	}

};


var SystemContext = function(){}

SystemContext.LOG_LEVEL_ERROR = 3;
SystemContext.LOG_LEVEL_WARN = 4;
SystemContext.LOG_LEVEL_INFO = 6;
SystemContext.LOG_LEVEL_DEBUG = 7;

SystemContext.LOG_LEVEL = SystemContext.LOG_LEVEL_ERROR;
Array.prototype.indexOf = function (obj) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == obj) {
            return i;
        }
    }
    return -1;
};

Array.prototype.removeByIndex = function (index) {
    this.splice(index,1);
};

Array.prototype.removeObj = function(obj){
	var index = this.indexOf(obj);
	if (index != -1){
		this.splice(index,1);
	}
};

Array.prototype.size = function () {
    return this.length;
};



function Constants(){}
/***line**/
Constants.DIRECTION_LT = 1;//left top
Constants.DIRECTION_RT = 2;//right top
Constants.DIRECTION_LB = 3;//left bottom
Constants.DIRECTION_RB = 4;//right bottom

Constants.COMPONENT_TYPE_NODE = 4;
Constants.COMPONENT_TYPE_LINE = 5;
Constants.COMPONENT_TYPE_POLYLINE = 6;

/**node rect zone**/
Constants.RectZone_TOP = 1;
Constants.RectZone_RIGHT = 2;
Constants.RectZone_BOTTOM = 3;
Constants.RectZone_LEFT = 4;

Constants.BTN_SELECT_TYPE = "chosen";
Constants.BTN_LINE_TYPE = "line";
Constants.BTN_POLYLINE_TYPE = "polyline";
Constants.BTN_NODE_TYPE = "tasknode";
Constants.BTN_STARTNODE_TYPE = "startnode";
Constants.BTN_ENDNODE_TYPE = "endnode";
Constants.BTN_DELETE_TYPE = "deletebtn";