<template>
  <div class="prizeset boxright">
    <div class="filter-container">
      <el-input
        placeholder="请输入标题/手机号码/姓名"
        v-model="listQuery.title"
        style="width: 210px;"
        class="filter-item"
        clearable
      />        
      <el-select
        v-model="listQuery.type"
        placeholder="选择类型"
        clearable
        style="width: 110px"
        class="filter-item"
      >
        <el-option v-for="item in Typelist" :label="item.Text" :key="item.Text" :value="item.Value"></el-option>
      </el-select> 
      <el-select
        v-model="listQuery.client"
        placeholder="选择app"
        clearable
        style="width: 110px"
        class="filter-item"
      >
        <el-option v-for="item in Clientlist" :label="item.Text" :key="item.Text" :value="item.Value"></el-option>
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="提交信息"
        clearable
        style="width: 110px"
        class="filter-item"
      >
        <el-option label="未提交" value="0"></el-option>
        <el-option label="已提交" value="1"></el-option>
      </el-select>
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
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >批量下载</el-button> 
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="活动名称" align="center" prop="Title"></el-table-column>
      <el-table-column label="收货人" align="center" prop="Name"></el-table-column>
      <el-table-column label="电话" align="center" prop="Phone"></el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.Address}}</span>          
        </template>
      </el-table-column>
      <el-table-column label="物流名称" align="center" prop="LogisticName">
      </el-table-column>
      <el-table-column label="物流单号" align="center" prop="LogisticCode">
      </el-table-column>
      <el-table-column label="时间" align="center" prop="CreateTimeStr">
      </el-table-column>
      <el-table-column label="发货时间" align="center" prop="UpdateTimeStr">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="success" v-if="scope.row.Type==2 && scope.row.Status==1 && scope.row.LogisticId==0" @click="handlefafang(scope.row,'发放',true)">
            发放
          </el-button>
          <el-button size="mini" type="success" v-if="scope.row.Type==2 && scope.row.Status==1 && scope.row.LogisticId>0" @click="handleditor(scope.row,'修改',false)">
            <i class="el-icon-edit"></i> 修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>          
    <pagination
      small
      layout="prev, pager, next"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.sum"
      @pagination="getList"
    />
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="500px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 350px; margin-left:50px;"
      >        
         <el-form-item label="物流" prop="LogistiName">
          <el-select v-model="wuliu" placeholder="请选择物流">
            <el-option v-for="item in Model" :label="item.Name" :key="item.Name" :value="item.Name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流编号" prop="LogistiCode">
          <el-input placeholder="请输入物流编号"  v-model="temp.LogistiCode"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "prizeset",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//门店总数量
      listLoading: false, //列表加载
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      dialogdetailVisible:false,//是否展示弹框
      iscreate:true,//是否是增加
      Model:[],//物流列表
      Clientlist:[],//用户app
      Typelist:[],//类型列表
      wuliu:'',
      downloadLoading: false,
      temp:{
        Id:0,
        Rid:0,
        LogistiCode:'',
        LogistiName:'',
        LogisticId:0,
        ShipperCode:''
      }, 
      value6:'',
      listQuery: {
        //搜素分页处理
        title: '',
        page: 1,
        sum: 15,
        type:'',
        client:'',
        status:'',
        starttime:'',
        endtime:''
      },
      rules:{  
        LogistiName: [
          { required: true, message: "请选择物流！", trigger: "blur" }
        ], 
        LogistiCode: [
          { required: true, message: "请填写物流编号！", trigger: "blur" }
        ]
      }
    };
  },
  watch:{
    wuliu(val, oldVal){
      if(val){        
        for(let i in this.Model){
          if(this.Model[i].Name==val){
            this.temp.LogistiName=this.Model[i].Name;
            this.temp.LogisticId=this.Model[i].Id;
            this.temp.ShipperCode=this.Model[i].ShipperCode;
            break;
          }
        }
      }
    },
    value6(val, oldval) {
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
    this.getmodel();
  },
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "Winning/GetWinningList",
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
    getmodel(){
      request({
        url: "Winning/DLl",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.Model=response.Express;
          this.Clientlist=response.Client;
          this.Typelist=response.Type;
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handlefafang(row,title,creat){
      this.wuliu=this.Model[0].Name;      
      this.temp.Id=row.Id;    
      this.temp.Rid=0;
      this.temp.LogistiName=this.wuliu;
      this.temp.LogistiCode='';
      this.temp.LogisticId='';
      for(let i in this.Model){
        if(this.Model[i].Name==this.wuliu){
          this.temp.LogisticId=this.Model[i].Id;
          this.temp.ShipperCode=this.Model[i].ShipperCode;
          break;
        }
      }
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat) {   
      this.temp.Id=row.Id;    
      this.temp.Rid=row.Rid;
      this.temp.LogistiCode=row.LogisticCode;
      this.temp.LogistiName=row.LogisticName;
      this.wuliu=row.LogisticName;
      for(let i in this.Model){
        if(this.Model[i].Name==row.LogisticName){
          this.temp.LogisticId=this.Model[i].Id;
          this.temp.ShipperCode=this.Model[i].ShipperCode;
          break;
        }
      }
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) { 
          var param={
              Id:this.temp.Rid,
              LogisticCode:this.temp.LogistiCode,
              LogisticId:this.temp.LogisticId,
              LogisticName:this.temp.LogistiName,
              ShipperCode:this.temp.ShipperCode
          };    
          var data = this.$qs.stringify({id:this.temp.Id,model:param});
          request({
            url: "Winning/SetWinning",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.getList();    
              this.dialogFormVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    },  
    handleDownload() {
      this.downloadLoading = true;
      this.$confirm("确定要导出数据吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let prams1={
            title:this.listQuery.title,
            type:this.listQuery.type,
            starttime:this.listQuery.starttime,
            endtime:this.listQuery.endtime,
            status:this.listQuery.status,
            client:this.listQuery.client
          };
          request({
            url: "Winning/ExcelWinning",
            method: "get",
            params:prams1
          }).then(response => {
              if(response.Status==1){
                import('@/vendor/Export2Excel').then(excel => {
                  const tHeader = response.TableTitle;
                  const filterVal = response.TableField;
                  const data = this.formatJson(filterVal, response.List)
                  if(response.List){
                    excel.export_json_to_excel({
                      header: tHeader,
                      data,
                      filename: 'table-list'
                    });
                  }
                
              }); 
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
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.prizeset .wuliuinfo li{list-style: none; line-height:22px; margin-bottom: 10px; display: flex;}
.prizeset .wuliuinfo span{color: #999; margin-right: 10px; width: 145px;}
</style>
