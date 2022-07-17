const state = {
    filename: '',
    menuVisible: false,
    settingVisible: -1, //-1不显示 0表示字体 1表示主题 2表示进度 3表示目录
    defaultFontSize: 16,
    currentBook: null,
    defaultFontFamily: 'Default',
    fontFamilyVisible: false,
    defaultTheme: 'Default',
    bookAvailable: false,
    progress: 0,
    section: 0,
    isPaginating: true,

    navigation: null,
    cover: null,
    metadata: null,
    paginate: '',
    pagelist: null,
    offsetY: 0,
    isBookmark: null
};
const mutations = {
    SET_FILENAME(state, filename) {
        state.filename = filename;
    },
    SET_MENUVISIBLE(state, menuVisible) {
        state.menuVisible = menuVisible;
    },
    SET_SETTTING_VISIBLE(state, settingVisible) {
        state.settingVisible = settingVisible;
    },
    SET_DEFAULT_FONT_SIZE(state, defaultFontSize) {
        state.defaultFontSize = defaultFontSize;
    },
    SET_CURRENTBOOK(state, currentBook) {
        state.currentBook = currentBook;
    },
    'SET_DEFAULT_FONT_FAMILY': (state, font) => {
        state.defaultFontFamily = font
    },
    'SET_FONT_FAMILY_VISIBLE': (state, visible) => {
        state.fontFamilyVisible = visible
    },
    'SET_DEFAULT_THEME': (state, theme) => {
        state.defaultTheme = theme
    },
    'SET_BOOK_AVAILABLE': (state, bookAvailable) => {
        state.bookAvailable = bookAvailable
    },
    'SET_PROGRESS': (state, progress) => {
        state.progress = progress
    },
    'SET_SECTION': (state, section) => {
        state.section = section
    },
    'SET_IS_PAGINATING': (state, isPaginating) => {
        state.isPaginating = isPaginating
    },

    'SET_NAVIGATION': (state, navigation) => {
        state.navigation = navigation
    },
    'SET_COVER': (state, cover) => {
        state.cover = cover
    },
    'SET_METADATA': (state, metadata) => {
        state.metadata = metadata
    },
    'SET_PAGINATE': (state, paginate) => {
        state.paginate = paginate
    },
    'SET_PAGELIST': (state, pagelist) => {
        state.pagelist = pagelist
    },
    'SET_OFFSETY': (state, offsetY) => {
        state.offsetY = offsetY
    },
    'SET_IS_BOOKMARK': (state, isBookmark) => {
        state.isBookmark = isBookmark
    }
};
const actions = {
    setFileName({ commit }, filename) {
        return commit('SET_FILENAME', filename);
    },
    setMenuVisible({ commit }, menuVisible) {
        return commit('SET_MENUVISIBLE', menuVisible);
    },
    setSettingVisible({ commit }, settingVisible) {
        return commit('SET_SETTTING_VISIBLE', settingVisible)
    },
    settingDefaultFontSize({ commit }, defaultFontSize) {
        return commit('SET_DEFAULT_FONT_SIZE', defaultFontSize);
    },
    setCurrentBook({ commit }, currentBook) {
        return commit('SET_CURRENTBOOK', currentBook);
    },
    setFontFamilyVisible: ({ commit }, visible) => {
        return commit('SET_FONT_FAMILY_VISIBLE', visible)
    },
    setDefaultFontFamily: ({ commit }, font) => {
        return commit('SET_DEFAULT_FONT_FAMILY', font)
    },




    setDefaultTheme: ({ commit }, theme) => {
        return commit('SET_DEFAULT_THEME', theme)
    },
    setBookAvailable: ({ commit }, bookAvailable) => {
        return commit('SET_BOOK_AVAILABLE', bookAvailable)
    },
    setProgress: ({ commit }, progress) => {
        return commit('SET_PROGRESS', progress)
    },
    setSection: ({ commit }, section) => {
        return commit('SET_SECTION', section)
    },
    setIsPaginating: ({ commit }, isPaginating) => {
        return commit('SET_IS_PAGINATING', isPaginating)
    },

    setNavigation: ({ commit }, navigation) => {
        return commit('SET_NAVIGATION', navigation)
    },
    setCover: ({ commit }, cover) => {
        return commit('SET_COVER', cover)
    },
    setMetadata: ({ commit }, metadata) => {
        return commit('SET_METADATA', metadata)
    },
    setPaginate: ({ commit }, paginate) => {
        return commit('SET_PAGINATE', paginate)
    },
    setPagelist: ({ commit }, pagelist) => {
        return commit('SET_PAGELIST', pagelist)
    },
    setIsBookmark({ commit }, isBookmark) {
        return commit('SET_IS_BOOKMARK', isBookmark)
    },
    setOffsetY({ commit }, offsetY) {
        return commit('SET_OFFSETY', offsetY)
    },

    setFlapCardVisible({ commit }, flapCardVisible) {
        return commit('SET_FLAP_CARD_VISIBLE', flapCardVisible)
    },
    setIsEditMode({ commit }, isEditMode) {
        return commit('SET_IS_EDIT_MODE', isEditMode)
    },
    setShelfList({ commit }, list) {
        return commit('SET_SHELF_LIST', list)
    },
    setShelfSelected({ commit }, selected) {
        return commit('SET_SHELF_SELECTED', selected)
    },
    setShelfTitleVisible({ commit }, visible) {
        return commit('SET_SHELF_TITLE_VISIBLE', visible)
    },
    setShelfCategory({ commit }, category) {
        return commit('SET_SHELF_CATEGORY', category)
    },
    setCurrentType({ commit }, type) {
        return commit('SET_CURRENT_TYPE', type)
    }
};
const getters = {
    filename(state) {
        return state.filename;
    },
    menuVisible(state) {
        return state.menuVisible;
    },
    settingVisible(state) {
        return state.settingVisible;
    },
    defaultFontSize(state) {
        return state.defaultFontSize;
    },
    currentBook(state) {
        return state.currentBook;
    },
    defaultFontFamily: state => state.defaultFontFamily,
    fontFamilyVisible: state => state.fontFamilyVisible,
    defaultTheme: state => state.defaultTheme,
    bookAvailable: state => state.bookAvailable,
    progress: state => state.progress,
    section: state => state.section,
    isPaginating: state => state.isPaginating,

    navigation: state => state.navigation,
    cover: state => state.cover,
    metadata: state => state.metadata,
    paginate: state => state.paginate,
    pagelist: state => state.pagelist,
    offsetY: state => state.offsetY,
    isBookmark: state => state.isBookmark,
};

export default {
    state,
    mutations,
    actions,
    getters,
}