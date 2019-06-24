<template>
    <el-container>
        <el-header class="padd">
            <el-row :gutter="10">
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <el-input placeholder="请输入内容" v-model="Query" clearable></el-input>
                    </div>
                </el-col>
                <el-col :span="1.5">
                    <div class="grid-content bg-purple-light">
                        <el-button type="primary" icon="el-icon-search" v-on:click="getquery">查询</el-button>
                    </div>
                </el-col>
                <el-col :span="1">
                    <div class="grid-content bg-purple-light">
                        <el-button type="primary" icon="el-icon-delete" v-on:click="getremove">删除</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-on:row-click="getdetail">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="RedisKey" label="Key" width="500" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="RedisType" label="Type" width="150" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="RedisValue" label="Value" :show-overflow-tooltip="true">
                </el-table-column>
            </el-table>
            <div class="pager">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="Pagelist" :page-sizes="[15, 30, 50, 100]" :page-size="sum" layout="total, sizes, prev, pager, next, jumper" :total="totalpage">
                </el-pagination>
            </div>
            <el-dialog title="详情" :visible.sync="dialogFormVisible" width="600px">
                <el-form :model="form">
                    <el-form-item label="Key：" :label-width="formLabelWidth">
                        <el-input v-model="form.key" type="textarea" autosize></el-input>
                    </el-form-item>
                    <el-form-item label="数据类型：" :label-width="formLabelWidth">
                        <el-input class="el-int1" v-model="form.type" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="value：" :label-width="formLabelWidth">
                        <el-input v-model="form.value" type="textarea" autosize></el-input>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>
    import request from "@/utils/request";
    export default {
        data() {
            return {
                Query: '', //搜索
                tableData: [], //数据列表
                Pagelist: 1, //页数
                form: {
                    key: '',
                    type: '',
                    value: ''
                },
                dialogFormVisible: false, //详情弹框
                formLabelWidth: '120px',
                sum: 15, //每页显示数量
                totalpage: 0, //总页数
                Checkedlist: [], //选中的列表
            }
        },
        created() {
            this.getlist()
        },
        methods: {
            //每页数量
            handleSizeChange(val) {
                this.sum = val;
                this.getlist();
            },
            //跳转页数
            handleCurrentChange(val) {
                this.Pagelist = val;
                this.getlist();
            },
            //选中
            handleSelectionChange(val) {
                this.Checkedlist = val;
            },
            //获取列表
            getlist: function() {
                var _this = this;
                var param = {
                    database: this.$route.params.id,
                    pageIndex: this.Pagelist,
                    pageSize: this.sum
                }
                request({
                    url: "redis/getlist",
                    method: "get",
                    params: param
                }).then(response => {
                    if (response.Status == 1) {
                        _this.totalpage = response.Total;
                        _this.tableData = response.List;
                        _this.form.key = _this.tableData.RedisKey;
                        _this.form.type = _this.tableData.RedisType;
                        _this.form.value = _this.tableData.RedisValue;
                    }
                });
            },
            //删除
            getremove: function() {
                var _this = this;
                var keys = [];
                for (var i = 0; i < this.Checkedlist.length; i++) {
                    keys.push(this.Checkedlist[i].RedisKey);
                }
                var param = {
                    database: this.$route.params.id,
                    keys: keys
                }
                var data = this.$qs.stringify(param);
                if (this.Checkedlist=='' || this.Checkedlist==null) {
                    this.$message({
                        type: 'error',
                        message: '请选择要删除的内容！'
                    });
                    
                }else{
                    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        request({
                            url: "redis/batchdelete",
                            method: "post",
                            data
                        }).then(response => {
                            if (response.Status == 1) {
                                _this.getlist();
                                this.$message({
                                    type: 'success',
                                    message: response.Msg
                                });
                            }
                        });
                    }).catch(() => {});
                }
            },
            //表格弹框
            getdetail: function(row, column, cell) {
                this.dialogFormVisible = true;
                this.form.key = row.RedisKey;
                this.form.type = row.RedisType;
                this.form.value = row.RedisValue;
            },
            //查询
            getquery:function(){
                var _this = this;
                var param = {
                    database: this.$route.params.id,
                    pageIndex: this.Pagelist,
                    pageSize: this.sum,
                    keyword:this.Query
                }
                request({
                    url: "redis/getlist",
                    method: "get",
                    params: param
                }).then(response => {
                    console.log(response)
                    if (response.Status == 1) {
                        _this.totalpage = response.Total;
                        _this.tableData = response.List;
                        _this.form.key = _this.tableData.RedisKey;
                        _this.form.type = _this.tableData.RedisType;
                        _this.form.value = _this.tableData.RedisValue;
                    }
                });
            }
        }
    }

</script>

<style scoped>
    .pager {
        text-align: right;
        margin-top: 20px;
        margin-right: 20px;
    }

    .el-textarea {
        width: 85%;
    }
    .padd{padding-top: 20px;}
    .el-int1 {
        width: 85%;
    }

    .el-form {
        padding-bottom: 20px;
    }
    .el-table_row .hover-row{
        border: 1px solid red;
    }

</style>
