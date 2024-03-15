const gitRepoUrl = 'http://redmine.mobilon.ru:5000/amoCrm/amotop';

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
  sourceLinkTemplate: `${gitRepoUrl}/files/tip/{path}#L{line}`,
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
