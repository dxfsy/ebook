const state = {
    hotSearchOffsetY: 0,
    flapCardVisible: false,
    isEditMode: false, //书架是否是编辑模式
    shelfList: [], // 书架列表
    shelfSelected: [], // 书架中被选中的图书列表
    shelfTitleVisible: true, //书架标题是否显示（配合搜索框）
    currentType: 1 ,// 书架列表为1，书架分类列表为2
    shelfCategory: [], //书架分类列表数据
    shelfSearchList: [] //书架搜索列表
}
const mutations = {
    SET_HOT_SEARCH_OFFSETY(state, offsetY) {
        state.hotSearchOffsetY = offsetY;
    },
    SET_FLAP_CARD_VISIBLE(state, visible) {
        state.flapCardVisible = visible;
    },
    SET_IS_EDIT_MODE(state, isEditMode) {
        state.isEditMode = isEditMode
    },
    SET_SHELF_LIST(state, list) {
        state.shelfList = list
    },
    SET_SHELF_SELECTED(state, selected) {
        state.shelfSelected = selected
    },
    SET_SHELF_TITLE_VISIBLE(state, visible) {
        state.shelfTitleVisible = visible
    },
    SET_CURRENT_TYPE(state, type) {
        state.currentType = type
    },
    SET_SHELF_CATEGORY(state,category) {
        state.shelfCategory = category
    },
    SET_SHELF_SEARCH_LIST(state,list){
        state.shelfSearchList = list
    }
}

const actions = {
    setHotSearchOffsetY({ commit }, offsetY) {
        return commit('SET_HOT_SEARCH_OFFSETY', offsetY)
    },
    setFlapCardVisible({ commit }, visible) {
        return commit('SET_FLAP_CARD_VISIBLE', visible);
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
    setCurrentType({ commit }, type) {
        return commit('SET_CURRENT_TYPE', type)
    },
    setShelfCategory({commit},category) {
        return commit('SET_SHELF_CATEGORY',category)
    },
    setShelfSearchList({commit},list) {
        return commit('SET_SHELF_SEARCH_LIST',list)
    }
}

const getters = {
    hotSearchOffsetY(state) {
        return state.hotSearchOffsetY;
    },
    flapCardVisible(state) {
        return state.flapCardVisible;
    },
    isEditMode(state) {
        return state.isEditMode;
    },
    shelfList(state) {
        return state.shelfList;
    },
    shelfSelected(state) {
        return state.shelfSelected;
    },
    shelfTitleVisible(state) {
        return state.shelfTitleVisible;
    },
    currentType(state) {
        return state.currentType;
    },
    shelfCategory(state) {
        return state.shelfCategory;
    },
    shelfSearchList(state){
        return state.shelfSearchList
    }
}

export default {
    state,
    mutations,
    getters,
    actions
}