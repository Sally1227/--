/* 定义一个询价的对象 */
var Inquiry = {
    createNew: function () {
        var inquiryBo = {};
        inquiryBo.id = null;
        inquiryBo.projectId = null;
        inquiryBo.projectName = null;
        inquiryBo.inquiryId = null;
        inquiryBo.instType = null;
        inquiryBo.instId = null;
        inquiryBo.instBranch = null;
        inquiryBo.businessPeople = null;
        inquiryBo.inquirer = null;
        return inquiryBo;
    }
};

var randomIdNum = 400;
var indexNum = 1;
var instBranchItems = [];   // 机构分子的选项

/* 获取未提交的询价信息 */
function getUncommittedInquiry() {
    console.log($("#tab-content").find('form'));

    var uncommittedDatas = uncommitted_inquiry;
    // uncommittedDatas = [];
    var formSelector = $("#addForm400");
    console.log("selectors:", formSelector);
    if (uncommittedDatas.length > 0) {
        $("#projectId").val(uncommittedDatas[0].projectId);
        $("#projectName").val(uncommittedDatas[0].projectName);

        var keys = Object.keys(uncommittedDatas[0]);
        console.log("keys:", keys);
        for (var i = 0; i < uncommittedDatas.length; i++) {
            var item = uncommittedDatas[i];
            if (i == 0) {
                setFormValue(keys, $("#addForm400"), item);
                getInstInfo($("#addForm400"), item.instType, item.instId, item.instBranch);
                // getInstBranchInfo($("#addForm400"), UncommittedDatas[i].instId, UncommittedDatas[i].instBranch);
            } else {
                // 增加询价
                addInquiry();
                setFormValue(keys, $("#tab-content").find('form')[i], item);
                getInstInfo($("#tab-content").find('form')[i], item.instType, item.instId, item.instBranch);
            }
        }
    } else {
        getInstInfo($("#addForm400"), '1', 0, 0);
    }
}

/* 给表单标签赋值 */
function setFormValue(keys, formSelector, value) {
    // for (var i = 0; i < selectors.length; i++) {
        for (var j = 0; j < keys.length; j++) {
            $(formSelector).find('.'+keys[j]).val(value[keys[j]]);
        }
    // }
}

/* 根据机构类型获取委托方 */
function getInstInfo(formSelector, instType, instId, instBranch) {
    console.log("instId:", instId);
    console.log("instInfo:", inst_data[instType]);
    var instInfo = inst_data[instType];
    var html = '';
    for (var i = 0; i < instInfo.length; i++) {
        html += '<option value="'+ instInfo[i].id +'">'+ instInfo[i].instName +'</option>';
    }
    $(formSelector).find('.instId').html(html);
    if (instId == 0) {
        $(formSelector).find('.instId').val(instInfo[0].id);
        getInstBranchInfo(formSelector, instInfo[0].id, instBranch);
    } else {
        $(formSelector).find('.instId').val(instId);
        getInstBranchInfo(formSelector, instId, instBranch);
    }
}

/* 根据委托方获取分支机构 */
function getInstBranchInfo(formSelector, instId, instBranch) {
    instBranchItems = instBranch_data[instId];
    var instBranchInfo = instBranch_data[instId];
    var html = '';
    for (var i = 0; i < instBranchInfo.length; i++) {
        html += '<option value="'+ instBranchInfo[i].id +'">'+ instBranchInfo[i].instName +'</option>';
    }
    $(formSelector).find('.instBranch').html(html);
    if (instBranch == 0) {
        $(formSelector).find('.instBranch').val(instBranchInfo[0].id);
    } else {
        $(formSelector).find('.instBranch').val(instBranch);
    }
    getBusinessPeople(formSelector, instBranch);

}

/* 根据分支机构 获取 业务员 */
function getBusinessPeople(formSelector, instBranch) {
    console.log("instBranch:", instBranch);
    console.log("instBranchItems:", instBranchItems);
    if (instBranch == 0) {
        $(formSelector).find('.businessPeople').val(instBranchItems[0].contact);
    } else {
        for (var i = 0; i < instBranchItems.length; i++) {
            if (instBranchItems[i].id == instBranch) {
                $(formSelector).find('.businessPeople').val(instBranchItems[i].contact);
                break;
            }
        }
    }
}

/* 获取表单数据 */
function getFormData(formSelector) {
    var formData = Inquiry.createNew();
    var labelSelectors = $(formSelector).find("[name]");
    console.log("labelSelectors:", labelSelectors);
    for (var i = 0; i < labelSelectors.length; i++) {
        var key = $(labelSelectors[i]).attr("name");
        formData[key] = $(labelSelectors[i]).val();
    }
    formData.projectId = $("#projectId").val();
    formData.projectName = $("#projectName").val();
    console.log("formData:",formData);
    return formData;
}


/* 添加询价 */
function addInquiry() {
    randomIdNum += 9;
    indexNum += 1;
    var formContent = $("#addForm400 .form-box").html();
    formContent = formContent.replace('cityBox400','cityBox'+randomIdNum);
    var htmlNav = '<li role="presentation"><a href="#inquiry-pane'+ randomIdNum +'" aria-controls="inquiry-pane'+ randomIdNum +'" role="tab" data-toggle="tab">询价'+ indexNum +'</a></li>';
    var htmlContent = '<div role="tabpanel" class="tab-pane mrt20" id="inquiry-pane'+ randomIdNum +'"><form id="addForm'+ randomIdNum +'">'+ formContent +'<div class="footer-button text-center"><button type="button" class="btn btn-sm btn-success btn-save">保存</button></div></form></div>';
    $('#nav-tabs').append(htmlNav);
    $('#tab-content').append(htmlContent);
}

$(function () {
    getUncommittedInquiry();

    // 选择机构类型
    $("#tab-content").on("change", ".instType", function () {
        var formSelector = $(this).parents("form[id^='addForm']");
        getInstInfo(formSelector, $(this).val(), 0, 0);
    });
    // 选择委托方（机构）
    $("#tab-content").on("change", ".instId", function () {
        var formSelector = $(this).parents("form[id^='addForm']");
        getInstBranchInfo(formSelector, $(this).val(), 0);
    });
    // 选择分支机构
    $("#tab-content").on("change", ".instBranch", function () {
        var formSelector = $(this).parents("form[id^='addForm']");
        getBusinessPeople(formSelector, $(this).val());
    });

    // 保存数据
    $("#tab-content").on("click", ".btn-save", function () {
        getFormData($(this).parents("form[id^='addForm']"));
    });

    // 提交数据
    $("#onSubmit").click(function () {
        var postData = [];
        // var formSelectors = $("#tab-content").find("form[id^='addForm']");
        $("#tab-content").find("form[id^='addForm']").each(function () {
           postData.push(getFormData($(this)));
        });
        console.log(postData);
    });


});
