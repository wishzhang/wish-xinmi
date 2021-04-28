<template>
    <div v-if="photos.length>0" class="thought-people-photos">
        <template v-if="photos.length===1">
            <van-image
                    fit="cover"
                    :lazy-load="true"
                    :style="{width: getLen(2), height: getLen(2)}"
                    :src="photos[0]"
                    @click="onImageClick(0)"/>
        </template>
        <template v-if="photos.length===2">
            <div style="display: flex">
                <van-image
                        fit="cover"
                        :lazy-load="true"
                        :style="{width: getLen(1),height: getLen(2, 2)}"
                        style="margin-right:2px;"
                        :src="photos[0]"
                        @click="onImageClick(0)"/>
                <van-image
                        fit="cover"
                        :lazy-load="true"
                        :style="{width: getLen(1),height: getLen(2, 2)}"
                        style="margin-right:2px;"
                        :src="photos[1]"
                        @click="onImageClick(0)"/>
            </div>
        </template>
        <template v-else-if="photos.length===3">
            <div style="display: flex">
                <van-image
                        fit="cover"
                        :lazy-load="true"
                        :style="{width: getLen(1),height: getLen(2, 2)}"
                        style="margin-right:2px;"
                        :src="photos[0]"
                        @click="onImageClick(0)"/>
                <div>
                    <div :style="{height: getLen(1)}" style="margin-bottom:2px;">
                        <van-image
                                fit="cover"
                                :lazy-load="true"
                                :style="{width: getLen(1),height: getLen(1)}"
                                :src="photos[1]"/>
                    </div>
                    <div>
                        <van-image
                                fit="cover"
                                :lazy-load="true"
                                :style="{width: getLen(1),height: getLen(1)}"
                                :src="photos[2]"/>
                    </div>
                </div>
            </div>
        </template>

        <template v-else-if="photos.length===4">
            <van-row v-for="row in 2" :gutter="2" style="margin-bottom: 2px;">
                <van-col v-for="col in 2" :style="{height: getLen(1)}">
                    <van-image
                            fit="cover"
                            :lazy-load="true"
                            :style="{width: getLen(1),height: getLen(1)}"
                            :src="photos[getFourIndex(row, col)]"
                            @click="onImageClick(getFourIndex(row, col))"/>
                </van-col>
            </van-row>
        </template>
    </div>
</template>

<script>
    import {ImagePreview} from 'vant';

    export default {
        name: "thought-people-photos",
        props: {
            photosUrl: {
                type: String
            }
        },
        data() {
            return {
                unit: 30
            }
        },
        computed: {
            photos() {
                if (!this.photosUrl) return [];
                return this.photosUrl.split(',').slice(0,4);
            },
            oneImageStyle() {
                return {
                    'max-width': this.unit * 2 + 'px',
                    'max-height': this.unit * 2 + 'px'
                }
            },
            otherImageStyle() {
                return {
                    'width': 30 + 'px',
                    'height': 30 + 'px'
                }
            }
        },
        methods: {
            getLen(times = 1, dx = 0) {
                return (this.unit * times + dx) + 'px';
            },
            getFourIndex(row, col) {
                return (row - 1) * 2 + col - 1;
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

