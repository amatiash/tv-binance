let path  = require('path'),
    isDev = process.env['NODE_ENV'] !== 'production';

// ----------------------------------------------------

let config = {
    entry : {
        'content'   : './dev/js/content.js',
        'background': './dev/js/background.js',
    },
    output: {
        path    : path.join(__dirname, 'dev/js/bundle'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test   : /\.js$/,
                exclude: /node_modules/,
                use    : ['babel-loader'],
            },
            {
                test  : /\.handlebars$/,
                loader: "handlebars-loader"
            },
            {
                test: /\.(s*)css$/,
                use : [
                    'style-loader',
                    {
                        loader : 'css-loader',
                        options: {
                            sourceMap    : isDev && true,
                            importLoaders: 2
                        }
                    },
                    {
                        loader : 'postcss-loader',
                        options: {
                            sourceMap: isDev && true
                        }
                    },
                    {
                        loader : 'sass-loader',
                        options: {
                            sourceMap: isDev && true
                        }
                    }
                ]
            }
        ]
    }
};

// Context config
// ----------------------------------------------------

if(isDev){
    config.watch = true;
}

// ----------------------------------------------------

module.exports = config;