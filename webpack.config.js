const webpack = require("webpack");
const path = require("path");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssets = require("optimize-css-assets-webpack-plugin");

const env = process.env.NODE_ENV;

let config =
{
    context: path.resolve(__dirname, 'src'),
    entry: {
        bundle: "./index.jsx",
        styles: './stylesheets/styles.scss'
    },
    output:
    {
    	path: path.resolve(__dirname, "./public"),
    	filename: "assets/js/[name].js"
    },
    module:
    {
        rules:
        [{
        	test: /\.(js|jsx)$/,
        	exclude: /node_modules/,
        	loader: "babel-loader"
        },
        {
			test: /\.scss$/,
			use: ['css-hot-loader'].concat(ExtractTextWebpackPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader', 'sass-loader', 'postcss-loader'],
  			}))
		}]
    },
    plugins: [
    	new ExtractTextWebpackPlugin("assets/stylesheets/styles.css")
    ],
    devServer:
    {
		contentBase: path.resolve(__dirname, "./public"),
		historyApiFallback: true,
		inline: true,
		open: true,
		hot: true
	},
	devtool: "eval-source-map"
}

module.exports = config;

if (env === 'production')
{
	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin(),
		new OptimizeCSSAssets()
	);
}