<template>
  <div class="prizeset boxright">
    <div class="filter-container">
      <el-input
        placeholder="请输入标题/手机号码/姓名"
        v-model="listQuery.title"
        style="width: 250px;"
        class="filter-item"
        clearable
      />  
      <el-date-picker
          v-model="value6"
          type="daterange"
          unlink-panels
          range-separator="至"
          class="filter-item"
          value-format="yyyy-MM-dd"
          clearable
          start-placeholder="开始日期"
          end-placeholder="结束日期" />
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
      <el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">下载</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="活动名称" align="center" prop="Prize"></el-table-column>
      <el-table-column label="收货人" align="center" prop="Name"></el-table-column>
      <el-table-column label="电话" align="center" prop="Phone"></el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.Address}}</span>          
        </template>
      </el-table-column>
      <el-table-column label="物流名称" align="center" prop="LogisticsName">
      </el-table-column>
      <el-table-column label="物流单号" align="center" prop="LogisticsCode">
      </el-table-column>
      <el-table-column label="时间" align="center" prop="CreateTimeStr">
      </el-table-column>
      <el-table-column label="发货时间" align="center" prop="UpdateTimeStr">
      </el-table-column>
      <!-- <el-table-column label="详情" align="center" prop="LogisticCode">
         <template slot-scope="scope">
          <el-tag size="mini" type="primary" @click="detail(scope.row)" v-if="scope.row.Remark" style="cursor: pointer;">
            详情
          </el-tag>
        </template>
      </el-table-column> -->
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
import upfile from '@/utils/upload';
export default {
  name: "prizeset",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      value6:'',
      downloadLoading:false,
      listQuery: {
        //搜素分页处理
        title: '',
        page: 1,
        sum: 15
      },
      time1:'',
      time2:'',
     
    };
  },
  watch:{
    value6(val, oldval) {
      if(val){
        this.time1 = val[0];
        this.time2 = val[1];
      }else{
        this.time1='';
        this.time2='';
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
        url: "Prize/GetPrizeList",
        method: "get",
        params: this.listQuery
      }).then(response => {
          this.listLoading = false;
        if (response.Status == 1) {
          this.list=[];
          this.total=0;
          if(response.List){
            this.list = response.List.DataList;
            this.total = response.List.TotalPage;
          }
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },  
    handleDownload(){
      if (this.time2=='') {
        this.$message({
          message: "请选择时间！！",
          type: "danger"
        });
        return;
      }
      this.downloadLoading = true;
      this.$confirm("确定要导出物流信息吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          request({
            url: "Prize/ExcelOrder",
            method: "get",
            params: {time1:this.time1,time2:this.time2}
          }).then(response => {
              if(response.Status==1){
                this.exportex(response,'物流信息')
                this.downloadLoading = false
              }          
          });          
        }).catch(() => {   
          this.downloadLoading = false      
        });
    },
    exportex(response,title){
      import('@/vendor/Export2Excel').then(excel => {
          const tHeader = response.TableTitle;
          const filterVal = response.TableField;
          const data = this.formatJson(filterVal, response.List)
          if(response.List){
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename:  title
            });
          }
        
      }); 
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    }, 
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.prizeset .wuliuinfo li{list-style: none; line-height:22px; margin-bottom: 10px; display: flex;}
.prizeset .wuliuinfo span{color: #999; margin-right: 10px; width: 145px;}
</style>
