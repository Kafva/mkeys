const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: "development",
    devtool: "inline-source-map",

    entry: {
        content: './src/app/content.ts',       // Script that can interact with the page
        background: './src/app/background.ts', // Runs persistently in the background
        popup: './src/popup.tsx',              // The browser_action popup
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                // TS(X) loader
                test: /\.tsx?$/, 
                loader: "ts-loader" 
            },
            {
              // SCSS-loader
              test: /\.s[ac]ss$/i,
              use: [
                // Creates `style` nodes from JS strings
                "style-loader",
                // Translates CSS into CommonJS
                "css-loader",
                // Compiles Sass to CSS
                "sass-loader"
              ],
            },
        ]
    },
    plugins: [
        // Copy static resources into the dist directory
        new CopyWebpackPlugin({
          patterns: [
            { from: "icons", to: "icons" },
            { from: "_locales", to: "_locales" },
            { from: "./src/popup.html", to: "popup.html" },
            { from: "./src/manifest.json", to: "manifest.json" }
          ],
        }),
    ] 
};