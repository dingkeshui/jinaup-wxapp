import {special} from '../../api/index'
const state = {
    list:[],
    banner:null,
    title:null,
    info:''
}

const mutations = {
    upstate(state,payload){
        state.list = {...payload.list.data.result.anchors};
        state.banner = payload.list.data.result.specialImg;
        state.title = payload.list.data.result.specialName;
        state.info = payload.list.data.result;
    }
}

const actions = {
    getList({commit},payload){
        return new Promise(async(resolve, reject)=>{
            let result = await special({siid:payload.siid})
            console.log('result',result)
            commit('upstate',{list:result})
            resolve(result);
        })
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
