((Vue)=>{
    window.reportCall = function(info) {
        vue.loadRecord(info);
    }
    window.showCall = function() {
        vue.showInit();
    }
    const spinLoader = Vue.component('spinLoader', {
        data: () => {return {}},
        template: `
        <div class="loader">
            <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="blue" strokeWidth="4"></circle>
                <path class="opacity-75" fill="blue" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
        `
    });
    const basicProfile = Vue.component('basicProfile', {
        data:()=>{ return {}},
        props: ['info'],
        template: `
        <div class="row">
            <div class="col-md-6">
                <h3 class="nameinfo1" data-aos="fade-right"> ID: {{info.accountId}}</h3>
                <h2 class="nameinfo2" data-aos="fade-right">{{info.firstName}} {{info.lastName}}</h2>
                <div class="line-horiz"></div>
                <div class="profileinfo" data-aos="fade-up-right">
                    <div class="d-flex"><span class="mydtl">Date of Birth :</span><span>{{moment(info.dob).format('DD-MMMM-YYYY')}}</span></div>
                    <div class="d-flex"><span class="mydtl">Address :</span><span>{{info.address}}</span></div>
                    <div class="d-flex"><span class="mydtl">E-mail :</span><span>{{info.userName}}</span></div>
                    <div class="d-flex"><span class="mydtl">Phone :</span><span>{{info.phoneCode}}{{info.phone}}</span></div>
                    <div class="d-flex"><span class="mydtl">Gender :</span><span>{{info.gender}}</span></div>
                    <div class="d-flex"><span class="mydtl">Nationality :</span><span>{{info.country}}</span></div>
                    <div class="d-flex"><span class="mydtl">State :</span><span>{{info.state}}</span></div>
                    <div class="d-flex"><span class="mydtl">Language :</span><span>{{info.language}}</span></div>
                </div>
            </div>
            <div class="col-md-6">
                <div class=" d-flex justify-content-center align-items-center" data-aos="zoom-in-left" data-aos-duration="1000"><div class="bg-profile" :style="{backgroundImage: 'url('+info.bg+')'}"></div></div>
            </div>
        </div>`
    });
    const myEducation = Vue.component('myEducation', {
        data:()=>{ return {}},
        props: ['info'],
        template: `
        <div class="row">
            <div class="col-md-6 d-flex flex-column pt-5" style="row-gap: 30px; padding-left:30px;">
                <h1>Job Details</h1>
                <table data-aos="fade-up" class="table table-primary shadow position-relative" v-for="(item, idx) in info">
                    <tbody>
                        <tr><td>Company Name</td><td class="text-primary">{{item.companyName}}<span class="jobno">Job {{idx + 1}}</span></td></tr>
                        <tr><td>Job Title</td><td class="text-primary">{{item.jobTitle}}</td></tr>
                        <tr><td>Job Type</td><td class="text-primary">{{item.jobType}}</td></tr>
                        <tr><td>Location</td><td class="text-primary">{{item.state}}, {{item.zipcode}}</td></tr>
                        <tr><td>Duration</td><td class="text-primary">From: {{moment(info.from).format('DD-MMMM-YYYY')}} To: {{item.isRecentJob ? 'Today': moment(info.to).format('DD-MMMM-YYYY')}}</td></tr>
                        <tr><td>Salary</td><td class="text-primary">{{item.salary}}</td></tr>
                        <tr><td>Current Job?</td><td class="text-primary">{{item.isRecentJob ? 'Yes' : 'No'}}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        `
    })
    const vue = new Vue({
        el: '#app',
        data: {
            show: false,
            tabid: 0,
            isLoader: false,
            dataInfo: {},
            profileinfo: {},
            educationinfo: {},
            passedInfo: {}
        },
        components: {
            basicProfile,spinLoader,myEducation
        },
        methods: {
            loadRecord(pass) {
                let info;
                if (!pass) {
                    this.isLoader = true;
                    info = this.passedInfo;
                }
                else {
                    info = {...pass}
                    this.passedInfo = {...pass}
                }
                let search = [{ _modal: 'UserBasicInfo', _find: { _id: info.userid }, _mode: 'single', _select: '' }];
                (async() => {
                    const res = await fetch(`${info.api_url}/api/common/common_search`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json"},
                        body: JSON.stringify({ _list: search })
                    });
                    const data = await res.json();
                    data.bg = data.photo ? `${info.api_url}/photos/${data._id}${data.photo}` : `${info.api_url}/photos/user.png`
                    this.dataInfo = {...data};
                    this.tabid = 0;
                    if (pass) window.parent.fromChild();
                    else {
                        this.isLoader = false;
                        this.$nextTick(function() {
                            AOS.init();
                        });
                    }
                })();
            },
            async loadMyJob() {
                this.isLoader = true;
                let search = [{ _modal: 'ProfileList', _find: { userid: this.passedInfo.userid }, _mode: 'single', _select: 'job' }];
                const res = await fetch(`${this.passedInfo.api_url}/api/common/common_search`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({ _list: search })
                });
                const data = await res.json();
                this.tabid = 1;
                this.dataInfo = data.job||[];
                this.isLoader = false;
                this.$nextTick(function() {
                    this.$nextTick(function() {
                        AOS.init();
                    });
                })
            },
            showInit() {
                this.show = true;
                this.$nextTick(function() {
                    AOS.init();
                });
            }
        },
        mounted() {},
    })
})(Vue);