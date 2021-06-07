// Build for Firefox
//  web-ext sign --api-key $(cat ../secrets/mozilla_issuer) --api-secret $(cat ../secrets/mozilla.jwt)

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;

module.exports = {
    mode:  "production", // Pass [--env development] to webpack to modify
    // The inline-source-map infers a considerably bigger bundle and is only
    // relevant for an easier debugging experience
    devtool:  process.env.DEBUG ? "inline-source-map" : false,

    entry: {
        content: './src/extension/content.ts',       // Script that can interact with the page
        background: './src/extension/background.ts', // Runs persistently in the background
        popup: './src/popup.tsx',                    // The browser_action popup
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
                // Note that we do not want to emit the 
                // *.d.ts declaration file, the declerations under 
                // @types are included through tsconfig.json and not
                // through webpack 
                //test: /([^\.][^d])\.tsx?$/, 
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
      new DefinePlugin({
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
      })
    ] 
};
