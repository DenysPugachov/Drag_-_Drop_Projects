const path = require("path") // allows build absolute path  to certain folder path.resolve(__dirname, "folderName")

module.exports = {
  mode: "development",
  entry: "./src/app.ts",// file to start project
  output: {
    filename: "bundle.js",//name for file to compile all code
    path: path.resolve(__dirname, 'dist'),// absolute path to output folder
    publicPath: "dist",//virtual output
  },
  devtool: "inline-source-map",// extract source map and this correctly
  //tell webpack what to do with *.ts files
  module: {
    //rules for all the files (with "loaders")
    rules: [
      {
        test: /\.ts/, //testing is this rule ca-n be applied to this file
        use: "ts-loader",//what to do with this files (use "ts-loader" package)
        exclude: /node_modules/,// do NOT look in there (node_modules)
      }
    ]
  },
  //which file extensions will added to import
  resolve: {
    extensions: [".ts", ".js"],// look for .ts and .js files
  },
}