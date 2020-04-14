<template>
    <section class="chart-container" >
        <el-carousel interval="5000" height="550px" indicator-position="outside">
            <el-carousel-item v-for="item in images">
                <el-image :src=item.src :fit="contain"></el-image>
                <div>
                    <label>{{item.text}}</label>
                    <br/>
                    <label>{{item.text2}}</label>
                </div>
            </el-carousel-item>
        </el-carousel>
    </section>
</template>

<script>
    import echarts from 'echarts'

    export default {
        data() {
            return {
                images:[
                    {src:"static/image/index1.png",text:"晓云舒瑞  寒影初回长日至",text2:"  —（宋） 阮阅 · 《减字木兰花》"},
                    {src:"static/image/index4.png",text:"灯下一身家万里  今年恰好是三冬",text2:"   —（宋） 郑刚中 · 《庚午冬至夜》"},
                    {src:"static/image/index2.png",text:"腊前梅蕊未斜横  至后醅香试满觥",text2:"  —（宋） 朱翌 · 《冬至后雪夜》"},
                    {src:"static/image/index5.png",text:"天时人事日相催  冬至阳生春又来",text2:"  —（唐） 杜甫 · 《小 至》"}
                ],
            }
        }
    }
</script>

<style scoped>
    .el-carousel{
        margin-top: 30px;
    }
    .el-carousel__item{
        width: 950px;
        margin-right: 50px;
    }
    .el-image{
        margin-left: 260px!important;
    }
    h2{
        display: block;
        color: #474946;
        font-family: 微软雅黑;
        margin-bottom: 8px;
        text-align: center;
    }
    .el-carousel__item label{
        margin-top: 35px;
        color: #616360;
        font-family: 隶书;
        font-size: 20px;
        margin-bottom: 8px;
        text-align: right !important;
        margin-left: 480px;
    }
</style>
