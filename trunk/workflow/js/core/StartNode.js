function StartNode(w,h,container,id){
	TaskNode.call(this,w,h,container,id);
	this.canDrop = false;
}

StartNode.prototype = TaskNode.prototype;

function EndNode(w,h,container,id){
	TaskNode.call(this,w,h,container,id);
	this.canDrag = false;

}

EndNode.prototype =  TaskNode.prototype;