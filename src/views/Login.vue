<template>
  <el-container :style="note" >
  <el-form style="height: 330px; background-color: #f7fff2; margin-right: 160px;" :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h1 class="title">智慧档案管理系统</h1>
    <el-form-item prop="account">
      <el-input type="text"  v-model="ruleForm2.account" auto-complete="off" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password"  v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%; font-weight: bold" round @click.native.prevent="handleSubmit2" @keyup.enter.native="loginEnter('loginData')" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
  </el-container>
</template>
<script>
  import { requestLogin } from '../api/api';
  //import NProgress from 'nprogress'
  import defaultImg from "../../static/image/index3.png"
  export default {

    data() {
      return {
      note:{
          backgroundImage:'url(' + defaultImg + ')',
          backgroundRepeat:'no-repeat',
          backgroundSize: "100% 100%",
          opacity:"0.9",
          height:"100%"

        },
        logining: false,
        ruleForm2: {
          account: 'admin',
          checkPass: 'admin'
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    methods: {
      loginEnter(){
          this.handleSubmit2();
          document.onkeydown = undefined; // 登陆后 置空按键
      },
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2() {
        const that = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.logining = true;
            var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            this.$http.post("/login",loginParams).then(res =>{
                this.logining = false;
                let {code,message,data} = res.data;
                let {userId,sessionId,menus} = data;
                if(code == "00000000"){
                    sessionStorage.setItem('userId',JSON.stringify(userId));
                    sessionStorage.setItem("sessionId",sessionId);
                    sessionStorage.setItem("menus",JSON.stringify(menus));

                    // 修改路由对象中routes数组
                    this.handleRoutes();
                    //添加路由
                    this.$router.push({path:'/main'});
                    console.debug("登录成功");
                }else {
                    this.$message({
                        message:message,
                        type:'error'
                    });
                }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleRoutes(){
          let menus = JSON.parse(sessionStorage.getItem("menus"));

          if(this.$router.options.routes.length > 3){
              return;
          }

          // 总的动态路由的数组
          let allRoutes = [];
          for(let i=0;i<menus.length;i++){
              let pMenu = menus[i];
              // 父级菜单
              let parentMenu ={
                  path:"/",
                  component:() => import("@/views/Home"),
                  name:pMenu.name,
                  iconCls:pMenu.icon,
                  children:[]  // 子级菜单数组
              };
              // 子级菜单对象
              for(let j=0;j<pMenu.children.length;j++){
                  let cMenu = pMenu.children[j];
                  let chidMenu = {
                      path: cMenu.url,
                      component: () => import("@/views/"+cMenu.component),
                      name: cMenu.name
                  };
                  parentMenu.children.push(chidMenu);
              }
              this.$router.options.routes.push(parentMenu)
              allRoutes.push(parentMenu);
          }
          this.$router.addRoutes(allRoutes);
      }
    },
    created(){
        var _self = this;
        document.onkeydown = function(e){
            if(window.event == undefined){
                var key = e.keyCode;
            }else{
                var key = window.event.keyCode;
            }
            if(key == 13){
                _self.loginEnter('loginData');
            }
        }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;

    }


    .remember {
      margin: 0px 0px 35px 0px;
    }

  }

</style>
