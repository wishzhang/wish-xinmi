module.exports = {
    //路径前缀
    publicPath: "/",
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = '信迷'
                return args
            })

        config.module
            .rule('change-markdown')
            .test(/\.md$/)
            .use('text-loader')
            .loader('text-loader')
            .end()
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
            [process.env.VUE_APP_MINIO_API]: {
                target: `${process.env.VUE_APP_MINIO_PROXY}`,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_MINIO_API]: process.env.VUE_APP_MINIO_API
                }
            },
            [process.env.VUE_APP_BASE_API]: {
                target: `${process.env.VUE_APP_SERVER_PROXY}`,
                ws: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: '/'
                }
            }
        }
    }
};
