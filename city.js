/*
 * @Author: Wendy 
 * @gitee: https://gitee.com/hi_wendy
 * @Date: 2018-03-09 16:59:29 
 * @Last Modified by: Wendy
 * @Last Modified time: 2018-03-13 09:28:32
 * @Version:0.0.1
 */
var obj = $('#tab-content');
obj.on('click','.cityTop-li',function () {
	var cityBoxSelector = $(this).parents("[id^='cityBox']");
	var index = $(this).index();
	/*头部切换*/
	$(this).addClass('active').siblings().removeClass('active');
	cityBoxSelector.find('.selBox').eq(index).addClass('active').siblings().removeClass('active');
});
var citysData = [];
/*省份选择*/
obj.on('click', '.provinceBox-dd', function() {
	var cityBoxSelector = $(this).parents("[id^='cityBox']");
	console.log("cityBoxSelector:",cityBoxSelector);
	citysData = cityFn(cityBoxSelector,this,cityData3,citysData);
});
var countyData = [];
/*城市选择*/
obj.on('click', '.citysBox-dd', function() {
	var cityBoxSelector = $(this).parents("[id^='cityBox']");
	countyData = cityFn(cityBoxSelector,this,citysData,countyData);
});
/*县区选择*/
obj.on('click', '.countyBox-dd', function() {
	var cityBoxSelector = $(this).parents("[id^='cityBox']");
	var dataId = $(this).attr('dataId');
	var dataText = $(this).text();
	$(this).addClass('active').siblings().removeClass('active');
	cityBoxSelector.find('.cityText .countyTxt').attr({
		'dataId':dataId,
		'title':dataText,
		'dataText':dataText
	}).addClass('active').find('em').text(dataText.length > 3 ? dataText.slice(0, 3) +'…':dataText);
});
/*三级联动展开*/
obj.on('click', '.cityText', function () {
	var cityBoxSelector = $(this).parents("[id^='cityBox']");
	if (cityBoxSelector.hasClass('active')&&!cityBoxSelector.find('.cityText').hasClass('active')) {
		cityBoxSelector.removeClass('active');
	}else{
		cityBoxSelector.addClass('active');
	}
});
obj.on('click', '.content', function () {
	var cityBoxSelector = $(this).parents("[id^='cityBox']");
	cityBoxSelector.find('.cityText').trigger('click');
});
obj.on('click', '.defaultTxt', function () {
	var cityBoxSelector = $(this).parents("[id^='cityBox']");
	cityBoxSelector.find('.cityText').trigger('click');
});
obj.on('click', '.cityText-jiantou', function () {
	var cityBoxSelector = $(this).parents("[id^='cityBox']");
	cityBoxSelector.find('.cityText').trigger('click');
});
/*text框中的点击跟随*/
obj.on('click', '.cityText-span', function(event) {
	/**阻止冒泡，防止执行父级点击事件 */
	event.stopPropagation();
	var cityBoxSelector = $(this).parents("[id^='cityBox']");
	var index = $(this).index();
	cityBoxSelector.find('.cityTop li').eq(index).trigger('click');
	cityBoxSelector.find('.cityText').trigger('click');
});
/*text框span关闭*/
obj.on('click', '.cityText-iconfont', function(event) {
	event.stopPropagation();
	var cityBoxSelector = $(this).parents("[id^='cityBox']");
	var index = $(this).closest('span').index();
	var dataId = $(this).closest('span').attr('dataId');
	clearCity(cityBoxSelector,index,dataId,true);
});
/*默认点击（全部）*/
obj.on('click', '.defaultBtn', function () {
	var cityBoxSelector = $(this).parents("[id^='cityBox']");
	cityBoxSelector.find('.cityText span:eq(0) .iconfont').trigger('click');
	cityBoxSelector.find('.cityBtn').trigger('click');
});
/*obj.find('.defaultBtn').click(function() {
	obj.find('.cityText span:eq(0) .iconfont').trigger('click');
	obj.find('.cityBtn').trigger('click');
});*/
/*确定按钮*/
obj.on('click', '.cityBtn', function (event) {
	event.stopPropagation();
	var cityBoxSelector = $(this).parents("[id^='cityBox']");
	cityBoxSelector.removeClass('active');
	/*input赋值*/
	var txt = '';
	for (var i = 0; i < cityBoxSelector.find('.cityText .content span').length; i++) {
		var nObj = cityBoxSelector.find('.cityText .content span').eq(i);
		txt += nObj.attr('dataText');
		if (i==0) {
			cityBoxSelector.find('.cityInput').attr({
				'provinceId':nObj.attr('dataId'),
				'provinceText':nObj.attr('dataText')
			});
		}else if (i==1) {
			cityBoxSelector.find('.cityInput').attr({
				'cityId':nObj.attr('dataId'),
				'cityText':nObj.attr('dataText')
			});
		}else if (i==2) {
			cityBoxSelector.find('.cityInput').attr({
				'countyId':nObj.attr('dataId'),
				'countyText':nObj.attr('dataText')
			});
		}
	}
	cityBoxSelector.find('.cityInput').val(txt);
	console.log(obj.find('.cityInput').val());
	console.log(obj.find('.cityInput').attr('provinceId'),obj.find('.cityInput').attr('provinceText'));
	console.log(obj.find('.cityInput').attr('cityId'),obj.find('.cityInput').attr('cityText'));
	console.log(obj.find('.cityInput').attr('countyId'),obj.find('.cityInput').attr('countyText'));
});
/*城市选择状态清除*/
function clearCity(cityBoxSelector,index,dataId,follow){
	// console.log("清除");
	/*text数据清除*/
	cityBoxSelector.find('.cityText span').eq(index).closest('span').attr({
		'dataId':'',
		'title':'',
		'dataText':''}).removeClass('active');
	/*省市区面板选中状态清除*/
	cityBoxSelector.find('.citysContent .selBox').eq(index).find('dd').removeClass('active');
	if (index==0) {
		clearCity(cityBoxSelector,1,dataId);
		clearCity(cityBoxSelector,2,dataId);
		citysData = [];
		countyData = [];
		cityBoxSelector.find('.citysBox dl').html('');
		cityBoxSelector.find('.citysBox .noData').addClass('active');
		cityBoxSelector.find('.countyBox dl').html('');
		cityBoxSelector.find('.countyBox .noData').addClass('active');
		cityBoxSelector.find('.cityText').removeClass('active');
	}else if (index==1) {
		clearCity(cityBoxSelector,2,dataId);
		countyData = [];
		cityBoxSelector.find('.countyBox dl').html('');
		cityBoxSelector.find('.countyBox .noData').addClass('active');
	}else{

	}
	if (follow) {
		/*省市区头部跟随*/
		cityBoxSelector.find('.cityTop li').eq(index).trigger('click');
	}
}

