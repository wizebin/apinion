module.exports = api => {
  const isTest = api.env('test');
  // You can use isTest to determine what presets and plugins to use.
  if (isTest) {
    return {
      presets: [
        ["@babel/preset-env", { targets: { node: 'current' } }]
      ],
      plugins: [
        "@babel/plugin-proposal-class-properties",
        ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
        "@babel/plugin-proposal-numeric-separator",
        "@babel/plugin-proposal-throw-expressions",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-transform-runtime",
      ]
    };
  }

  return {
    presets: [
      "@babel/preset-env",
    ],
    plugins: [
      "@babel/plugin-proposal-class-properties",
      ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
      "@babel/plugin-proposal-numeric-separator",
      "@babel/plugin-proposal-throw-expressions",
      "@babel/plugin-syntax-dynamic-import",
    ]
  }
};
