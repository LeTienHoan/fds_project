<template>
    <v-layout wrap class="xs12 kanban_class">
        <v-flex xs4 pr-3>
            <div style="position: relative; overflow: hidden;">
                <v-expansion-panel expand class="sub-panel expansion-blue">
                    <v-expansion-panel-content value="true">
                        <div slot="header" class="custome-panel-heading-with-icon pl-0 mr-2">
                            <div class="">Chưa diễn ra</div>
                        </div>
                        <div class="panel-heading px-0 lessClass py-0">
                            <div class="layout" v-for="(item,index) in kanban_list">
                                    <div class="layout py-2 wrap borderKanban" v-if="index<=4">
                                        <v-flex xs2 class="text-xs-center">
                                            <div class="kanban_linhvuc" style="background: #5e5e5e" v-bind:title="item.categoryName">
                                                {{ item.activityType }}
                                            </div>
                                            <v-tooltip v-model="show" top v-if="item.activityId==test && kanban__Visibilities.length!=0" v-click-outside="hideState">
                                                <div slot="activator">
                                                </div>
                                                <span>
                                                    <span @click="changeState(items,indexs)" v-for="(items,indexs) in kanban__Visibilities" style="cursor: pointer;">
                                                        {{ items.actionName }}
                                                        <span v-if="indexs-1 && kanban__Visibilities.length==2"> | </span>
                                                    </span>
                                                </span>
                                            </v-tooltip>    
                                            <div class="mt-2"><v-icon @click="showState(item,index)" style="cursor: pointer;">settings</v-icon></div>
                                        </v-flex>
                                        <v-flex xs10 pr-3>
                                            <div v-on:click.stop="activityDetail(item,index)" class="hoverKanban">{{ item.subject }}</div>
                                            <div v-if="changeDate(item.endDate)==1">Thời hạn: {{ item.endDate|date }}</div>
                                            <div v-else style="color: red">Quá hạn: {{ item.endDate|date }}</div>
                                            <div class="kanbanStatename mt-1" :class="getColor(item.state)">
                                                {{ item.stateName }}
                                            </div>
                                        </v-flex>
                                    </div>
                                    <div class="layout py-2 wrap borderKanban" v-if="index>4 && kanban_list_hidden">
                                        <v-flex xs2 class="text-xs-center">
                                            <div class="kanban_linhvuc" style="background: #5e5e5e" v-bind:title="item.categoryName">
                                                {{ item.activityType }}
                                            </div>
                                            <v-tooltip v-model="show" top v-if="item.activityId==test && kanban__Visibilities.length!=0" v-click-outside="hideState">
                                                <div slot="activator">
                                                </div>
                                                <span>
                                                    <span @click="changeState(items,indexs)" v-for="(items,indexs) in kanban__Visibilities" style="cursor: pointer;">
                                                        {{ items.actionName }}
                                                        <span v-if="indexs-1 && kanban__Visibilities.length==2"> | </span>
                                                    </span>
                                                </span>
                                            </v-tooltip>    
                                            <div class="mt-2"><v-icon @click="showState(item,index)" style="cursor: pointer;">settings</v-icon></div>
                                        </v-flex>
                                        <v-flex xs10 pr-3>
                                            <div v-on:click.stop="activityDetail(item,index)" class="hoverKanban">{{ item.subject }}</div>
                                            <div v-if="changeDate(item.endDate)==1">Thời hạn: {{ item.endDate|date }}</div>
                                            <div v-else style="color: red">Quá hạn: {{ item.endDate|date }}</div>
                                            <div class="kanbanStatename mt-1" :class="getColor(item.state)">
                                                {{ item.stateName }}
                                            </div>
                                        </v-flex>
                                    </div>
                            </div>
                        </div>
                        <div v-if="kanban_list.length>5">
                            <span class="xemthem primary--text mr-2" @click="clickXemthem" v-if="less">Xem thêm</span>
                        </div>
                        <div v-if="kanban_list.length>5">
                            <span class="rutgon primary--text mr-2" @click="clickXemthem" v-if="!less">Rút gọn</span>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </div>
        </v-flex>
        <v-flex xs4 pr-3>
            <div style="position: relative; overflow: hidden;">
                <v-expansion-panel expand class="sub-panel expansion-blue">
                    <v-expansion-panel-content value="true">
                        <div slot="header" class="custome-panel-heading-with-icon pl-0 mr-2">
                            <div class="">Đang diễn ra</div>
                        </div>
                        <div class="panel-heading px-0 lessClass1 py-0">
                            <div class="layout" v-for="(item,index) in kanban_list1">
                                    <div class="layout py-2 wrap borderKanban" v-if="index<=4">
                                        <v-flex xs2 class="text-xs-center">
                                            <div class="kanban_linhvuc" style="background: #5e5e5e" v-bind:title="item.categoryName">
                                                {{ item.activityType }}
                                            </div>
                                            <v-tooltip v-model="show" top v-if="item.activityId==test && kanban__Visibilities.length!=0" v-click-outside="hideState">
                                                <div slot="activator">
                                                </div>
                                                <span>
                                                    <span @click="changeState(items,indexs)" v-for="(items,indexs) in kanban__Visibilities" style="cursor: pointer;">
                                                        {{ items.actionName }}
                                                        <span v-if="indexs-1 && kanban__Visibilities.length==2"> | </span>
                                                    </span>
                                                </span>
                                            </v-tooltip>    
                                            <div class="mt-2"><v-icon @click="showState(item,index)" style="cursor: pointer;">settings</v-icon></div>
                                        </v-flex>
                                        <v-flex xs10 pr-3>
                                            <div v-on:click.stop="activityDetail(item,index)" class="hoverKanban">{{ item.subject }}</div>
                                            <div v-if="changeDate(item.endDate)==1">Thời hạn: {{ item.endDate|date }}</div>
                                            <div v-else style="color: red">Quá hạn: {{ item.endDate|date }}</div>
                                            <div class="kanbanStatename mt-1" :class="getColor(item.state)">
                                                {{ item.stateName }}
                                            </div>
                                        </v-flex>
                                    </div>
                                    <div class="layout py-2 wrap borderKanban" v-if="index>4 && kanban_list_hidden1">
                                        <v-flex xs2 class="text-xs-center">
                                            <div class="kanban_linhvuc" style="background: #5e5e5e" v-bind:title="item.categoryName">
                                                {{ item.activityCat }}
                                            </div>
                                            <v-tooltip v-model="show" top v-if="item.activityId==test && kanban__Visibilities.length!=0" v-click-outside="hideState">
                                                <div slot="activator">
                                                </div>
                                                <span>
                                                    <span @click="changeState(items,indexs)" v-for="(items,indexs) in kanban__Visibilities" style="cursor: pointer;">
                                                        {{ items.actionName }}
                                                        <span v-if="indexs-1 && kanban__Visibilities.length==2"> | </span>
                                                    </span>
                                                </span>
                                            </v-tooltip>    
                                            <div class="mt-2"><v-icon @click="showState(item,index)" style="cursor: pointer;">settings</v-icon></div>
                                        </v-flex>
                                        <v-flex xs10 pr-3>
                                            <div>{{ item.subject }}</div>
                                            <div v-if="changeDate(item.endDate)==1">Thời hạn: {{ item.endDate|date }}</div>
                                            <div v-else style="color: red">Quá hạn: {{ item.endDate|date }}</div>
                                            <div class="kanbanStatename mt-1" :class="getColor(item.state)">
                                                {{ item.stateName }}
                                            </div>
                                        </v-flex>
                                    </div>
                            </div>
                        </div>
                        <div v-if="kanban_list1.length>5">
                            <span class="xemthem primary--text" @click="clickXemthem1" v-if="less1">Xem thêm</span>
                        </div>
                        <div v-if="kanban_list1.length>5">
                            <span class="rutgon primary--text" @click="clickXemthem1" v-if="!less1">Rút gọn</span>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </div>
        </v-flex>
        <v-flex xs4>
            <div style="position: relative; overflow: hidden;">
                <v-expansion-panel expand class="sub-panel expansion-blue">
                    <v-expansion-panel-content value="true">
                        <div slot="header" class="custome-panel-heading-with-icon pl-0 mr-2">
                            <div class="">Đã kết thúc</div>
                        </div>
                        <div class="panel-heading px-0 lessClass2 py-0">
                            <div class="layout" v-for="(item,index) in kanban_list2">
                                    <div class="layout py-2 wrap borderKanban" v-if="index<=4">
                                        <v-flex xs2 class="text-xs-center">
                                            <div class="kanban_linhvuc" style="background: #5e5e5e" v-bind:title="item.categoryName">
                                                {{ item.activityType }}
                                            </div>
                                            <v-tooltip v-model="show" top v-if="item.activityId==test && kanban__Visibilities.length!=0" v-click-outside="hideState">
                                                <div slot="activator">
                                                </div>
                                                <span>
                                                    <span @click="changeState(items,indexs)" v-for="(items,indexs) in kanban__Visibilities" style="cursor: pointer;">
                                                        {{ items.actionName }}
                                                        <span v-if="indexs-1 && kanban__Visibilities.length==2"> | </span>
                                                    </span>
                                                </span>
                                            </v-tooltip>    
                                            <div class="mt-2"><v-icon @click="showState(item,index)" style="cursor: pointer;">settings</v-icon></div>
                                        </v-flex>
                                        <v-flex xs10 pr-3>
                                            <div v-on:click.stop="activityDetail(item,index)" class="hoverKanban">{{ item.subject }}</div>
                                            <div v-if="changeDate(item.endDate)==1">Thời hạn: {{ item.endDate|date }}</div>
                                            <div v-else style="color: red">Quá hạn: {{ item.endDate|date }}</div>
                                            <div class="kanbanStatename mt-1" :class="getColor(item.state)">
                                                {{ item.stateName }}
                                            </div>
                                        </v-flex>
                                    </div>
                                    <div class="layout py-2 wrap borderKanban" v-if="index>4 && kanban_list_hidden2">
                                        <v-flex xs2 class="text-xs-center">
                                            <div class="kanban_linhvuc" style="background: #5e5e5e" v-bind:title="item.categoryName">
                                                {{ item.activityCat }}
                                            </div>
                                            <v-tooltip v-model="show" top v-if="item.activityId==test && kanban__Visibilities.length!=0" v-click-outside="hideState">
                                                <div slot="activator">
                                                </div>
                                                <span>
                                                    <span @click="changeState(items,indexs)" v-for="(items,indexs) in kanban__Visibilities" style="cursor: pointer;">
                                                        {{ items.actionName }}
                                                        <span v-if="indexs-1 && kanban__Visibilities.length==2"> | </span>
                                                    </span>
                                                </span>
                                            </v-tooltip>    
                                            <div class="mt-2"><v-icon @click="showState(item,index)" style="cursor: pointer;">settings</v-icon></div>
                                        </v-flex>
                                        <v-flex xs10 pr-3>
                                            <div>{{ item.subject }}</div>
                                            <div v-if="changeDate(item.endDate)==1">Thời hạn: {{ item.endDate|date }}</div>
                                            <div v-else style="color: red">Quá hạn: {{ item.endDate|date }}</div>
                                            <div class="kanbanStatename mt-1" :class="getColor(item.state)">
                                                {{ item.stateName }}
                                            </div>
                                        </v-flex>
                                    </div>
                            </div>
                        </div>
                        <div v-if="kanban_list2.length>5">
                            <span class="xemthem primary--text" @click="clickXemthem2" v-if="less2">Xem thêm</span>
                        </div>
                        <div v-if="kanban_list2.length>5">
                            <span class="rutgon primary--text" @click="clickXemthem2" v-if="!less2">Rút gọn</span>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
    const COMPONENT_NAME = 'jx-mobilink-activity-kanban'

    export default {
        name: COMPONENT_NAME,
        props: {
            class_name: null,
            group_id: null,
            end_point: null,
        },

        created () {
            let vm = this
            vm.$nextTick(function () {
                vm.getKanban();
            })
        },
        data () {
            return {
                kanban_list: [],
                kanban_list1:[],
                kanban_list2:[],
                show: false,
                test:'',
                kanban__Visibilities: [],
                class_pk: 0,
                less:true,
                kanban_list_hidden: false,
                less1:true,
                kanban_list_hidden1: false,
                less2:true,
                kanban_list_hidden2: false
            }
        },
        
        methods: {
            activityDetail: function(item, index){
                this.$emit('view_detail', item, index);
            },
            clickXemthem: function(){
                let vm=this;
                vm.less=!vm.less;
                if(vm.less==false){
                    vm.kanban_list_hidden=true;
                    $('.lessClass').css({"height": "700px","overflow": "auto"});
                }
                else{
                    vm.kanban_list_hidden=false;
                    $('.lessClass').css({"height": "auto","overflow": "hidden"});
                }
            },
            clickXemthem1: function(){
                let vm=this;
                vm.less1=!vm.less1;
                if(vm.less1==false){
                    vm.kanban_list_hidden1=true;
                    $('.lessClass1').css({"height": "700px","overflow": "auto"});
                }
                else{
                    vm.kanban_list_hidden1=false;
                    $('.lessClass1').css({"height": "auto","overflow": "hidden"});
                }
            },
            clickXemthem2: function(){
                let vm=this;
                vm.less2=!vm.less2;
                if(vm.less2==false){
                    vm.kanban_list_hidden2=true;
                    $('.lessClass2').css({"height": "700px","overflow": "auto"});
                }
                else{
                    vm.kanban_list_hidden2=false;
                    $('.lessClass2').css({"height": "auto","overflow": "hidden"});
                }
            },
            changeDate: function(date1){
                let date=new Date();
                let d1 = moment(date1).format('MM/DD/YYYY');
                let d2 =  moment(date).format('MM/DD/YYYY');

                if (Date.parse(d1)<Date.parse(d2)) {
                    return 0;
                } else{
                    return 1;
                }
            },
            changeState: function(items,indexs){
                let vm=this;
                let config = {
                    headers: {
                        'groupId': vm.group_id
                    }
                };
                let dataToAPI = new URLSearchParams();
                dataToAPI.append("state",items.state);
                let url = vm.end_point + 'visibilities/'+ vm.class_name+'/'+vm.class_pk;
                axios.put(url, dataToAPI, config).then(function(response) {
                    let serializable = response.data;
                    // vm.kanban_list.stateName=serializable.stateName;
                    // vm.kanban_list.state=serializable.state;
                    // vm.kanban_list.startend=serializable.startend;
                    vm._initVisibilities();
                    setTimeout(function(){
                        vm.getKanban();
                    },1000);
                    showMessageToastr('success', 'Cập nhật thành công');
                })
                .catch(function(error) {
                    console.log(error);
                    showMessageByAPICode(error.response.status, error.response.data);
                });
            },
            hideState: function(item,index){
                let vm = this;
                vm.show=false;
            },
            showState: function(item,index){
                let vm=this;
                vm.show=false;
                vm.test=item.activityId;
                vm.class_pk=item.activityId;
                vm.show=!vm.show;
                vm._initVisibilities();
            },
            getKanban: function(){
                let vm = this;
                let config = {
                    headers: {
                        'groupId': vm.group_id
                    }
                };
                let url = vm.end_point + 'activities?sort=startDate_Number&order=true&type=TASK';


                 axios.all([
                    axios.get(vm.end_point + 'activities?sort=startDate_Number&order=true&type=TASK&startend=0', config),
                    axios.get( vm.end_point + 'activities?sort=startDate_Number&order=true&type=TASK&startend=1,2', config),
                    axios.get( vm.end_point + 'activities?sort=startDate_Number&order=true&type=TASK&startend=3,4', config),
                ])
                 .then(axios.spread(function(response, response1, response2) {
                    let serializable = response.data;
                    let serializable1 = response1.data;
                    let serializable2 = response2.data;
                    if (serializable.hasOwnProperty('data')) {
                        vm.kanban_list=serializable.data;
                    }
                    else{
                        vm.kanban_list=[]
                    }



                    if (serializable1.hasOwnProperty('data')) {
                        vm.kanban_list1=serializable1.data;
                    }
                    else{
                        vm.kanban_list1=[]
                    }



                    if (serializable2.hasOwnProperty('data')) {
                        vm.kanban_list2=serializable2.data;
                    }
                    else{
                        vm.kanban_list2=[]
                    }




                }))
                .catch(function (error) {
                    vm.kanban_list=[];
                    vm.kanban_list1=[];
                    vm.kanban_list2=[];
                })
            },
            getColor: function(item){
                let color;
                switch (item) {
                    case 1:
                        color = "red accent-4 white--text";
                        break;
                    case 2:
                        color = "purple accent-4 white--text";
                        break;
                    case 3:
                        color = "orange darken-3 white--text";
                        break;
                    case 4:
                        color = "blue-grey white--text";
                        break;
                    case 5:
                        color = "orange darken-4 white--text";
                        break;
                    case 6:
                        color = "light-blue accent-4 white--text";
                        break;
                    case 7:
                        color = "light-green white--text";
                        break;
                    case 8:
                        color = "green lighten-2 white--text";
                        break;
                    case 9:
                        color = "light-green darken-3 white--text";
                        break;
                    case 10:
                        color = "orange accent-3 white--text";
                        break;
                    case 11:
                        color = "deep-orange lighten-3 white--text";
                        break;
                    case 12:
                        color = "blue white--text";
                        break;
                        
                }
                return color
            },
            _initVisibilities: function () {
                let vm = this;
                let config = {
                    headers: {
                        groupId: vm.group_id
                    }
                }
                let url = vm.end_point + 'visibilities/'+ vm.class_name+'/'+ vm.class_pk+'/actions';
                axios.get(url, config).then(function (response) {
                    let serializable = response.data;
                    if (serializable.hasOwnProperty('data')) {
                        vm.kanban__Visibilities = serializable.data;
                    }
                })
                    .catch(function (error) {
                        vm.kanban__Visibilities = [];
                    })
            },
        }

    }
