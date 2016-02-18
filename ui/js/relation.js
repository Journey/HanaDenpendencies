var CollapsibleTree = function(elt) {
    var width = 1280,
        height = 980;
    var m = [50, 120, 20, 120],
        w = width - m[1] - m[3],
        h = height - m[0] - m[2],
        i = 0,
        root,
        root2;

    var tree = d3.layout.tree();
    var parentdiagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.x, -d.y];
        });

    var childdiagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.x, d.y];
        });
    var placeHolder = d3.select(elt);
    var svg = placeHolder.append("svg:svg");
    var vis = svg
        .append("svg:g");


    var that = {
        init: function(data) {
            var depth = data.parentDepth + data.childDepth + 1;
            var height = depth * 150;
	    var width = data.breadth * 300;
	    height = height > 900 ? height : 900;
	    width = width > 1280 ? width : 1280;
            var h = height - m[0] - m[2];
	    var w = width - m[1] - m[2];
            root = data;
            root.x0 = w / 2;
            root.y0 = h / 2;
            placeHolder.style("width", width).style("height", height);
            svg.attr("height", height).attr("width", width);
            tree.size([w, h]);
            vis.attr("transform", "translate(0," + ((h * data.parentDepth) / depth + 30) + ")");

            //root.children.forEach(that.toggleAll);
            this.updateBoth(root);
        },
        updateBoth: function(source) {
            var duration = d3.event && d3.event.altKey ? 5000 : 500;

            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse();

            // Normalize for fixed-depth.
            nodes.forEach(function(d) {
                d.y = d.depth * 150;
            });

            // Update the nodes…
            var node = vis.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id || (d.id = ++i);
                });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("svg:g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + source.x0 + "," + source.y0 + ")";
                })
                .on("click", function(d) {
                    that.toggle(d);
                    that.updateBoth(d);
                });

            nodeEnter.append("svg:circle")
                .attr("r", function(d) {
                    return 1e-6;
                })
		.attr("title",function(d){
		    return d.name;
		})
                .style("fill", function(d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeEnter.append("svg:text")
		.attr("title",function(d){
		    return d.name;
		})
                .attr("x", function(d) {
                    if (that.isParent(d)) {
                        return -10;
                    } else {
                        return d.children || d._children ? -10 : 10;
                    }
                })
                .attr("dy", ".35em")
                // .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                .attr("text-anchor", function(d) {
                    if (that.isParent(d)) {
                        return "end";
                    } else {
                        return d.children || d._children ? "end" : "start";
                    }
                })
                .attr("transform", function(d) {
                    if (d != root) {
                        if (that.isParent(d)) {
                            return "rotate(15)";
                        } else {
                            return "rotate(15)";
                        }
                    }
                })
                .text(function(d) {
                    return d.name;
                })
                .style("fill-opacity", 1e-6);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    if (that.isParent(d)) {
                        return "translate(" + d.x + "," + -d.y + ")";
                    } else {
                        return "translate(" + d.x + "," + d.y + ")";
                    }
                });

            nodeUpdate.select("circle")
                .attr("r", 4.5)
                .style("fill", function(d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + source.x + "," + source.y + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // Update the links…
            var link = vis.selectAll("path.link")
                .data(tree.links_parents(nodes).concat(tree.links(nodes)), function(d) {
                    return d.target.id;
                });

            // Enter any new links at the parent's previous position.
            link.enter().insert("svg:path", "g")
                .attr("class", "link")
                .attr("d", function(d) {
                    var o = {
                        x: source.x0,
                        y: source.y0
                    };
                    if (that.isParent(d.target)) {
                        return parentdiagonal({
                            source: o,
                            target: o
                        });
                    } else {
                        // return parentdiagonal({source: o, target: o});
                        return childdiagonal({
                            source: o,
                            target: o
                        });
                    }
                })
                .transition()
                .duration(duration)
                // .attr("d", parentdiagonal);
                .attr("d", function(d) {
                    if (that.isParent(d.target)) {
                        return parentdiagonal(d);
                    } else {
                        // return parentdiagonal(d);
                        return childdiagonal(d);
                    }
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                // .attr("d", parentdiagonal);
                .attr("d", function(d) {
                    if (that.isParent(d.target)) {
                        return parentdiagonal(d);
                    } else {
                        return childdiagonal(d);
                    }
                });

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    var o = {
                        x: source.x,
                        y: source.y
                    };
                    // return parentdiagonal({source: o, target: o});
                    if (that.isParent(d.target)) {
                        return parentdiagonal({
                            source: o,
                            target: o
                        });
                    } else {
                        return childdiagonal({
                            source: o,
                            target: o
                        });
                    }
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        },
        updateParents: function(source) {
            var duration = d3.event && d3.event.altKey ? 5000 : 500;

            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse();

            // Normalize for fixed-depth.
            nodes.forEach(function(d) {
                d.y = d.depth * 180;
            });

            // Update the nodes…
            var node = vis.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id || (d.id = ++i);
                });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("svg:g")
                .attr("class", "node")
                // .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                .attr("transform", function(d) {
                    return "translate(" + source.x0 + "," + source.y0 + ")";
                })
                .on("click", function(d) {
                    that.toggle(d);
                    that.updateParents(d);
                });

            nodeEnter.append("svg:circle")
                .attr("r", 1e-6)
                .style("fill", function(d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeEnter.append("svg:text")
                .attr("x", function(d) {
                    return d.children || d._children ? -10 : 10;
                })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function(d) {
                    return d.name;
                })
                .style("fill-opacity", 1e-6);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + -d.y + ")";
                });

            nodeUpdate.select("circle")
                .attr("r", 4.5)
                .style("fill", function(d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                // .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                .attr("transform", function(d) {
                    return "translate(" + source.x + "," + source.y + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // Update the links…
            var link = vis.selectAll("path.link")
                .data(tree.links(nodes), function(d) {
                    return d.target.id;
                });

            // Enter any new links at the parent's previous position.
            link.enter().insert("svg:path", "g")
                .attr("class", "link")
                .attr("d", function(d) {
                    var o = {
                        x: source.x0,
                        y: source.y0
                    };
                    return parentdiagonal({
                        source: o,
                        target: o
                    });
                })
                .transition()
                .duration(duration)
                .attr("d", parentdiagonal);

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", parentdiagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    var o = {
                        x: source.x,
                        y: source.y
                    };
                    return parentdiagonal({
                        source: o,
                        target: o
                    });
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        },
        updateChildren: function(source) {
            var duration = d3.event && d3.event.altKey ? 5000 : 500;

            // Compute the new tree layout.
            var nodes = tree.nodes(root2).reverse();

            // Normalize for fixed-depth.
            nodes.forEach(function(d) {
                d.y = d.depth * 180;
            });

            // Update the nodes…
            var node = vis.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id || (d.id = ++i);
                });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("svg:g")
                .attr("class", "node")
                // .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                .attr("transform", function(d) {
                    return "translate(" + source.x0 + "," + source.y0 + ")";
                })
                .on("click", function(d) {
                    that.toggle(d);
                    that.updateChildren(d);
                });

            nodeEnter.append("svg:circle")
                .attr("r", 1e-6)
                .style("fill", function(d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeEnter.append("svg:text")
                .attr("x", function(d) {
                    return d.children || d._children ? -10 : 10;
                })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function(d) {
                    return d.name;
                })
                .style("fill-opacity", 1e-6);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                // .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            nodeUpdate.select("circle")
                .attr("r", 4.5)
                .style("fill", function(d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                // .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                .attr("transform", function(d) {
                    return "translate(" + source.x + "," + source.y + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // Update the links…
            var link = vis.selectAll("path.link")
                .data(tree.links(nodes), function(d) {
                    return d.target.id;
                });

            // Enter any new links at the parent's previous position.
            link.enter().insert("svg:path", "g")
                .attr("class", "link")
                .attr("d", function(d) {
                    var o = {
                        x: source.x0,
                        y: source.y0
                    };
                    return childdiagonal({
                        source: o,
                        target: o
                    });
                })
                .transition()
                .duration(duration)
                .attr("d", childdiagonal);

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", childdiagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    var o = {
                        x: source.x,
                        y: source.y
                    };
                    return childdiagonal({
                        source: o,
                        target: o
                    });
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        },

        isParent: function(node) {
            if (node.parent && node.parent != root) {
                return this.isParent(node.parent);
            } else
            // if ( node.name == 'data' || node.name == 'scale' || node.name == 'util' ) {
            if (node.isparent) {
                return true;
            } else {
                return false;
            }
        },

        // Toggle children.
        toggle: function(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            if (d.parents) {
                d._parents = d.parents;
                d.parents = null;
            } else {
                d.parents = d._parents;
                d._parents = null;
            }
        },
        toggleAll: function(d) {
            if (d.children) {
                d.children.forEach(that.toggleAll);
                that.toggle(d);
            }
            if (d.parents) {
                d.parents.forEach(that.toggleAll);
                that.toggle(d);
            }
        }

    };

    return that;
};
