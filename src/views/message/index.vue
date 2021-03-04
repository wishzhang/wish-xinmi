<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               v-model="form"
               ref="crud"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @row-update="rowUpdate"
               @row-save="rowSave"
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
  import {fetchAllMessagePageRequest} from "../../api/message";
  import {dateFormat} from "../../util/date";

  export default {
    name: 'index',
    data() {
      return {
        form: {},
        query: {},
        loading: true,
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
              label: "发起人",
              prop: "originUsername",
              type: 'input',
              search: true,
            },
            {
              label: "接收人",
              prop: "targetUsername",
              type: 'input',
              search: true,
            },
            {
              label: "内容",
              prop: "content",
              type: 'input',
              search: true,
            },
            {
              label: "创建时间",
              prop: "createTime",
              type: 'datetime',
              format: "yyyy-MM-dd hh:mm:ss",
              search: true,
              formatter(row){
                return dateFormat(row.createTime);
              }
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
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud && this.$refs.crud.toggleSelection();
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
        this.loading = true;

        const params = {
          current: this.page.currentPage,
          size: this.page.pageSize
        };
        fetchAllMessagePageRequest(params).then(res => {
          this.loading = false;
          const data = res.data;
          const dates = data.records.map(el=>new Date(el.createTime).valueOf());
          console.log(dates);
          this.data = data.records;
          this.page.total = data.total;
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
