<template>
  <div class="addavtivity boxright">
    <div class="back"><span @click="backto"><i class="el-icon-arrow-left"></i>返回</span></div>
      <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="150px"
      style="width: 800px; margin-left:20px;"
    >

        <el-form-item label="活动类型" prop="Type" style="width:500px">          
          <el-select
            v-model="temp.Type"
            placeholder="选择活动类型"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="item in ModelType" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="活动标题" prop="Title" style="width:500px">
          <el-input v-model="temp.Title" placeholder="请填写活动标题"/>
        </el-form-item>
        <el-row>
          <el-col :span="10">            
             <el-form-item label="活动图片：" prop="Cover">
              <el-upload
                class="avatar-uploader"
                ref="upload"
                :show-file-list="false"
                accept=".jpg, .png"
                action
                :http-request="upLoad"
              >
                <img v-if="temp.Cover" :src="temp.Cover" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload><div class="chicun">尺寸：170*170</div>
            </el-form-item>   
          </el-col>
          <el-col :span="10">            
             <el-form-item label="置顶图片：" prop="Image">
              <el-upload
                class="avatar-uploader"
                ref="upload"
                :show-file-list="false"
                accept=".jpg, .png"
                action
                :http-request="upLoad1"
              >
                <img v-if="temp.Image" :src="temp.Image" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload><div class="chicun">尺寸：640*335</div>
            </el-form-item>
          </el-col>
        </el-row>   
        <el-row>
          <el-col :span="10">
            <el-form-item label="奖品类型" prop="PrizeId">          
              <el-select
                v-model="listQuery.type"
                placeholder="选择奖品类型"
                clearable
                style="width: 150px"
                class="filter-item"
                @change="handleFilter"
              >
                <el-option v-for="item in Model1" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
              </el-select> 
            </el-form-item> 
          </el-col>
          <el-col :span="10">            
            <el-form-item label="奖品数量"  prop="PrizeNum">
              <el-input v-model="temp.PrizeNum" placeholder="请填写奖品数量"/>
            </el-form-item>
          </el-col>
        </el-row>              
        <el-form-item label="绑定号码"  prop="IsBinding">
          <el-switch
            v-model="temp.IsBinding"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>   
        <el-form-item label="券码" prop="PType" style="width:500px">          
          <el-select
            v-model="temp.PType"
            placeholder="选择券码"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="item in ModelPType" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
          </el-select> 
        </el-form-item>    
        <el-form-item v-show="listQuery.type" label="奖品选择" prop="PrizeId">       
          <div class="filter-container">
            <div class="filter-item">
              <el-input
                placeholder="请输入奖品名称"
                v-model="listQuery.prizetitle"
                style="width: 200px;"
                class="filter-item"
                clearable
              />
            </div>
            <div class="filter-item" style="margin-right:20px;">
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </div>
          </div> 
            <div>
              <span v-show="prizelist.length==0" style="padding-left:20px">暂无数据</span>
              <el-radio-group v-model="temp.PrizeId">    
                  <el-radio v-for="item in prizelist" :label="item.Id" :key="item.Id">{{item.PrizeTitle}}</el-radio>    
              </el-radio-group>           
            </div>    
        </el-form-item>  
        <el-row>
          <el-col :span="10">
            <el-form-item label="开奖类型" prop="AwardType">          
              <el-select
                v-model="temp.AwardType"
                placeholder="选择活动类型"
                clearable
                style="width: 150px"
                class="filter-item"
              >
                <el-option v-for="item in Model" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
              </el-select> 
            </el-form-item> 
          </el-col>
          <el-col :span="10">            
            <el-form-item label="开奖时间"  v-show="temp.AwardType==0" prop="AwardTime">
                <el-date-picker
                  v-model="temp.AwardTime"
                  type="datetime"
                  placeholder="请选择开奖时间">
                </el-date-picker>
            </el-form-item>        
            <el-form-item label="满人数" v-show="temp.AwardType==1" prop="AwardNumber">
              <el-input v-model="temp.AwardNumber" placeholder="请填写满开奖人数"/>
            </el-form-item>
          </el-col>
        </el-row> 
        <el-form-item label="分享标题" prop="ShareTitle" style="width:500px">
          <el-input v-model="temp.ShareTitle" placeholder="请填写分享标题"/>
        </el-form-item>
        <el-form-item label="分享描述" prop="ShareDesc" style="width:500px">
          <el-input type="textarea" v-model="temp.ShareDesc" placeholder="请填写分享描述"/>
        </el-form-item>
        <el-form-item label="规则" prop="ActorRule" style="width:500px">
          <el-input type="textarea" v-model="temp.ActorRule" placeholder="请填写活动规则"/>
        </el-form-item>
        <div>
        <el-form-item label="描述" prop="Describe" style="width:800px">
          <textarea id="myEditor" style="width:100%;"></textarea>  
        </el-form-item></div>
    </el-form>
    <el-button type="primary" style="margin-left:170px" @click="createData">确定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
