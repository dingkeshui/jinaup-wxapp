import {addAddress} from '@/api/index'

const state ={

}
const actions = {
    submit({commit},payload){
      return new Promise(async (resolve,reject)=>{
      	console.log('收货地址',payload)
         let data =await addAddress();
         resolve(data)
      })
    }
}

export default{
   namespaced: true,
   state,
   actions
}