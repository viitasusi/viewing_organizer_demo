/**
 * Created by ville on 24.3.2016.
 */
var path = require('path');
var webpack = require('webpack');
var $ = require("jquery");
injectTapEventPlugin = require("react-tap-event-plugin");

module.exports = {
    entry: './main.js',
    output: { path: __dirname + '/public', filename: 'bundle.js' },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
};
