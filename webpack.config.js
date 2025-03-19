const { exec } = require("child_process");
const path = require("path");

module.exports = (env, options) => {
    const { mode = "development" } = options;
    const rules = [
        {
            test: /\.m?js(x)?$/, // Handle both .js and .jsx files
            exclude: /node_modules/,
            use: [
                "html-tag-js/jsx/tag-loader.js",
                {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }
            ]
        },
        {
            test: /\.ts(x)?$/, // Handle both .ts and .tsx files
            exclude: /node_modules/,
            use: "ts-loader" // Use ts-loader for TypeScript files
        }
    ];

    const main = {
        mode,
        entry: {
            main: "./src/main.tsx" // Update your entry point if needed
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].js",
            chunkFilename: "[name].js"
        },
        module: {
            rules
        },
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx"] // Allow importing without specifying the extension
        },
        plugins: [
            {
                apply: compiler => {
                    compiler.hooks.afterDone.tap("pack-zip", () => {
                        exec(
                            "node .vscode/pack-zip.js",
                            (err, stdout, stderr) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                console.log(stdout);
                            }
                        );
                    });
                }
            }
        ]
    };

    return [main];
};
