/*
 * jQuery Chinese Characters Length Limit Plugin 1.0
 * http://code.google.com/p/jquery-chinese-characters-length-limit-plugin/
 *
 * Copyright (C) 2012 Patrick Wang <patw.hi@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation 
 * files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS 
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

(function ($) {
	$.fn.ChineseLengthLimit = function(options) {

		var defaults = {
			limitCount: 10,
			isByte: true,
			callback:function(){}
		};
        var opts = $.extend({}, defaults, options);
		var	$elements = $(this);

		$(this).each(function(i) {
			var $this = $(this);
			console.log($(this));
			if ((!options || !options.limitCount) && parseInt($this.attr('maxlength')) > 0 && parseInt($this.attr('maxlength')) != opts.limitCount) {
				$this.ChineseLengthLimit($.extend({}, opts, { limitCount: parseInt($this.attr('maxlength')) }), opts.callback);
			} else {
				$elements.attr('maxlength', opts.limitCount);
				$elements.bind('keyup', function(event){setTimeout(function(){ChineseLengthLimitCheck();}, 15);});
				$elements.bind('paste', function(event){setTimeout(function(){ChineseLengthLimitCheck();}, 15);});
			}
		});
		
		// 以位元數計算的字串長度 (中文: 2 字元, 英文: 1 字元)
		var byteLength = 0;
		// 以字數計算的字串長度 (中英文皆算 1 字元)
		var charLength = 0;
		// 限制長度
		var maxCharacters = opts.limitCount;
		// 剩餘長度
		var numLeft = 0;
		
		function ChineseLengthLimitCheck(e) {
			// 目前字數
	        var txtCount = 0;
	        
	        // 若以位元計
	        if(opts.isByte)
	        {
	        	// 目前字數，以位元計算 (中文: 2 字元, 英文: 1 字元)
	        	txtCount = $elements.val().replace(/[^\x00-\xff]/g, "pp").length;
	        }
	        else
	        {
	        	// 目前字數，以字數計算 (中英文皆算 1 字元)
	        	txtCount = $elements.val().length;
	        }
	        
	        // 若目前字數大於設定的限制長度
	        if( txtCount > opts.limitCount ){
	            if (opts.isByte)
	            {
	                $elements.val( $elements.val().substring(0, charLength + Math.floor( (opts.limitCount - byteLength) / 2 )) );
	                byteLength = $elements.val().replace(/[^\x00-\xff]/g, "pp").length;
	            }
	            else
	            {
	                $elements.val($elements.val().substring(0, options.limitCount));
	            }
	        }
	        charLength = $elements.val().length;
	        byteLength = $elements.val().replace(/[^\x00-\xff]/g, "pp").length;
	        
	        if (opts.isByte)
	        {
	        	numLeft = maxCharacters - byteLength;
	        }
	        else
	        {
	        	numLeft = maxCharacters - charLength;
	        }
	        
			//function call back
			if(typeof (opts.callback) == 'function'){
				opts.callback.call(this, getInfo());
			}
			return true;
		}
		
		// callback event
		function getInfo(){
			var info = {
				input: (opts.isByte) ? byteLength : charLength, // 目前字數
				max: maxCharacters, // 最大字數
				left: numLeft // 剩餘字數
			};
			return info;
		}
	};


})(jQuery);