const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "production",
	entry: path.join(__dirname, "src", "main.tsx"),
	output: {
		path: path.resolve(__dirname, "dist"),
	},
	devServer: {
		client: {
			overlay: { errors: true, warnings: false },
		},
	},
	resolve: {
		roots: [path.resolve(__dirname, "src")],
		extensions: [".tsx", ".ts", ".js"],
		preferRelative: true,
		modules: [path.resolve(__dirname, "./src"), "node_modules"],
	},
	module: {
		rules: [
			{
				test: /\.?(js|ts|jsx|tsx)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env", "@babel/preset-react"],
						},
					},
					{
						loader: "ts-loader",
						options: {
							transpileOnly: true,
						},
					},
				],
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					"style-loader",
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
					"sass-loader",
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "index.html"),
		}),
	],
};
