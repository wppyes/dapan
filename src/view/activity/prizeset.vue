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
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="活动名称" align="center" prop="PrizeTitle"></el-table-column>
      <el-table-column label="收货人" align="center" prop="Name"></el-table-column>
      <el-table-column label="电话" align="center" prop="Phone"></el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          <span :title="scope.row.Province+scope.row.City+scope.row.Area+scope.row.Address">{{scope.row.City}}</span>          
        </template>
      </el-table-column>
      <el-table-column label="物流名称" align="center" prop="LogName">
      </el-table-column>
      <el-table-column label="物流单号" align="center" prop="LogisticCode">
      </el-table-column>
      <el-table-column label="详情" align="center" prop="LogisticCode">
         <template slot-scope="scope">
          <el-tag size="mini" type="primary" @click="detail(scope.row)" v-if="scope.row.Remark" style="cursor: pointer;">
            详情
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.IsDelivery && scope.row.Status==1" size="mini" type="success" @click="handlefafang(scope.row,'发放',true)">
            发放
          </el-button>
          <el-button  v-if="scope.row.IsDelivery" size="mini" type="success" @click="handleditor(scope.row,'修改',false)">
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
      wuliu:'',
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
      listQuery: {
        //搜素分页处理
        title: '',
        page: 1,
        sum: 15
      },
      rules:{  
        Name: [
          { required: true, message: "请选择物流！", trigger: "blur" }
        ]
      },
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
        url: "DrawCashInfo/GetDrawCashInfoList",
        method: "get",
        params: this.listQuery
      }).then(response => {
          this.listLoading = false;
        if (response.Status == 1) {
          if(response.List){
            this.list = response.List.DataList;
            this.total = response.List.TotalPage;
          }
        }
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
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handlefafang(row,title,creat){
      this.wuliu='';
      this.temp.EId='';
      this.temp.Id=0;
      this.temp.Userid=row.Userid;
      this.temp.Aid=row.Aid;
      this.temp.Name='';
      this.temp.ShipperCode='';
      this.temp.LogisticCode='';
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
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
    createData(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) { 
          var param={
              Id:this.temp.Id,
              Aid:this.temp.Aid,
              Userid:this.temp.Userid,
              Name:this.temp.Name,
              ShipperCode:this.temp.ShipperCode,
              LogisticCode:this.temp.LogisticCode,
              EId:this.temp.EId
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "DrawCashInfo/SetLogistics",
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
