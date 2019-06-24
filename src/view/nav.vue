<template>
<div class="nav-right">
  <div class="othernav nav-right-item">
         <el-tree node-key="id" :current-node-key="treenum" :default-expanded-keys="[treenum]" highlight-current :data="datatree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
    <div class="nav-right-item">
      <keep-alive>
        <router-view :key="key"/>
      </keep-alive>
    </div>
</div>
</template>

<script>
export default {
  name: "othernav",
  data() {
    return {
      sidearr: [],
      isCollapse: false,
      Animated: true,
      indexlist: ["1", "2", "3", "4"],
      defaultactive: 0 + "-" + 0,
      treenum: -1,
      datatree: [
        {
          label: "主页",
          children: [
            {
              label: "控制台",
              url: "/",
              id: -1
            }
          ]
        },
        {
          label: "数据库",
          children: [
            {
              label: "DB0",
              url: "DB",
              id: 0
            },
            {
              label: "DB1",
              url: "DB",
              id: 1
            },
            {
              label: "DB2",
              url: "DB",
              id: 2
            },
            {
              label: "DB3",
              url: "DB",
              id: 3
            },
            {
              label: "DB4",
              url: "DB",
              id: 4
            },
            {
              label: "DB5",
              url: "DB",
              id: 5
            },
            {
              label: "DB6",
              url: "DB",
              id: 6
            },
            {
              label: "DB7",
              url: "DB",
              id: 7
            },
            {
              label: "DB8",
              url: "DB",
              id: 8
            },
            {
              label: "DB9",
              url: "DB",
              id: 9
            },
            {
              label: "DB10",
              url: "DB",
              id: 10
            },
            {
              label: "DB11",
              url: "DB",
              id: 11
            },
            {
              label: "DB12",
              url: "DB",
              id: 12
            },
            {
              label: "DB13",
              url: "DB",
              id: 13
            },
            {
              label: "DB14",
              url: "DB",
              id: 14
            },
            {
              label: "DB15",
              url: "DB",
              id: 15
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  computed: {
    key() {
      return this.$route.fullPath
    }
  },

  created() {
       var te = this.$route.params.id;
        if (!te) {
            this.defaultactive = 1 + '-' + 1;
        } else {
            this.defaultactive = 2 + '-' + (parseInt(te) + 1);
            this.treenum = parseInt(te);
        }
  },
methods:{
  handleNodeClick(data) {
    if (data.url) {
      if (data.url == "/") {
        this.$router.push({
          path: "/dapan/index"
        });
      } else {
        this.$router.push({
          path: data.url + data.id
        });
      }
    }
  }
}
};
</script>

<style>
.othernav{width: 160px;}
    .el-menu-item-group__title {
        padding: 0;
    }

    .el-menu {
        border: none;
    }


    .active {
        color: red;
    }

    .el-aside {
        color: #333;
        margin-left: -1px;
        background-color: #304156;
    }

    .tit-span {
        font-size: 14px;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
    }

    .toggle-btn {
        position: absolute;
        top: -40px;
        z-index: 999;
        left: 100px;
        border: none;
        transition: all 0.38s;
        width: 0px;
        height: 0;
        margin-top: -20px;
    }

    .el-radio-button:first-child .el-radio-button__inner {
        border: none;
    }

    .svg-ico {
        position: absolute;
        top: 45px;
    }

    .animated {
        left: 230px;
    }

    .nav-right {
        display: flex;
        flex-direction: row;
    }

    .nav-right-item:first-child {
        flex-basis: 10%;
    }

    .nav-right-item:last-child {
        flex: 1;
    }
</style>

