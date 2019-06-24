<template>
  <div class="assist boxright">
     <div class="filter-container">
      <el-input
        placeholder="请输入编号搜索"
        v-model="userid"
        style="width: 250px;"
        class="filter-item"
        clearable
      />  
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>    
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="标题" align="center" prop="Title"></el-table-column>
      <el-table-column label="时间" align="center" prop="WinTimeStr"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleclick(scope.row,scope.$index)">
            操作
          </el-button>
        </template>
      </el-table-column>
    </el-table> 
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  name: "assist",
  data() {
    return {
      userid:'',
      listLoading:false,
      list:[],
    };
  },
  created() {
    
  },
  methods: {
    handleFilter(){
      this.listLoading = true;
      request({
        url: "DrawPool/GetPoolList",
        method: "get",
        params: {userid:this.userid}
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          this.listLoading = false;
        }
      });
    },
    handleclick(row,index){
        var data = this.$qs.stringify({id:row.Id});
        request({
          url: "DrawPool/SetPool",
          method: "post",
          data
        }).then(response => {
          if (response.Status==1) {        
            this.$message({
              message: response.Msg,
              type: "success"
            });          
          }          
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
