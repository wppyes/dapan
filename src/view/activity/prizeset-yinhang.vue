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
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleup">批量设置物流</el-button>   
      <span>格式：（id,物流名称，物流单号）</span>
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
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handlefafang(scope.row,'发放',true)">
            发放
          </el-button>
          <!-- <el-button size="mini" type="success" @click="handleditor(scope.row,'修改',false)">
            <i class="el-icon-edit"></i> 修改
          </el-button> -->
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
         <el-form-item label="物流" prop="Name">
          <el-select v-model="wuliu" placeholder="请选择物流">
            <el-option v-for="item in Model" :label="item.Name" :key="item.Name" :value="item.Name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流编号" prop="LogisticCode">
          <el-input placeholder="请输入物流编号"  v-model="temp.LogisticCode"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="物流详情" :visible.sync="dialogdetailVisible" :close-on-click-modal="false" width="600px">
      <ul class="wuliuinfo">
        <li v-for="item in remark">
          <span>{{item.AcceptTime}}</span>{{item.AcceptStation}}
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogdetailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量设置物流" :visible.sync="dialogwuliuVisible" :close-on-click-modal="false" width="650px">
      <el-form
        ref="datawuliu"
        :rules="ruleswuliu"
        :model="temp1"
        label-position="left"
        label-width="100px"
        style="width: 350px; margin-left:50px;"
      >        
        <el-form-item label="文件上传" prop="filepath">          
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
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogwuliuVisible = false">取消</el-button>
        <el-button type="primary" @click="subwuliu">确定</el-button>
      </div>
    </el-dialog>
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
      total:0,//门店总数量
      listLoading: false, //列表加载
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      dialogdetailVisible:false,//是否展示弹框
      iscreate:true,//是否是增加
      Model:[],//物流列表
      wuliu:'',
      value6:'',
      downloadLoading:false,
      temp:{
        Id:0,
        Userid:'',
        Aid:'',
        LogisticCode:'',
        ShipperCode:'',
        Name:'',
        EId:0
      }, 
      remark:{},
      parizeselect:[],
      listQuery: {
        //搜素分页处理
        title: '',
        page: 1,
        sum: 15
      },
      time1:'',
      time2:'',
      temp1:{
        filepath:''
      },
      dialogwuliuVisible:false,
      rules:{  
        Name: [
          { required: true, message: "请选择物流！", trigger: "blur" }
        ]
      },
      ruleswuliu:{  
        ids: [
          { required: true, message: "请选择活动！", trigger: "blur" }
        ],
        filepath: [
          { required: true, message: "请上传文件！", trigger: "blur" }
        ]
      }
    };
  },
  watch:{
    wuliu(val, oldVal){
      if(val){        
        for(let i in this.Model){
          if(this.Model[i].Name==val){
            this.temp.Name=this.Model[i].Name;
            this.temp.ShipperCode=this.Model[i].ShipperCode;
            this.temp.EId=this.Model[i].Id;
            break;
          }
        }
      }
    },
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
    this.getmodel();
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
    handleup(){
      this.dialogwuliuVisible=true;
      this.temp1.filepath='';
      this.$nextTick(() => {
        this.$refs["datawuliu"].clearValidate();
      });
    }, 
    getmodel(){
      request({
        url: "Express/ExpressDDL",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.Model=response.List;
          this.parizeselect=response.Activity;
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
      // this.temp.EId='';
      // this.temp.Id=0;
      // this.temp.Userid=row.Userid;
      // this.temp.Aid=row.Aid;
      this.temp.Name=this.wuliu;
      this.temp.ShipperCode='';
      this.temp.LogisticCode='';
      for(let i in this.Model){
        if(this.Model[i].Name==this.wuliu){
          this.temp.ShipperCode=this.Model[i].ShipperCode;
          this.temp.EId=this.Model[i].Id;
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
    upLoad(param){
         upfile(param.file,'Upload/UploadFile',(data => {
             if(data.Status){
                 this.temp1.filepath=data.Path;
             }else{
                 this.$message({
                    message: data.Msg,
                    type: "error"
                });
             };
         }))
    }, 
    subwuliu(){
      this.$refs["datawuliu"].validate(valid => {
        if (valid) { 
          var param={
              filepath:this.temp1.filepath,
          };  
          var data = this.$qs.stringify(param);
          request({
            url: "Prize/YHPrizeBatch",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.getList();    
              this.dialogwuliuVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    }, 
    handleditor(row, title, creat) {
      this.temp.Id=row.LId;
      this.temp.Userid=row.Userid;
      this.temp.Aid=row.Aid;
      this.temp.LogisticCode=row.LogisticCode;
      this.temp.Name=row.LogName;
      this.wuliu=row.LogName;
      for(let i in this.Model){
        if(this.Model[i].Name==row.LogName){
          this.temp.ShipperCode=this.Model[i].ShipperCode;
          this.temp.EId=this.Model[i].Id;
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
    detail(row){
      this.dialogdetailVisible=true;
      this.remark=JSON.parse(row.Remark).Traces;
      console.log(this.remark)
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
            url: "Prize/Excel",
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
    createData(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) { 
          var param={
              id:this.temp.Id,
              // Aid:this.temp.Aid,
              // Userid:this.temp.Userid,
              logisticsname:this.temp.Name,
              // ShipperCode:this.temp.ShipperCode,
              logisticscode:this.temp.LogisticCode,
              // EId:this.temp.EId
          };    
          console.log(param)
          var data = this.$qs.stringify(param);
          request({
            url: "Prize/SetPrize",
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
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.prizeset .wuliuinfo li{list-style: none; line-height:22px; margin-bottom: 10px; display: flex;}
.prizeset .wuliuinfo span{color: #999; margin-right: 10px; width: 145px;}
</style>
