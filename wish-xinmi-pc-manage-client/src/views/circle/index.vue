<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               ref="crud"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="avatarUrl" slot-scope="{row}">
        <el-image
          v-if="row.avatarUrl"
          style="width: 40px; height: 40px"
          :src="row.avatarUrl"
          fit="fit"/>
        <div v-else></div>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {fetchCirclePageRequest} from "../../api/circle/index";

  export default {
    name: 'index',
    data() {
      return {
        query: {},
        loading: false,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        data: [],
      }
    },
    computed: {
      ...mapGetters(['userList', 'permission']),
      option() {
        return {
          menu: false,
          size: 'small',
          refreshBtn: true,
          columnBtn: false,
          indexLabel: '序号',
          tip: false,
          searchShow: false,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: false,
          editBtn: false,
          delBtn: false,
          addBtn: false,
          selection: false,
          dialogClickModal: false,
          dialogWidth: 450,
          menuWidth: 200,
          column: [
            {
              label: "创建人",
              prop: "username",
              type: 'input',
              search: true,
            },
            {
              label: "内容",
              prop: "content",
              type: 'input',
              search: true,
              overHidden: true,
              formatter: (row) => {
                return row.content + row.photosUrl;
              }
            },
            {
              label: "创建时间",
              prop: "createTime",
              type: 'datetime',
              format: "yyyy-MM-dd hh:mm:ss",
              search: true,
            }
          ]
        }
      }
    },
    methods: {
      searchReset() {
        this.query = {};
        this.onLoad();
      },
      searchChange(params, done) {
        this.query = Object.assign({}, params);
        this.page.currentPage = 1;
        this.onLoad();
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      currentChange(current) {
        this.page.currentPage = current;
      },
      sizeChange(size) {
        this.page.pageSize = size;
      },
      refreshChange() {
        this.onLoad();
      },
      onLoad() {
        const params = {
          current: this.page.currentPage,
          size: this.page.pageSize
        }
        fetchCirclePageRequest(params).then(res => {
          const data = res.data;
          this.page.total = data.total;
          this.data=  data.records;

        }).finally(()=>{
        })
      },
    },
    created() {
    },
    beforeDestroy() {

    }
  };
</script>

<style scoped lang="scss">
</style>