function cityFn(cityBoxSelector,that,sourceArr,newArr) {
	var dataId = $(that).attr('dataId');
	var dataText = $(that).text();
	var index = $(that).closest('.selBox').index();
	/*是否状态初始化*/
	if (!$(that).hasClass('active')) {
		/*状态初始化*/
		clearCity(cityBoxSelector,index,dataId,true);
		/*当前选中添加激活状态*/
		$(that).addClass('active');
		/*给文本框添加数据*/
		cityBoxSelector.find('.cityText .content span').eq(index).attr({
			'dataId':dataId,
			'title':dataText,
			'dataText':dataText
		}).addClass('active').find('em').text(dataText.length>3?dataText.slice(0, 3)+'...':dataText);
		/*给文本框添加激活标记*/
		cityBoxSelector.find('.cityText').addClass('active');
		/*给下一级做准备*/
		newArr = [];
		for (var i = 0; i < sourceArr.length; i++) {
			if (sourceArr[i].value==dataId) {
				newArr = sourceArr[i].children||[];
				break;
			}
		}
		/*下一级数据展示*/
		var citysStr = '';
		if (newArr.length>0) {
			for (var i = 0; i < newArr.length; i++) {
				if (index == 0) {
					citysStr += '<dd class="citysBox-dd" dataId="'+newArr[i].value+'">'+newArr[i].text+'</dd>';
				} else {
					citysStr += '<dd class="countyBox-dd" dataId="'+newArr[i].value+'">'+newArr[i].text+'</dd>';
				}

			}
		}
		/**数据填充 */
		cityBoxSelector.find('.selBox').eq(index+1).find('dl').html(citysStr);
		/*如果没有下一级数据的处理*/
		if (citysStr!='') {
			cityBoxSelector.find('.selBox').eq(index+1).find('.noData').removeClass('active');
		}
		/*三级跳转跟随*/
		cityBoxSelector.find('.cityTop li').eq(index+1).trigger('click');
	}else{
		/*三级跳转跟随*/
		cityBoxSelector.find('.cityTop li').eq(index+1).trigger('click');
	}
	/*返回新数组,以便下一次使用*/
	return newArr;
}
