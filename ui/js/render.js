"use strict";
var SearchBox = React.createClass({
  displayName: "SearchBox",

  onSearchChange: function onSearchChange(evt) {
    var value = evt.target.value;
    this.props.searchTextChanged(value);
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "search" },
      React.createElement("input", { type: "text", ref: function (input) {
          if (input) {
            input.focus();
          }
        }, name: "fname", placeholder: "Enter hana object name,e.g db.alert::alert_", onKeyUp: this.onSearchChange })
    );
  }
});
var List = React.createClass({
  displayName: "List",

  render: function render() {
    return React.createElement(
      "ul",
      null,
      this.props.list.map(function (objKey) {
        return React.createElement(
          "li",
          { className: "object-item", key: objKey, "data-id": objKey },
          objKey
        );
      })
    );
  }
});

var Tips = React.createClass({
  displayName: "Tips",

  render: function render() {
    return React.createElement(
      "div",
      { className: "tips" },
      React.createElement(
        "span",
        null,
        "Total Objects:(",
        this.props.totalCount,
        ")"
      ),
      React.createElement(
        "span",
        null,
        "Filtered Objects:(",
        this.props.filterCount,
        ")"
      )
    );
  }
});

var ListContainer = React.createClass({
  displayName: "ListContainer",

  getInitialState: function getInitialState() {
    return {
      objects: [],
      filterCount: 0,
      totalCount: 0
    };
  },
  componentDidMount: function componentDidMount() {
    this.allObjs = {};
    this.aObjects = [];
    d3.json(this.props.source, (function (error, result) {
      this.allObjs = result;
      if (this.isMounted()) {
        for (var obj in result) {
          this.aObjects.push(obj);
        }
        this.setState({ "totalCount": this.aObjects.length });
      }
    }).bind(this));
  },
  updateList: function updateList() {
    var filterList = [];
    if (!this.props.filter) {
      this.setState({
        filterCount: 0,
        objects: filterList
      });
      return;
    }
    this.aObjects.forEach((function (objKey) {
      if (objKey.indexOf(this.props.filter) > -1) {
        filterList.push(objKey);
      }
    }).bind(this));
    this.setState({
      objects: filterList,
      filterCount: filterList.length
    });
  },
  onClick: function onClick(evt) {
    var key = evt.target.getAttribute("data-id");
    if (key) {
      window.open("detail.html?objectName=" + key);
      console.log(this.allObjs[key]);
    } else {
      console.log("no key");
    }
  },
  getRelations: function getRelations(id) {},
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(Tips, { totalCount: this.state.totalCount, filterCount: this.state.filterCount }),
      React.createElement(
        "div",
        { onClick: this.onClick, className: "list" },
        React.createElement(List, { list: this.state.objects })
      )
    );
  }
});
var Component = React.createClass({
  displayName: "Component",

  getInitialState: function getInitialState() {
    return {
      searchParam: ""
    };
  },
  searchParamUpdate: function searchParamUpdate(searchText) {
    searchText = searchText.replace(/ /g, "");
    this.setState({
      "searchParam": searchText
    });
    this.refs.listInstance.updateList();
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "component" },
      React.createElement(
        "div",
        { className: "disclaim" },
        "Supported Objects:hdbtable,calculationview,hdbprocedure,attributeview,hdbview,hdbsequence,hdbstructure"
      ),
      React.createElement(SearchBox, { search: this.state.searchParam, searchTextChanged: this.searchParamUpdate }),
      React.createElement(ListContainer, { ref: "listInstance", source: this.props.source, filter: this.state.searchParam })
    );
  }

});

ReactDOM.render(React.createElement(Component, { source: "data/relations.json" }), document.getElementById("placeholder"));
