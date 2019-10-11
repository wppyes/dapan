<template>
  <div class="activity boxright">
   <el-tabs v-model="listQuery.type" type="card" @tab-click="handleFilter">
    <el-tab-pane v-for="item in Model" :label="item.Text" :name="item.Value" :key="item.Value"></el-tab-pane>
  </el-tabs>
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="linktoadd(0)">
          <i class="el-icon-circle-plus"></i> 增加活动
        </el-button>
      </div>
      <el-input
        placeholder="请输入活动标题"
        v-model="listQuery.title"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
      <el-select
        v-model="listQuery.awardtype"
        placeholder="选择用户类型"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in ModelType" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select> 
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="Id" align="center" prop="Id" width="80px"></el-table-column>
      <el-table-column label="类型" align="center" prop="TypeName" width="80px"></el-table-column>
      <el-table-column label="标题" align="center" prop="Title" width="200px"></el-table-column>
      <el-table-column label="图片" align="center" width="60px">
        <template slot-scope="scope">
          <img :src="scope.row.Cover+'?imageView2/1/w/40/h/40'" class="img">
        </template>
      </el-table-column>
      <el-table-column label="奖品" align="center">
        <el-table-column label="类型" align="center" width="100px" prop="PrizeTypeName">
            <template slot-scope="scope">
             {{scope.row.PrizeTypeName}}
             <div>
                {{scope.row.PTypeName}}
             </div>
            </template>
        </el-table-column>
        <el-table-column label="名称" align="center" width="120px" prop="PrizeTitle"></el-table-column>
        <el-table-column label="数量" align="center" width="60px" prop="PrizeNum"></el-table-column>
      </el-table-column>      
      <el-table-column label="开奖时间" align="center" width="140px" prop="AwardTimeStr" v-if="listQuery.type==0"></el-table-column>
      <el-table-column label="开奖人数" align="center" width="100px" prop="AwardNumber" v-if="listQuery.type==1"></el-table-column>
      <el-table-column label="总参与人数" align="center" prop="ActorCount" width="100px"></el-table-column>
      <el-table-column label="状态" align="center" prop="StatusStr" width="80px">
        <template slot-scope="scope">
          <span :class="'status'+scope.row.Status">{{scope.row.StatusStr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="linktoadd(scope.row.Id)" v-if="scope.row.Status==0 || scope.row.Status==3">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row,2)" v-if="scope.row.Status==0 || scope.row.Status==3">
            <i class="el-icon-delete"></i>
          </el-button>
          <el-button size="mini" type="success" @click="handledel(scope.row,0)" v-if="scope.row.Status==3">
            上架
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row,3)" v-if="scope.row.Status==0">
            下架
          </el-button>
          <el-button size="mini" @click="undata(scope.row)" v-if="scope.row.Status==0">
            更新
          </el-button>
          <el-button size="mini" @click="clone(scope.row)" v-if="scope.row.Status==0 || scope.row.Status==3 || scope.row.Status==1">
            克隆
          </el-button><br>
          <br>
          <el-button size="mini" type="success" @click="betop(scope.row)" v-if="scope.row.IsTop==0 && scope.row.Status==0">
            置顶
          </el-button>
          <el-button size="mini" type="danger" @click="betop(scope.row)" v-if="scope.row.IsTop==1 && scope.row.Status==0">
            取消置顶
          </el-button>
          <el-button size="mini" type="" @click="quan(scope.row)" v-if="scope.row.PType>0">
            导入券码
          </el-button>
          <el-button
          v-if="scope.row.Status==1"
          size="mini"        
            :loading="downloadLoading"
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            @click="handleDownload1(scope.row)"
          >全部</el-button>
          <el-button
          v-if="scope.row.Status==1"
          size="mini" 
            :loading="downloadLoading1"
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            @click="handleDownload(scope.row)"
          >中奖</el-button>
        </template>
      </el-table-column>
    </el-table> 
    
    <el-dialog title="导入券码" :visible.sync="dialogquanVisible" :close-on-click-modal="false" width="500px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 350px; margin-left:50px;"
      >  
        <div style="margin:0 0 20px 0" v-show="count!=0">
         <el-button type="danger" @click="del">一键清空</el-button><span class="qingkong">【{{count}}】条数据</span>
        </div>     
       
        <el-upload
            class="upload-demo"
            drag
            ref="upload"
            accept=".xls,.xlsx"
            action=""
            :http-request="upLoad"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogquanVisible = false">取消</el-button>
        <el-button type="primary" @click="subfile">确定</el-button>
      </div>
    </el-dialog>
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
import upfile from "@/utils/upload";
var tabarr=[];
export default {
  name: "activity",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//门店总数量
      listLoading: false, //列表加载
      downloadLoading:false,
      downloadLoading1:false,
      listQuery: {
        //搜素分页处理
        title:'',
        page: 1,
        sum: 10,
        awardtype:'',
        type:''
      },
      Model:[],
      ModelType:[],
      dialogquanVisible:false,
      count:0,
      temp:{
          aid:0,
          filepath:'',
          type:0
      },      
      rules:{  
        filepath: [
          { required: true, message: "请上传文件！", trigger: "blur" }
        ]
      },
    };
  },
  created() {
    this.getModel();
    this.getList();
  },
  mounted () {
    this.$bus.$on('change', ()=> {
      this.getList()
    })
  },
  methods: {
    subfile(){      
      this.$refs["dataForm"].validate(valid => {
        if (valid) { 
          var param={
              aid:this.temp.aid,
              filepath:this.temp.filepath,
              type:this.temp.type
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "DrawActivity/UploadQM",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {        

              this.$message({
                message: response.Msg,
                type: "success"
              });
              this.count=this.count+response.Count;
              this.$nextTick(() =>{                
                this.$refs.upload.clearFiles();
              })
            }
          });
        }
      });
    },
    upLoad(param) {
      upfile(param.file, "Upload/UploadFile?folder=DrawPrize", data => {
        if (data.Status) {
          this.temp.filepath = data.Path;
        } else {
          this.$message({
            message: data.Msg,
            type: "error"
          });
        }
      });
    },
    del(){
      var param={
        aid:this.temp.aid
      }
      var data = this.$qs.stringify(param);
        request({
          url: "DrawActivity/UpdateIsCode",
          method: "post",
          data
        }).then(response => {
          if (response.Status==1) {    
            this.count=0;     
            this.$message({
              message: response.Msg,
              type: "success"
            });
          }
        });
    },
    getList(){
      this.listLoading = true;
      request({
        url: "DrawActivity/GetDrawActivityList",
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
    quan(row){
      this.temp.aid=row.Id;
      this.temp.filename='';      
      if(row.IsCode){
        this.temp.type=0;
      }   
      if(row.IsKalman){
        this.temp.type=1;
      }      
      request({
        url: "DrawActivity/GetCod",
        method: "get",
        params: {aid:row.Id}
      }).then(response => {
        if (response.Status == 1) {
          this.count=response.Count;
        }
      });
      this.dialogquanVisible=true;
    },
    getModel(){
      request({
        url: "DrawActivity/AwardDDL",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.Model = response.Model;
          this.ModelType = response.ModelType;
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },   
    handledel(row,value) {
      let str='';
      switch (value) {
        case 0:
          str = "上架";
          break;
        case 2:
          str = "删除";
          break;
        case 3:
          str = "下架";
          break;      
        default:
          break;
      }
      var data = this.$qs.stringify({ Id: row.Id,status:value});
      this.$confirm("确定要"+str+"活动吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "DrawActivity/Del",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              row.Status = value;
              row.StatusStr = data.StatusStr;
              if (value == 2) {                
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
              }
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    linktoadd(id){
       this.$router.push({
        path: "/activity/addavtivity",
        query: { id:id }
      });
    },
    handleDownload(row){
      if (row.ActorCount == 0) {
        this.$message({
          message: "暂无用户参与，无法导出！！",
          type: "danger"
        });
        return;
      }
      this.downloadLoading1 = true;
      this.$confirm("确定要导出中奖数据吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          request({
            url: "DrawActivity/ExcelWinning",
            method: "get",
            params: {aid:row.Id}
          }).then(response => {
              if(response.Status==1){
                this.exportex(response,row.Title+'中奖数据')
                this.downloadLoading1 = false
              }          
          });          
        }).catch(() => {   
          this.downloadLoading1 = false      
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
    handleDownload1(row){
      if (row.ActorCount == 0) {
        this.$message({
          message: "暂无用户参与，无法导出！！",
          type: "danger"
        });
        return;
      };
      this.downloadLoading = true;
      this.$confirm("确定要导出全部数据吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          request({
            url: "DrawActivity/ExcelPartake",
            method: "get",
            params: {aid:row.Id}
          }).then(response => {
              if(response.Status==1){            
                this.exportex(response,row.Title+'全部数据')
                this.downloadLoading = false
              }          
          });          
        }).catch(() => {   
          this.downloadLoading = false      
        });
    }, 
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
    undata(row){
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要更新时间吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "DrawActivity/UpdateTime",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.handleFilter();
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    clone(row){
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要克隆该活动吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "DrawActivity/Clone",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.handleFilter();
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    betop(row){
        var str = ''; var istop = 1;
        if (row.IsTop) {
            str = "取消";
            istop = 0;
        };
        var data = this.$qs.stringify({ Id: row.Id, istop: istop});
        this.$confirm('确定要' + str + '置顶吗？', "提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            request({
              url: "DrawActivity/UpdateIsTop",
              method: "post",
              data
            }).then(response => {
              if (response.Status==1) {
                row.IsTop = istop;
                this.$message({
                  message: response.Msg,
                  type: "success"
                });
              }
            });
          })
          .catch(() => {});
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.activity {
  .img{width:40px; height:40px;}
  .status3{color:#F56C6C;}
  .status0{color:#67C23A;}
  .status1{color:#E6A23C;}
  .status2{color:#409EFF;}
  .status4{color:#909399;}
  .qingkong{margin-left: 30px; color: #409EFF;}
}
</style>
