window.onload = function(){
    function _getObjectName(){
	var key;
	var search = location.search;
	var regQueryString = /objectName=[a-zA-Z0-9:._]*/gi;
	matches = search.match(regQueryString);
	if(matches && matches.length > 0){
	    key =  matches[0].split("=")[1];
	}
	return key;
	
    }
    var key = _getObjectName();
    d3.json("data/relations.json", function(data){
	if(key){
	    var relations = Util.generate2WayTree(key, data);
	    treeObj = CollapsibleTree("#placeholder");
	    treeObj.init(relations);
	}
    });
};