import upfile from "@/utils/upload";
import Pagination from "@/components/Pagination";
import { fail } from 'assert';
var validnum=(rule, value,callback)=>{
    if(!value){
      callback(new Error('不能为空'));
      return;
    }
      if (value<=0){
          callback(new Error('请输入正确的数字'))
      }else {
          callback()
      }
  }
export default {
  name: "merchants",
  components: { Pagination},
  data() {
    return {
      Model:[],
      ModelType:[],
      ModelPType:[],
      Model1:[],
      prizelist:[],
      total:0,
      listLoading:false,
      temp:{
        Id:0,
        Type:'',//类型
        Title:'',//名称
        Describe:'',//描述
        ActorRule:'',//规则
        Cover:'',//活动图片
        Image:'',//置顶图片
        PrizeId:'',//奖品id
        PrizeNum:'',//奖品数量
        AwardType:'',//奖品领取条件
        AwardTime:'',//时间截点
        AwardNumber:'',//人数要求
        ShareTitle:'',//分享标题
        ShareDesc:'',//分享描述
        IsBinding:false,//是否绑定
        PType:'',
      },
      editor: null,
      rules: {
        Type: [
          { required: true, message: "类型必须选择！", trigger: "blur" }
        ],
        Title: [
          { required: true, message: "标题必须填写！", trigger: "blur" }
        ],
        Describe:[{ required: true,  message: "描述必须填写！", trigger: "blur"}],
        Cover: [
          { required: true, message: "活动图片必须上传！", trigger: "change" }
        ],
        Image: [
          { required: true, message: "置顶图片必须上传！", trigger: "change" }
        ],
        ActorRule: [{ required: true, message: "规则必须选择！", trigger: "change" }],
        PrizeId: [
          { required: true, message: "请选择奖品！", trigger: "blur" }
        ],
        PrizeNum: [
          { required: true,  validator: validnum, trigger: "blur" }
        ],
        AwardType: [
          { required: true, message: "奖品领取条件必须选择！", trigger: "blur" }
        ],
        AwardTime: [
          { required: true, message: "时间必须选择！", trigger: "blur" }
        ],
        AwardNumber: [
          { required: true, validator: validnum, trigger: "blur" }
        ],
        ShareTitle: [
          { required: true, message: "分享标题必须填写！", trigger: "blur" }
        ],
        ShareDesc: [
          { required: true, message: "分享描述必须填写！", trigger: "blur" }
        ],
      },   
      listQuery: {
        prizetitle: '',
        page: 1,
        sum: 10,
        type:''
      },
    };
  },
  created() {
    this.temp.Id=this.$route.query.id;
    this.getModel();
  },
  mounted(){
    UE.delEditor('myEditor');
    this.editor = UE.getEditor('myEditor',{toolbars:[[
            'fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder','fontfamily', 'fontsize','strikethrough','|', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', ,
            'simpleupload', 'insertimage','|', 'justifyleft','justifyright', 'justifycenter', 'justifyjustify','cleardoc'
        ]],
        initialFrameHeight:400
    });
    if(this.$route.query.id>0){      
      this.getdata();
    }else{
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    } 
  },
  destroyed() {//销毁后，第一次和切换路由后都能加载出来
    this.editor.destroy();
  },
  methods: {
    getdata(){
      request({
        url: "DrawActivity/GetDrawActivity",
        method: "get",
        params:{id: this.temp.Id}
      }).then(response => {
        if (response.Status==1) {   
          this.listQuery.type=response.ActivityModel.PrizeType.toString();
          this.temp.Type=response.ActivityModel.Type.toString();
          this.temp.Title=response.ActivityModel.Title;
          this.temp.Describe=response.ActivityModel.Describe;
          this.temp.ActorRule=response.ActivityModel.ActorRule;
          this.temp.Cover=response.ActivityModel.Cover;
          this.temp.Image=response.ActivityModel.Image;
          this.temp.PrizeId=response.ActivityModel.PrizeId;
          this.temp.PrizeNum=response.ActivityModel.PrizeNum;
          this.temp.AwardType=response.ActivityModel.AwardType.toString();
          this.temp.AwardTime=response.ActivityModel.AwardTimeStr;
          this.temp.AwardNumber=response.ActivityModel.AwardNumber;
          this.temp.ShareTitle=response.ActivityModel.ShareTitle;
          this.temp.ShareDesc=response.ActivityModel.ShareDesc; 
          this.temp.IsBinding=response.ActivityModel.IsBinding; 
          if(response.ActivityModel.PType){
            this.temp.PType=response.ActivityModel.PType.toString();
          }          
          this.getprize();
          this.editor.ready( ()=>{
              this.editor.setContent(response.ActivityModel.Describe)
          });
        }            
      });
    },
    upLoad(param) {
      upfile(
        param.file,
        "Upload/Upload?folder=DrawActivity",
        data => {
          if (data.Status) {
            this.temp.Cover = data.Path;
          } else {
            this.$message({
              message: data.Msg,
              type: "error"
            });
          }
        }
      );
    },
    upLoad1(param) {
      upfile(
        param.file,
        "Upload/Upload?folder=DrawActivity",
        data => {
          if (data.Status) {
            this.temp.Image = data.Path;
          } else {
            this.$message({
              message: data.Msg,
              type: "error"
            });
          }
        }
      );
    },
    backto(){
      this.temp.Type='';
      this.temp.Title='';
      this.temp.Describe='';
      this.temp.ActorRule='';
      this.temp.Cover='';
      this.temp.Image='';
      this.temp.PrizeId='';
      this.temp.PrizeNum='';
      this.temp.AwardType='';
      this.temp.AwardTime='';
      this.temp.AwardNumber='';
      this.temp.ShareTitle='';
      this.temp.ShareDesc=''; 
      this.temp.IsBinding=false;  
      this.temp.PType='';
      this.$router.go(-1);
    },
    createData(){
      if(this.temp.AwardType==0){
        this.temp.AwardNumber=10;
      }else{
        this.temp.AwardTime=10;
      }
      this.temp.Describe=this.editor.getContent();
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if(this.temp.AwardType==0){
            this.temp.AwardNumber='';
          }else{
            this.temp.AwardTime='';
          }
          var data = this.$qs.stringify(this.temp);
          request({
            url: "DrawActivity/SetDrawActivity",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {           
              this.$router.push({ path: "/activity/list"});
              this.$bus.$emit('change');
              this.$message({
                message: response.Msg,
                type: "success"
              });    
              this.temp.Type='';
              this.temp.Title='';
              this.temp.Describe='';
              this.temp.ActorRule='';
              this.temp.Cover='';
              this.temp.Image='';
              this.temp.PrizeId='';
              this.temp.PrizeNum='';
              this.temp.AwardType='';
              this.temp.AwardTime='';
              this.temp.AwardNumber='';
              this.temp.ShareTitle='';
              this.temp.ShareDesc=''; 
              this.temp.IsBinding=false;   
              this.temp.PType='';
            }            
          });
        }
      });
    },
    getModel(){
      request({
        url: "DrawActivity/AwardDDL",
        method: "get",
        params:{}
      }).then(response => {
        if (response.Status==1) {           
          this.Model=response.Model;
          this.ModelType=response.ModelType;
          this.ModelPType=response.ModelPType;
        }            
      });
      request({
        url: "DrawPrize/DrawPrizeDDL",
        method: "get",
        params:{}
      }).then(response => {
        if (response.Status==1) {           
          this.Model1=response.Model;
        }            
      });
    },
    handleFilter(){
      this.listQuery.page=1;
      this.getprize();
    },
    getprize(){
      this.listLoading = true;
      request({
        url: "DrawPrize/GetDrawPrizeList",
        method: "get",
        params:this.listQuery
      }).then(response => {
        if (response.Status==1) {   
          this.prizelist = response.List.DataList;
          this.total = response.List.TotalPage;
          this.listLoading = false;
        }            
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.addavtivity {
  .chicun{color:#f00;}
  .ql-container {
    height:180px;
    }
  .el-radio{margin:0 10px 10px 0; border: 1px solid #eee; padding: 10px; border-radius: 2px;}
  }
</style>
