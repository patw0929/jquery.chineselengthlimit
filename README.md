jQuery Chinese Characters Length Limit Plugin
====


這是一個可以限制 **文字框（input[type='text']）** 與 **文字輸入區域（textarea）** 輸入 **中英文字數** 的 jQuery Plugin。


***


Options
---

下面是可以調整的參數：

| Options        | Description   |
| ------------- |:--------------|
| limitCount      | 最大長度限制。預設值為 **10**。<br />若目標對象有 **maxlength** 屬性，則以此數字限制。但若在 `$( 元素 ).ChineseLengthLimit( opts )` 中有傳入字數限制，則以此設定為最優先。 |
| isByte      | 是否採用位元限制。預設值為 **true**。<br />若採用，則會以中文字以 2 字元、英文字以 1 字元的方式計算。<br />換行字元 (\n) 則一律計算為 2 字元。      |
| callback | 當 keyup 與 paste 事件觸發時，呼叫的 callback 事件。無預設 function。<br /><br />使用範例：<br />`callback: function (data) {`<br />`    $("#msg").html("目前輸入:" + data.input + "/" + data.max + " 還剩:" + data.left + "字元");`<br />`}`<br /><br />回傳的物件中擁有三個屬性：<br />*  input：目前輸入的字數，會依 isByte 的 true or false 而改變計算方式。<br />*  max：最大限制的字數，會依 isByte 的 true or false 而改變計算方式。<br />*  left：剩餘可輸入的字數，會依 isByte 的 true or false 而改變計算方式。      |


Usage
---

###Basic

    $(function () { 
        $('目標對象').ChineseLengthLimit(); 
    });

###Advanced

	$(function () { 
	    $('目標對象').ChineseLengthLimit({ 
 	       limitCount: 11, 
  	      isByte: true, 
  	      callback: function (data) { 
     	       $('顯示 callback 訊息元素').html("目前輸入:" + data.input + "/" + data.max + " 還剩:" + data.left + "字元"); 
  	      } 
 	   }); 

     $('目標對象').trigger('checkLimit');
	});
