<template>
  <div class="addphone boxright">
    <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="150px"
        style="width: 800px; margin-left:20px;"
      >
          <el-form-item label="手机号码：" prop="phone" style="width:500px">
            <el-input v-model="temp.phone" placeholder="手机号码"/>
          </el-form-item> 
      </el-form>
      <el-button type="primary" style="margin-left:170px" @click="createData">确定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
import { isvalidPhone } from "@/utils/validate";
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};
export default {
  name: "addphone",
  components: { Pagination },
  data() {
    return {
      temp:{
        phone:''
      },
      rules: {
        phone: [
          { required: true, trigger: ["blur"], validator: validPhone }
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
            url: "Children/SetPhone",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {        
              this.$message({
                message: response.Msg,
                type: "success"
              });    
              this.temp.phone=''
              this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
              });           
            }          
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
