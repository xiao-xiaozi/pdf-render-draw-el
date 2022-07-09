module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    // 'plugin:vue/essential',
    "standard",
    "plugin:vue/vue3-recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    // ecmaVersion: 6,
    // sourceType: 'module',
    // ecmaFeatures: {
    //   modules: true
    // },
    // requireConfigFile: false,
    // parser: '@babel/eslint-parser'
  },
  plugins: ["vue", "prettier"],
  rules: {
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["index"], // 需要忽略的组件名
      },
    ],
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-console": "off",
  },
};
