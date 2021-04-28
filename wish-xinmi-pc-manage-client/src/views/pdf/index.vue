<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               :before-open="beforeOpen"
               :page="page"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
    </avue-crud>
  </basic-container>
</template>

<script>
    import {
        getList,
        getUser,
        remove,
        update,
        add,
    } from "@/api/system/user";
    import {mapGetters} from "vuex";

    export default {
        name: 'pdf',
        data() {
            return {
                form: {},
                roleBox: false,
                loading: true,
                selectionList: [],
                query: {},
                page: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
                init: {
                    roleTree: [],
                    deptTree: [],
                },
                props: {
                    label: "title",
                    value: "key"
                },
                roleGrantList: [],
                roleTreeObj: [],
                option: {
                    searchShow: true,
                    searchMenuSpan: 6,
                    tip: false,
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    selection: true,
                    viewBtn: true,
                    dialogWidth: 500,
                    column: [
                        {
                            label: "名称",
                            prop: "account",
                            search: true,
                            span: 24,
                            row: true,
                            rules: [{
                                required: true,
                                message: "请输入名称",
                                trigger: "blur"
                            }],
                        },
                        {
                            label: 'pdf文件',
                            prop: 'file',
                            type: 'upload',
                            hide: true,
                        },
                        {
                            label: "访问路径",
                            prop: "tenantId",
                            display: false,
                            search: false,
                        },
                        {
                            label: '创建时间',
                            prop: 'datetime',
                            addDisplay: false,
                            editDisabled: true,
                            viewDisplay: true,
                        },
                        {
                            label: '更新时间',
                            prop: 'datetime',
                            addDisplay: false,
                            viewDisplay: true,
                            editDisabled: true,
                        }
                    ]
                },
                data: [],
            };
        },
        watch: {},
        computed: {
            ...mapGetters(["userInfo", "permission"]),
            permissionList() {
                return {
                    addBtn: true,
                    viewBtn: true,
                    delBtn: true,
                    editBtn: true
                };
            },
        },
        methods: {
            rowSave(row, done, loading) {
                row.deptId = row.deptId.join(",");
                row.roleId = row.roleId.join(",");
                row.postId = row.postId.join(",");
                add(row).then(() => {
                    done();
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    window.console.log(error);
                    loading();
                });
            },
            rowUpdate(row, index, done, loading) {
                row.deptId = row.deptId.join(",");
                row.roleId = row.roleId.join(",");
                row.postId = row.postId.join(",");
                update(row).then(() => {
                    done();
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    window.console.log(error);
                    loading();
                });
            },
            rowDel(row) {
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        return remove(row.id);
                    })
                    .then(() => {
                        this.onLoad(this.page);
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                    });
            },
            searchReset() {
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params, done) {
                this.query = params;
                this.page.currentPage = 1;
                this.onLoad(this.page, params);
                done();
            },
            selectionChange(list) {
                this.selectionList = list;
            },
            beforeOpen(done, type) {
                if (["edit", "view"].includes(type)) {
                    getUser(this.form.id).then(res => {
                        this.form = res.data.data;
                        if (this.form.hasOwnProperty("deptId")) {
                            this.form.deptId = this.form.deptId.split(",");
                        }
                        if (this.form.hasOwnProperty("roleId")) {
                            this.form.roleId = this.form.roleId.split(",");
                        }
                        if (this.form.hasOwnProperty("postId")) {
                            this.form.postId = this.form.postId.split(",");
                        }
                    });
                }
                done();
            },
            currentChange(currentPage) {
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
            },
            refreshChange() {
                this.onLoad(this.page, this.query);
            },
            onLoad(page, params = {}) {
                this.loading = true;
                getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    this.data = data.records;
                    this.loading = false;
                });
            }
        }
    };
</script>

<style>
</style>
