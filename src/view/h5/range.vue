<template>
  <div class="range boxright">
   <el-tabs v-model="listQuery.type" type="card" @tab-click="handleFilter">
     <el-tab-pane label="儿童" name="0"></el-tab-pane>
     <el-tab-pane label="少年" name="1"></el-tab-pane>
  </el-tabs>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="编号" align="center" prop="Id"></el-table-column>
      <el-table-column label="姓名" align="center" prop="Name"></el-table-column>
      <el-table-column label="年龄" align="center" prop="Age"></el-table-column>
      <el-table-column label="监护人" align="center" prop="ParentName"></el-table-column>
      <el-table-column label="电话" align="center" prop="Phone"></el-table-column>
      <el-table-column label="支行" align="center" prop="DotName"></el-table-column>
      <el-table-column label="作品" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.Pic+'?imageView2/1/w/40/h/40'" class="img">
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="Title"></el-table-column>
      <el-table-column label="票数" align="center" prop="PraiseCount"></el-table-column>
      <el-table-column label="排名" align="center" prop="WinRank"></el-table-column>
    </el-table> 
    
    <pagination
      small
      layout="prev, pager, next"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "range",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//门店总数量
      listLoading: false, //列表加载
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        type:''
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "Children/GameRankingsList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List.DataList;
          this.total = response.List.TotalPage;
          this.listLoading = false;
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    }, 
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.range {
  .img{width:40px; height:40px;}
}
</style>
