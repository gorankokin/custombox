/* ***** START - custom custombox ***** */
/* **** CBEventsPublic - global object with all events **** */
var CBPublicMethods = new Object ({});
var InitCustomBox = function(GlInitObj) {
	/* ***** check if custom box is already created ***** */
	if($("[data-stamp-value='CUSTOMBOX']").length === 0) {
		
		/* **** cbMainVar - local object with all variables, cbHelpVar - helper object with variables for moving **** */
		'use strict';
		var cbMainVar = new Object ({
			documentProperty : $(document),
			windowProperty : $(window),
			bodyProperty : $("body"),
			enteredCarousel : false,
			enteredFullScreen : false,
			firstImageOpen : false,
			escapePressed : true,
			currentImageNo : 0,
			imageSrc : "",
			currentSlides : 0,
			currentLoadedImage : 0,
			scrollTop : 0,
			timeoutOpen : 0,
			timeoutClose : 0,
			enteredZoom : false,
			onlyOneSlide : false,
			moveEntered : false,
			fixPxMove : 2,
			previousCoordinates : [],
			enteredDoubleTapZoom : false,
			zoomedRatio : 1,
			moveCoordX : 0,
			moveCoordY : 0,
			previousPinchEnter : 0,
			checkedMobile : false,
			sourceParent : {},
			imageClientHeigth : 0,
			imageClientWidth : 0,
			imagePositionTop : 10,
			imagePositionLeft : 10,
			windowWidth : $(window).innerWidth(),
			windowHeight : $(window).innerHeight(),
			imageBorder : true,
			openCurrentImage : {},
			getAllSlides : "",
			activeCustomBox : false,
			hideClass : "",
			animationClassOpen : "",
			animationClassOpenSmall : "",
			animationVerticalPhoto : "",
			animationClassClose : "",
			visibleClass : "",
			alignCenter : "",
			fixedBodyOverflow : "",
			customboxWrap : {},
			overlayElement : {},
			overlayClickClose : true,
			imageObject : {},
			imageWrapObject : {},
			spinnerObject : {},
			spinnerSrc : "",
			spinnerWrapObject : {},
			additionalBoxObject : {},
			additionalBoxHeight : 40,
			additionalBoxVisible : true,
			hideAdditional : "",
			additionalWrapObject : {},
			customBoxCaption : "",
			customBoxNumber : "",
			openCustombox : {},
			closeCustombox : {},
			nextBtn : {},
			previousBtn : {},
			fullScreenBtn : {},
			exitFullBtn : {},
			imageMaxWidth : 1280,
			imageMaxHeight : 720,
			customHtmlBuilder : "",
			imageAltAttr : "",
			dataAttr : "data-src",
			isAjax : false,
			totalSlides : 0,
			fullScreenAvailable : true
		}),
		cbHelpVar = new Object({
			scaling : false,
			touchEndCoord : [],
			lastDistance : 0,
			detectOneTouch : false,
			startTime : 0,
			endTime : 0,
			doubleTapTime : 0,
			allowedTime : 300,
			threshold : 60,
			restraint : 100,
			coordStartSwipe : []
		}),
		cbEvents = new Object ({
			onOpenStart : {},	
			onOpenFinished : {},
			onCloseStart : {},
			onCloseFinished : {},
			onPrevious : {},
			onNext : {},
			onStartLoad : {},
			onCompleteLoad : {},
			onEnterFScren : {},
			onExitFScren : {}
		});
		
		/* *** init reference to event listeners after default builder *** */
		function initEventsDefault() {
			CBPublicMethods.customBox = $("#CustomBox");
			cbMainVar.overlayElement = $(".cl_overlay_box");
			cbMainVar.customboxWrap = $(".cl_custom_box_wrap");
			cbMainVar.spinnerWrapObject = $(".cl_loading_spinner");
			cbMainVar.spinnerObject = $(".cl_spinner_gif");
			cbMainVar.imageWrapObject = $(".cl_image_box_wrap");
			cbMainVar.previousBtn = $(".cl_previous_image");
			cbMainVar.nextBtn = $(".cl_next_image");
			cbMainVar.additionalWrapObject = $(".cl_additional_wrap_box");
			cbMainVar.customBoxCaption = $(".cl_caption_box");
			cbMainVar.customBoxNumber = $(".cl_number_box");
			cbMainVar.fullScreenBtn = $(".cl_enter_full_screen");
			cbMainVar.exitFullBtn = $(".cl_exit_full_screen");	
			cbMainVar.closeCustombox = $(".cl_close_custom_box");
			cbMainVar.imageObject = $(".cl_image_source");
			cbMainVar.openCustombox = $(".cl_open_box");
		}
		
		/* *** init reference to event listeners after custom builder *** */
		function initEventsCustomBuilder() {
			CBPublicMethods.customBox = $(CBPublicMethods.customBox.selector);
			cbMainVar.overlayElement = $(cbMainVar.overlayElement.selector);
			cbMainVar.customboxWrap = $(cbMainVar.customboxWrap.selector);
			cbMainVar.spinnerWrapObject = $(cbMainVar.spinnerWrapObject.selector);
			cbMainVar.spinnerObject = $(cbMainVar.spinnerObject.selector);
			cbMainVar.imageWrapObject = $(cbMainVar.imageWrapObject.selector);
			cbMainVar.previousBtn = $(cbMainVar.previousBtn.selector);
			cbMainVar.nextBtn = $(cbMainVar.nextBtn.selector);
			cbMainVar.additionalWrapObject = $(cbMainVar.additionalWrapObject.selector);
			cbMainVar.customBoxCaption = $(cbMainVar.customBoxCaption.selector);
			cbMainVar.customBoxNumber = $(cbMainVar.customBoxNumber.selector);
			cbMainVar.fullScreenBtn = $(cbMainVar.fullScreenBtn.selector);
			cbMainVar.exitFullBtn = $(cbMainVar.exitFullBtn.selector);	
			cbMainVar.closeCustombox = $(cbMainVar.closeCustombox.selector);
			cbMainVar.imageObject = $(cbMainVar.imageObject.selector);
			cbMainVar.openCustombox = $(cbMainVar.openCustombox.selector);
		}
		
		/* *** detach event listeners general *** */
		function funcDetachEventListeners() {
			cbMainVar.imageObject.off('touchstart');
			cbMainVar.imageObject.off('touchmove');
			cbMainVar.imageObject.off('touchend');
			cbMainVar.openCustombox.off('click');
			cbMainVar.previousBtn.off('click');
			cbMainVar.nextBtn.off('click');
			cbMainVar.closeCustombox.off('click');
			cbMainVar.overlayElement.off('click');
			cbMainVar.fullScreenBtn.off('click');
			cbMainVar.exitFullBtn.off('click');
			cbMainVar.imageObject.off('load');
			cbMainVar.documentProperty.off('keyup');
			cbMainVar.windowProperty.off('orientationchange');
			cbMainVar.windowProperty.off('resize');
	
		}
			
		/* *** init custom box main events and build html *** */
		function subInitCustomBox(cnVar) {	
			if(typeof(cnVar) === "object") {				
				
				if(cnVar.hasOwnProperty("customBoxID")) {
					CBPublicMethods.customBox = $(cnVar.customBoxID.selector);
					cbMainVar.customHtmlBuilder += "<div id='" + cnVar.customBoxID.selector.replace(/[#.]/g,"") + "' ";
				} else {
					cbMainVar.customHtmlBuilder += "<div id='CustomBox' ";
					CBPublicMethods.customBox = $("#CustomBox");
				}
				
				if(cnVar.hasOwnProperty("customBoxClass")) {
					cbMainVar.customHtmlBuilder += "class='" + cnVar.customBoxClass.selector.replace(/[#.]/g,"") + " ";
				} else {
					cbMainVar.customHtmlBuilder += "class='cl_custom_box "
				}
				
				if(cnVar.hasOwnProperty("animationOpenClass")) {
					cbMainVar.animationClassOpen = cnVar.animationOpenClass.selector.replace(/[#.]/g,"");
					cbMainVar.customHtmlBuilder += cnVar.animationOpenClass.selector.replace(/[#.]/g,"") + " ";
				} else {
					cbMainVar.customHtmlBuilder += "cl_animation ";
					cbMainVar.animationClassOpen = "cl_animation";
				}
				
				if(cnVar.hasOwnProperty("hideClass")) {
					cbMainVar.hideClass = cnVar.hideClass.selector.replace(/[#.]/g,"");
					cbMainVar.customHtmlBuilder += cnVar.hideClass.selector.replace(/[#.]/g,"") + "' data-stamp-value='CUSTOMBOX'>";
				} else {
					cbMainVar.customHtmlBuilder += "cl_hidden' data-stamp-value='CUSTOMBOX'>";
					cbMainVar.hideClass = "cl_hidden";
				}
				
				if(cnVar.hasOwnProperty("overlayClass")) {
					cbMainVar.overlayElement = $(cnVar.overlayClass);
					cbMainVar.customHtmlBuilder += "<div class='" + cnVar.overlayClass.selector.replace(/[#.]/g,"") + "'></div>";
				} else {
					cbMainVar.customHtmlBuilder += "<div class='cl_overlay_box'></div>";
					cbMainVar.overlayElement = $(".cl_overlay_box");
				}
				
				if(cnVar.hasOwnProperty("customBoxWrapClass")) {
					cbMainVar.customboxWrap = $(cnVar.customBoxWrapClass);
					cbMainVar.customHtmlBuilder += "<div class='" + cnVar.customBoxWrapClass.selector.replace(/[#.]/g,"") + "'>";
				} else {
					cbMainVar.customHtmlBuilder += "<div class='cl_custom_box_wrap'>";
					cbMainVar.customboxWrap = $(".cl_custom_box_wrap");
				}
				
				if(cnVar.hasOwnProperty("spinnerWrapClass")) {
					cbMainVar.spinnerWrapObject = $(cnVar.spinnerWrapClass);
					cbMainVar.customHtmlBuilder += "<div class='" + cnVar.spinnerWrapClass.selector.replace(/[#.]/g,"") + " " + cbMainVar.hideClass + "'>";
				} else {
					cbMainVar.customHtmlBuilder += "<div class='cl_loading_spinner cl_hidden'>";
					cbMainVar.spinnerWrapObject = $(".cl_loading_spinner");
				}
				
				if(cnVar.hasOwnProperty("spinnerClass")) {
					cbMainVar.spinnerObject = $(cnVar.spinnerClass);
					cbMainVar.customHtmlBuilder += "<img class='" + cnVar.spinnerClass.selector.replace(/[#.]/g,"") + "' src='";
				} else {
					cbMainVar.customHtmlBuilder += "<img class='cl_spinner_gif' src='";
					cbMainVar.spinnerObject = $(".cl_spinner_gif");
				}
				
				if(cnVar.hasOwnProperty("spinnerSourceUrl")) {
					cbMainVar.spinnerSrc = cnVar.spinnerSourceUrl;
					cbMainVar.customHtmlBuilder += cnVar.spinnerSourceUrl + "' /></div>";
				} else {
					cbMainVar.spinnerSrc = site_url_global + "/adria/img/spinnerLoading.gif";
					cbMainVar.customHtmlBuilder += cbMainVar.spinnerSrc + "' /></div>";
				}
				
				if(cnVar.hasOwnProperty("imageWrapClass")) {
					cbMainVar.imageWrapObject = $(cnVar.imageWrapClass);
					cbMainVar.customHtmlBuilder += "<div class='" + cnVar.imageWrapClass.selector.replace(/[#.]/g,"") + "'>";
				} else {
					cbMainVar.customHtmlBuilder += "<div class='cl_image_box_wrap'>";
					cbMainVar.imageWrapObject = $(".cl_image_box_wrap");
				}
				
				if(cnVar.hasOwnProperty("previousButtonClass")) {
					cbMainVar.previousBtn = $(cnVar.previousButtonClass);
					cbMainVar.customHtmlBuilder += "<div class='" + cnVar.previousButtonClass.selector.replace(/[#.]/g,"") + "'></div>";
				} else {
					cbMainVar.customHtmlBuilder += "<div class='cl_previous_image'></div>";
					cbMainVar.previousBtn = $(".cl_previous_image");
				}
				
				if(cnVar.hasOwnProperty("nextButtonClass")) {
					cbMainVar.nextBtn = $(cnVar.nextButtonClass);
					cbMainVar.customHtmlBuilder += "<div class='" + cnVar.nextButtonClass.selector.replace(/[#.]/g,"") + "'></div>";
				} else {
					cbMainVar.customHtmlBuilder += "<div class='cl_next_image'></div>";
					cbMainVar.nextBtn = $(".cl_next_image");
				}
				
				if(cnVar.hasOwnProperty("additionalBoxWrapClass")) {
					cbMainVar.additionalBoxObject = cnVar.additionalBoxWrapClass.selector.replace(/[#.]/g,"");
					cbMainVar.customHtmlBuilder += "<div class='" + cnVar.additionalBoxWrapClass.selector.replace(/[#.]/g,"") + "'>";
				} else {
					cbMainVar.customHtmlBuilder += "<div class='cl_additional_box'>";
					cbMainVar.additionalBoxObject = "cl_additional_box";
				}
				
				if(cnVar.hasOwnProperty("additionalBoxInnerWrapClass")) {
					cbMainVar.additionalWrapObject = $(cnVar.additionalBoxInnerWrapClass);
					cbMainVar.customHtmlBuilder += "<div class='" + cnVar.additionalBoxInnerWrapClass.selector.replace(/[#.]/g,"") + " ";
				} else {
					cbMainVar.customHtmlBuilder += "<div class='cl_additional_wrap_box ";
					cbMainVar.additionalWrapObject = $(".cl_additional_wrap_box");
				}
				
				if(cnVar.hasOwnProperty("additionalHideClass")) {
					cbMainVar.hideAdditional = cnVar.additionalHideClass.selector.replace(/[#.]/g,"");
					cbMainVar.customHtmlBuilder += cnVar.additionalHideClass.selector.replace(/[#.]/g,"") + "'>";
				} else {
					cbMainVar.customHtmlBuilder += "cl_hide_additional_box'>";
					cbMainVar.hideAdditional = "cl_hide_additional_box";
				}
				
				if(cnVar.hasOwnProperty("additionalBoxCaptionClass")) {
					cbMainVar.customBoxCaption = $(cnVar.additionalBoxCaptionClass);
					cbMainVar.customHtmlBuilder += "<span class='" + cnVar.additionalBoxCaptionClass.selector.replace(/[#.]/g,"") + "'></span>";
				} else {
					cbMainVar.customHtmlBuilder += "<span class='cl_caption_box'></span>";
					cbMainVar.customBoxCaption = $(".cl_caption_box");
				}
				
				if(cnVar.hasOwnProperty("additonalBoxNumberClass")) {
					cbMainVar.customBoxNumber = $(cnVar.additonalBoxNumberClass);
					cbMainVar.customHtmlBuilder += "<span class='" + cnVar.additonalBoxNumberClass.selector.replace(/[#.]/g,"") + "'></span>";
				} else {
					cbMainVar.customHtmlBuilder += "<span class='cl_number_box'></span>";
					cbMainVar.customBoxNumber = $(".cl_number_box");
				}
				
				if(cbMainVar.fullScreenAvailable == true) {			
					if(cnVar.hasOwnProperty("enterFullScreenButtonClass")) {
						cbMainVar.fullScreenBtn = $(cnVar.fullScreenButtonClass);
						cbMainVar.customHtmlBuilder += "<div class='" + cnVar.fullScreenButtonClass.selector.replace(/[#.]/g,"") + "'></div>";
					} else {
						cbMainVar.customHtmlBuilder += "<div class='cl_enter_full_screen'></div>";
						cbMainVar.fullScreenBtn = $(".cl_enter_full_screen");
					}
					
					if(cnVar.hasOwnProperty("exitFullScreenButtonClass")) {
						cbMainVar.exitFullBtn = $(cnVar.exitFullScreenButtonClass);
						cbMainVar.customHtmlBuilder += "<div class='" + cnVar.exitFullScreenButtonClass.selector.replace(/[#.]/g,"") + " " + cbMainVar.hideClass + "'></div>";
					} else {
						cbMainVar.customHtmlBuilder += "<div class='cl_exit_full_screen cl_hidden'></div>";
						cbMainVar.exitFullBtn = $(".cl_exit_full_screen");
					}					
				}
			
				if(cnVar.hasOwnProperty("closeCustomBoxButtonClass")) {
					cbMainVar.closeCustombox = $(cnVar.closeCustomBoxButtonClass);
					cbMainVar.customHtmlBuilder += "<div class='" + cnVar.closeCustomBoxButtonClass.selector.replace(/[#.]/g,"") + "'></div></div></div>";
				} else {
					cbMainVar.customHtmlBuilder += "<div class='cl_close_custom_box'></div></div></div>";
					cbMainVar.closeCustombox = $(".cl_close_custom_box");
				}
				
				if(cnVar.hasOwnProperty("imageCustomBoxClass")) {
					cbMainVar.imageObject = $(cnVar.imageCustomBoxClass);
					cbMainVar.customHtmlBuilder += "<img class='" + cnVar.imageCustomBoxClass.selector.replace(/[#.]/g,"") + "' src='' alt='' /></div></div></div>";
				} else {
					cbMainVar.customHtmlBuilder += "<img class='cl_image_source' src='' alt='' /></div></div></div>";
					cbMainVar.imageObject = $(".cl_image_source");
				}
				
				if(cnVar.hasOwnProperty("overlayClickClose")) {
					if(typeof(cnVar.overlayClickClose) === "boolean") {
						cbMainVar.overlayClickClose = cnVar.overlayClickClose;
					} else {
						cbMainVar.overlayClickClose = true;
					}
				} else {
					cbMainVar.overlayClickClose = true;
				}
				
				if(cnVar.hasOwnProperty("dataAttr")) {
					cbMainVar.dataAttr = cnVar.dataAttr;
				} else {
					cbMainVar.dataAttr = "data-src";
				}
				
				if(cnVar.hasOwnProperty("imageBorderClass")) {
					cbMainVar.imageBorder = cnVar.imageBorderClass;
				} else {
					cbMainVar.imageBorder = "cl_border_image";
				}	
				
				if(cnVar.hasOwnProperty("alignCenterCustomBoxClass")) {
					cbMainVar.alignCenter = cnVar.alignCenterCustomBoxClass;
				} else {
					cbMainVar.alignCenter = "cl_align_center";
				}	
				
				if(cnVar.hasOwnProperty("fixedBodyClass")) {
					cbMainVar.fixedBodyOverflow = cnVar.fixedBodyClass;
				} else {
					cbMainVar.fixedBodyOverflow = "cl_overflow_body";
				}
				
				if(cnVar.hasOwnProperty("animationOpenSmallScreenClass")) {
					cbMainVar.animationClassOpenSmall = cnVar.animationOpenSmallScreen;
				} else {
					cbMainVar.animationClassOpenSmall = "cl_animation_small";
				}
				
				if(cnVar.hasOwnProperty("animationOpenPortraitImageClass")) {
					cbMainVar.animationVerticalPhoto = cnVar.animationOpenPortraitImage;
				} else {
					cbMainVar.animationVerticalPhoto = "cl_animation_vertical_photo";
				}
				
				if(cnVar.hasOwnProperty("animationCloseCustomBoxClass")) {
					cbMainVar.animationClassClose = cnVar.cl_animationClassClose;
				} else {
					cbMainVar.animationClassClose = "cl_animation_close";
				}
				
				if(cnVar.hasOwnProperty("visibleClass")) {
					cbMainVar.visibleClass = cnVar.visibleClass;
				} else {
					cbMainVar.visibleClass = "cl_visible";
				}
				
				if(cnVar.hasOwnProperty("activeCustomBoxClass")) {
					cbMainVar.activeCustomBox = cnVar.activeCustomBoxClass;
				} else {
					cbMainVar.activeCustomBox = "cl_active";
				}
				
				if(cnVar.hasOwnProperty("imageSourceParent")) {
					cbMainVar.sourceParent = cnVar.imageSourceParent.selector;
				} else {
					cbMainVar.sourceParent = ".cl_sources";
				}
				
				if(cnVar.hasOwnProperty("imageSourceGetActive")) {
					cbMainVar.openCurrentImage = cnVar.imageSourceGetActive.selector;
				} else {
					cbMainVar.openCurrentImage = ".cl_sources-slide.active.in img";
				}
				
				if(cnVar.hasOwnProperty("imageSourceAllImages")) {
					cbMainVar.getAllSlides = cnVar.imageSourceAllImages.selector;
				} else {
					cbMainVar.getAllSlides = ".cl_sources-slide";
				}		
				
				if(cnVar.hasOwnProperty("openCustomBoxButton")) {
					cbMainVar.openCustombox = $(cnVar.openCustomBoxButton.selector);
				} else {
					cbMainVar.openCustombox = $(".cl_open_box");
				}
				
				if(cnVar.hasOwnProperty("imageMaxWidth")) {
					cbMainVar.imageMaxWidth = cnVar.imageMaxWidth;
				} else {
					cbMainVar.imageMaxWidth = 1280;
				}
				
				if(cnVar.hasOwnProperty("imageMaxHeight")) {
					cbMainVar.imageMaxHeight = cnVar.imageMaxHeight;
				} else {
					cbMainVar.imageMaxHeight = 720;
				}
				
				if(cnVar.hasOwnProperty("imagePositionTop")){
					cbMainVar.imagePositionTop = cnVar.imagePositionTop;
				} else {
					cbMainVar.imagePositionTop = 10;
				}
				
				if(cnVar.hasOwnProperty("imagePositionLeft")){
					cbMainVar.imagePositionLeft = cnVar.imagePositionLeft;
				} else {
					cbMainVar.imagePositionLeft = 10;
				}
				
				if(cnVar.hasOwnProperty("additionalBoxVisible")) {
					if(typeof(cnVar.additionalBoxVisible) === "boolean") {
						cbMainVar.additionalBoxVisible = cnVar.additionalBoxVisible;
					} else {
						cbMainVar.additionalBoxVisible = true;
					}
				} else {
					cbMainVar.additionalBoxVisible = true;
				}
				
				if(cnVar.hasOwnProperty("additionalBoxHeight")){
					if(cbMainVar.additionalBoxVisible === true) {
						cbMainVar.additionalBoxHeight = cnVar.additionalBoxHeight;
					} else {
						cbMainVar.additionalBoxHeight = 0;
					}
				} else {
					if(cbMainVar.additionalBoxVisible === true) {
						cbMainVar.additionalBoxHeight = 40;
					} else {
						cbMainVar.additionalBoxHeight = 0;
					}
				}
				
				if(cnVar.hasOwnProperty("isAjax")) {
					cbMainVar.isAjax = cnVar.isAjax;
				} else {
					cbMainVar.isAjax = false;
				}
				
				$.when(
						cbMainVar.bodyProperty.append(cbMainVar.customHtmlBuilder)
				).then(
						initEventsCustomBuilder(), 
						funcAttachEventListeners()
				);
				
			} else {				
				cbMainVar.animationClassOpen = "cl_animation";
				cbMainVar.hideClass = "cl_hidden";
				cbMainVar.spinnerSrc = site_url_global + "/adria/img/spinnerLoading.gif";
				cbMainVar.additionalBoxObject = "cl_additional_box";
				cbMainVar.hideAdditional = "cl_hide_additional_box";		
				cbMainVar.sourceParent = ".cl_sources";
				cbMainVar.getAllSlides = ".cl_sources-slide";
				cbMainVar.openCurrentImage = ".cl_sources-slide.active.in img";
				cbMainVar.activeCustomBox = "cl_active";
				cbMainVar.animationClassOpenSmall = "cl_animation_small";
				cbMainVar.animationVerticalPhoto = "cl_animation_vertical_photo";
				cbMainVar.animationClassClose = "cl_animation_close";
				cbMainVar.visibleClass = "cl_visible";
				cbMainVar.alignCenter = "cl_align_center";
				cbMainVar.fixedBodyOverflow = "cl_overflow_body";	
				cbMainVar.imageBorder = "cl_border_image";
				
				cbMainVar.customHtmlBuilder = "<div id='CustomBox' class='cl_custom_box cl_animation cl_hidden' data-stamp-value='CUSTOMBOX'><div class='cl_overlay_box'></div><div class='cl_custom_box_wrap'><div class='cl_loading_spinner cl_hidden'><img class='cl_spinner_gif' src='" + cbMainVar.spinnerSrc + "' /></div><div class='cl_image_box_wrap'><div class='cl_previous_image'></div><div class='cl_next_image'></div><div class='cl_additional_box'><div class='cl_additional_wrap_box cl_hide_additional_box'><span class='cl_caption_box'></span><span class='cl_number_box'></span>";
				if(cbMainVar.fullScreenAvailable == true) {
					cbMainVar.customHtmlBuilder += "<div class='cl_enter_full_screen'></div><div class='cl_exit_full_screen cl_hidden'></div>";
				}
				cbMainVar.customHtmlBuilder += "<div class='cl_close_custom_box'></div></div></div><img class='cl_image_source' src=' ' alt=' ' /></div></div></div>";
				
				$.when(
						cbMainVar.bodyProperty.append(cbMainVar.customHtmlBuilder)
				).then(
						initEventsDefault(),
						funcAttachEventListeners()
				);			
		
				/*cbMainVar.moveCoordX = cbMainVar.imageObject.offset().left;
				cbMainVar.moveCoordY = cbMainVar.imageObject.offset().top;*/
			}
		}
			
		/* *** helper check is it fullscreen mode available, available = true, unavailable = false *** */
		function funcCheckFullScreen() {
			if(document.webkitIsFullScreen === undefined && document.mozFullScreen === undefined && document.msFullscreenEnabled === undefined && document.fullScreenEnabled === undefined) {
				return false;
			} else {
				return true;
			}
		}	
		
		/* *** helper check is it mobile device, mobile = true, notmobile = false *** */
		function funcCheckMobile() {
			if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
				return true;
			} else {
				return false;
			}
		}
		
		/* *** calculate resize and return back [0]=width [1]=height [2]=top [3]=left *** */
		function funcCalculateDimensionsReturn(cl_imageW, cl_imageH) {
			var cl_calculated_dim = [],
				cl_calcImageH,
				cl_calcImageW,
				cl_screenW = $(window).innerWidth(),
				cl_screenH = $(window).innerHeight(),
				cl_ratioCurrentMaxValues = cbMainVar.imageMaxHeight / cbMainVar.imageMaxWidth,
				cl_ratioCurrentScreen = cl_screenH / cl_screenW,
				cl_ratioCurrentImage = cl_imageH / cl_imageW,
				cl_top_fix = cbMainVar.additionalBoxHeight / 2,
				cl_width_fix = cbMainVar.imagePositionLeft * 2,
				cl_height_fix = cbMainVar.imagePositionTop * 2 + cbMainVar.additionalBoxHeight;
			
			/* ** helper inside recalc one ** */
			function recalc_helper_one() {
				if(cbMainVar.imageMaxWidth >= (cl_screenW - cl_width_fix)) {
					if((cl_screenW - cl_width_fix) >= cl_imageW) {
						cl_calculated_dim[0] = cl_imageW;
						cl_calculated_dim[1] = cl_imageH;
						cl_calculated_dim[2] = Math.round((cl_screenH - cl_imageH) / 2) - cl_top_fix;
						cl_calculated_dim[3] = Math.round((cl_screenW - cl_imageW) / 2);
					} else {
						cl_calcImageH = Math.round((cl_screenW - cl_width_fix) * cl_ratioCurrentImage);
						cl_calculated_dim[0] = cl_screenW - cl_width_fix;
						cl_calculated_dim[1] = cl_calcImageH;
						cl_calculated_dim[2] = Math.round((cl_screenH - cl_calcImageH) / 2) - cl_top_fix;
						cl_calculated_dim[3] = cbMainVar.imagePositionLeft;
					}
				} else {
					if(cbMainVar.imageMaxWidth >= cl_imageW) {
						cl_calculated_dim[0] = cl_imageW;
						cl_calculated_dim[1] = cl_imageH;
						cl_calculated_dim[2] = Math.round((cl_screenH - cl_imageH) / 2) - cl_top_fix;
						cl_calculated_dim[3] = Math.round((cl_screenW - cl_imageW) / 2);
					} else {
						cl_calcImageH = Math.round(cbMainVar.imageMaxWidth * cl_ratioCurrentImage);
						cl_calculated_dim[0] = cbMainVar.imageMaxWidth;
						cl_calculated_dim[1] = cl_calcImageH;
						cl_calculated_dim[2] = Math.round((cl_screenH - cl_calcImageH) / 2) - cl_top_fix;
						cl_calculated_dim[3] = Math.round((cl_screenW - cbMainVar.imageMaxWidth) / 2);
					}
				}
			}
			
			/* ** helper inside recalc two ** */
			function recalc_helper_two() {
				if(cbMainVar.imageMaxWidth >= (cl_screenW - cl_width_fix)) {
					if((cl_screenW - cl_width_fix) >= cl_imageW) {
						cl_calcImageW = Math.round((cl_screenH - cl_height_fix) / cl_ratioCurrentImage);
						cl_calculated_dim[0] = cl_calcImageW;
						cl_calculated_dim[1] = cl_screenH - cl_height_fix;
						cl_calculated_dim[2] = cbMainVar.imagePositionTop;
						cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
					} else {
						cl_calcImageH = Math.round((cl_screenW - cl_width_fix) * cl_ratioCurrentImage);
						if(cl_calcImageH > (cl_screenH - cl_height_fix)) {
							cl_calcImageW = Math.round((cl_screenH - cl_height_fix) / cl_ratioCurrentImage);
							cl_calculated_dim[0] = cl_calcImageW;
							cl_calculated_dim[1] = cl_screenH - cl_height_fix;
							cl_calculated_dim[2] = cbMainVar.imagePositionTop;
							cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
						} else {
							cl_calculated_dim[0] = cl_screenW - cl_width_fix;
							cl_calculated_dim[1] = cl_calcImageH;
							cl_calculated_dim[2] = Math.round((cl_screenH - cl_calcImageH) / 2) - cl_top_fix;
							cl_calculated_dim[3] = cbMainVar.imagePositionLeft;
						}
					}
				} else {
					if(cbMainVar.imageMaxWidth >= cl_imageW) {
						cl_calcImageW = Math.round((cl_screenH - cl_height_fix) / cl_ratioCurrentImage);
						cl_calculated_dim[0] = cl_calcImageW;
						cl_calculated_dim[1] = cl_screenH - cl_height_fix;
						cl_calculated_dim[2] = cbMainVar.imagePositionTop;
						cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
					} else {
						cl_calcImageH = Math.round(cbMainVar.imageMaxWidth * cl_ratioCurrentImage);
						if(cl_calcImageH > (cl_screenH - cl_height_fix)) {
							cl_calcImageW = Math.round((cl_screenH - cl_height_fix) / cl_ratioCurrentImage);
							cl_calculated_dim[0] = cl_calcImageW;
							cl_calculated_dim[1] = cl_screenH - cl_height_fix;
							cl_calculated_dim[2] = cbMainVar.imagePositionTop;
							cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
						} else {
							cl_calculated_dim[0] = cbMainVar.imageMaxWidth;
							cl_calculated_dim[1] = cl_calcImageH;
							cl_calculated_dim[2] = Math.round((cl_screenH - cl_calcImageH) / 2) - cl_top_fix;
							cl_calculated_dim[3] = Math.round((cl_screenW - cbMainVar.imageMaxWidth) / 2);
						}
					}
				}
			}
			
			/* ** helper inside recalc three ** */
			function recalc_helper_three() {
				if(cbMainVar.imageMaxWidth >= (cl_screenW - cl_width_fix)) {
					if((cl_screenW - cl_width_fix) >= cl_imageW) {
						cl_calcImageW = Math.round(cbMainVar.imageMaxHeight / cl_ratioCurrentImage);
						cl_calculated_dim[0] = cl_calcImageW;
						cl_calculated_dim[1] = cbMainVar.imageMaxHeight;
						cl_calculated_dim[2] = Math.round((cl_screenH - cbMainVar.imageMaxHeight) / 2) - cl_top_fix;
						cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
					} else {
						cl_calcImageH = Math.round((cl_screenW - cl_width_fix) * cl_ratioCurrentImage);
						if(cl_calcImageH > cbMainVar.imageMaxHeight) {
							cl_calcImageW = Math.round(cbMainVar.imageMaxHeight / cl_ratioCurrentImage);
							cl_calculated_dim[0] = cl_calcImageW;
							cl_calculated_dim[1] = cbMainVar.imageMaxHeight;
							cl_calculated_dim[2] = Math.round((cl_screenH - cbMainVar.imageMaxHeight) / 2) - cl_top_fix;
							cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
						} else {
							cl_calculated_dim[0] = cl_screenW - cl_width_fix;
							cl_calculated_dim[1] = cl_calcImageH;
							cl_calculated_dim[2] = Math.round((cl_screenH - cl_calcImageH) / 2) - cl_top_fix;
							cl_calculated_dim[3] = cbMainVar.imagePositionLeft;
						}
					}
				} else {
					if(cbMainVar.imageMaxWidth >= cl_imageW) {
						cl_calcImageW = Math.round(cbMainVar.imageMaxHeight / cl_ratioCurrentImage);
						cl_calculated_dim[0] = cl_calcImageW;
						cl_calculated_dim[1] = cbMainVar.imageMaxHeight;
						cl_calculated_dim[2] = Math.round((cl_screenH - cbMainVar.imageMaxHeight) / 2) - cl_top_fix;
						cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
					} else {
						cl_calcImageH = Math.round(cbMainVar.imageMaxWidth * cl_ratioCurrentImage);
						if(cl_calcImageH > cbMainVar.imageMaxHeight) {
							cl_calcImageW = Math.round(cbMainVar.imageMaxHeight / cl_ratioCurrentImage);
							cl_calculated_dim[0] = cl_calcImageW;
							cl_calculated_dim[1] = cbMainVar.imageMaxHeight;
							cl_calculated_dim[2] = Math.round((cl_screenH - cbMainVar.imageMaxHeight) / 2) - cl_top_fix;
							cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
						} else {
							cl_calculated_dim[0] = cbMainVar.imageMaxWidth;
							cl_calculated_dim[1] = cl_calcImageH;
							cl_calculated_dim[2] = Math.round((cl_screenH - cl_calcImageH) / 2) - cl_top_fix;
							cl_calculated_dim[3] = Math.round((cl_screenW - cbMainVar.imageMaxWidth) / 2);
						}
					}
				}
			}
			
			/* ** check for inside recalc helper ** */
			if(cbMainVar.imageMaxHeight >= (cl_screenH - cl_height_fix)) {
				if((cl_screenH - cl_height_fix) >= cl_imageH) {
					recalc_helper_one();
				} else {
					recalc_helper_two();
				}
			} else {
				if(cbMainVar.imageMaxHeight >= cl_imageH) {
					recalc_helper_one();
				} else {
					recalc_helper_three();
				}
			}
			
			cbMainVar.topPosition = cl_calculated_dim[2];
			
			/* ** return calculated values ** */
			return cl_calculated_dim;
		}
		
		/* *** open custom custombox *** */
		function funcOpenCustomCustombox(cl_imageActive, cl_totalSlides) {
			var cl_imageSrc = "",
				cl_imageAlt = "",
				cl_windowW = $(window).width(),
				cl_windowH = $(window).height(),
				cl_spinnerSrc = cbMainVar.spinnerSrc,
				cl_numberSlides = 0;
		 
			if (!cbMainVar.enteredCarousel) {	
				
				cbEvents.onOpenStart = $.Event('onOpenStartEvent', { type : "onOpenStartEvent", time : Date.now() });		
				CBPublicMethods.customBox.trigger(cbEvents.onOpenStart);		
				
				cbMainVar.enteredCarousel = true;
				clearTimeout(cbMainVar.timeoutClose);
				
				/* ** check is it mobile ** */
				if(funcCheckMobile()) {
					cbMainVar.previousBtn.addClass(cbMainVar.hideClass);
					cbMainVar.nextBtn.addClass(cbMainVar.hideClass);
					cbMainVar.checkedMobile = true;
				}
				
				/* ** check is it small screen and add class for small animation ** */
				if(cl_windowW < 992) {
					CBPublicMethods.customBox.addClass(cbMainVar.animationClassOpenSmall);
				}
				
				if(!cbMainVar.isAjax) {	
					if(typeof(cl_totalSlides) === "number") {
						cl_numberSlides = cl_totalSlides;
					} else {
						cl_numberSlides = cl_totalSlides.length;
					}
						
					/* ** get number of slides, current and all ** */
					cbMainVar.currentImageNo = cl_imageActive.parents(cbMainVar.getAllSlides).index();
					cbMainVar.imageSrc = cl_imageActive.attr(cbMainVar.dataAttr);
					cbMainVar.currentLoadedImage = cl_imageActive.parent();
					
					/* ** check is it alt attribute on image ** */
					if ( typeof (cl_imageActive.attr("alt")) != "undefined") {
						cl_imageAlt = cl_imageActive.attr("alt");
						cbMainVar.customBoxCaption.html(cl_imageAlt);
						cbMainVar.imageObject.attr("alt", cl_imageAlt);
					} else {
						cbMainVar.customBoxCaption.html(" ");
						cbMainVar.imageObject.attr("alt", " ");
					}
					
					/* ** check if total slides number is 1 and hide next prev ** */
					if(cl_numberSlides === 1) {
						cbMainVar.nextBtn.addClass(cbMainVar.hideClass);
						cbMainVar.previousBtn.addClass(cbMainVar.hideClass);
						cbMainVar.onlyOneSlide = true;
					}
					
					/* ** set additional info ** */
					cbMainVar.additionalWrapObject.addClass(cbMainVar.hideAdditional);
					cbMainVar.customBoxNumber.html("Image " + (cbMainVar.currentImageNo + 1) + " of " + cl_numberSlides);
				}
		
				/* ** body fixed and scroll to current ** */
				cbMainVar.scrollTop = $(window).scrollTop();
				window.scrollTo(0,0);
				$("body").addClass(cbMainVar.fixedBodyOverflow).css("top", -cbMainVar.scrollTop);
				
				/* ** set custom box opacity ** */
				CBPublicMethods.customBox.removeClass(cbMainVar.hideClass);	
				CBPublicMethods.customBox.css({
					"opacity" : 0.4
				});
				
				/* ** call resize first start ** */
				cbMainVar.customboxWrap.css({
					"top" : (cl_imageActive.parent().offset().top - $(window).scrollTop()),
					"left" : cl_imageActive.parent().offset().left
				});
				cbMainVar.imageWrapObject.css({
					"width" : cl_imageActive.parent().prop("clientWidth"),
					"height" : cl_imageActive.parent().prop("clientHeight")
				});
				if((cl_imageActive.prop("clientHeight") / cl_imageActive.prop("clientWidth")) > 1.0) {
					CBPublicMethods.customBox.addClass(cbMainVar.animationVerticalPhoto);
				}
				setTimeout(function() {
					var	cl_dimensions = funcCalculateDimensionsReturn(cl_imageActive.prop("naturalWidth"), cl_imageActive.prop("naturalHeight"));
					cbMainVar.customboxWrap.css({
						"top" : cl_dimensions[2],
						"left" : cl_dimensions[3]
					});
					cbMainVar.imageWrapObject.css({
						"width" : cl_dimensions[0],
						"height" : cl_dimensions[1]
					});
				}, 10);
				
				/* ** spinner load ** */
				cbMainVar.spinnerWrapObject.removeClass(cbMainVar.hideClass);
				cbMainVar.spinnerObject.attr("src", " ");
				setTimeout(function() {
					CBPublicMethods.customBox.addClass(cbMainVar.activeCustomBox);
					cbMainVar.spinnerObject.attr("src", cl_spinnerSrc);
				}, 10);		
				
				/* ** call load image func ** */
				setTimeout(function() {
					
					funcSetImageUrl(cbMainVar.imageSrc, true);
					
				}, 200);
				
				var cb_openStartTime = Date.now();
				
				cbMainVar.openFinished = function(){
					var cb_callbackTime = Date.now();
					if(cb_callbackTime - cb_openStartTime < 700) {
						cbMainVar.timeoutOpen = setTimeout(function() {
							CBPublicMethods.customBox.removeClass(cbMainVar.animationClassOpen).removeClass(cbMainVar.animationClassOpenSmall).removeClass(cbMainVar.animationVerticalPhoto).addClass(cbMainVar.imageBorder);
							CBPublicMethods.customBox.removeAttr("style");
							
							cbEvents.onOpenFinished = $.Event('onOpenFinishedEvent', { type : "onOpenFinishedEvent", time : Date.now() });			
							CBPublicMethods.customBox.trigger(cbEvents.onOpenFinished);
						}, 770 - (cb_callbackTime - cb_openStartTime));
					} else {
						CBPublicMethods.customBox.removeClass(cbMainVar.animationClassOpen).removeClass(cbMainVar.animationClassOpenSmall).removeClass(cbMainVar.animationVerticalPhoto).addClass(cbMainVar.imageBorder);
						CBPublicMethods.customBox.removeAttr("style");
						
						cbEvents.onOpenFinished = $.Event('onOpenFinishedEvent', { type : "onOpenFinishedEvent", time : Date.now() });			
						CBPublicMethods.customBox.trigger(cbEvents.onOpenFinished);
					}				
				};
			}
		}
		
		/* *** close custom custombox *** */
		function funcCloseCustomCustombox() {
			if (cbMainVar.enteredCarousel) {
				cbMainVar.enteredCarousel = false;
				clearTimeout(cbMainVar.timeoutOpen);
				
				cbEvents.onCloseStart = $.Event('onCloseStartEvent', { type : "onCloseStartEvent", time : Date.now() });
				CBPublicMethods.customBox.trigger(cbEvents.onCloseStart);
				
				cbMainVar.customboxWrap.css({
					"left" : cbMainVar.customboxWrap.offset().left
				});
				CBPublicMethods.customBox.removeClass(cbMainVar.alignCenter).removeClass(cbMainVar.imageBorder);
				
				/* ** allow body and scroll to current ** */
				cbMainVar.bodyProperty.removeClass(cbMainVar.fixedBodyOverflow).removeAttr("style");
				window.scrollTo(0,cbMainVar.scrollTop);
				
				/* ** position custom box for where it open ** */
				cbMainVar.additionalWrapObject.addClass(cbMainVar.hideClass);
				CBPublicMethods.customBox.removeClass(cbMainVar.activeCustomBox).addClass(cbMainVar.animationClassOpen).addClass(cbMainVar.animationClassClose);
				CBPublicMethods.customBox.removeAttr("style");
				cbMainVar.imageObject.removeAttr("style").css({
					"transition" : "transform 0.5s ease-in-out",
					"transform" : "transform scale(1)"
				})
				cbMainVar.customboxWrap.css({
					"top": (cbMainVar.currentLoadedImage.offset().top - $(window).scrollTop()),
					"left" : cbMainVar.currentLoadedImage.offset().left
				});
				cbMainVar.imageWrapObject.css({
					"width": cbMainVar.currentLoadedImage.prop("clientWidth"),
					"height": cbMainVar.currentLoadedImage.prop("clientHeight")
				});			
				
				/* ** call all custom box reset after transitions ends ** */
				cbMainVar.timeoutClose = setTimeout(function() {
					cbMainVar.imageObject.attr({"src":" ", "alt":" "});
					funcExitFullScreen(CBPublicMethods.customBox);
					funcResetButtons();
					cbMainVar.additionalWrapObject.removeClass(cbMainVar.hideClass);
					CBPublicMethods.customBox.removeClass(cbMainVar.animationClassClose);
					
					cbEvents.onCloseFinished = $.Event('onCloseFinishedEvent', { type : "onCloseFinishedEvent", time : Date.now() });
					CBPublicMethods.customBox.trigger(cbEvents.onCloseFinished);				
				}, 770);
			}
		}
		
		/* *** next previous photo *** */
		function funcNextPrevious(cl_paramsNexPrev) {
			var cl_imageAlt,
				cl_spinnerSrc = cbMainVar.spinnerObject.attr("src"),
				cl_numberOfSlides = cbMainVar.currentSlides.length;
			
			/* ** check what is it next of previous ** */
			if (cl_paramsNexPrev === "previous") {
				
				cbEvents.onPrevious = $.Event('onPreviousEvent', { type : "onPreviousEvent", time : Date.now() });
				CBPublicMethods.customBox.trigger(cbEvents.onPrevious);
				
				if (cbMainVar.currentImageNo === 0) {
					cbMainVar.currentImageNo = cl_numberOfSlides - 1;
				} else {
					cbMainVar.currentImageNo -= 1;
				}
				
			} else {
				
				cbEvents.onNext = $.Event('onNextEvent', { type : "onNextEvent", time : Date.now() });
				CBPublicMethods.customBox.trigger(cbEvents.onNext);	
				
				if (cbMainVar.currentImageNo === (cl_numberOfSlides - 1)) {
					cbMainVar.currentImageNo = 0;
				} else {
					cbMainVar.currentImageNo += 1;
				}	
			}
			
			if(!cbMainVar.isAjax) {
				/* ** set src of photo ** */
				cbMainVar.imageSrc = cbMainVar.currentSlides.eq(cbMainVar.currentImageNo).find("img").attr(cbMainVar.dataAttr);
				
				/* ** get alt attribute if exist and set additional ** */
				if ( typeof (cbMainVar.currentSlides.eq(cbMainVar.currentImageNo).find("img").attr("alt")) != "undefined") {
					cl_imageAlt = cbMainVar.currentSlides.eq(cbMainVar.currentImageNo).find("img").attr("alt");
					cbMainVar.customBoxCaption.html(cl_imageAlt);
					cbMainVar.imageObject.attr("alt", cl_imageAlt);
				} else {
					cbMainVar.imageObject.html(" ");
					cbMainVar.imageObject.attr("alt", " ");
				}	
				cbMainVar.additionalWrapObject.addClass(cbMainVar.hideClass).addClass(cbMainVar.hideAdditional);
				cbMainVar.customBoxNumber.html("Image " + (cbMainVar.currentImageNo + 1) + " of " + cl_numberOfSlides);
				cbMainVar.imageObject.removeClass(cbMainVar.visibleClass);
				cbMainVar.imageObject.attr("src", " ");
			}
			
			/* ** call image load and show spinner loading ** */
			setTimeout(function() {
				cbMainVar.imageObject.addClass(cbMainVar.hideClass);
				cbMainVar.spinnerObject.attr("src", cl_spinnerSrc);
				cbMainVar.spinnerWrapObject.removeClass(cbMainVar.hideClass);
				funcSetImageUrl(cbMainVar.imageSrc, false);
			}, 10);
		}
		
		/* *** image load *** */
		function funcSetImageUrl(cl_imageSrc, cl_param_helper) {		
			
			cbEvents.onStartLoad = $.Event('onStartLoad', { type : "onStartLoad", time : Date.now() });	
			CBPublicMethods.customBox.trigger(cbEvents.onStartLoad);
			
			cbMainVar.imageObject.attr("src", cl_imageSrc);		
			cbMainVar.firstImageOpen = cl_param_helper;
		}
		
		/* *** do things after image load *** */
		function funcAfterImageLoad() {
			
			/* ** hide spinner on finished load ** */
			cbMainVar.spinnerWrapObject.addClass(cbMainVar.hideClass);
			setTimeout(function() {
				cbMainVar.imageObject.removeClass(cbMainVar.hideClass);
			}, 5);
			
			/* ** get and set dimensions image "true = first start, false = every other load" ** */
			var cl_dimensions = funcCalculateDimensionsReturn(cbMainVar.imageObject.prop('naturalWidth'), cbMainVar.imageObject.prop('naturalHeight'));		
			if(cbMainVar.firstImageOpen) {		
				CBPublicMethods.customBox.addClass(cbMainVar.alignCenter);	
				cbMainVar.customboxWrap.removeAttr("style");	
				cbMainVar.customboxWrap.css({
					"top" : cl_dimensions[2]
				});
				cbMainVar.imageWrapObject.css({
					"width" : cl_dimensions[0],
					"height" : cl_dimensions[1]
				});			
				cbMainVar.openFinished();
			} else {						
				cbMainVar.customboxWrap.css({
					"top" : cl_dimensions[2]
				});
				cbMainVar.imageWrapObject.css({
					"width" : cl_dimensions[0],
					"height" : cl_dimensions[1]
				});
			}
			
			/* ** show photo and additional ** */
			setTimeout(function() {
				cbMainVar.additionalWrapObject.removeClass(cbMainVar.hideClass);
				cbMainVar.imageObject.addClass(cbMainVar.visibleClass);
			}, 30);
			setTimeout(function() {
				cbMainVar.additionalWrapObject.removeClass(cbMainVar.hideAdditional);			
			}, 200);
			
			cbMainVar.imageClientHeight = cbMainVar.imageObject.prop("clientHeight");
			cbMainVar.imageClientWidth = cbMainVar.imageObject.prop("clientWidth");
			
			cbEvents.onCompleteLoad = $.Event('onCompleteLoad', { type : "onCompleteLoad", time : Date.now() });
			CBPublicMethods.customBox.trigger(cbEvents.onCompleteLoad);
		}
		
		/* *** enter full screen mode *** */
		function funcEnterFullScreen(cl_element) {
			if(!cbMainVar.enteredFullScreen && (cl_element.requestFullscreen || cl_element.mozRequestFullScreen || cl_element.webkitRequestFullscreen || cl_element.msRequestFullscreen)) {
				if(cl_element.requestFullscreen) {
					cl_element.requestFullscreen();
		  		} else if(cl_element.mozRequestFullScreen) {
		  			cl_element.mozRequestFullScreen();
			  	} else if(cl_element.webkitRequestFullscreen) {
			  		cl_element.webkitRequestFullscreen();
			  	} else if(cl_element.msRequestFullscreen) {
			  		cl_element.msRequestFullscreen();
			  	}
		
				cbMainVar.fullScreenBtn.addClass(cbMainVar.hideClass);
				cbMainVar.exitFullBtn.removeClass(cbMainVar.hideClass);		
				cbMainVar.enteredFullScreen = true;
				
				cbEvents.onEnterFScren = $.Event('onEnterFullScreen', { type : "onEnterFullScreen", time : Date.now() });
				CBPublicMethods.customBox.trigger(cbEvents.onEnterFScren);
			}
		}
		
		/* *** exit full screen mode *** */
		function funcExitFullScreen() {
			if(cbMainVar.enteredFullScreen) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.msExitFullscreen) {
			   		document.msExitFullscreen();
				} else if (document.mozCancelFullScreen) {
			   		document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
			   		document.webkitExitFullscreen();
				}
		
				cbMainVar.exitFullBtn.addClass(cbMainVar.hideClass);
				cbMainVar.fullScreenBtn.removeClass(cbMainVar.hideClass);		
				cbMainVar.enteredFullScreen = false;
				
				cbEvents.onExitFScren = $.Event('onExitFullScreen', { type : "onExitFullScreen", time : Date.now() });
				CBPublicMethods.customBox.trigger(cbEvents.onExitFScren);
			}
		}
		
		/* *** reset buttons *** */
		function funcResetButtons() {
			cbMainVar.imageObject.removeAttr("style");
			CBPublicMethods.customBox.addClass(cbMainVar.hideClass).addClass(cbMainVar.animationClassOpen);
			cbMainVar.imageObject.removeClass(cbMainVar.visibleClass);
			cbMainVar.imageWrapObject.removeAttr("style");
			cbMainVar.customboxWrap.removeAttr("style");
			cbMainVar.spinnerObject.removeClass(cbMainVar.hideClass);
			cbMainVar.nextBtn.removeClass(cbMainVar.hideClass);
			cbMainVar.previousBtn.removeClass(cbMainVar.hideClass);
			if(document.webkitIsFullScreen != undefined || document.mozFullScreen != undefined || document.msFullscreenEnabled != undefined || document.fullScreenEnabled != undefined) {
				cbMainVar.fullScreenBtn.removeClass(cbMainVar.hideClass);
				cbMainVar.exitFullBtn.addClass(cbMainVar.hideClass);
			}		
			cbMainVar.escapePressed = true;
		}
		
		/* *** zoom photo *** */
		function funcZoomPhoto(cl_event_zoom, cl_touch_ratio, cl_zoom_direction) {
			var cl_transition_timeout,
				cl_natural_img_width = cbMainVar.imageObject.prop("naturalWidth"),
				cl_client_img_width = cbMainVar.imageObject.prop("clientWidth"),
				cl_ratio_between = cl_natural_img_width / cl_client_img_width,
				cl_windowW = $(window).innerWidth(),
				cl_windowH = $(window).innerHeight(),
				cl_scale;
			
			if(funcCheckMobile()) {
				if(cl_event_zoom === "doubletap") {
					if(!cbMainVar.enteredDoubleTapZoom) {
						if(cl_ratio_between > 1.0) {
							cbMainVar.enteredDoubleTapZoom = true;
							cbMainVar.enteredZoom = true;
							cbMainVar.additionalWrapObject.addClass(cbMainVar.hideAdditional);
							//clearTimeout(cl_transition_timeout);
							cbMainVar.zoomedRatio = cl_ratio_between;						
							if(((cl_windowW - cl_touch_ratio[0].clientX) / cl_ratio_between) < 100 ) {
								cl_scale = "translate(-" + (cl_touch_ratio[0].clientX / cl_ratio_between) + "px," + 0 + "px)" + "scale(" + cl_ratio_between + ")";
							} else if((cl_touch_ratio.clientX * cl_ratio_between) < 150) {
								cl_scale = "translate(" + ((cl_touch_ratio[0].clientX) * cl_ratio_between) + "px," + 0 + "px)" + "scale(" + cl_ratio_between + ")";
							} else {
								cl_scale = "translate(" + 0 + "px," + 0 + "px)" + "scale(" + cl_ratio_between + ")";
							}
							//cl_scale = "scale(" + cl_ratio_between + ")";
							cbMainVar.imageObject.css({
								"transition" : "transform 0.3s ease-in-out",
								"transform" : cl_scale
							});
						}
					} else {
						cbMainVar.enteredDoubleTapZoom = false;
						cbMainVar.enteredZoom = false;
						cbMainVar.additionalWrapObject.removeClass(cbMainVar.hideAdditional);
						cbMainVar.zoomedRatio = 1;
						cbMainVar.imageObject.css({
							"transition" : "transform 0.3s ease-in-out, opacity 0.7s ease-in-out",
							"transform" : "scale(1)"
						});
					}
				} else if(cl_event_zoom === "pinch") {
					if(cl_zoom_direction === "in") {
						if((cbMainVar.previousPinchEnter + 1) < cl_touch_ratio) {
							cbMainVar.previousPinchEnter = cl_touch_ratio;
							if((cbMainVar.zoomedRatio + 0.015) <= cl_ratio_between) {
								cbMainVar.enteredZoom = true;
								cbMainVar.zoomedRatio += 0.015;
								if(cbMainVar.imageObject.css("transition").indexOf("transform") !== -1) {
									cbMainVar.imageObject.css("transition", "");
								}
								cl_scale = "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
								cbMainVar.imageObject.css({
									"transform" : cl_scale
								});
								cbMainVar.additionalWrapObject.addClass(cbMainVar.hideAdditional);						
							}
						}
					} else if(cl_zoom_direction === "out") {
						cbMainVar.enteredZoom = true;
						cbMainVar.previousPinchEnter = cl_touch_ratio;
						cbMainVar.imageObject.removeAttr("style");
						if((cbMainVar.zoomedRatio - 0.015) > 1.0) {
							cbMainVar.zoomedRatio -= 0.015;
							cbMainVar.additionalWrapObject.addClass(cbMainVar.hideAdditional);
							cl_scale = "scale(" + cbMainVar.zoomedRatio + ")";
							cbMainVar.imageObject.css({
								"transform" : cl_scale
							});
						} else {
							cbMainVar.enteredZoom = false;
							cbMainVar.imageObject.removeAttr("style");
							cbMainVar.zoomedRatio = 1;
							cbMainVar.additionalWrapObject.removeClass(cbMainVar.hideAdditional);
						}
					}
				}
			}
		}
		
		/* *** move image *** */
		function funcMoveImage(cl_move_direction, cl_alternative_move) {	
			var cl_scale;
			if(cbMainVar.imageObject.css("transition").indexOf("transform") !== -1) {
				cbMainVar.imageObject.css("transition", "");
			}
			
			switch(cl_move_direction) {
				case "left":
					if((cbMainVar.moveCoordX - cbMainVar.fixPxMove) > -(((cbMainVar.imageClientWidth * cbMainVar.zoomedRatio - cbMainVar.windowWidth) / 2) + 150)) {
						switch(cl_alternative_move) {
							case "up":
								cbMainVar.moveCoordX -= cbMainVar.fixPxMove;
								cbMainVar.moveCoordY -= cbMainVar.fixPxMove;
								cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
								cbMainVar.imageObject.css({
									"transform" : cl_scale
								});	
								break;
							case "down":
								cbMainVar.moveCoordX -= cbMainVar.fixPxMove;
								cbMainVar.moveCoordY += cbMainVar.fixPxMove;
								cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
								cbMainVar.imageObject.css({
									"transform" : cl_scale
								});	
								break;
							default:
								cbMainVar.moveCoordX -= cbMainVar.fixPxMove;
								cbMainVar.moveCoordY = cbMainVar.moveCoordY;
								cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
								cbMainVar.imageObject.css({
									"transform" : cl_scale
								});	
								break;
						}
					}
					break;
				case "right":
					if((cbMainVar.moveCoordX + cbMainVar.fixPxMove) < (((cbMainVar.imageClientWidth * cbMainVar.zoomedRatio - cbMainVar.windowWidth) / 2) + 150)) {
						switch(cl_alternative_move) {
							case "up":
								cbMainVar.moveCoordX += cbMainVar.fixPxMove;
								cbMainVar.moveCoordY -= cbMainVar.fixPxMove;
								cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
								cbMainVar.imageObject.css({
									"transform" : cl_scale
								});	
								break;
							case "down":
								cbMainVar.moveCoordX += cbMainVar.fixPxMove;
								cbMainVar.moveCoordY += cbMainVar.fixPxMove;
								cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
								cbMainVar.imageObject.css({
									"transform" : cl_scale
								});	
								break;
							default:
								cbMainVar.moveCoordX += cbMainVar.fixPxMove;
								cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
								cbMainVar.imageObject.css({
									"transform" : cl_scale
								});	
								break;
						}
					}
					break;
				case "up":
					if(cbMainVar.windowHeight > (cbMainVar.imageClientHeight * cbMainVar.zoomedRatio)) {
						if((cbMainVar.moveCoordY - cbMainVar.fixPxMove) > -130) {
							switch(cl_alternative_move) {
								case "left":
									cbMainVar.moveCoordX -= cbMainVar.fixPxMove;
									cbMainVar.moveCoordY -= cbMainVar.fixPxMove;
									cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
									cbMainVar.imageObject.css({
										"transform" : cl_scale
									});
									break;
								case "right":
									cbMainVar.moveCoordX += cbMainVar.fixPxMove;
									cbMainVar.moveCoordY -= cbMainVar.fixPxMove;
									cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
									cbMainVar.imageObject.css({
										"transform" : cl_scale
									});
									break;
								default:
									cbMainVar.moveCoordY -= cbMainVar.fixPxMove;
									cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
									cbMainVar.imageObject.css({
										"transform" : cl_scale
									});
									break;
							}
						}
					} else {
						if((cbMainVar.moveCoordY - cbMainVar.fixPxMove) > -((((cbMainVar.zoomedRatio * cbMainVar.imageClientHeight) - cbMainVar.imageClientHeight) / 2) + 50)) {
							switch(cl_alternative_move) {
								case "left":
									cbMainVar.moveCoordX -= cbMainVar.fixPxMove;
									cbMainVar.moveCoordY -= cbMainVar.fixPxMove;
									cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
									cbMainVar.imageObject.css({
										"transform" : cl_scale
									});
									break;
								case "right":
									cbMainVar.moveCoordX += cbMainVar.fixPxMove;
									cbMainVar.moveCoordY -= cbMainVar.fixPxMove;
									cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
									cbMainVar.imageObject.css({
										"transform" : cl_scale
									});
									break;
								default:
									cbMainVar.moveCoordY -= cbMainVar.fixPxMove;
									cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
									cbMainVar.imageObject.css({
										"transform" : cl_scale
									});
									break;
							}
						}
					}
					break;
				default:
					if(cbMainVar.windowHeight > (cbMainVar.imageClientHeight * cbMainVar.zoomedRatio)) {
						if(cbMainVar.moveCoordY + cbMainVar.fixPxMove < 130) {
							switch(cl_alternative_move) {
								case "left":
									cbMainVar.moveCoordX -= cbMainVar.fixPxMove;
									cbMainVar.moveCoordY += cbMainVar.fixPxMove;
									cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
									cbMainVar.imageObject.css({
										"transform" : cl_scale
									});
									break;
								case "right":
									cbMainVar.moveCoordX += cbMainVar.fixPxMove;
									cbMainVar.moveCoordY += cbMainVar.fixPxMove;
									cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
									cbMainVar.imageObject.css({
										"transform" : cl_scale
									});
									break;
								default:
									cbMainVar.moveCoordY += cbMainVar.fixPxMove;
									cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
									cbMainVar.imageObject.css({
										"transform" : cl_scale
									});
									break;
							}
						}
					} else {
						if(cbMainVar.moveCoordY + cbMainVar.fixPxMove < (((cbMainVar.zoomedRatio * cbMainVar.imageClientHeight) - cbMainVar.imageClientHeight) / 2) + 130) {
							switch(cl_alternative_move) {
								case "left":
									cbMainVar.moveCoordX -= cbMainVar.fixPxMove;
									cbMainVar.moveCoordY += cbMainVar.fixPxMove;
									cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
									cbMainVar.imageObject.css({
										"transform" : cl_scale
									});
									break;
								case "right":
									cbMainVar.moveCoordX += cbMainVar.fixPxMove;
									cbMainVar.moveCoordY += cbMainVar.fixPxMove;
									cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
									cbMainVar.imageObject.css({
										"transform" : cl_scale
									});
									break;
								default:
									cbMainVar.moveCoordY += cbMainVar.fixPxMove;
									cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
									cbMainVar.imageObject.css({
										"transform" : cl_scale
									});
									break;
							}
						}
					}
			}	
		
			if(Math.abs(cbMainVar.moveCoordX) > (((cbMainVar.imageClientWidth * cbMainVar.zoomedRatio) - cbMainVar.windowWidth) / 3) || Math.abs(cbMainVar.moveCoordY) > Math.abs(((cbMainVar.imageClientHeight * cbMainVar.zoomedRatio) - cbMainVar.windowHeight) / 4)) {
				cbMainVar.fixPxMove = 3;
			} else {
				cbMainVar.fixPxMove = 2;
			}
		}
		
		/* *** zoom image *** */
		function funcPinchZoom(e) {
			var cl_dist = Math.sqrt((e[0].pageX-e[1].pageX) * (e[0].pageX-e[1].pageX) + (e[0].pageY-e[1].pageY) * (e[0].pageY-e[1].pageY)),
				cl_direction;
			if(cbHelpVar.scaling) {
				if((cbHelpVar.lastDistance + 0.5) < cl_dist) {
					cl_direction = "in";
					cbHelpVar.lastDistance = cl_dist;
				} 
				if((cbHelpVar.lastDistance - 0.5) > cl_dist) {
					cl_direction = "out";
					cbHelpVar.lastDistance = cl_dist;
				}
				
				funcZoomPhoto("pinch", cl_dist, cl_direction);
			}
		}
		
		/* *** helper move image *** */
		function funcMoveHelper(cl_touchX, cl_touchY) {
			if(cbMainVar.zoomedRatio > 1) {
				if((cbMainVar.previousCoordinates[0] + 1) < cl_touchX) { // right move
					if((cbMainVar.previousCoordinates[1] + 1) < cl_touchY) { 
						funcMoveImage("right", "down"); // right down
					} else if((cbMainVar.previousCoordinates[1] - 1) > cl_touchY) { 
						funcMoveImage("right", "up");	// right up
					} else { 
						funcMoveImage("right", "none");  // right only
					}
					cbMainVar.moveEntered = true;		
					cbMainVar.previousCoordinates[0] = cl_touchX;
					cbMainVar.previousCoordinates[1] = cl_touchY;
				} 
				if((cbMainVar.previousCoordinates[0] - 1) > cl_touchX) { // left move
					if((cbMainVar.previousCoordinates[1] + 1) < cl_touchY) { 
						funcMoveImage("left", "down"); // left down
					} else if((cbMainVar.previousCoordinates[1] - 1) > cl_touchY) { // left up
						funcMoveImage("left", "up"); // left up	
					} else { 	
						funcMoveImage("left", "none"); // left only			
					}
					cbMainVar.moveEntered = true;
					cbMainVar.previousCoordinates[0] = cl_touchX;
					cbMainVar.previousCoordinates[1] = cl_touchY;
				}
				if((cbMainVar.previousCoordinates[1] - 1) > cl_touchY) { // up move
					if((cbMainVar.previousCoordinates[0] - 1) > cl_touchX) { 		
						funcMoveImage("up", "left"); // up left				
					} else if((cbMainVar.previousCoordinates[0] + 1) < cl_touchX) { 	
						funcMoveImage("up", "right");  // up right	
					} else { 
						funcMoveImage("up", "none"); // up only				
					}
					cbMainVar.moveEntered = true;		
					cbMainVar.previousCoordinates[0] = cl_touchX;
					cbMainVar.previousCoordinates[1] = cl_touchY;
				} 
				if((cbMainVar.previousCoordinates[1] + 1) < cl_touchY) { // down
					if((cbMainVar.previousCoordinates[0] - 1) > cl_touchX) { 		
						funcMoveImage("down", "left");	// down left
					} else if((cbMainVar.previousCoordinates[0] + 1) < cl_touchX) { 
						funcMoveImage("down", "right");	// down right				
					} else {
						funcMoveImage("down", "none"); // down only	
					}
					cbMainVar.moveEntered = true;			
					cbMainVar.previousCoordinates[0] = cl_touchX;
					cbMainVar.previousCoordinates[1] = cl_touchY;
				}
			}
		}
		
		/* *** detect swipe *** */
		function funcDetectSwipe(cl_touchStart, cl_touchEnd, cl_timeStart, cl_timeEnd) {
			var cl_swipedir,
				cl_distance,
				cl_distX = cl_touchStart[0] - cl_touchEnd[0],
				cl_distY = cl_touchStart[1] - cl_touchEnd[1];
		    if ((cl_timeEnd - cl_timeStart) <= cbHelpVar.allowedTime){
		        if (Math.abs(cl_distX) >= cbHelpVar.threshold && Math.abs(cl_distY) <= cbHelpVar.restraint){
		        	cl_distance = Math.abs(cl_distX);
		        	cl_swipedir = (cl_distX < 0) ? 'right' : 'left'
		            
		            if(cbMainVar.currentSlides.length > 1) {	
		            	cl_swipedir === "left" ? CBPublicMethods.nextPrevious("next") : CBPublicMethods.nextPrevious("previous")	
		            }
		        }
		        else if (Math.abs(cl_distY) >= cbHelpVar.threshold && Math.abs(cl_distX) <= cbHelpVar.restraint){
		        	cl_distance = Math.abs(cl_distY);
		        	cl_swipedir = (cl_distY < 0) ? 'down' : 'up'
		        }
		    }
		}
		
		/* *** Attach event listeners *** */
		function funcAttachEventListeners() {
			/* **** ATTACH TOUCH EVENET LISTENERS **** */
			/* *** touchstart event listener *** */
			cbMainVar.imageObject.on('touchstart', function(e) {
				cbHelpVar.startTime = new Date().getTime();
				if(cbMainVar.checkedMobile) {
					var cl_local_touch = e.originalEvent.touches || e.originalEvent.changedTouches;
					if(cl_local_touch.length === 1) {
						if((Date.now() - cbHelpVar.doubleTapTime) < 250) {
							funcZoomPhoto("doubletap", cl_local_touch);
						}
						cbHelpVar.doubleTapTime = Date.now();
					    cbMainVar.previousCoordinates[0] = cbHelpVar.coordStartSwipe[0] = cbHelpVar.touchEndCoord[0] = cl_local_touch[0].pageX;
						cbMainVar.previousCoordinates[1] = cbHelpVar.coordStartSwipe[1] = cbHelpVar.touchEndCoord[1] = cl_local_touch[0].pageY;
					} else if(cl_local_touch.length === 2) {
					    cbHelpVar.scaling = true;
					}
				}
			});
			
			/* *** touchmove event listener *** */
			cbMainVar.imageObject.on('touchmove', function(e) {
				if(cbMainVar.checkedMobile) {
					e.preventDefault();
				    var cl_local_touch = e.originalEvent.touches || e.originalEvent.changedTouches;	    
					if(cl_local_touch.length === 1) {
						funcMoveHelper(cl_local_touch[0].pageX, cl_local_touch[0].pageY);
						cbHelpVar.touchEndCoord[0] = cl_local_touch[0].pageX;
						cbHelpVar.touchEndCoord[1] = cl_local_touch[0].pageY;
						cbHelpVar.detectOneTouch = true;
					} else if(cl_local_touch.length === 2) {
						funcPinchZoom(cl_local_touch);
						cbHelpVar.detectOneTouch = false;
					}
				}
			});
			
			/* *** touchend event listener *** */
			cbMainVar.imageObject.on('touchend', function(e) {
				var cl_coordX,
					cl_coordY,
					cl_scale;
				cbHelpVar.endTime = new Date().getTime();
				if(cbMainVar.checkedMobile) {
					var winWidth = $(window).innerWidth(),
						winHeight = $(window).innerHeight(),
						cl_flag_x = false,
						cl_flag_y = false,
						touchEnd = e.originalEvent.touches || e.originalEvent.changedTouches;
					
					if(cbMainVar.moveEntered && (cbMainVar.zoomedRatio > 1.1)) {
						cl_coordX = (((cbMainVar.imageObject.prop("clientWidth") * cbMainVar.zoomedRatio) - winWidth) / 2) + 2;			
						cl_coordY = ((cbMainVar.zoomedRatio * cbMainVar.imageObject.prop("clientHeight")) - cbMainVar.imageObject.prop("clientHeight")) / 2;
						
						if(cbMainVar.moveCoordX < (-cl_coordX)) {
							cbMainVar.moveCoordX = -cl_coordX;
							cl_flag_x = true;
						} else if(cbMainVar.moveCoordX > cl_coordX) {
							cbMainVar.moveCoordX = cl_coordX;
							cl_flag_x = true;
						}
						
						if((cbMainVar.imageObject.prop("clientHeight") * cbMainVar.zoomedRatio) > winHeight) {
							if(cbMainVar.moveCoordY > (cl_coordY - cbMainVar.topPosition)) {
								cbMainVar.moveCoordY = cl_coordY - cbMainVar.topPosition;
								cl_flag_y = true;
							} else if(cbMainVar.moveCoordY < (-(cl_coordY - cbMainVar.topPosition - 40))) {
								cbMainVar.moveCoordY = -(cl_coordY - cbMainVar.topPosition - 40);
								cl_flag_y = true;
							}
						} else {
							cbMainVar.moveCoordY = 20;
							cl_flag_y = true;
						}
						
						if(cl_flag_x || cl_flag_y) {
							cl_scale = "translate3d(" + cbMainVar.moveCoordX + "px," + cbMainVar.moveCoordY + "px,0)" + "scale(" + cbMainVar.zoomedRatio + "," + cbMainVar.zoomedRatio + ")";
							cbMainVar.imageObject.css({
								"transition" : "transform 0.3s ease-in-out",
								"transform" : cl_scale
							});				
						}
						
						if(cbHelpVar.scaling) {
						    cbHelpVar.scaling = false;
						}
						
						if(cbMainVar.moveEntered) {
							cbMainVar.moveEntered = false;
						}
					} else if(cbHelpVar.detectOneTouch) {
						funcDetectSwipe(cbHelpVar.coordStartSwipe, cbHelpVar.touchEndCoord, cbHelpVar.startTime, cbHelpVar.endTime);
					}
				}
			});
			
			/* **** ATTACH CLICK EVENT LISTENERS **** */	
			/* *** open button click and call function for open custom custombox, get sources, total slides and current slide *** */
			cbMainVar.openCustombox.on('click', function() {		
				cbMainVar.currentSlides = $(this).parents(cbMainVar.sourceParent).find(cbMainVar.getAllSlides);
				funcOpenCustomCustombox($(this).parents(cbMainVar.sourceParent).find(cbMainVar.openCurrentImage), cbMainVar.currentSlides);
			});
			
			/* *** previous button click call function for next/previous photo *** */
			cbMainVar.previousBtn.on('click', function() {
				CBPublicMethods.nextPrevious("previous");
			});
			
			/* *** next button click call function for next/previous photo *** */
			cbMainVar.nextBtn.on('click', function() {
				CBPublicMethods.nextPrevious("next");
			});
			
			/* *** close button click and call function for closing custom custombox *** */
			cbMainVar.closeCustombox.on('click', function() {
				funcCloseCustomCustombox();
			});
			
			/* *** overlay click and call function for closing custom custombox *** */
			cbMainVar.overlayElement.on('click', function(ev) {
				if(cbMainVar.overlayClickClose && cbMainVar.overlayElement.is(ev.target)) {
					funcCloseCustomCustombox();
				}
			});
			
			/* *** fullscreen button click and call function for entering fullscreen *** */
			cbMainVar.fullScreenBtn.on('click', function() {
				funcEnterFullScreen(document.getElementById(CBPublicMethods.customBox.attr("id")));
			});
			
			/* *** exit fullscreen button click and call function for closing fullscreen *** */
			cbMainVar.exitFullBtn.on('click', function() {
				funcExitFullScreen(CBPublicMethods.customBox);
			});
			
			/* *** attached image load event listener on image load *** */	
			cbMainVar.imageObject.on('load', function() {	
				funcAfterImageLoad();		
			});
			
			/* **** attached keyup event listener for next/previous photo or exit custom custombox **** */
			cbMainVar.documentProperty.on('keyup', function(e) {
				if (CBPublicMethods.customBox.hasClass(cbMainVar.activeCustomBox)) {
					var cl_code = e.keyCode || e.which;
					if (cl_code === 27 && cbMainVar.escapePressed) {
						funcCloseCustomCustombox();
						cbMainVar.escapePressed = false;
					}
					if (cl_code === 37 && !cbMainVar.onlyOneSlide) {
						CBPublicMethods.nextPrevious("previous");
					}
					if (cl_code === 39 && !cbMainVar.onlyOneSlide) {
						CBPublicMethods.nextPrevious("next");
					}
				}
			});
		
			/* **** attached orientationchange event listener on window **** */
			cbMainVar.windowProperty.on('orientationchange', function() {
				if(CBPublicMethods.customBox.hasClass(cbMainVar.activeCustomBox)) {
					if(cbMainVar.imageObject.css("transform").indexOf("scale") !== -1){
						cbMainVar.imageObject.removeAttr("style");
					}
					
					cbMainVar.windowWidth = $(window).innerWidth();
					cbMainVar.windowHeight = $(window).innerHeight();
				}
			});
		
			/* **** attached resize event listener on window **** */
			cbMainVar.windowProperty.on('resize', function() {
				if(CBPublicMethods.customBox.hasClass(cbMainVar.activeCustomBox)) {
					
					var cl_dimensions = funcCalculateDimensionsReturn(cbMainVar.imageObject.prop("naturalWidth"), cbMainVar.imageObject.prop("naturalHeight"));
					
					cbMainVar.customboxWrap.css({
						"top" : cl_dimensions[2]
					});
					
					cbMainVar.imageWrapObject.css({
						"width" : cl_dimensions[0],
						"height" : cl_dimensions[1]
					});	
				}
			});
		}
		
		/* ***** PUBLIC METHODS FOR CUSTOM BOX ***** */
		/* **** trigger open **** */
		CBPublicMethods.openCustomBox = function(openObj) {
			if(!cbMainVar.enteredCarousel) {
				if(typeof(openObj) === "object") {
					cbMainVar.currentSlides = openObj.allSlidesObject;
					funcOpenCustomCustombox(openObj.currentImageObject, cbMainVar.currentSlides);
				} else {
					cbMainVar.currentSlides = $(cbMainVar.getAllSlides);
					funcOpenCustomCustombox($(cbMainVar.openCurrentImage), cbMainVar.currentSlides);
				}
				return true;
			} else {
				return false;
			}
		}
		
		/* **** trigger close **** */
		CBPublicMethods.closeCustomBox = function() {
			if (cbMainVar.enteredCarousel) {
				funcCloseCustomCustombox();
				return true;
			} else {
				return false;
			}
		}
		
		/* ** ajax helper on open if isAjax = true ** */
		CBPublicMethods.openCBoxAjax = function(cBoxOpenObj) {
			if(!cbMainVar.enteredCarousel && cbMainVar.isAjax && typeof(cBoxOpenObj) === "object") {
				/* ** get number of slides, current and all ** */
				cbMainVar.currentImageNo = parseInt(cBoxOpenObj.index);
				cbMainVar.imageSrc = cBoxOpenObj.src;
				cbMainVar.currentLoadedImage = cBoxOpenObj.element;
				cbMainVar.imageAltAttr = cBoxOpenObj.altAttr;
				cbMainVar.totalSlides = parseInt(cBoxOpenObj.numberSlides);
				
				if(typeof(cbMainVar.imageAltAttr) !== "undefined") {
					cbMainVar.customBoxCaption.html(cbMainVar.imageAltAttr);
					cbMainVar.imageObject.attr("alt", cbMainVar.imageAltAttr);
				} else {
					cbMainVar.customBoxCaption.html(" ");
					cbMainVar.imageObject.attr("alt", " ");
				}
				
				/* ** check if total slides number is 1 and hide next prev ** */
				if(cbMainVar.totalSlides === 1) {
					cbMainVar.nextBtn.addClass(cbMainVar.hideClass);
					cbMainVar.previousBtn.addClass(cbMainVar.hideClass);
					cbMainVar.onlyOneSlide = true;
				}
				
				/* ** set additional info ** */
				cbMainVar.additionalWrapObject.addClass(cbMainVar.hideAdditional);
				cbMainVar.customBoxNumber.html("Image " + cbMainVar.currentImageNo + " of " + cbMainVar.totalSlides);
				
				return true;
			} else {
				return false;
			}
		}
		
		/* **** call next previous image **** */	
		CBPublicMethods.nextPrevious = function(cbNextPrevParam) {
			if(cbMainVar.enteredCarousel && (cbNextPrevParam === "next" || cbNextPrevParam === "previous")) {
				funcNextPrevious(cbNextPrevParam);
				return true;
			} else {
				return false;
			}				
		}
		
		/* **** ajax parameters on next previous image if isAjax = true **** */
		CBPublicMethods.ajaxNextPrev = function(nexPrevObj) {
			if(cbMainVar.enteredCarousel && cbMainVar.isAjax) {
				cbMainVar.imageSrc = nexPrevObj.src;
				cbMainVar.currentImageNo = parseInt(nexPrevObj.imageIndex);			
				
				/* ** get alt attribute if exist and set additional ** */
				if ( typeof (nexPrevObj.altAttr) != "undefined") {
					cbMainVar.imageAltAttr = nexPrevObj.altAttr;
					cbMainVar.customBoxCaption.html(cbMainVar.imageAltAttr);
					cbMainVar.imageObject.attr("alt", cbMainVar.imageAltAttr);
				} else {
					cbMainVar.customBoxCaption.html(" ");
					cbMainVar.imageObject.attr("alt", " ");
				}	
				cbMainVar.additionalWrapObject.addClass(cbMainVar.hideClass).addClass(cbMainVar.hideAdditional);
				cbMainVar.customBoxNumber.html("Image " + cbMainVar.currentImageNo + " of " + cbMainVar.totalSlides);
				cbMainVar.imageObject.removeClass(cbMainVar.visibleClass);
				cbMainVar.imageObject.attr("src", " ");
				return true;
			} else {
				return false;
			}
		}
		
		/* **** destroy custom box html and destroy objects **** */
		CBPublicMethods.removeCBox = function() {
			CBPublicMethods.customBox.remove();
			cbMainVar.bodyProperty.removeClass(cbMainVar.fixedBodyOverflow);
			window.scrollTo(0,cbMainVar.scrollTop);
			funcDetachEventListeners();
			cbEvents = {};
			CBPublicMethods = {};
			return true;
		}
		
		/* **** CALL INITIALIZATION CUSTOM BOX **** */
		/* call check full screen availability */
		cbMainVar.fullScreenAvailable = funcCheckFullScreen();
		subInitCustomBox(GlInitObj);
		return true;
	} else {
		console.log("Custom Box initialized.");
		return false;
	}
}

$(document).ready(function(){	
	
	InitCustomBox({
		customBoxID : $("#Goran"),
		isAjax : false
	});
	
	/*
	CBPublicMethods.customBox.on('onOpenStartEvent', function(param) {		
		
		CBPublicMethods.openCBoxAjax(({
			index : 1,
			src : "https://amazingslider.com/wp-content/uploads/2012/12/dandelion.jpg",
			element: $(".highlightsWrapper.insidePages"),
			altAttr : "neznam jas, soznam jas",
			numberSlides : 9
		}));
		
		console.log("open start: ", param.time);		
	});
	
	CBPublicMethods.customBox.on('onOpenFinishedEvent', function(param) {
		console.log("open finished: ", param.time);
	});
	
	CBPublicMethods.customBox.on('onCloseStartEvent', function(param) {		
		console.log("close start: ", param.time);
	});
	
	CBPublicMethods.customBox.on('onCloseFinishedEvent', function(param) {
		console.log("close finished: ", param.time);
	});
	
	CBPublicMethods.customBox.on('onNextEvent', function(param) {		
		CBPublicMethods.ajaxNextPrev({
			src : "https://media.8ch.net/hdi8/src/1444400648042.jpg",
			imageIndex : 2,
			altAttr: "nesto novo next"
		})
		console.log("next: ", param.time);
	});
	
	CBPublicMethods.customBox.on('onPreviousEvent', function(param) {		
		CBPublicMethods.ajaxNextPrev({
			src : "https://amazingslider.com/wp-content/uploads/2012/12/dandelion.jpg",
			imageIndex : 1,
			altAttr: "nesto novo prevs"
		})
		console.log("previous: ", param.time);
	});
	
	CBPublicMethods.customBox.on('onStartLoad', function(param) {
		console.log("start-image-loading:", param.time);
	});
	
	CBPublicMethods.customBox.on('onCompleteLoad', function(param) {
		console.log("finished-image-loading:", param.time);
	});
	
	CBPublicMethods.customBox.on('onEnterFullScreen', function(param) {
		console.log("enter-full-screen:", param.time);
	});
	
	CBPublicMethods.customBox.on('onExitFullScreen', function(param) {
		console.log("exit-full-screen:", param.time);
	});
	*/
	
});