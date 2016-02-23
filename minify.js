var compressor = require('node-minify');
// Array 
new compressor.minify({
  type: 'gcc',
    fileIn: ['ui/js/lib/d3.min.js',
	     'ui/js/lib/react.min.js',
	     'ui/js/lib/react-dom.min.js',
	     'ui/js/render.js'
	    ],
  fileOut: 'ui/dist/main.js',
  callback: function(err, min){
    console.log(err);
    //console.log(min); 
  }
});

new compressor.minify({
  type: 'gcc',
    fileIn: ['ui/js/lib/d3.min.js',
	     'ui/js/lib/d3.layout.js',
	     'ui/js/util.js',
	     'ui/js/relation.js',
	     'ui/js/detail.js'
	    ],
  fileOut: 'ui/dist/detail.js',
  callback: function(err, min){
    console.log("detail::"+err);
    //console.log(min); 
  }
});



