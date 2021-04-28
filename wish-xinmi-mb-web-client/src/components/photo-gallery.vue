<template>
    <div v-if="photos.length>0" class="photo-gallery">
        <!--分为以下三种情况，当图片数量为1，4，其他的情况-->
        <template v-if="photos.length===1">
            <van-image
                    fit="cover"
                    :lazy-load="true"
                    :style="oneImageStyle"
                    :src="photos[0]"
                    @click="onImageClick(0)"/>
        </template>
        <template v-else-if="photos.length===4">
            <van-row v-for="row in 2" :gutter="4" type="flex">
                <van-col v-for="col in 2">
                    <van-image
                            fit="cover"
                            :lazy-load="true"
                            :style="otherImageStyle"
                            :src="photos[getFourIndex(row, col)]"
                            @click="onImageClick(getFourIndex(row, col))"/>
                </van-col>
            </van-row>
        </template>

        <template v-else>
            <van-row v-for="row in 3" :gutter="4" type="flex" v-if="(row-1)*3<photos.length">
                <van-col v-for="col in 3" v-if="getOtherIndex(row, col)<photos.length">
                    <van-image
                            fit="cover"
                            :lazy-load="true"
                            :style="otherImageStyle"
                            :src="photos[getOtherIndex(row, col)]"
                            @click="onImageClick(getOtherIndex)"/>
                </van-col>
            </van-row>
        </template>
    </div>
</template>

<script>
    import {ImagePreview} from 'vant';

    export default {
        name: "photo-gallery",
        props: {
            photosUrl: {
                type: String
            }
        },
        computed: {
            photos() {
                if (!this.photosUrl) return [];
                return this.photosUrl.split(',');
            },
            oneImageStyle() {
                const oneMaxHeight = Math.trunc(this.maxWidth * 1.3);
                const width = this.website.winWidth - 70;
                const oneMaxWidth = Math.trunc(width / 3 * 1.8);
                return {
                    'max-width': oneMaxWidth + 'px',
                    'max-height': oneMaxHeight + 'px'
                }
            },
            otherImageStyle() {
                const width = (this.website.winWidth - 70) / 3 - 10;
                return {
                    'width': width + 'px',
                    'height': width + 'px'
                }
            }
        },
        methods: {
            getFourIndex(row, col){
                return (row - 1) * 2 + col - 1;
            },
            getOtherIndex(row, col) {
                return (row - 1) * 3 + col - 1;
            },
            onImageClick(photoInd) {
                ImagePreview({
                    images: this.photos,
                    showIndex: false,
                    showIndicators: true,
                    loop: false,
                    startPosition: photoInd
                });
            }
        }
    }
</script>

<style scoped>

</style>
