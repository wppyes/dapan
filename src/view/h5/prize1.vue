<template>
  <div class="DrawPrize boxright">    
    <el-tabs v-model="temp.Client" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in AppModel"
        :key="item.Value"
        :label="item.Text"
        :name="item.Value"
      ></el-tab-pane>
    </el-tabs>
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="handleadd('增加奖品',true)">
          <i class="el-icon-circle-plus"></i> 增加奖品
        </el-button>
      </div>           
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="类型" align="center" prop="Title" width="100px">
        <template slot-scope="scope">
          <span v-text="set(scope.row.Type)"></span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="Title"></el-table-column>
      <el-table-column label="图片" align="center" width="100px">
        <template slot-scope="scope">
          <img :src="scope.row.Image+'?imageView2/1/w/50/h/50'" class="PrizeImg">
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" prop="Number" width="100px"></el-table-column>
      <el-table-column label="概率" align="center" prop="Rate" width="100px"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改奖品',false)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>
          <el-button size="mini" type="" @click="quan(scope.row)" v-if="scope.row.Type==3">
            导入券码(剩余{{scope.row.Counts}})
          </el-button>
        </template>
      </el-table-column>
    </el-table>   
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >        
        <el-form-item label="类型" prop="Type">
          <el-select v-model="temp.Type" placeholder="请选择类型">
            <el-option v-for="item in Model" :label="item.Text" :key="item.Value" :value="item.Value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="Title">
          <el-input placeholder="请输入标题"  v-model="temp.Title" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="图片" prop="Image">
          <div class="video">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :show-file-list="false"
              accept=".jpg, .png"
              action
              :http-request="upLoad"
            >
              <img v-if="temp.Image" :src="temp.Image" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="数量" prop="Number">
          <el-input placeholder="请输入数量"  v-model="temp.Number" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="概率" prop="Rate">
          <el-input placeholder="请输入概率"  v-model="temp.Rate" style="width: 215px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入券码" :visible.sync="dialogquanVisible" :close-on-click-modal="false" width="500px">
      <el-form
        ref="dataFormquan"
        :rules="rulesquan"
        :model="tempquan"
        label-position="left"
        label-width="100px"
        style="width: 350px; margin-left:50px;"
      >  
       
        <el-upload prop="filepath"
            class="upload-demo"
            drag
            ref="upload"
            accept=".xls,.xlsx"
            action=""
            :http-request="upLoad1"

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
  </div>
</template>
<script>
import request from "@/utils/request";
import upfile from "@/utils/upload";
var arr=[];
export default {
  name: "DrawPrize",
  data() {
    return {
      list: [], //列表
      total:0,//门店总数量
      listLoading: false, //列表加载
      Model:[],
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      iscreate:true,//是否是增加
      dialogquanVisible:false,
      AppModel:[],
      temp:{
        Id:0,
        Title:'',
        Type:'',
        Image:'',
        Number:'',
        Rate:'',
        Client:'1'
      }, 
      tempquan:{
        filepath:'',
        id:0
      },
      rulesquan:{
        filepath:[
          { required: true, message: "请上传文件", trigger: "blur" }
        ],
      },
      rules:{  
        Type: [
          { required: true, message: "请选择类型！", trigger: "blur" }
        ],
        Title: [
          { required: true, message: "请输入标题！", trigger: "blur" }
        ],
        Image:[
          { required: true, message: "请上传图片", trigger: "blur" }
        ],
        Number:[
          { required: true, message: "请填写数量", trigger: "blur" }
        ],
        Rate:[
          { required: true, message: "请填写概率", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getModel();
  },
  methods: {
    handleClick(){    
      this.list=[];
      for(var i in arr){
        if(arr[i].Client==this.temp.Client){
          this.list.push(arr[i]);
        };
      };
    },
    subfile(){      
      this.$refs["dataFormquan"].validate(valid => {
        if (valid) { 
          var param={
            id:this.tempquan.id,
            filepath:this.tempquan.filepath
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "Draw/UploadQM",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) { 
              this.$message({
                message: response.Msg,
                type: "success"
              });
              this.dialogquanVisible=false;
              this.$nextTick(() =>{                
                this.$refs.upload.clearFiles();
              })
            }
          });
        }
      });
    },
    upLoad1(param) {
      upfile(param.file, "Upload/UploadFile?folder=DrawPrize", data => {
        if (data.Status) {
          this.tempquan.filepath = data.Path;
        } else {
          this.$message({
            message: data.Msg,
            type: "error"
          });
        }
      });
    },
    quan(row){
      this.tempquan.id=row.Id;
      this.dialogquanVisible=true;
    },
    getList(){
      this.listLoading = true;
      request({
        url: "Draw/GetDrawList",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          arr=response.List;
          this.handleClick();
          this.listLoading = false;
        }
      });
    },
    set(value){
      for (let i in this.Model) {
          if (this.Model[i].Value == value) {
              return this.Model[i].Text;
          }
      }

    },
    getModel() {
      request({
        url: "Draw/DrawDDL",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.Model = response.Model;
          this.AppModel=response.AppModel;
        }
      });
    },
    upLoad(param) {
      upfile(param.file, "Upload/Upload?folder=Draw", data => {
        if (data.Status) {
          this.temp.Image = data.Path;
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
      this.temp.Title='';
      this.temp.Type='';
      this.temp.Image='';
      this.temp.Number='';
      this.temp.Rate='';
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat) {
      this.temp.Id=row.Id;
      this.temp.Title=row.Title;
      this.temp.Type=row.Type.toString();
      this.temp.Image=row.Image;
      this.temp.Number=row.Number;
      this.temp.Rate=row.Rate;
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
              Title:this.temp.Title,
              Type:this.temp.Type,
              Image:this.temp.Image,
              Number:this.temp.Number,
              Rate:this.temp.Rate,
              Client:this.temp.Client
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "Draw/SetDraw",
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
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id });
      this.$confirm("确定要删除奖品吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Draw/Del",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            }
          });
        })
        .catch(() => {});
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.DrawPrize {
  .PrizeImg{width:40px; height:40px;}
}
</style>