</script>
<style type="text/css" scoped>
    .kanbanStatename{
        padding: 4px 15px; 
        border-radius: 20px;
        margin-bottom: 0px;
        text-align: center;
        font-size: 12px;
        display:inline-block;
    }
    .kanban_linhvuc{
        padding: 3px; 
        border-radius: 100%;
        margin-bottom: 0px;
        text-align: center;
        font-size: 12px;
        display:inline-block;
        color: #fff;
    }
    .borderKanban{
        border-bottom: 1px solid #eee;
    }
    .lessClass::-webkit-scrollbar-track,.lessClass1::-webkit-scrollbar-track,.lessClass2::-webkit-scrollbar-track{
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 8px;
        background-color: #F5F5F5;
    }
    .lessClass::-webkit-scrollbar,.lessClass1::-webkit-scrollbar,.lessClass2::-webkit-scrollbar{
        width: 8px;
        background-color: #F5F5F5;
    }
    .lessClass::-webkit-scrollbar-thumb,.lessClass1::-webkit-scrollbar-thumb,.lessClass2::-webkit-scrollbar-thumb{
        border-radius: 8px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: rgb(181, 181, 181);
    }
    .hoverKanban:hover{
        color: #1a5eba!important;
    }
    .hoverKanban{
        cursor: pointer;
    }
</style>