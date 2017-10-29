const path = require('path');
const Uglify = require("uglifyjs-webpack-plugin");

module.exports = {
	entry: './build/script.js',
	output: {
		path: path.resolve(__dirname),
		filename: 'script.js'
	},
	plugins: [
		new Uglify()
	]
};
