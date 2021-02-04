module.exports = {
    //路径前缀
    publicPath: "/",
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: (config) => {
    },
    css: {
        loaderOptions: {
            less: {
                // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
                lessOptions: {
                    modifyVars: {
                        // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
                        hack: `true; @import "./src/style/theme-vant.less";`,
                    },
                },
            },
        },
    },
    devServer: {
        port: 2021,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                ws: true,
                pathRewrite: {
                    '^/api': '/'
                }
            },
            '/ws': {
                target: 'http://localhost:3001/socket.io/',
                ws: true,
                pathRewrite: {
                    '^/ws': '/'
                }
            }
        }
    }
};
