"use strict";
var SearchBox = React.createClass({
  onSearchChange: function(evt){
    var value = evt.target.value;
    this.props.searchTextChanged(value);
  },
  render: function(){
    return (<div className="search">
      <input type="text" ref={function(input){
	if(input){
	  input.focus();
	}
	}} name="fname" placeholder="Enter hana object name,e.g db.alert::alert_" onChange={this.onSearchChange} />
    </div>);
  }
});
var List = React.createClass({
  render: function(){
    return (
      <ul>
	{this.props.list.map(function(objKey){
	   return (<li className="object-item" key={objKey} data-id={objKey}>{objKey}</li>);
	 })}
      </ul>
    );
  }
});

var ListContainer = React.createClass({
  getInitialState: function(){
    return {
  	objects:[]
    }
  },
  componentDidMount: function(){
    this.allObjs = {};
    this.aObjects = [];
    d3.json(this.props.source, function(error,result){
      this.allObjs = result;
	if(this.isMounted()){
	  for(var obj in result){
	    this.aObjects.push(obj);
	  }
	}
    }.bind(this));
  },
  updateList: function(){
    var filterList = [];
    console.log(this.props.filter);
    if(!this.props.filter){
      return;
    }
    this.aObjects.forEach(function(objKey){
      if(objKey.indexOf(this.props.filter) > -1){
	  filterList.push(objKey);
	}
    }.bind(this));
    console.log(filterList.length);
    this.setState({
      objects:filterList
    });
  },
  onClick: function(evt){
    var key = evt.target.getAttribute("data-id");
    if(key){
      window.open("detail.html?objectName="+key);
      console.log(this.allObjs[key]);
    } else {
      console.log("no key");
    }
  },
  getRelations: function(id){
    
  },
  render: function() {
    return (
      <div onClick={this.onClick}>
	<List list={this.state.objects} />
      </div>
    );
	   
    }
});
var Component = React.createClass({
  getInitialState: function(){
    return {
      searchParam:""
    }
  },
  searchParamUpdate: function(searchText){
    searchText = searchText.replace(/ /g,"");
    this.setState({
      "searchParam": searchText
    });
    this.refs.listInstance.updateList();
  },
  render: function(){
    return (
      <div className="component">
	<SearchBox search={this.state.searchParam} searchTextChanged={this.searchParamUpdate}/>
	<ListContainer ref="listInstance" source={this.props.source} filter={this.state.searchParam} />
      </div>
    );
  }
  
});

ReactDOM.render(
  <Component source="data/relations.json" />,
  document.getElementById("placeholder")
);

