<template>
  <div class="setrange boxright">
     <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="150px"
      style="width: 800px; margin-left:20px;"
    >
        <el-form-item label="排名" prop="rank">
          <el-select v-model="temp.rank" placeholder="请选择排名">
            <el-option v-for="item in ranklist" :label="'第'+item+'名'" :key="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编号：" prop="ret" style="width:500px">
          <el-input type="textarea" v-model="temp.ret" placeholder="请输入编号"/>
        </el-form-item> 
    </el-form>
    <el-button type="primary" style="margin-left:170px" @click="createData">确定</el-button>
  </div>
</template>
<script>

import request from "@/utils/request";
export default {
  name: "setrange",
  data() {
    return {      
      temp:{
        rank:'',
        ret:''
      },
      ranklist:[1,2,3,4,5,6,7],
      rules: {
        rank: [
          { required: true, message: "排名必须选择！", trigger: "blur" }
        ],
        ret: [
          { required: true, message: "编号必须填写！", trigger: "blur" }
        ]
      },
    };
  },
  created() {
  },
  methods: {
    createData(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "Children/SetWinRank",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {        
              this.$message({
                message: response.Msg,
                type: "success"
              });    
              this.temp.rank='';
              this.temp.ret='';
              this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
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

</style>
