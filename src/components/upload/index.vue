<template>
    <div>
        <el-upload
            :action="host"
            :on-remove="handleRemove"
            :file-list="fileList"
            :list-type="config.listType || 'picture'"
            :before-upload="beforeUploadHandler"
            :on-success="successHandler"
            :data="formData"
            :multiple="config.multiple || false"
            :accept="config.accept || '.jpg,.jpeg,.png,.gif'"
            :limit="config.limit || 5"
            :on-exceed="exceedHandler"
            :on-error="errorHandler"
            :on-preview="preViewHandler"
            :show-file-list="!config.hideFileList"
        >
            <el-button size="small" type="primary">点击上传</el-button>
            <div v-if="!config.hideTips" slot="tip" class="el-upload__tip">
                只能上传jpg/png文件, 且不超过500kb
            </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="66%">
            <div style="width: 100%; text-align: center;">
                <img :src="url" alt="" style="width: 100%; height: auto;" />
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getUUID, getType } from '../../utils/common';

export default {
    props: {
        config: {
            type: Object,
            default() {
                return {}
            }
        },
        value: String|Array // 在组件上绑定的值（即v-model
    },
    created() {
        this.init();
    },
    data() {
        return {
            formData: {
                OSSAccessKeyId: "", // 阿里云accessKeyId
                policy: "", // (后端接口返回)
                signature: "", // 签名(后端接口返回)
                key: "", // 存储文件路径（不包含主机名）
                success_action_status: "200"
            },
            host: "", // 上传文件主机名
            dialogVisible: false,
            url: "",
            multiple: false,
            fileList: []
        };
    },
    methods: {
        init() {
            const result = [];
            const type = getType(this.value);
            switch (type) {
                case 'Array':
                    this.multiple = true;
                    for (const item of this.value) {
                        result.push({ url: item, name: item });
                    }
                    break;
                case 'string':
                    if (this.value) {
                        result.push({ url: this.value, name: this.value });
                    }
                    break;
            }
            if (result.length) {
                this.fileList = result;
            }
        },
        // 通知父组件
        emitInputHandler(fileList) {
            // 多文件上传时，返回数组；否则返回单个字符串
            let result;
            if (this.multiple) {
                result = fileList.map(item => item.url);
            }
            else {
                result = fileList.length ? fileList[0].url : '';
            }
            this.$emit('input', result);
            this.$emit('change', fileList);
        },
        // 移除图片
        handleRemove(file, fileList) {
            this.emitInputHandler(fileList);
        },
        beforeUploadHandler(file) {
            // multiple指的是，能否多选文件，而不是能否上传多个
            const dotIndex = file.name.lastIndexOf('.');
            const suffix = file.name.slice(dotIndex + 1);
            const prefix = file.name.slice(0, dotIndex);
            const acceptStr = this.config.accpet || '.jpg,.jpeg,.png,.gif';
            if (!acceptStr.split(',').includes(`.${suffix}`)) {
                this.$message.warning('只能上传指定类型的文件：' + acceptStr);
                return false;
            }
            return new Promise((resolve, reject) => {
                // 获取上传签名数据
                this.$http({
                    url: this.$http.adornUrl("/third/oss/signature"),
                    method: "get"
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        const { accessid, dir, host, policy, signature } = data.data
                        this.host = host;
                        this.formData.OSSAccessKeyId = accessid;
                        this.formData.policy = policy;
                        this.formData.signature = signature;
                        this.formData.key = `${dir}${prefix}--${getUUID()}.${suffix}`; // 文件路径
                        resolve(true);
                    }
                    else {
                        reject(false)
                    }
                }).catch(() => {
                    reject(false);
                });
            });
        },
        // 上传成功回调
        successHandler(response, file) {
            this.fileList.push({
                name: file.name,
                url: `${this.host}/${this.formData.key}`
            });
            this.emitInputHandler(this.fileList);
        },
        // 上传数量超出提示
        exceedHandler(files, fileList){
          this.$message.error(`超出最大上传数量：${this.config.limit || 5}`)
        },
        // 上传错误提示
        errorHandler(err, file, fileList) {
            this.$message.error('上传失败：' + err);
        },
        // 预览图片（点击名字
        preViewHandler(file) {
            this.dialogVisible = true;
            this.url = file.url;
        }
    },
};
</script>