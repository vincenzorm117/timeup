const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                loaders: ['style-loader','css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ],
    output: {
        path: path.resolve(__dirname, 'wwwroot/'),
        filename: 'bundle.min.js'
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:44352',
                secure: false
            },
            '/assets': {
                target: 'http://localhost:44352',
                secure: false
            }
        }
    }

};