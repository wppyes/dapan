<template>
  <div class="activitystatistics boxright">    
    <div class="filter-container">      
      <el-date-picker
        class="filter-item"
        v-model="value7"
        type="daterange"
        align="left"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions2"
        value-format="yyyy-MM-dd"
        style="width:380px;"
      ></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row show-summary :summary-method="setsum">
      <el-table-column label="标题" align="center" prop="Title" width="300px"></el-table-column>
      <el-table-column label="PV" align="center" prop="BowserPv"></el-table-column>
      <el-table-column label="UV" align="center" prop="BowserUv"></el-table-column>
      <el-table-column label="参与人数" align="center" prop="ActorCount"></el-table-column>
      <el-table-column label="奖品数量" align="center" prop="PrizeNum"></el-table-column>
      <el-table-column label="领奖数量" align="center" prop="CashNum"></el-table-column>
      <el-table-column label="开奖时间" align="center" prop="AwardTimeStr"></el-table-column>
    </el-table>                 
    <pagination
      small
      layout="prev, pager, next"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.sum"
      @pagination="getList"
    />
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "activitystatistics",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//
      listLoading: false, //列表加载
      value7: "",
      pickerOptions2: {
        disabledDate(time) {
            let deta1=(new Date("2019/06/15 0:0:0")).getTime();
            return time.getTime() < deta1;
        },
      },
      listQuery: {
        //搜素分页处理
        page: 1,
        sum: 10,
        starttime:'',
        endtime:''
      },
      model:{}
    };
  },
  watch: {
    value7(val, oldval) {
      if(val){
        this.listQuery.starttime = val[0];
        this.listQuery.endtime = val[1];
      }else{
        this.listQuery.starttime='';
        this.listQuery.endtime='';
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "ActivityStat/GetActivityStatList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          this.listLoading = false;
          this.list = response.List.DataList;
          this.total = response.List.TotalPage;
          this.model=response.StatModel;
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    setsum(param){
       const { columns,  data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if(index === 0) {
            sums[index] = '汇总：';
            return;
          }
          switch(column.property) {
            case "BowserPv":
              sums[index] = this.model.CBowserPv;
            break;
            case "BowserUv":
              sums[index] = this.model.CBowserUv;
            break;
            case "ActorCount":
              sums[index] = this.model.CActorCount ;
            break;
            case "PrizeNum":
              sums[index] = this.model.CPrizeNum ;
            break;
            case "CashNum":
              sums[index] = this.model.CCashNum;
            break;
            default:
            break;
          }
      });
      return sums;
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
