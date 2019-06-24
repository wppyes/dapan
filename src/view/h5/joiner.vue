<template>
  <div class="joiner boxright">
   <el-tabs v-model="listQuery.type" type="card" @tab-click="handleFilter">
     <el-tab-pane label="儿童" name="0"></el-tab-pane>
     <el-tab-pane label="少年" name="1"></el-tab-pane>
  </el-tabs>
    <div class="filter-container">
      <el-input
        placeholder="请输入编号搜索"
        v-model="listQuery.id"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
      <el-input
        placeholder="请输入名字搜索"
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item"
        clearable
      /> 
      <el-select
        v-model="listQuery.status"
        placeholder="是否有作品"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option label="无作品" value="0" ></el-option>
        <el-option label="有作品" value="1" ></el-option>
        <el-option label="已晋级" value="2" ></el-option>
      </el-select> 
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
       <el-button  :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
            @click="handleDownload"
          >导出</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="编号" align="center" prop="Id" width="60px"></el-table-column>
      <el-table-column label="姓名" align="center" prop="Name" width="80px"></el-table-column>
      <el-table-column label="年龄" align="center" prop="Age" width="60px"></el-table-column>
      <el-table-column label="监护人" align="center" prop="ParentName" width="80px"></el-table-column>
      <el-table-column label="电话" align="center" prop="Phone" width="130px"></el-table-column>
      <el-table-column label="支行" align="center" prop="DotName"></el-table-column>
      <el-table-column label="作品" align="center" width="60px">
        <template slot-scope="scope">
          <img :src="scope.row.Pic+'?imageView2/1/w/40/h/40'" class="img" @click="bigimg(scope.row)">
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="Title"></el-table-column>
      <el-table-column label="票数" align="center" prop="PraiseCount" width="80px"></el-table-column>
      <el-table-column label="中奖名次" align="center" prop="WinRank" width="80px"></el-table-column>
      <el-table-column label="状态" align="center" prop="StatusStr" width="80px">
        <template slot-scope="scope">
          <span :class="'status'+scope.row.Status">{{scope.row.Status==0?'':scope.row.Status==1?'已参赛':'晋级'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="betop(scope.row)" v-if="scope.row.Status==1">
            晋级
          </el-button>
          <el-button size="mini" type="danger" @click="betop(scope.row)" v-if="scope.row.Status==2">
            取消晋级
          </el-button>
        </template>
      </el-table-column>
    </el-table> 
    <pagination
      layout="total,prev, pager, next"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
      :total="total"
    />
    
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="900px" style="text-align:center">
      <img :src="imgs" alt="" style="max-width:100%">
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "joiner",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//门店总数量
      listLoading: false, //列表加载
      downloadLoading:false,
      listQuery: {
        //搜素分页处理
        name:'',
        id:'',
        pageIndex: 1,
        pageSize: 10,
        type:'',
        status:''
      },
      dialogStatus:'',//标题
      dialogFormVisible:false,//是否展示
      imgs:''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "Children/GameList",
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
      this.listQuery.pageIndex = 1;
      this.getList();
    }, 
    handleDownload(row){
      this.downloadLoading = true;
      this.$confirm("确定要导出数据吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          request({
            url: "Children/Excel",
            method: "get",
            params: {}
          }).then(response => {
              if(response.Status==1){
                this.exportex(response,'大赛名单')
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
    betop(row){
        var str = ''; var istop = 2;
        if (row.Status==2) {
            str = "取消";
            istop = 1;
        }
        var data = this.$qs.stringify({ Id: row.Id, status: istop});
        this.$confirm('确定要' + str + '晋级吗？', "提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            request({
              url: "Children/Update",
              method: "post",
              data
            }).then(response => {
              if (response.Status==1) {
                row.Status = istop;
                this.$message({
                  message: response.Msg,
                  type: "success"
                });
              }
            });
          })
          .catch(() => {});
    },
    bigimg(row){
      this.dialogFormVisible=true;
      this.dialogStatus='名字：'+row.Name+'----标题：'+row.Title+'----编号：'+row.Id
      this.imgs=row.Pic
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.joiner {
  .img{width:40px; height:40px;}
  .status3{color:#F56C6C;}
  .status0{color:#67C23A;}
  .status1{color:#E6A23C;}
  .status2{color:#409EFF;}
  .status4{color:#909399;}
}
</style>
