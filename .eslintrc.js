module.exports = {
 "plugins": ["sonarjs"],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
    "plugin:sonarjs/recommended-legacy",
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": 1,
    "sonarjs/no-duplicate-string": 1
  },
};
