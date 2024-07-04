// ==UserScript==
// @name         cpcapi
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      3.1
// @description  此脚本为蓥蓥专用!
// @author       Zemelee
// @match        https://cpcapi.cbg.cn/newEraPlatform/#/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==
 
(async function () {
    'use strict';
    let mode = JSON.parse(localStorage.getItem("mode"));
    if (mode == null || mode == void 0) {
        mode = true; // 默认新增活动模式
    }
    let header = document.querySelector("#app > section > section > header > div.currentBox")
    let modeBtn = document.createElement("button")
    modeBtn.style.marginLeft = "10px"
    if (mode) {
        modeBtn.textContent = "新增活动模式"
    } else {
        modeBtn.textContent = "录入人员模式"
    }
    header.appendChild(modeBtn)
    modeBtn.addEventListener("click", function () {
        mode = !mode;
        localStorage.setItem("mode", mode)
        if (mode) {
            modeBtn.textContent = "新增活动模式"
        } else {
            modeBtn.textContent = "录入人员模式"
        }
        setTimeout(location.reload(), 1000)
    })
    //新增活动模式
    if (mode && window.location.href.includes("volunteerActivityList")) {
        const styles = {
            newDiv: {
                // border: "1px solid red",
                width: "47%",
                height: "auto",
                padding: "0 10px",
                margin: "10px",
                backgroundColor: "white"
            },
            input: {
                width: "300px"
            },
            dateSelect: { //日期选择
                width: "150px",
                margin: "10px"
            },
            serviceSelect: { //服务方向选择
                width: "100px"
            },
            submitButton: {
                className: "btn searchBtn",
                background: "#18b4a3",
                border: "0px",
                color: "#fff",
                cursor: "pointer",
                width: ".4583rem",
                height: ".1667rem",
                marginLeft: "15px"
            }
        };
        function createStyledElement(tagName, styles) {
            const element = document.createElement(tagName);
            Object.assign(element.style, styles); // 将 styles 对象中的属性和值复制到 element.style 对象
            return element;
        }
        const ActivityForm = document.querySelector("#app > section > section > main > div > div.navSelect");
        const newDiv = createStyledElement("div", styles.newDiv);
        // 创建表单元素
        const form = document.createElement("form");
        // 活动名称输入框
        const activityTitleInput = createStyledElement("input", styles.input);
        activityTitleInput.type = "text";
        activityTitleInput.value = "建工村社区开展";
        activityTitleInput.className = "el-input__inner"
        activityTitleInput.name = "activityTitle";
        activityTitleInput.placeholder = "活动名称";
        form.appendChild(activityTitleInput);
        // 活动时间选择器
        let now = new Date();
        const activityStartTimeSelect = createStyledElement("select", styles.dateSelect);
        activityStartTimeSelect.className = "el-input__inner"
        activityStartTimeSelect.name = "activityStartTime";
        activityStartTimeSelect.placeholder = "活动开始时间";
        // 生成当前日期及其前30天的10:00和14:00选项
        for (let i = 0; i <= 30; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            const option1 = document.createElement("option");
            option1.value = `${dateStr} 10:00`;
            option1.textContent = `${dateStr} 10:00`;
            const option2 = document.createElement("option");
            option2.value = `${dateStr} 14:00`;
            option2.textContent = `${dateStr} 14:00`;
            activityStartTimeSelect.appendChild(option1);
            activityStartTimeSelect.appendChild(option2);
        }
        form.appendChild(activityStartTimeSelect);
        // 服务方向
        const activities = [
            { value: '9da78dfafb934cdeab788e5f83b6da43', textContent: '乡村振兴' },
            { value: '8c0bcd11a9c54ac88c714d4d417b5beb', textContent: '亲子互动' },
            { value: '7bd3b95bdcd24f34aaacb7e556a37c7b', textContent: '劳动实践' },
            { value: '4a233184bb8949329d2eac3a8c62aad5', textContent: '红色研学' },
            { value: '0cbf4b4397154c6ab34d400739d49437', textContent: '理论学习' },
            { value: '1747b3642cea45caa28ef38da41e70de', textContent: '理论宣传' },
            { value: '0689501c809041dbb937771e90140f48', textContent: '理论宣讲' },
            { value: 'jiaoyupeixun', textContent: '教育培训' },
            { value: 'huodongceihua', textContent: '活动策划' },
            { value: 'wenhuayishu', textContent: '文化艺术' },
            { value: 'shengtaihuanbao', textContent: '生态环保' },
            { value: 'shequfuwu', textContent: '社区服务' }
        ];
        const serviceContentSelect = createStyledElement("select", styles.serviceSelect);
        serviceContentSelect.className = "el-input__inner"
        serviceContentSelect.name = "serviceContent";
        activities.forEach(activity => {
            const option = document.createElement("option");
            option.value = activity.value;
            option.textContent = activity.textContent;
            serviceContentSelect.appendChild(option);
        });
        form.appendChild(serviceContentSelect);
        // 提交按钮
        const submitButton = createStyledElement("button", styles.submitButton);
        submitButton.type = "submit";
        submitButton.textContent = "提交";
        form.appendChild(submitButton);
        newDiv.appendChild(form);
        ActivityForm.appendChild(newDiv);
 
        // 监听表单提交事件
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            if (activityTitleInput.value.length <= 7) {
                showMessage("蓥蓥!活动名称太短啦~")
                return
            }
            let activityStartTime = activityStartTimeSelect.value;//2024-06-16 10:00
            let activityEndTime = formatTime(activityStartTime, 0, 1);
            const formData = {
                activityTitle: activityTitleInput.value,
                recruitStartTime: getRecruitTime(activityStartTime, 1),
                recruitEndTime: getRecruitTime(activityStartTime, 0),
                activityStartTime: activityStartTime,
                activityEndTime: activityEndTime,
                serviceContent: serviceContentSelect.value,
            };
            // 合并 formData 到 ReqBody
            const ReqBody = {
                ...formData,
                "activityProfile": formData.activityTitle,
                "contactPhone": "65126464",
                "publishOrganization": "c108032b4bf5467a86b7b1ac3ce2ff21",
                "requireUserCount": "40",
                "activityIntegral": "5",
                "activityRequire": "",
                "activityGuarantee": "",
                "activityPicture": "",
                "publishOrganizationType": 20,
                "activityAddress": "重庆市沙坪坝区重庆大学(B区)",
                "joinDistance": 5000,
                "mapCoordinate": "106.468165,29.573403",
                "serviceType": "",
                "status": 10
            };
 
            console.log("ReqBody:", ReqBody)
 
            // 发送 fetch 请求
            fetch("https://cpcapi.cbg.cn/manageapi/volunteerActivity/add?_t=1719644928", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "usertoken": localStorage.getItem("TOKEN"),  //好爱蓥蓥🥰
                },
                body: JSON.stringify(ReqBody),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.msg == "成功") {
                        showMessage("提交成功")
                        activityTitleInput.value = ""
                    } else {
                        showMessage("提交失败")
                    }
                })
                .catch(error => {
                    showMessage("提交失败")
                });
        });
 
    }
    //录入人员模式
    if (!mode && window.location.href.includes("volunteerActivityList")) {
        const activitiesContainer = document.createElement("div");
        activitiesContainer.style.margin = "5px";
        activitiesContainer.style.fontSize = "20px";
        activitiesContainer.style.overflowY = "auto";
        activitiesContainer.style.maxHeight = "150px";
        // 请求志愿者为0的活动，并生成多选列表
        let allActivities = await getActivities();  //包含title、code
        allActivities.forEach(activity => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `activity_${activity.id}`;
            checkbox.value = activity.activityCode;
            const label = document.createElement('label');
            label.textContent = activity.activityTitle;
            activitiesContainer.appendChild(checkbox);
            activitiesContainer.appendChild(label);
            activitiesContainer.appendChild(document.createElement('br')); // 换行
        });
        // 提交按钮/提示按钮
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.style.height = ".1067rem"
        submitButton.style.background = "#18b4a3"
        submitButton.style.border = "0px"
        submitButton.style.color = "#fff"
        submitButton.style.marginLeft = "15px";
        if (allActivities.length > 0) {
            submitButton.style.width = ".4083rem"
            submitButton.style.cursor = "pointer"
            submitButton.textContent = "提交";
            let allVoluntees = await getAllVoluntees(); //请求所有志愿者信息
            submitButton.addEventListener('click', async () => {
                const selectedCodes = [];
                // 收集选中的活动代码
                allActivities.forEach(activity => {
                    const checkbox = document.getElementById(`activity_${activity.id}`);
                    if (checkbox.checked) {
                        selectedCodes.push(activity.activityCode);
                    }
                });
                selectedCodes.forEach(activitycode => {
                    addVoluntees(activitycode, r40tees(allVoluntees)) //每个活动的需要不同的40志愿者
                })
            });
        } else {
            submitButton.style.width = ".6083rem"
            submitButton.textContent = "暂无活动可补录";
        }
        activitiesContainer.appendChild(submitButton)
 
        const footer = document.querySelector("#app > section > section > main > div > div.pageList")
        footer.style.height = "200px"
        footer.appendChild(activitiesContainer)
    }
    //请求活动信息：获取活动code
    async function getActivities() {
        const response = await fetch("https://cpcapi.cbg.cn/manageapi/volunteerActivity/list?_t=1719818494&pageNumber=1&pageSize=20&status=20", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "usertoken": localStorage.getItem("TOKEN")
            },
            "referrer": "https://cpcapi.cbg.cn/newEraPlatform/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const res = await response.json();
        if (res.msg != "成功") {
            showMessage("获取活动信息失败");
            return;
        }
        let allRes = res.data.result;
        allRes = allRes.filter(item => !item.registUserCount);
        return allRes;
    }
    //请求志愿者信息
    async function getAllVoluntees() {
        const response = await fetch("https://cpcapi.cbg.cn/manageapi/volunteerTeamUser/list?_t=1719816537&pageNumber=1&pageSize=9999&teamCode=3dabbfb2abc54138bcc3ecc72ba70a02&status=20&areaCode=49bc0e0716b54a60b693e790b56c472b", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "usertoken": localStorage.getItem("TOKEN")
            },
            "referrer": "https://cpcapi.cbg.cn/newEraPlatform/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const res = await response.json();
        if (res.msg != "成功") {
            showMessage("获取志愿者信息失败")
            return
        }
        return res.data.result
    }
    function r40tees(allVoluntees) {
        let randomIndices = new Set();
        while (randomIndices.size < 40) {
            let randomIndex = Math.floor(Math.random() * allVoluntees.length);
            randomIndices.add(randomIndex);
        }
        let rIndices = Array.from(randomIndices)
        let volunteerUsers = rIndices.map(index => allVoluntees[index].volunteerUser);  //随机40个志愿者id
        return volunteerUsers;
    }
    //补录志愿者信息
    async function addVoluntees(activityCode, volunteerUsers) {
        let reqBody = {
            "activityCode": activityCode,
            "volunteerUsers": volunteerUsers
        }
        const response = await fetch("https://cpcapi.cbg.cn/manageapi/volunteerActivityUser/batchAdd?_t=1719816951", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "usertoken": localStorage.getItem("TOKEN")
            },
            "referrer": "https://cpcapi.cbg.cn/newEraPlatform/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(reqBody),
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const res = await response.json();
        if (res.msg != "成功") {
            showMessage("志愿者补录失败")
            return
        }
        showMessage("志愿者补录成功")
    }
    function formatTime(AST, day = 0, hour = 0) {
        AST = new Date(AST);
        let resTime;
        if (day) {
            // 增加1天
            let nextDate = new Date(AST.getTime());
            nextDate.setDate(AST.getDate() + 1);
            resTime = `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}-${pad(nextDate.getDate())} ${pad(AST.getHours())}:${pad(AST.getMinutes())}`;
        } else if (hour) {
            // 增加2小时
            let nextHour = new Date(AST.getTime());
            nextHour.setHours(AST.getHours() + 2);
            resTime = `${nextHour.getFullYear()}-${pad(nextHour.getMonth() + 1)}-${pad(nextHour.getDate())} ${pad(nextHour.getHours())}:${pad(AST.getMinutes())}`;
        } else {
            // 没有增加
            resTime = `${AST.getFullYear()}-${pad(AST.getMonth() + 1)}-${pad(AST.getDate())} ${pad(AST.getHours())}:${pad(AST.getMinutes())}`;
        }
        return resTime;
    }
    function getRecruitTime(AST, start = 0) {
        AST = new Date(AST);
        let resTime = new Date(AST.getTime());
        if (resTime.getHours() == 10) { //上午
            resTime.setHours(9)
        } else { //下午
            resTime.setHours(12)
        }
        if (start) {
            resTime.setDate(resTime.getDate() - 1);//前一天开始招募
        }
        return formatTime(resTime); //招募结束日期即活动日期
    }
    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }
    let messageBox = null;
    function showMessage(text) {
        if (messageBox) {
            document.body.removeChild(messageBox);
        }
        messageBox = document.createElement('div');
        messageBox.textContent = text;
        messageBox.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 9999;
    `;
        document.body.appendChild(messageBox);
        setTimeout(() => {
            document.body.removeChild(messageBox);
            messageBox = null; // 释放引用，准备下一次使用
        }, 4000); // 4 seconds
    }
})();
