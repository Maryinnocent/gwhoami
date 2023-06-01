((Vue) =>
{
    window.reportCall = function (info)
    {
        vue.loadRecord(info);
    }
    window.showCall = function ()
    {
        vue.showInit();
    }
    const spinLoader = Vue.component('spinLoader', {
        data: () => { return {} },
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
        data: () => { return {} },
        props: ['info'],
        template: `
        <div class="row">
        
        <div class="col-md-6">
            <h3 class="nameinfo1" data-aos="fade-right"> ID: {{info.accountId}}</h3>
            <h2 class="nameinfo2" data-aos="fade-right">{{info.firstName}} {{info.lastName}}</h2>
            <div class="line-horiz"></div>
        </div>
        <div class="col-md-6">
        </div>
        <div class="col-md-12"><h3 class="seconheader" data-aos="fade-right">My Sports
        </h3>
        </div>
        <div class="col-md-12"><h3 class="seconheader" data-aos="fade-right">My favorite play is Soccer
        </h3>
        </div>
        <div class="col-md-4">
                <div class="profiletext" data-aos="fade-left">
                <h3  class="nameinfo1">{{info.firstName}} {{info.lastName}}</h3>
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
        <div class="col-md-4">
            <div class=" d-flex justify-content-center align-items-center" data-aos="flip-left" data-aos-duration="1000"><div class="bg-profile" :style="{backgroundImage: 'url('+info.bg+')'}"></div></div>
        </div>
        <div class="col-md-4">
            <div class=" d-flex justify-content-center align-items-center" data-aos="flip-right" data-aos-duration="1000"><div class="bg-profile" :style="{backgroundImage: 'url('+info.bg+')'}"></div></div>
        </div>
<div>


<table class="table"  data-aos="fade-right">
  <thead  class="thirdheader">
    <tr>
      <th  colspan="7">Primary League</th>
    </tr>
  </thead>
  <tbody>
  <tr class="thirdheaderrow">
    <th scope="col">Season</th>
    <th scope="col">Team</th>
    <th scope="col">Goals</th>
    <th scope="col">Assists</th>
    <th scope="col">Yellow Cards</th>
    <th scope="col">Red Cards</th>
</tr>
    <tr  class="thirdheaderrows">
      <th scope="row">2023</th>
      <td>FPYC</td>
      <td>10</td>
      <td>7</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr  class="thirdheaderrows">
      <th scope="row">2022</th>
      <td>FPYC</td>
      <td>9</td>
      <td>9</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr  class="thirdheaderrows">
      <th scope="row">2021</th>
      <td>FPYC</td>
      <td>12</td>
      <td>11</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr  class="thirdheaderrows">
      <th scope="row">2020</th>
      <td>FPYC</td>
      <td>10</td>
      <td>7</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr  class="thirdheaderrows">
      <th scope="row">2019</th>
      <td>FPYC</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
<div>

<table border="1" cellpadding="1" cellspacing="1" style="background-color:#ffffff; width:329.949px">
	<tbody>
		<tr>
			<td  style="width:90px" class="bg-3imgtr"><div class="bg-profile2" :style="{backgroundImage: 'url('+info.bg+')'}"></div><p>2023</p>
            </td>
			<td colspan="1" rowspan="2" class="bg-3imgtr" style="width:162px"><div class="bg-profile1" :style="{backgroundImage: 'url('+info.bg+')'}"></div><p>    </p></td>
			<td class="bg-3imgtr"  style="width:59px"><div class="bg-profile2" :style="{backgroundImage: 'url('+info.bg+')'}"></div><p>2022</p></td>
		</tr>
		<tr>
			<td class="bg-3imgtr"  style="width:90px"><div class="bg-profile2" :style="{backgroundImage: 'url('+info.bg+')'}"></div><p>2021</p></td>
			<td class="bg-3imgtr"  style="width:59px"><div class="bg-profile2" :style="{backgroundImage: 'url('+info.bg+')'}"></div><p>2020</p></td>
		</tr>
		<tr>
			<td class="bg-3imgtr"  style="width:90px"><div class="bg-profile2" :style="{backgroundImage: 'url('+info.bg+')'}"></div><p>2019</p></td>
			<td class="bg-3imgtr"  style="width:162px"><div class="bg-profile2" :style="{backgroundImage: 'url('+info.bg+')'}"></div><p>    </p></td>
			<td class="bg-3imgtr"  style="width:59px"><div class="bg-profile2" :style="{backgroundImage: 'url('+info.bg+')'}"></div><p>2018</p></td>
		</tr>
	</tbody>
</table>

<table class="table"  data-aos="fade-right">
  
  <tbody>
  <tr class="thirdheaderrow4">
    <th scope="col">
    <div id="slideshow">
        <div class="slide-wrapper">
            
            <div class="slide">
                <h1 class="slide-number">
                <div class=" d-flex justify-content-center align-items-center" data-aos="flip-left" data-aos-duration="1000"><div class="bg-profile" :style="{backgroundImage: 'url('+info.bg+')'}"></div></div>
                </h1>
            </div>
            <div class="slide">
                <h1 class="slide-number">
                <div class=" d-flex justify-content-center align-items-center" data-aos="flip-left" data-aos-duration="1000"><div class="bg-profile" :style="{backgroundImage: 'url('+info.bg+')'}"></div></div>
                </h1>
            </div>
            <div class="slide">
                <h1 class="slide-number">
                <div class=" d-flex justify-content-center align-items-center" data-aos="flip-left" data-aos-duration="1000"><div class="bg-profile" :style="{backgroundImage: 'url('+info.bg+')'}"></div></div>
                </h1>
            </div>
            <div class="slide">
                <h1 class="slide-number">
                <div class=" d-flex justify-content-center align-items-center" data-aos="flip-left" data-aos-duration="1000"><div class="bg-profile" :style="{backgroundImage: 'url('+info.bg+')'}"></div></div>
                
                </h1>
            </div>
        </div>
    </div></th>
    </tr>
</tbody>
</table>

</div>
   </div>`
    });
    const myEducation = Vue.component('myEducation', {
        data: () => { return {} },
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
            basicProfile, spinLoader, myEducation
        },
        methods: {
            loadRecord(pass)
            {
                let info;
                if (!pass)
                {
                    this.isLoader = true;
                    info = this.passedInfo;
                }
                else
                {
                    info = { ...pass }
                    this.passedInfo = { ...pass }
                }
                let search = [{ _modal: 'UserBasicInfo', _find: { _id: info.userid }, _mode: 'single', _select: '' }];
                (async () =>
                {
                    const res = await fetch(`${info.api_url}/api/common/common_search`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ _list: search })
                    });
                    const data = await res.json();
                    data.bg = data.photo ? `${info.api_url}/photos/${data._id}${data.photo}` : `${info.api_url}/photos/user.png`
                    this.dataInfo = { ...data };
                    this.tabid = 0;
                    if (pass) window.parent.fromChild();
                    else
                    {
                        this.isLoader = false;
                        this.$nextTick(function ()
                        {
                            AOS.init();
                        });
                    }
                })();
            },
            async loadMyJob()
            {
                this.isLoader = true;
                let search = [{ _modal: 'ProfileList', _find: { userid: this.passedInfo.userid }, _mode: 'single', _select: 'job' }];
                const res = await fetch(`${this.passedInfo.api_url}/api/common/common_search`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ _list: search })
                });
                const data = await res.json();
                this.tabid = 1;
                this.dataInfo = data.job || [];
                this.isLoader = false;
                this.$nextTick(function ()
                {
                    this.$nextTick(function ()
                    {
                        AOS.init();
                    });
                })
            },
            showInit()
            {
                this.show = true;
                this.$nextTick(function ()
                {
                    AOS.init();
                });
            }
        },
        mounted() { },
    })
})(Vue);