const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		demo: './src/demo/index.js',
		server: './src/server/App.js',
	},
	output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
				]
			},
		],
	},
};
