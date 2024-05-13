//小仓库: catagory组件相关配置仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import { CategoryResponseData } from '@/api/product/attr/type'
import {CategoryState} from './types/type'
 
const useCategoryStore = defineStore('Category', {
    state: ():CategoryState => {
        return {
            // 存储一级分类数据的数据
            c1Arr: [],
            // 存储一级分类的id
            c1Id: '',
            //存储对应一级分类下二级分类的数据
            c2Arr: [],
            //收集二级分类的ID
            c2Id: '',
            //存储三级分类的数据
            c3Arr: [],
            //存储三级分类的ID
            c3Id: '',
        }
    },
    actions: {
        // 获取一级分类的数据
        async getC1() {
            let result: CategoryResponseData = await reqC1()
            console.log(result)
            if (result.code == 200) {
                this.c1Arr = result.data;
            }

        },
        // 获取二级分类的数据
        async getC2() {
            let result: CategoryResponseData = await reqC2(this.c1Id)
            console.log(result)
            if (result.code == 200) {
                this.c2Arr = result.data;
            }
        },
        // 获取三级分类的数据
        async getC3() {
            let result: CategoryResponseData = await reqC3(this.c2Id)
            console.log(result)
            if (result.code == 200) {
                this.c3Arr = result.data;
            }
        }

    },
    getters: {}
})

export default useCategoryStore
