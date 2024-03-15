const gitRepoUrl = 'https://github.com/mobilon-org/amotop';

module.exports = {
  entryPoints: [
    "./src/index.ts",
    // "./src/interfaces/index.ts"
  ],
  out: "docs",
  validation: {
    "notExported": true,
    "invalidLink": true,
    "notDocumented": false
  },
  sourceLinkTemplate: `${gitRepoUrl}/blob/main/{path}#L{line}`,
  includeVersion: true,
  sourceLinkExternal: true,
  // categorizeByGroup: true,
  navigation: {
    "includeCategories": true,
    "includeGroups": true,
    "includeFolders": true
  },
  "groupOrder": [
    "Classes",
    "Variables",
    "Functions",
    "*",
  ],
};
