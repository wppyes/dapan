<template>
  <div class="user boxright">
    <div class="filter-container">
      <div class="filter-item">
        <el-button type="primary" @click="handleadd('增加授权',true)">
          <i class="el-icon-circle-plus"></i> 增加授权
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="名称" prop="Name" align="center"></el-table-column>
      <el-table-column label="识别码" prop="Project" align="center"></el-table-column>
      <el-table-column label="链接" prop="Url" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改',false)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="名称" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写名称"/>
        </el-form-item>
        <el-form-item label="链接" prop="Url">
          <el-input v-model="temp.Url" placeholder="请填写链接"/>
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
export default {
  name: "user",
  data() {
    return {
      list: [],
      listLoading: true,
      temp: {
        Id: 0,
        Name: "",
        Url: ''
      },
      dialogStatus: "", //面板标题
      dialogFormVisible: false, //面板是否展示
      iscreate: false, //是否是添加
      rules: {
        Url: [
          { required: true, message: "链接必须填写！", trigger: "blur" }
        ],
        Name: [
          { required: true, message: "名称必须填写！", trigger: "blur" }
        ]
      }
    };
  },
  created() {
   this.getlist();
  },
  methods: {
    getlist(){
      request({
        url: "ProjectHash/GetProjectHashList",
        method: "get",
        params: {}
      }).then(response => { 
        if(response.Status==1){ 
          this.list = response.List;
          this.listLoading = false;
        }
      });
    },
    handleditor(row, title, creat) {
      this.temp = {
        Id: row.Id,
        Url: row.Url,
        Name: row.Name
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id });
      this.$confirm("确定要删除该授权吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "ProjectHash/Del",
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
    handleadd(title, creat) {
      this.temp = {
        Id: 0,
        Name: "",
        Url: ''
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "ProjectHash/SetProjectHash",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.dialogFormVisible = false;
              this.getlist();
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
.user .tdspan span {
  margin-right: 10px;
}
</style>
