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

};


var SystemContext = function(){}

SystemContext.LOG_LEVEL_ERROR = 3;
SystemContext.LOG_LEVEL_WARN = 4;
SystemContext.LOG_LEVEL_INFO = 6;
SystemContext.LOG_LEVEL_DEBUG = 7;

SystemContext.LOG_LEVEL = SystemContext.LOG_LEVEL_INFO;