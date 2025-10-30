const path = require("path");

module.exports = {
  entry: "./frontend/src/index.js",
  output: {
    path: path.resolve(__dirname, "frontend/public"),
    filename: "bundle.js",
    publicPath: "/"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    extensions: [".js"]
  },
  devServer: {
    static: path.resolve(__dirname, "frontend/public"),
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: true,
     proxy: [
    {
      context: ['/api'],
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
      onError(err, req, res) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('Error connecting to backend.');
      }
    }
  ]
  }
};
