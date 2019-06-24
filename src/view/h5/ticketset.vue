<template>
  <div class="ticketset boxright">
    <div class="filter-container">
      <el-input
        placeholder="请输入编号搜索"
        v-model="id"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <div class="filter-container" v-show="list">
      <div class="tip">姓名：{{list.Name}} &nbsp;&nbsp;&nbsp;&nbsp;票数：{{list.PraiseCount}}</div>
    </div>
    <div class="filter-container" v-show="list">
      <el-input
        placeholder="请输入增加票数"
        v-model="number"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleadd">增加</el-button>   
    </div>
  </div>
</template>
<script>

import request from "@/utils/request";
import Pagination from "@/components/Pagination";
var tabarr=[];
export default {
  name: "ticketset",
  components: { Pagination },
  data() {
    return {
      id:'',//编号id
      list:'',//结果名次
      number:'',//数量
    };
  },
  created() {
  },
  methods: {
    handleFilter() {
      if(this.id==''){
         this.$message({
            message: '请输入搜索编号',
            type: "error"
          }); 
          return
      }
      request({
        url: "Children/GetGame",
        method: "get",
        params: {id:this.id}
      }).then(response => {
        if (response.Status == 1) {
          if(!response.List){            
            this.$message({
              message: '没有此编号',
              type: "error"
            }); 
            return
          }
          this.list = response.List;         
        }
      });
    }, 
    handleadd(){    
      if(this.id==''){
         this.$message({
            message: '请输入搜索编号',
            type: "error"
          }); 
          return
      }
      if(this.number==''){
         this.$message({
            message: '请输入增加票数',
            type: "error"
          }); 
          return
      }
      if(this.number<0){
         this.$message({
            message: '请输入正确的票数',
            type: "error"
          }); 
          return
      }
      var data = this.$qs.stringify({id:this.id,number:this.number});  
      request({
        url: "Children/UpdateCount",
        method: "post",
        data
      }).then(response => { 
        if (response.Status == 1) {
          this.$message({
            message: response.Msg,
            type: "success"
          });    
        }else{
           this.$message({
            message: response.Msg,
            type: "error"
          }); 
        }
      });
    } 
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
  .ticketset .tip{    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    width: 245px;
    margin: 20px 0;}
</style>
