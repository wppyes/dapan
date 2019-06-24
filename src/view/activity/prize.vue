<template>
  <div class="DrawPrize boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="lintonext">
          设置下期奖品
        </el-button>
      </div>
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="handleadd('增加奖品',true)">
          <i class="el-icon-circle-plus"></i> 增加奖品
        </el-button>
      </div>
      <el-input
        placeholder="请输入奖品标题"
        v-model="listQuery.prizetitle"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
      <el-select
        v-model="listQuery.type"
        placeholder="选择类型"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in Model" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select> 
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="类型" align="center" prop="Title" width="100px">
        <template slot-scope="scope">
          <span v-text="set(scope.row.PrizeType)"></span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="PrizeTitle" width="200px"></el-table-column>
      <el-table-column label="图片" align="center" width="80px">
        <template slot-scope="scope">
          <img :src="scope.row.PrizeImg+'?imageView2/1/w/50/h/50'" class="PrizeImg">
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="PrizeRemark"></el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改奖品',false)">
            <i class="el-icon-edit"></i> 编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i> 删除
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
        <el-form-item label="类型" prop="PrizeType">
          <el-select v-model="temp.PrizeType" placeholder="请选择类型">
            <el-option v-for="item in Model" :label="item.Text" :key="item.Value" :value="item.Value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="PrizeTitle">
          <el-input placeholder="请输入标题"  v-model="temp.PrizeTitle" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="图片" prop="PrizeImg">
          <div class="video">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :show-file-list="false"
              accept=".jpg, .png"
              action
              :http-request="upLoad"
            >
              <img v-if="temp.PrizeImg" :src="temp.PrizeImg" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="描述" prop="PrizeRemark">
          <el-input placeholder="请输入描述" type="textarea" v-model="temp.PrizeRemark"/>
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
export default {
  name: "DrawPrize",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//门店总数量
      listLoading: false, //列表加载
      Model:[],
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      iscreate:true,//是否是增加
      temp:{
        Id:0,
        PrizeTitle:'',
        PrizeType:'',
        PrizeImg:'',
        PrizeRemark:''
      }, 
      listQuery: {
        //搜素分页处理
        prizetitle: '',
        page: 1,
        sum: 10,
        type:''
      },
      rules:{  
        PrizeType: [
          { required: true, message: "请选择类型！", trigger: "blur" }
        ],
        PrizeTitle: [
          { required: true, message: "请输入标题！", trigger: "blur" }
        ],
        PrizeImg:[
          { required: true, message: "请上传图片", trigger: "blur" }
        ],
        PrizeRemark:[
          { required: true, message: "请填写描述", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getModel();
  },
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "DrawPrize/GetDrawPrizeList",
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
    set(value){
      for (let i in this.Model) {
          if (this.Model[i].Value == value) {
              return this.Model[i].Text;
          }
      }

    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    getModel() {
      request({
        url: "DrawPrize/DrawPrizeDDL",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.Model = response.Model;
        }
      });
    },
    upLoad(param) {
      upfile(param.file, "Upload/Upload?folder=DrawPrize", data => {
        if (data.Status) {
          this.temp.PrizeImg = data.Path;
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
      this.temp.PrizeTitle='';
      this.temp.PrizeType='';
      this.temp.PrizeImg='';
      this.temp.PrizeRemark='';
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat) {
      this.temp.Id=row.Id;
      this.temp.PrizeTitle=row.PrizeTitle;
      this.temp.PrizeType=row.PrizeType.toString();
      this.temp.PrizeImg=row.PrizeImg;
      this.temp.PrizeRemark=row.PrizeRemark;
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
              PrizeTitle:this.temp.PrizeTitle,
              PrizeType:this.temp.PrizeType,
              PrizeImg:this.temp.PrizeImg,
              PrizeRemark:this.temp.PrizeRemark
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "DrawPrize/SetDrawPrize",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              if(this.iscreate){
                param.Id=response.Id;
                this.list.unshift(param);
              }else{
                for (let i in this.list) {
                    if (this.list[i].Id == param.Id) {
                        this.list[i].PrizeTitle = this.temp.PrizeTitle;
                        this.list[i].PrizeType = this.temp.PrizeType;
                        this.list[i].PrizeImg = this.temp.PrizeImg;
                        this.list[i].PrizeRemark = this.temp.PrizeRemark;
                    };
                };
              }                   
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
            url: "DrawPrize/Del",
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
    lintonext(){
      this.$router.push({
        path: "/activity/prizenext"
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.DrawPrize {
  .PrizeImg{width:40px; height:40px;}
}
</style>
