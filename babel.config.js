module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false,
            },
        ],
    ],
    plugins: [
        // '@babel/plugin-transform-modules-amd',
        '@babel/plugin-proposal-private-property-in-object',
        '@babel/plugin-proposal-class-properties',
    ],
};
