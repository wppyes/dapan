<template>
  <div class="prizenext boxright">
  <div class="back"><span @click="backto"><i class="el-icon-arrow-left"></i>返回</span></div>
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="handleadd('增加下期奖品',true)">
          <i class="el-icon-circle-plus"></i> 增加下期奖品
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="图片" align="left">
        <template slot-scope="scope">
          <img :src="scope.row.Img+'?imageView2/1/w/50/h/50'" class="PrizeImg">
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改下期奖品',false)">
            <i class="el-icon-edit"></i> 编辑
          </el-button>
          <el-button size="mini" type="danger" v-if="scope.row.Status==0" @click="handledel(scope.row,1)">
            <i class="el-icon-delete"></i> 禁用
          </el-button>
          <el-button size="mini" type="primary" v-if="scope.row.Status==1" @click="handledel(scope.row,0)">
            <i class="el-icon-delete"></i> 启用
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
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >        
        <el-form-item label="图片" prop="Img">
          <div class="video">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :show-file-list="false"
              accept=".jpg, .png"
              action
              :http-request="upLoad"
            >
              <img v-if="temp.Img" :src="temp.Img" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
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
import upfile from "@/utils/upload";
var tabarr=[];
export default {
  name: "prizenext",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      iscreate:true,//是否是增加
      temp:{
        Id:0,
        Img:'',
      }, 
      listQuery: {
        page: 1,
        sum: 10
      },
      rules:{  
        Img:[
          { required: true, message: "请上传图片", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    backto(){
      this.$router.go(-1);
    },
    getList(){
      this.listLoading = true;
      request({
        url: "DrawNextStage/GetDrawNextStageList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          if(response.List){
            this.list = response.List.DataList;
            this.total = response.List.TotalPage;
          }
          this.listLoading = false;
        }
      });
    },
    upLoad(param) {
      upfile(param.file, "Upload/Upload?folder=DrawNextStage", data => {
        if (data.Status) {
          this.temp.Img = data.Path;
        } else {
          this.$message({
            message: data.Msg,
            type: "error"
          });
        }
      });
    },
    handleadd(title,creat){
      this.temp.Id=0;
      this.temp.Img='';
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat) {
      this.temp.Id=row.Id;
      this.temp.Img=row.Img;
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
              Id:this.temp.Id,
              Img:this.temp.Img
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "DrawNextStage/SetDrawNextStage",
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
    handledel(row,value) {
      var str = value == 0 ? '启用' : '禁用';
      var data = this.$qs.stringify({ Id: row.Id ,status: value});
      this.$confirm("确定要"+str+"下期奖品吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "DrawNextStage/Del",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              this.getList();   
            }
          });
        })
        .catch(() => {});
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.prizenext {
  .PrizeImg{width:40px; height:40px;}
}
</style>
