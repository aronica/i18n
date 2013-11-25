/**
 * Translate the text in the HTML.
 * @param {dom} domObj An dom object under which text will be translated.
 * @param {string} sTag The HTML tag name in which text will be translated, usually "span".
 */
(function($){
	$.i18n = {};
	$.i18n.local = {
			en:"en_US",
			zh_cn:"zh_Hans_CN"
	};

 
	
	$.i18n.options = {
		path:"",
		language:"",
		cookie:true,
		cookie_key:"language",
		dom_attr_name:"lang",
		callback:"",
		refresh:true
	};
	var BABEL_TO_LOAD=
	$.i18n.init = function(options){
		var oldLang = $.i18n.options.language;
		$.extend($.i18n.options,options);
		var language = $.i18n.getlang($.i18n.options.language);
		var protocal = location.href;
		debugger;
		if(protocal.indexOf("file:")>=0){
			//$("head").append("<script type='text/javascript' src='"+$.i18n.options.path+"/"+language+".js'></script>");
			var sc = document.createElement("script");
			sc.setAttribute("type","text/javascript");
			sc.setAttribute("src",$.i18n.options.path+"/"+language+".js");
			document.head.appendChild(sc);
			setTimeout(function(){
				
				   if(language!="en_US"||(language!=oldLang)){
					   translateDom("html");
				   }
				   if($.i18n.options.callback){
					   $.i18n.options.callback();
				   }
				   if($.i18n.options["cookie"]){
					   $.cookie($.i18n.options["cookie_key"],language,{expires:10000});
				   }
			},1000);
		}else{
			 
		   $.ajax({
			   url:$.i18n.options.path+"/"+language+".js",
			   type:"GET",
			   dataType:"script",
			   async:false,
			   success:function(data){
				   eval(data);
				   
				   if(language!="en_US"||(language!=oldLang)){
					   translateDom("html");
				   }
				   if($.i18n.options.callback){
					   $.i18n.options.callback();
				   }
				   if($.i18n.options["cookie"]){
					   $.cookie($.i18n.options["cookie_key"],language,{expires:10000});
				   }
			   }
		   });
		}
		
	 
	};
	
	var loading_js = false;
	window.translate = $.i18n.translate = function() {
		var length = arguments.length;
		var key = "";
		if(length == 1){
			key = arguments[0];
		}		
		var value = document.ResourceMap[key];
		if(value){
			return value;
		}else{
			return "";
		}
		
	};

	window.translateDom = $.i18n.translateDom = function(ele) {
		if(!(ele instanceof jQuery)){
			ele = $(ele);
		}
        if(!ele.is("html")){
            $.i18n.translateElement(ele);
        }

		ele.find("["+$.i18n.options["dom_attr_name"]+"]").each(function(i,element){
			translateElement(element);
		});
		return ele;
	};

	window.translateElement = $.i18n.translateElement = function(element){
		if($(element).has("[lang]")){
			var tagName = element.tagName;
			var key = $(element).attr("lang");
			var value = translate(key);
			if(value == null||!value||value==key){
				return;
			}
			if($(element).attr("validationMessage")){
				$(element).attr("validationMessage",value);
			}
			var type = $(element).attr("type");
			switch(tagName){
				case "SPAN":
					$(element).text(value);
					break;
				case "IMG":
					var alt = $(element).attr("alt");
					var title = $(element).attr("title");
					if(alt){
						$(element).attr("alt",value);
					}
					if(title){
						$(element).attr("title",value);
					}
					break;
				case "OPTION":
					$(element).text(value);
					break;
				case "BUTTON":
					var btn_value = $(element).attr("value");
					if(btn_value){
						$(element).attr("value",value);
					}else{
						var childSize = $(element).children().size();
						if(childSize==0){
							var text = $(element).text();
							if(text)
							$(element).text(value);
						}else if($(element).find(".moyu-button-bg-left").size()>0){
							$(element).find(".moyu-button-text").text(value);
							if(!$(element).is(":visible")){
								var cl = $(element).clone();
								cl.appendTo("body");
								cl.show();
								var width = cl.outerWidth();
								$(element).find(".moyu-button-bg-left").css("width",width+20);
								$(element).next(":first").css("left",(width)+"px");
								cl.remove();
								return;
							}
							$(element).find('.moyu-button-bg-left').each(function(i,v){
								$(v).width( $(v).parent().outerWidth() - 2 );
							});
							$(element).next(":first").css("left",($(element).outerWidth()-20)+"px");
						}
					}
					break;
				case "INPUT":
					var type = $(element).attr("type");
					if(type.toUpperCase()=="TEXT"){
						var placeHolder = $(element).attr("placeholder");
						if(placeHolder){
							$(element).attr("placeholder",value);
						}
						var val = $(element).val();
						if(val){
							$(element).val(value);
						}
					}else if(type.toUpperCase()=="BUTTON"){
						var btn_value = $(element).attr("value");
						if(btn_value){
							$(element).attr("value",value);
						}else{
							$(element).text(value);
						}
					}
					break;
				case "TEXTAREA":
					var btn_value = $(element).attr("value");
					if(btn_value){
						$(element).attr("value",value);
					}else{
						$(element).text(value);
					}
					var placeHolder = $(element).attr("placeholder");
					if(placeHolder){
						$(element).attr("placeholder",value);
					}
					break;
					/*
				case "TH":
					debugger;
					var childSize = $(element).children().size();
					if(childSize==0){
						$(element).text(value);
					}else{
						
					}
					break;
					*/
				case "SELECT":
					break;
				
				default:
					$(element).html(value);
			}
		}
	};
	
	window.getlang = $.i18n.getlang = function(language){

		language = language|| ($.i18n.options.cookie?$.cookie($.i18n.options["cookie_key"]):"en_US");
	    if(!language){
	    	language =  navigator.language || navigator.userLanguage;
	    	if(language){
	    		var lan = language.split("-");
	    		if(lan[0]!="zh"){
	    			language = lan[0];
	    		}
	    	}
	    }
	    if(!language||language=="en"){
	    	language = "en_US";
	    }
        if(language=="zh"||language=="zh_CN"||language=="zh-CN"||language=="zh_cn"){
            language="zh_Hans_CN";
        }

	   language=language.replace("-","_");
	   language = language.toLowerCase();
	   return language;
	};


})(jQuery);
