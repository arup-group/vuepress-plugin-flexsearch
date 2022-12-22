const { path } = require("@vuepress/shared-utils");
const { getPageText } = require("./src/utils");

let defaultSearchOptions = {
  encode: "icase",
  tokenize: "forward",
  resolution: 9,
  doc: {
    id: "key",
    field: ["title", "content", "headers"],
  },
};

const DEFAULT_SEARCH_RESULT_LENGTH = 60;

module.exports = (options) => ({
  extendPageData($page) {
    $page.content = getPageText($page, options.noExtraSpaceAfterHtmlTag);
    const section_path = (/[^\/]+/.exec($page.regularPath) || ["Home"])[0]
    // if there is no nicely formated text for the section in the plugin options, split into words and make title case
    $page.section = options['section_names'][section_path] || section_path.split(/[\s-_]/).map(w => w[0].toUpperCase()+w.slice(1)).join(' ')
  },
  alias: {
    "@SearchBox": path.resolve(__dirname, "src", "SearchBox.vue"),
  },
  // implementation based on https://github.com/z3by/vuepress-plugin-flexsearch/pull/37
  clientDynamicModules: () => {
    const hooks = options.hooks || { }
    const nullHook = () => {}
    return {
      name: "select-hooks.js",
      content: `export default {
        beforeNavToSelectedSuggestion: ${hooks.beforeNavToSelectedSuggestion || nullHook}
      }`
    };
  },
  define: {
    SEARCH_OPTIONS: options.search_options || defaultSearchOptions,
    SEARCH_MAX_SUGGESTIONS: options.maxSuggestions || 10,
    SEARCH_PATHS: options.searchPaths || null,
    SEARCH_HOTKEYS: options.searchHotkeys || "s",
    SEARCH_RESULT_LENGTH:
      Number(options.searchResultLength) || DEFAULT_SEARCH_RESULT_LENGTH,
    SEARCH_SPLIT_HIGHLIGHTED_WORDS: options.splitHighlightedWords || null,
  },
});
