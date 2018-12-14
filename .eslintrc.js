module.exports = {
  root: true,
  parser: "babel-eslint",
  plugins: [
    "react",
    "class-property"
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    amd: true,
    mocha: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
     jsx: true
    }
  },
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
    'jsx-a11y/anchor-is-valid': 'off',
    'react/forbid-prop-types': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/label-has-for': 'off' 
  },
  extends: [
    "airbnb"
  ],
  settings: {
    "import/resolver": "webpack"
  }
};
