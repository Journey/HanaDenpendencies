
function Breadth(){
    var structure = {
	parents:{},
	children:{}
    };
    function _logParents(depth,number){
	var obj = structure.parents;
	if(obj[depth] === undefined){
	    obj[depth] = [];
	}
	obj[depth].push(number);
    }
    function _logChildren(depth,number){
	var obj = structure.children;
	if(obj[depth] === undefined){
	    obj[depth] = [];
	}
	obj[depth].push(number);
    }

    function _getBreadth(){
	var aParents = [];
	var aChildren = [];
	var temp;
	var parents = structure.parents;
	for(var inx in parents){
	    temp = 0;
	    parents[inx].forEach(function(num){
		temp +=num;
	    });
	    aParents.push(temp);
	}
	var children = structure.children;
	for(inx in children){
	    temp = 0;
	    children[inx].forEach(function(num){
		temp += num;
	    });
	    aChildren.push(temp);
	}

	var parentMax = aParents.sort()[aParents.length -1];
	var childrenMax = aChildren.sort()[aChildren.length -1];
	return parentMax > childrenMax ? parentMax : childrenMax;
    }

    return {
	logParents: _logParents,
	logChildren: _logChildren,
	getBreadth: _getBreadth
    };
    
}
var breadth = Breadth();
function _initNodeObj(name,isParent){
    var node = {
	"name": name,
	"isparent": isParent
    };
    return node;
}
function _addParent2Node(node,name){
    if(node.parents === undefined){
	node.parents = [];
    }
    var subNode = _initNodeObj(name,true);
    node.parents.push(_initNodeObj(name,true));
    return subNode;
}
function _addChild2Node(node,name){
    if(node.children === undefined){
	node.children = [];
    }
    var subNode = _initNodeObj(name,false);
    node.children.push(subNode);
    return subNode;
}
function _fillParents(centerNode,allObj,depth){
    var key = centerNode.name;
    var parentKeys = allObj[key].whereUsedList;
    var retDepth = 0;
    parentKeys.forEach(function(key){
	_addParent2Node(centerNode,key);
    });
    if(centerNode.parents){
	++ depth;
	breadth.logParents(depth,centerNode.parents.length);
	centerNode.parents.forEach(function(node){
	    var dimension = _fillParents(node,allObj,depth);
	    var subDepth= dimension.depth;
	    retDepth = retDepth > subDepth ? retDepth : subDepth;
	});
	depth = retDepth;
    }
    return {
	depth: depth,
	breadth: 0
    };
}
function _fillChilds(centerNode,allObj,depth){
    var key = centerNode.name;
    var childKeys = allObj[key].dependencies;
    var retDepth = 0;
    childKeys.forEach(function(key){
	_addChild2Node(centerNode,key);
    });
    if(centerNode.children){
	++depth;
	breadth.logChildren(depth, centerNode.children.length);
	centerNode.children.forEach(function(node){
	    var diamension = _fillChilds(node, allObj, depth);
	    var subDepth = diamension.depth;
	    retDepth = retDepth > subDepth ? retDepth : subDepth;
	});
	depth = retDepth;
    }
    return {
	depth: depth,
	breadth: 0
    };
}
var Util = {
    generate2WayTree: function(key, allObj){
	var centerNode = {
	    "name": key,
	    "parents":[],
	    "children":[]
	};
	var parentDimension = _fillParents(centerNode,allObj,1);
	centerNode.parentDepth = parentDimension.depth;
	var childDimension = _fillChilds(centerNode, allObj, 1);
	centerNode.childDepth = childDimension.depth;
	centerNode.breadth = breadth.getBreadth();
	return centerNode;
    }
};
