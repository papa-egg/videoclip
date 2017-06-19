var webpack = require('webpack');
var path = require('path');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.min.js', ['index']);
var fs = require('fs');

var files = fs.readdirSync('./src/js/lib');
var fileObj = {};

for (var p of files) {
    var _index = isJsSuffix(p);
    
    if (_index > -1) {
        fileObj[p.slice(0, _index)] = './src/js/lib/' + p;
    }
}

function isJsSuffix(filename) {
    var _index = filename.lastIndexOf('.');
    
    if (filename.slice(_index + 1) === 'js') {
        return _index;
    }
    
    return -1;
}

//console.log(fileObj);

fileObj = {
    videoclip: './src/js/lib/videoclip.js',
};

module.exports = {
    //插件项
    plugins: [commonsPlugin],
    //页面入口文件配置
    entry: fileObj,
    //入口文件输出配置
    output: {
        path: path.join(__dirname, '/src/js'),
        filename: '[name].min.js',
        publicPath: '/src/js/'
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel', query: { presets: ['es2015'] } },
            { test: /\.jsx$/, loader: 'jsx-loader?harmony' },
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    //其它解决方案配置
    resolve: {
        extensions: ['', '.js', '.json', '.scss'],
        alias: {
            AppStore : 'js/stores/AppStores.js',
            ActionType : 'js/actions/ActionType.js',
            AppAction : 'js/actions/AppAction.js'
        }
    }
};