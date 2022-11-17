import axios from 'axios';
import store from '@/store';
import { refresh } from '@/api/account';
import { Message, MessageBox } from 'element-ui';
import router from "@/router";
import { timeout } from "@/utils/common";

// create an axios instance
const service = axios.create({
    // url = base url + request url
    baseURL: process.env.VUE_APP_BASE_API,
    // request timeout
    timeout: 5000
});

// while循环次数
let times = 0;
let noticed = false;
let popuped = false;
let refreshing = false;
let globalTimes = 0; // 防止无限重试的问题

function gotoLoginPage(message, fullPath) {
    MessageBox(message, "提示", {
        confirmButtonText: '确定'
    }).then(() => {

        let path = "/login";
        if (!fullPath.startsWith(path)) {
            path += `?redirect=${fullPath}`;
        }
        router.push(path);
    });
}

async function respHandler(resp) {
    const data = resp.data;
    switch (data.code) {
        case 0:
            return data;
        // 未登录或accessToken过期
        case 40101:
            // 若没refreshToken时，提示用户前往登录（与其过期一样的逻辑
            let accessToken = store.state.user.accessToken;
            const refreshToken = store.state.user.refreshToken;
            
            if (!refreshToken) {
                // 多个请求40101的情况下，只提示一次
                if (noticed) {
                    return;
                }
                noticed = true;
                gotoLoginPage(data.message, router.app.$route.fullPath);
                setTimeout(() => {
                    noticed = false;
                }, 2000);
                return;
            }

            // 先等待刷新token的结果【一般来说，网络良好的情况下，不会花多久；可根据自己的实际情况来设置等待时间】
            while (refreshing && times < 5 && !accessToken) {
                times++;
                await timeout(0.1 * times);
                accessToken = store.state.user.accessToken;
                if (accessToken) {
                    break;
                }
            }

            // 等待次数完毕，且无accessToken时，则不再重新发起请求
            if (times !== 0) {
                times = 0;
                if (!accessToken) {
                    return;
                } 
            }
            
            // 若token为空或者请求头与store中的token一致，则进行刷新
            if (!accessToken || resp.config.headers["Authorization"].split(" ")[1] === accessToken) {
                refreshing = true;
                store.commit("user/SET_ACCESS_TOKEN", { accessToken: "" });
                const refreshResp = await refresh({ refreshToken }).catch(error => {
                    console.log("刷新失败：");
                    console.log(error);
                });
                refreshing = false;
                // 若重新请求成功，请求失败那个响应结果将会被忽略，以service(response.config)的结果代替
                if (refreshResp && refreshResp.code === 0) {
                    const { accessToken, refreshToken, payload: user } = refreshResp.data;
                    store.commit("user/SET_ACCESS_TOKEN", { accessToken });
                    store.commit("user/SET_USER", { user });
                    if (refreshToken) {
                        commit("user/SET_REFRESH_TOKEN", { refreshToken });
                    }
                    // 重新发起【失败的请求】
                    return await service(resp.config);
                }
            }
            else {
                return await service(resp.config);
            }
            break;
        // refreshToken过期
        case 40198:
            gotoLoginPage(data.message, router.app.$route.fullPath);
            store.commit("user/SET_REFRESH_TOKEN", { refreshToken: "" });
            break;
        default:
            if (popuped) {
                return;
            }
            popuped = true;
            setTimeout(() => {
                popuped = false;
            }, 2000);
            Message.error(data.message || "系统发生异常");
    }
}

// request interceptor
service.interceptors.request.use(
    config => {
        const accessToken = store.state.user.accessToken;
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => {
        // do something with request error
        console.log(error); // for debug
        return Promise.resolve(error);
    }
);

// response interceptor
service.interceptors.response.use(
    async response => {
        const data = respHandler(response);
        return data;
    },
    async error => {
        console.log(error.response); // for debug
        if (error.response && globalTimes < 5) {
            const retryResp = await respHandler(error.response, error.config);
            if (!retryResp) {
                globalTimes++;
            }
            else {
                if (globalTimes > 0) {
                    globalTimes = 0;
                }
            }
            // 回返回一个Promise<undefined>，导致后续的接口判断处触发异常无法提示信息【这刚好符合需求，本来出错的时候，就不想让其提示】
            return Promise.resolve(retryResp || error.response.data || error.response);
        }
        
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        });

        return Promise.reject(error);
    }
);

export default service;
