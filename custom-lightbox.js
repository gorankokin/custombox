/* ***** START - custom lightbox ***** */
function Init_customLightbox(cl_lightboxObject) {
	'use strict';
	var cl_flagTrue = true,
		cl_flagFalse = true,
		cl_enteredCarousel = true,
		cl_enteredFullScreen = true,
		cl_escapeEnter = true,
		cl_currentImageNo,
		cl_imageSrc,
		cl_currentSlides,
		cl_currentLoadedImage,
		cl_scrollTop = 0,
		cl_timeoutOpen,
		cl_timeoutClose,
		cl_tapCount = 0,
		cl_top_position = 0,
		cl_enteredZoom = false,
		cl_onlyOneSlide = false,
		cl_move_entered = false,
		cl_fix_px_move = 2,
		cl_previous_coordinates = [],
		cl_enteredDoubleTapZoom = false,
		cl_Zoomed_ratio = 1,
		cl_move_coord_x = 0,
		cl_move_coord_y = 0,
		cl_previousPinchEnter = 0,
		cl_checked_mobile = false,
		cl_source,
		cl_image_client_height,
		cl_image_client_width,
		cl_window_width = $(window).innerWidth(),
		cl_window_height = $(window).innerHeight(),
		cl_border_image = "cl_border_image",
		cl_openCurrentImage,
		cl_getAllSlides,
		cl_activeCustomBox,
		cl_hideClass,
		cl_animationClassOpen,
		cl_animationClassOpenSmall,
		cl_animationVerticalPhoto,
		cl_animationClassClose,
		cl_visibleClass,
		cl_align_center,
		cl_additional_box,
		cl_hideAdditional,
		cl_fixedBodyOverflow,
		cl_lightbox,
		cl_lightboxWrap,
		cl_overlay,
		cl_image,
		cl_imageWrap,
		cl_spinner,
		cl_spinner_src,
		cl_spinnerWrap,
		cl_additionalWrap,
		cl_customBoxCaption,
		cl_customBoxNumber,
		cl_openLightbox,
		cl_closeLighbox,
		cl_nextBtn,
		cl_previousBtn,
		cl_fullScreenBtn,
		cl_exitFullBtn,
		cl_max_image_width = 1280,
		cl_max_image_height = 720,
		cl_custom_html_builder = "";
	
	if(typeof(cl_lightboxObject) === "object") {
		function init_events_object() {
			cl_lightbox = $(cl_lightbox.selector);
			cl_overlay = $(cl_overlay.selector);
			cl_lightboxWrap = $(cl_lightboxWrap.selector);
			cl_spinnerWrap = $(cl_spinnerWrap.selector);
			cl_spinner = $(cl_spinner.selector);
			cl_imageWrap = $(cl_imageWrap.selector);
			cl_previousBtn = $(cl_previousBtn.selector);
			cl_nextBtn = $(cl_nextBtn.selector);
			cl_additionalWrap = $(cl_additionalWrap.selector);
			cl_customBoxCaption = $(cl_customBoxCaption.selector);
			cl_customBoxNumber = $(cl_customBoxNumber.selector);
			cl_fullScreenBtn = $(cl_fullScreenBtn.selector);
			cl_exitFullBtn = $(cl_exitFullBtn.selector);	
			cl_closeLighbox = $(cl_closeLighbox.selector);
			cl_image = $(cl_image.selector);
			cl_openLightbox = $(cl_openLightbox.selector);
		}
		if(cl_lightboxObject.hasOwnProperty("cl_lightbox")) {
			cl_lightbox = $(cl_lightboxObject.cl_lightbox.selector);
			cl_custom_html_builder += "<div id='" + cl_lightboxObject.cl_lightbox.selector.replace(/[#.]/g,"") + "' class='cl_custom_box ";
		} else {
			cl_custom_html_builder += "<div id='artLightbox' class='cl_custom_box ";
			cl_lightbox = $("#artLightbox");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_animationClassOpen")) {
			cl_animationClassOpen = cl_lightboxObject.cl_animationClassOpen.selector.replace(/[#.]/g,"");
			cl_custom_html_builder += cl_lightboxObject.cl_animationClassOpen.selector.replace(/[#.]/g,"") + " ";
		} else {
			cl_custom_html_builder += "cl_animation ";
			cl_animationClassOpen = "cl_animation";
		}
		if(cl_lightboxObject.hasOwnProperty("cl_hideClass")) {
			cl_hideClass = cl_lightboxObject.cl_hideClass.selector.replace(/[#.]/g,"");
			cl_custom_html_builder += cl_lightboxObject.cl_hideClass.selector.replace(/[#.]/g,"") + "'><div class='";
		} else {
			cl_custom_html_builder += "cl_hidden'><div class='";
			cl_hideClass = "cl_hidden";
		}
		if(cl_lightboxObject.hasOwnProperty("cl_overlay")) {
			cl_overlay = $(cl_lightboxObject.cl_overlay);
			cl_custom_html_builder += cl_lightboxObject.cl_overlay.selector.replace(/[#.]/g,"") + "'></div><div class='";
		} else {
			cl_custom_html_builder += "cl_overlay_box'></div><div class='";
			cl_overlay = $(".cl_overlay_box");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_lightboxWrap")) {
			cl_lightboxWrap = $(cl_lightboxObject.cl_lightboxWrap);
			cl_custom_html_builder += cl_lightboxObject.cl_lightboxWrap.selector.replace(/[#.]/g,"") + "'><div class='";
		} else {
			cl_custom_html_builder += "cl_custom_box_wrap'><div class='";
			cl_lightboxWrap = $(".cl_custom_box_wrap");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_spinnerWrap")) {
			cl_spinnerWrap = $(cl_lightboxObject.cl_spinnerWrap);
			cl_custom_html_builder += cl_lightboxObject.cl_spinnerWrap.selector.replace(/[#.]/g,"") + " " + cl_hideClass + "'><img class='";
		} else {
			cl_custom_html_builder += "cl_loading_spinner cl_hidden'><img class='";
			cl_spinnerWrap = $(".cl_loading_spinner");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_spinner")) {
			cl_spinner = $(cl_lightboxObject.cl_spinner);
			cl_custom_html_builder += cl_lightboxObject.cl_spinner.selector.replace(/[#.]/g,"") + "' src='";
		} else {
			cl_custom_html_builder += "cl_spinner_gif' src='";
			cl_spinner = $(".cl_spinner_gif");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_spinner_src")) {
			cl_spinner_src = cl_lightboxObject.cl_spinner_src;
			cl_custom_html_builder += cl_lightboxObject.cl_spinner_src + "' /></div><div class='";
		} else {
			cl_spinner_src = site_url_global + "/adria/img/spinnerLoading.gif";
			cl_custom_html_builder += cl_spinner_src + "' /></div><div class='";
		}
		if(cl_lightboxObject.hasOwnProperty("cl_imageWrap")) {
			cl_imageWrap = $(cl_lightboxObject.cl_imageWrap);
			cl_custom_html_builder += cl_lightboxObject.cl_imageWrap.selector.replace(/[#.]/g,"") + "'><div class='";
		} else {
			cl_custom_html_builder += "cl_image_box_wrap'><div class='";
			cl_imageWrap = $(".cl_image_box_wrap");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_previousBtn")) {
			cl_previousBtn = $(cl_lightboxObject.cl_previousBtn);
			cl_custom_html_builder += cl_lightboxObject.cl_previousBtn.selector.replace(/[#.]/g,"") + "'></div><div class='";
		} else {
			cl_custom_html_builder += "cl_previous_image'></div><div class='";
			cl_previousBtn = $(".cl_previous_image");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_nextBtn")) {
			cl_nextBtn = $(cl_lightboxObject.cl_nextBtn);
			cl_custom_html_builder += cl_lightboxObject.cl_nextBtn.selector.replace(/[#.]/g,"") + "'></div><div class='";
		} else {
			cl_custom_html_builder += "cl_next_image'></div><div class='";
			cl_nextBtn = $(".cl_next_image");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_additional_box")) {
			cl_additional_box = cl_lightboxObject.cl_additional_box.selector.replace(/[#.]/g,"");
			cl_custom_html_builder += cl_lightboxObject.cl_additional_box.selector.replace(/[#.]/g,"") + "'><div class='";
		} else {
			cl_custom_html_builder += "cl_additional_box'><div class='";
			cl_additional_box = "cl_additional_box";
		}
		if(cl_lightboxObject.hasOwnProperty("cl_additionalWrap")) {
			cl_additionalWrap = $(cl_lightboxObject.cl_additionalWrap);
			cl_custom_html_builder += cl_lightboxObject.cl_additionalWrap.selector.replace(/[#.]/g,"") + " ";
		} else {
			cl_custom_html_builder += "cl_additional_wrap_box ";
			cl_additionalWrap = $(".cl_additional_wrap_box");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_hideAdditional")) {
			cl_hideAdditional = cl_lightboxObject.cl_hideAdditional.selector.replace(/[#.]/g,"");
			cl_custom_html_builder += cl_lightboxObject.cl_hideAdditional.selector.replace(/[#.]/g,"") + "'><span class='";
		} else {
			cl_custom_html_builder += "cl_hide_additional_box'><span class='";
			cl_hideAdditional = "cl_hide_additional_box";
		}
		if(cl_lightboxObject.hasOwnProperty("cl_customBoxCaption")) {
			cl_customBoxCaption = $(cl_lightboxObject.cl_customBoxCaption);
			cl_custom_html_builder += cl_lightboxObject.cl_customBoxCaption.selector.replace(/[#.]/g,"") + "'></span><span class='";
		} else {
			cl_custom_html_builder += "cl_caption_box'></span><span class='";
			cl_customBoxCaption = $(".cl_caption_box");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_customBoxNumber")) {
			cl_customBoxNumber = $(cl_lightboxObject.cl_customBoxNumber);
			cl_custom_html_builder += cl_lightboxObject.cl_customBoxNumber.selector.replace(/[#.]/g,"") + "'></span><div class='";
		} else {
			cl_custom_html_builder += "cl_number_box'></span><div class='";
			cl_customBoxNumber = $(".cl_number_box");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_fullScreenBtn")) {
			cl_fullScreenBtn = $(cl_lightboxObject.cl_fullScreenBtn);
			cl_custom_html_builder += cl_lightboxObject.cl_fullScreenBtn.selector.replace(/[#.]/g,"") + "'></div><div class='";
		} else {
			cl_custom_html_builder += "cl_enter_full_screen'></div><div class='";
			cl_fullScreenBtn = $(".cl_enter_full_screen");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_exitFullBtn")) {
			cl_exitFullBtn = $(cl_lightboxObject.cl_exitFullBtn);
			cl_custom_html_builder += cl_lightboxObject.cl_exitFullBtn.selector.replace(/[#.]/g,"") + " " + cl_hideClass + "'></div><div class='";
		} else {
			cl_custom_html_builder += "cl_exit_full_screen cl_hidden'></div><div class='";
			cl_exitFullBtn = $(".cl_exit_full_screen");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_closeLighbox")) {
			cl_closeLighbox = $(cl_lightboxObject.cl_closeLighbox);
			cl_custom_html_builder += cl_lightboxObject.cl_closeLighbox.selector.replace(/[#.]/g,"") + "'></div></div></div><img class='";
		} else {
			cl_custom_html_builder += "cl_close_custom_box'></div></div></div><img class='";
			cl_closeLighbox = $(".cl_close_custom_box");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_image_source")) {
			cl_image = $(cl_lightboxObject.cl_image_source);
			cl_custom_html_builder += cl_lightboxObject.cl_image_source.selector.replace(/[#.]/g,"") + "' src='' alt='' /></div></div></div>";
		} else {
			cl_custom_html_builder += "cl_image_source' src='' alt='' /></div></div></div>";
			cl_image = $(".cl_image_source");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_source")) {
			cl_source = cl_lightboxObject.cl_source.selector;
		} else {
			cl_source = ".cl_sources";
		}
		if(cl_lightboxObject.hasOwnProperty("cl_openCurrentImage")) {
			cl_openCurrentImage = cl_lightboxObject.cl_openCurrentImage;
		} else {
			cl_openCurrentImage = ".cl_sources-slide.active img";
		}
		if(cl_lightboxObject.hasOwnProperty("cl_getAllSlides")) {
			cl_getAllSlides = cl_lightboxObject.cl_getAllSlides.selector;
		} else {
			cl_getAllSlides = ".cl_sources-slide";
		}		
		if(cl_lightboxObject.hasOwnProperty("cl_align_center")) {
			cl_align_center = cl_lightboxObject.cl_align_center;
		} else {
			cl_align_center = "cl_align_center";
		}		
		if(cl_lightboxObject.hasOwnProperty("cl_openLightbox")) {
			cl_openLightbox = $(cl_lightboxObject.cl_openLightbox.selector);
		} else {
			cl_openLightbox = $(".cl_open_box");
		}
		if(cl_lightboxObject.hasOwnProperty("cl_fixedBodyOverflow")) {
			cl_fixedBodyOverflow = cl_lightboxObject.cl_fixedBodyOverflow;
		} else {
			cl_fixedBodyOverflow = "cl_overflow_body";
		}
		if(cl_lightboxObject.hasOwnProperty("cl_animationClassOpenSmall")) {
			cl_animationClassOpenSmall = cl_lightboxObject.cl_animationClassOpenSmall;
		} else {
			cl_animationClassOpenSmall = "cl_animation_small";
		}
		if(cl_lightboxObject.hasOwnProperty("cl_animationVerticalPhoto")) {
			cl_animationVerticalPhoto = cl_lightboxObject.cl_animationVerticalPhoto;
		} else {
			cl_animationVerticalPhoto = "cl_animation_vertical_photo";
		}
		if(cl_lightboxObject.hasOwnProperty("cl_animationClassClose")) {
			cl_animationClassClose = cl_lightboxObject.cl_animationClassClose;
		} else {
			cl_animationClassClose = "cl_animation_close";
		}
		if(cl_lightboxObject.hasOwnProperty("cl_visibleClass")) {
			cl_visibleClass = cl_lightboxObject.cl_visibleClass;
		} else {
			cl_visibleClass = "cl_visible";
		}
		if(cl_lightboxObject.hasOwnProperty("cl_activeCustomBox")) {
			cl_activeCustomBox = cl_lightboxObject.cl_activeCustomBox;
		} else {
			cl_activeCustomBox = "cl_active";
		}
		if(cl_lightboxObject.hasOwnProperty("cl_max_image_width")) {
			cl_max_image_width = cl_lightboxObject.cl_max_image_width;
		}
		if(cl_lightboxObject.hasOwnProperty("cl_max_image_height")) {
			cl_max_image_height = cl_lightboxObject.cl_max_image_height;
		}
		
		$.when($("body").append(cl_custom_html_builder)).then(init_events_object());
		
	} else {
		function init_events_default() {
			cl_lightbox = $("#artLightbox");
			cl_overlay = $(".cl_overlay_box");
			cl_lightboxWrap = $(".cl_custom_box_wrap");
			cl_spinnerWrap = $(".cl_loading_spinner");
			cl_spinner = $(".cl_spinner_gif");
			cl_imageWrap = $(".cl_image_box_wrap");
			cl_previousBtn = $(".cl_previous_image");
			cl_nextBtn = $(".cl_next_image");
			cl_additionalWrap = $(".cl_additional_wrap_box");
			cl_customBoxCaption = $(".cl_caption_box");
			cl_customBoxNumber = $(".cl_number_box");
			cl_fullScreenBtn = $(".cl_enter_full_screen");
			cl_exitFullBtn = $(".cl_exit_full_screen");	
			cl_closeLighbox = $(".cl_close_custom_box");
			cl_image = $(".cl_image_source");
			cl_openLightbox = $(".cl_open_box");	
		}
		
		cl_animationClassOpen = "cl_animation";
		cl_hideClass = "cl_hidden";
		cl_spinner_src = site_url_global + "/adria/img/spinnerLoading.gif";
		cl_additional_box = "cl_additional_box";
		cl_hideAdditional = "cl_hide_additional_box";		
		cl_source = ".cl_sources";
		cl_getAllSlides = ".cl_sources-slide";
		cl_openCurrentImage = ".cl_sources-slide.active img";
		cl_activeCustomBox = "cl_active";
		cl_animationClassOpenSmall = "cl_animation_small";
		cl_animationVerticalPhoto = "cl_animation_vertical_photo";
		cl_animationClassClose = "cl_animation_close";
		cl_visibleClass = "cl_visible";
		cl_align_center = "cl_align_center";
		cl_fixedBodyOverflow = "cl_overflow_body";
		cl_max_image_width = 800;
		cl_max_image_height = 600;
		
		
		cl_custom_html_builder = "<div id='artLightbox' class='cl_custom_box cl_animation cl_hidden'><div class='cl_overlay_box'></div><div class='cl_custom_box_wrap'><div class='cl_loading_spinner cl_hidden'><img class='cl_spinner_gif' src='" + cl_spinner_src + "' /></div><div class='cl_image_box_wrap'><div class='cl_previous_image'></div><div class='cl_next_image'></div><div class='cl_additional_box'><div class='cl_additional_wrap_box cl_hide_additional_box'><span class='cl_caption_box'></span><span class='cl_number_box'></span><div class='cl_enter_full_screen'></div><div class='cl_exit_full_screen cl_hidden'></div><div class='cl_close_custom_box'></div></div></div><img class='cl_image_source' src=' ' alt=' ' /></div></div></div>";
		$.when($("body").append(cl_custom_html_builder)).then(init_events_default());			
	}
	
	cl_openLightbox.click(function() {		
		func_openCustomLightbox($(this).parents(cl_source).find(cl_openCurrentImage), $(this).parents(cl_source).find(cl_getAllSlides));
		cl_currentSlides = $(this).parents(cl_source).find(cl_getAllSlides);
	});
	
	function func_check_full_screen() {
		if(document.webkitIsFullScreen === undefined && document.mozFullScreen === undefined && document.msFullscreenEnabled === undefined && document.fullScreenEnabled === undefined) {
			return false;
		} else {
			return true;
		}
	}	

	/* *** check if is it mobile *** */
	function func_check_mobile() {
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
			return true;
		} else {
			return false;
		}
	}

	/* *** calculate resize and return back [0]=width [1]=height [2]=top [3]=left *** */
	function func_calculate_dimensions_return(cl_imageW, cl_imageH) {
		var cl_calculated_dim = [],
			cl_calcImageH,
			cl_calcImageW,
			cl_screenW = $(window).innerWidth(),
			cl_screenH = $(window).innerHeight(),
			cl_ratioCurrentMaxValues = cl_max_image_height / cl_max_image_width,
			cl_ratioCurrentScreen = cl_screenH / cl_screenW,
			cl_ratioCurrentImage = cl_imageH / cl_imageW;
		
		
		function recalc_helper_one() {
			if(cl_max_image_width >= (cl_screenW - 20)) {
				if((cl_screenW - 20) >= cl_imageW) {
					cl_calculated_dim[0] = cl_imageW;
					cl_calculated_dim[1] = cl_imageH;
					cl_calculated_dim[2] = Math.round((cl_screenH - cl_imageH) / 2) - 20;
					cl_calculated_dim[3] = Math.round((cl_screenW - cl_imageW) / 2);
				} else {
					cl_calcImageH = Math.round((cl_screenW - 20) * cl_ratioCurrentImage);
					cl_calculated_dim[0] = cl_screenW - 20;
					cl_calculated_dim[1] = cl_calcImageH;
					cl_calculated_dim[2] = Math.round((cl_screenH - cl_calcImageH) / 2) - 20;
					cl_calculated_dim[3] = 10;
				}
			} else {
				if(cl_max_image_width >= cl_imageW) {
					cl_calculated_dim[0] = cl_imageW;
					cl_calculated_dim[1] = cl_imageH;
					cl_calculated_dim[2] = Math.round((cl_screenH - cl_imageH) / 2) - 20;
					cl_calculated_dim[3] = Math.round((cl_screenW - cl_imageW) / 2);
				} else {
					cl_calcImageH = Math.round(cl_max_image_width * cl_ratioCurrentImage);
					cl_calculated_dim[0] = cl_max_image_width;
					cl_calculated_dim[1] = cl_calcImageH;
					cl_calculated_dim[2] = Math.round((cl_screenH - cl_calcImageH) / 2) - 20;
					cl_calculated_dim[3] = Math.round((cl_screenW - cl_max_image_width) / 2);
				}
			}
		}
		
		function recalc_helper_two() {
			if(cl_max_image_width >= (cl_screenW - 20)) {
				if((cl_screenW - 20) >= cl_imageW) {
					cl_calcImageW = Math.round((cl_screenH - 60) / cl_ratioCurrentImage);
					cl_calculated_dim[0] = cl_calcImageW;
					cl_calculated_dim[1] = cl_screenH - 60;
					cl_calculated_dim[2] = 10;
					cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
				} else {
					cl_calcImageH = Math.round((cl_screenW - 20) * cl_ratioCurrentImage);
					if(cl_calcImageH > (cl_screenH - 60)) {
						cl_calcImageW = Math.round((cl_screenH - 60) / cl_ratioCurrentImage);
						cl_calculated_dim[0] = cl_calcImageW;
						cl_calculated_dim[1] = cl_screenH - 60;
						cl_calculated_dim[2] = 10;
						cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
					} else {
						cl_calculated_dim[0] = cl_screenW - 20;
						cl_calculated_dim[1] = cl_calcImageH;
						cl_calculated_dim[2] = Math.round((cl_screenH - cl_calcImageH) / 2) - 20;
						cl_calculated_dim[3] = 10;
					}
				}
			} else {
				if(cl_max_image_width >= cl_imageW) {
					cl_calcImageW = Math.round((cl_screenH - 60) / cl_ratioCurrentImage);
					cl_calculated_dim[0] = cl_calcImageW;
					cl_calculated_dim[1] = cl_screenH - 60;
					cl_calculated_dim[2] = 10;
					cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
				} else {
					cl_calcImageH = Math.round(cl_max_image_width * cl_ratioCurrentImage);
					if(cl_calcImageH > (cl_screenH - 60)) {
						cl_calcImageW = Math.round((cl_screenH - 60) / cl_ratioCurrentImage);
						cl_calculated_dim[0] = cl_calcImageW;
						cl_calculated_dim[1] = cl_screenH - 60;
						cl_calculated_dim[2] = 10;
						cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
					} else {
						cl_calculated_dim[0] = cl_max_image_width;
						cl_calculated_dim[1] = cl_calcImageH;
						cl_calculated_dim[2] = Math.round((cl_screenH - cl_calcImageH) / 2) - 20;
						cl_calculated_dim[3] = Math.round((cl_screenW - cl_max_image_width) / 2);
					}
				}
			}
		}
		
		function recalc_helper_three() {
			if(cl_max_image_width >= (cl_screenW - 20)) {
				if((cl_screenW - 20) >= cl_imageW) {
					cl_calcImageW = Math.round(cl_max_image_height / cl_ratioCurrentImage);
					cl_calculated_dim[0] = cl_calcImageW;
					cl_calculated_dim[1] = cl_max_image_height;
					cl_calculated_dim[2] = Math.round((cl_screenH - cl_max_image_height) / 2) - 20;
					cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
				} else {
					cl_calcImageH = Math.round((cl_screenW - 20) * cl_ratioCurrentImage);
					if(cl_calcImageH > cl_max_image_height) {
						cl_calcImageW = Math.round(cl_max_image_height / cl_ratioCurrentImage);
						cl_calculated_dim[0] = cl_calcImageW;
						cl_calculated_dim[1] = cl_max_image_height;
						cl_calculated_dim[2] = Math.round((cl_screenH - cl_max_image_height) / 2) - 20;
						cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
					} else {
						cl_calculated_dim[0] = cl_screenW - 20;
						cl_calculated_dim[1] = cl_calcImageH;
						cl_calculated_dim[2] = Math.round((cl_screenH - cl_calcImageH) / 2) - 20;
						cl_calculated_dim[3] = 10;
					}
				}
			} else {
				if(cl_max_image_width >= cl_imageW) {
					cl_calcImageW = Math.round(cl_max_image_height / cl_ratioCurrentImage);
					cl_calculated_dim[0] = cl_calcImageW;
					cl_calculated_dim[1] = cl_max_image_height;
					cl_calculated_dim[2] = Math.round((cl_screenH - cl_max_image_height) / 2) - 20;
					cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
				} else {
					cl_calcImageH = Math.round(cl_max_image_width * cl_ratioCurrentImage);
					if(cl_calcImageH > cl_max_image_height) {
						cl_calcImageW = Math.round(cl_max_image_height / cl_ratioCurrentImage);
						cl_calculated_dim[0] = cl_calcImageW;
						cl_calculated_dim[1] = cl_max_image_height;
						cl_calculated_dim[2] = Math.round((cl_screenH - cl_max_image_height) / 2) - 20;
						cl_calculated_dim[3] = Math.round((cl_screenW - cl_calcImageW) / 2);
					} else {
						cl_calculated_dim[0] = cl_max_image_width;
						cl_calculated_dim[1] = cl_calcImageH;
						cl_calculated_dim[2] = Math.round((cl_screenH - cl_calcImageH) / 2) - 20;
						cl_calculated_dim[3] = Math.round((cl_screenW - cl_max_image_width) / 2);
					}
				}
			}
		}
		
		
		if(cl_max_image_height >= (cl_screenH - 60)) {
			if((cl_screenH - 60) >= cl_imageH) {
				recalc_helper_one();
			} else {
				recalc_helper_two();
			}
		} else {
			if(cl_max_image_height >= cl_imageH) {
				recalc_helper_one();
			} else {
				recalc_helper_three();
			}
		}
		
		cl_top_position = cl_calculated_dim[2];
		return cl_calculated_dim;
	}

	/* *** open customLightbox from highlights *** */
	function func_openCustomLightbox(cl_imageActive, cl_totalSlides) {
		var cl_imageSrc = 0,
			cl_imageAlt = " ",
			cl_windowW = $(window).width(),
			cl_windowH = $(window).height(),
			cl_spinnerSrc = cl_spinner.attr("src");
			
		if (cl_enteredCarousel) {						
			cl_enteredCarousel = false;
			clearTimeout(cl_timeoutClose);
			
			/* ** check is if mobile ** */
			if(func_check_mobile()) {
				cl_previousBtn.addClass(cl_hideClass);
				cl_nextBtn.addClass(cl_hideClass);
				cl_checked_mobile = true;
			}
			
			/* ** get number of slides, current and all ** */
			cl_currentImageNo = cl_imageActive.parents(cl_getAllSlides).index();
			cl_imageSrc = cl_imageActive.attr("data-src");
			cl_currentLoadedImage = cl_imageActive.parent();
			
			/* ** if is it small screen add class for small animation ** */
			if(cl_windowW < 992) {
				cl_lightbox.addClass(cl_animationClassOpenSmall);
			}
			
			/* ** check if is it alt attribute on image ** */
			if ( typeof (cl_imageActive.attr("alt")) != "undefined") {
				cl_imageAlt = cl_imageActive.attr("alt");
				cl_customBoxCaption.html(cl_imageAlt);
				cl_image.attr("alt", cl_imageAlt);
			} else {
				cl_customBoxCaption.html(" ");
				cl_image.attr("alt", " ");
			}
			
			/* ** check if total slides number is 1 and hide next prev ** */
			if(cl_totalSlides.length === 1) {
				cl_nextBtn.addClass(cl_hideClass);
				cl_previousBtn.addClass(cl_hideClass);
				cl_onlyOneSlide = true;
			}
			
			/* ** body fixed and scroll to current ** */
			cl_additionalWrap.addClass(cl_hideAdditional);
			cl_customBoxNumber.html("Image " + (cl_currentImageNo + 1) + " of " + cl_totalSlides.length);
			cl_scrollTop = $(window).scrollTop();
			window.scrollTo(0,0);
			$("body").addClass(cl_fixedBodyOverflow).css("top", -cl_scrollTop);
			cl_lightbox.removeClass(cl_hideClass);	
			cl_lightbox.css({
				"opacity" : 0.4
			});
			
			/* ** call resize first start ** */
			cl_lightboxWrap.css({
				"top" : (cl_imageActive.parent().offset().top - $(window).scrollTop()),
				"left" : cl_imageActive.parent().offset().left
			});
			cl_imageWrap.css({
				"width" : cl_imageActive.parent().prop("clientWidth"),
				"height" : cl_imageActive.parent().prop("clientHeight")
			});
			if((cl_imageActive.prop("clientHeight") / cl_imageActive.prop("clientWidth")) > 1.0) {
				cl_lightbox.addClass(cl_animationVerticalPhoto);
			}
			setTimeout(function() {
				var	cl_dimensions = func_calculate_dimensions_return(cl_imageActive.prop("naturalWidth"), cl_imageActive.prop("naturalHeight"));
				cl_lightboxWrap.css({
					"top" : cl_dimensions[2],
					"left" : cl_dimensions[3]
				});
				cl_imageWrap.css({
					"width" : cl_dimensions[0],
					"height" : cl_dimensions[1]
				});
			}, 10);
			
			/* ** spinner load ** */
			cl_spinnerWrap.removeClass(cl_hideClass);
			cl_spinner.attr("src", " ");
			setTimeout(function() {
				cl_lightbox.addClass(cl_activeCustomBox);
				cl_spinner.attr("src", cl_spinnerSrc);
			}, 10);		
			
			/* ** helper for hiddenTopMenu ** */
			$("header .topMenu").addClass("notVisible");
			
			/* ** call load image func ** */
			setTimeout(function() {
				func_loadImageDone(cl_imageSrc, true);
			}, 200);			
			cl_timeoutOpen = setTimeout(function(){
				cl_lightbox.removeClass(cl_animationClassOpen).removeClass(cl_animationClassOpenSmall).removeClass(cl_animationVerticalPhoto).addClass(cl_border_image);
				cl_lightbox.removeAttr("style");
			}, 770);
		}
	}

	/* *** close customLightbox *** */
	function func_closeCustomLightbox() {
		if (!cl_enteredCarousel) {
			cl_enteredCarousel = true;
			clearTimeout(cl_timeoutOpen);
			
			cl_lightboxWrap.css({
				"left" : cl_lightboxWrap.offset().left
			});
			cl_lightbox.removeClass("cl_align_center").removeClass(cl_border_image);
			
			/* ** allow body and scroll to current ** */
			$("body").removeClass(cl_fixedBodyOverflow);
			window.scrollTo(0,cl_scrollTop);
			
			/* ** position custom box for where it open ** */
			cl_additionalWrap.addClass(cl_hideClass);
			cl_lightbox.removeClass(cl_activeCustomBox).addClass(cl_animationClassOpen).addClass(cl_animationClassClose);
			cl_lightbox.removeAttr("style");
			cl_image.removeAttr("style").css({
				"transition" : "transform 0.5s ease-in-out",
				"transform" : "transform scale(1)"
			})
			cl_lightboxWrap.css({
				"top": (cl_currentLoadedImage.offset().top - $(window).scrollTop()),
				"left" : cl_currentLoadedImage.offset().left
			});
			cl_imageWrap.css({
				"width": cl_currentLoadedImage.prop("clientWidth"),
				"height": cl_currentLoadedImage.prop("clientHeight")
			});			
			
			/* ** call all custom box reset after transitions ends ** */
			cl_timeoutClose = setTimeout(function() {
				cl_image.attr({"src":" ", "alt":" "});
				func_resetButtons();
				func_exitFullScreen();
				cl_additionalWrap.removeClass(cl_hideClass);
				cl_lightbox.removeClass(cl_animationClassClose);
			}, 770);
			
			/* ** helper for hiddenTopMenu ** */
			$("header .topMenu").removeClass("notVisible");
		}
	}

	/* *** next previous customLightbox *** */
	function func_nextPrev(cl_paramsNexPrev) {
		var cl_imageAlt,
			cl_spinnerSrc = cl_spinner.attr("src"),
			cl_numberOfSlides = cl_currentSlides.length;
		
		/* ** check what is it next of previous ** */
		if (cl_paramsNexPrev === "previous") {
			if (cl_currentImageNo === 0) {
				cl_currentImageNo = cl_numberOfSlides - 1;
			} else {
				cl_currentImageNo -= 1;
			}
		} else {
			if (cl_currentImageNo === (cl_numberOfSlides - 1)) {
				cl_currentImageNo = 0;
			} else {
				cl_currentImageNo += 1;
			}
		}
		
		/* ** set src of photo ** */
		cl_imageSrc = cl_currentSlides.eq(cl_currentImageNo).find("img").attr("data-src");
		
		/* ** get alt attribute if exist and set additional ** */
		if ( typeof (cl_currentSlides.eq(cl_currentImageNo).find("img").attr("alt")) != "undefined") {
			cl_imageAlt = cl_currentSlides.eq(cl_currentImageNo).find("img").attr("alt");
			cl_customBoxCaption.html(cl_imageAlt);
			cl_image.attr("alt", cl_imageAlt);
		} else {
			cl_image.html(" ");
			cl_image.attr("alt", " ");
		}	
		cl_additionalWrap.addClass(cl_hideClass).addClass(cl_hideAdditional);
		cl_customBoxNumber.html("Image " + (cl_currentImageNo + 1) + " of " + cl_numberOfSlides);
		cl_image.removeClass(cl_visibleClass);
		cl_image.attr("src", " ");
		
		/* ** call image load and show spinner loading ** */
		setTimeout(function() {
			cl_image.addClass(cl_hideClass);
			cl_spinner.attr("src", cl_spinnerSrc);
			cl_spinnerWrap.removeClass(cl_hideClass);
			func_loadImageDone(cl_imageSrc, false);
		}, 10);
	}

	/* *** event listener on image load *** */
	function func_loadImageDone(cl_imageSrc, cl_param_helper) {			
		cl_image.attr("src", cl_imageSrc).on('load', function() {	
			
			/* ** hide spinner on finished load ** */
			cl_spinnerWrap.addClass(cl_hideClass);
			setTimeout(function() {
				cl_image.removeClass(cl_hideClass);
			}, 5);
			
			/* ** get and set dimensions image "true = first start, false = every other load" ** */
			var cl_dimensions = func_calculate_dimensions_return(cl_image.prop('naturalWidth'), cl_image.prop('naturalHeight'));		
			if(!cl_param_helper) {			
				cl_lightboxWrap.css({
					"top" : cl_dimensions[2]
				});
				cl_imageWrap.css({
					"width" : cl_dimensions[0],
					"height" : cl_dimensions[1]
				});			
			} else {			
				cl_lightboxWrap.removeAttr("style");
				cl_lightbox.addClass("cl_align_center");			
				cl_lightboxWrap.css({
					"top" : cl_dimensions[2]
				});
				cl_imageWrap.css({
					"width" : cl_dimensions[0],
					"height" : cl_dimensions[1]
				});
			}
			
			/* ** show photo and additional ** */
			setTimeout(function() {
				cl_additionalWrap.removeClass(cl_hideClass);
				cl_image.addClass(cl_visibleClass);
			}, 30);
			setTimeout(function() {
				cl_additionalWrap.removeClass(cl_hideAdditional);			
			}, 200);
			
			cl_image_client_height = cl_image.prop("clientHeight");
			cl_image_client_width = cl_image.prop("clientWidth");
		});
	}

	/* *** enter full screen mode *** */
	function func_enterFullScreen(cl_element) {
		if(cl_enteredFullScreen) {
			if(cl_element.requestFullscreen) {
				cl_element.requestFullscreen();
	  		} else if(cl_element.mozRequestFullScreen) {
	  			cl_element.mozRequestFullScreen();
		  	} else if(cl_element.webkitRequestFullscreen) {
		  		cl_element.webkitRequestFullscreen();
		  	} else if(cl_element.msRequestFullscreen) {
		  		cl_element.msRequestFullscreen();
		  	}
			cl_enteredFullScreen = false;
		}
	}

	/* *** exit full screen mode *** */
	function func_exitFullScreen() {
		if(!cl_enteredFullScreen) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
		   		document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
		   		document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
		   		document.webkitExitFullscreen();
			}
			cl_enteredFullScreen = true;
		}
	}

	/* *** reset buttons *** */
	function func_resetButtons() {
		cl_image.removeAttr("style");
		cl_lightbox.addClass(cl_hideClass).addClass(cl_animationClassOpen);
		cl_image.removeClass(cl_visibleClass);
		cl_imageWrap.removeAttr("style");
		cl_lightboxWrap.removeAttr("style");
		cl_spinner.removeClass(cl_hideClass);
		cl_nextBtn.removeClass(cl_hideClass);
		cl_previousBtn.removeClass(cl_hideClass);
		if(document.webkitIsFullScreen != undefined || document.mozFullScreen != undefined || document.msFullscreenEnabled != undefined || document.fullScreenEnabled != undefined) {
			cl_fullScreenBtn.removeClass(cl_hideClass);
			cl_exitFullBtn.addClass(cl_hideClass);
		}		
		cl_escapeEnter = true;
	}

	/* *** zoom photo *** */
	function func_zoomPhoto(cl_event_zoom, cl_zoom_ratio, cl_zoom_direction) {
		var cl_transition_timeout,
			cl_natural_img_width = cl_image.prop("naturalWidth"),
			cl_client_img_width = cl_image.prop("clientWidth"),
			cl_ratio_between = cl_natural_img_width / cl_client_img_width,
			cl_windowW = $(window).innerWidth(),
			cl_windowH = $(window).innerHeight(),
			cl_scale;
		
		if(func_check_mobile()) {
			if(cl_event_zoom === "doubletap") {
				if(!cl_enteredDoubleTapZoom) {
					if(cl_ratio_between > 1.0) {
						cl_enteredDoubleTapZoom = true;
						cl_enteredZoom = true;
						cl_additionalWrap.addClass(cl_hideAdditional);
						//clearTimeout(cl_transition_timeout);
						cl_Zoomed_ratio = cl_ratio_between;						
						if(((cl_windowW - cl_zoom_ratio[0].clientX) / cl_ratio_between) < 100 ) {
							cl_scale = "translate(-" + (cl_zoom_ratio[0].clientX / cl_ratio_between) + "px," + 0 + "px)" + "scale(" + cl_ratio_between + ")";
						} else if((cl_zoom_ratio.clientX * cl_ratio_between) < 150) {
							cl_scale = "translate(" + ((cl_zoom_ratio[0].clientX) * cl_ratio_between) + "px," + 0 + "px)" + "scale(" + cl_ratio_between + ")";
						} else {
							cl_scale = "translate(" + 0 + "px," + 0 + "px)" + "scale(" + cl_ratio_between + ")";
						}
						cl_image.css({
							"transition" : "transform 0.3s ease-in-out",
							"transform" : cl_scale
						});
					}
				} else {
					cl_enteredDoubleTapZoom = false;
					cl_enteredZoom = false;
					cl_additionalWrap.removeClass(cl_hideAdditional);
					cl_Zoomed_ratio = 1;
					cl_image.css({
						"transition" : "transform 0.3s ease-in-out, opacity 0.7s ease-in-out",
						"transform" : "scale(1)"
					});
				}
			} else if(cl_event_zoom === "pinch") {
				if(cl_zoom_direction === "in") {
					if((cl_previousPinchEnter + 1) < cl_zoom_ratio) {
						cl_previousPinchEnter = cl_zoom_ratio;
						if((cl_Zoomed_ratio + 0.015) <= cl_ratio_between) {
							cl_enteredZoom = true;
							cl_Zoomed_ratio += 0.015;
							if(cl_image.css("transition").indexOf("transform") !== -1) {
								cl_image.css("transition", "");
							}
							cl_scale = "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
							cl_image.css({
								"transform" : cl_scale
							});
							cl_additionalWrap.addClass(cl_hideAdditional);						
						}
					}
				} else if(cl_zoom_direction === "out") {
					cl_enteredZoom = true;
					cl_previousPinchEnter = cl_zoom_ratio;
					cl_image.removeAttr("style");
					if((cl_Zoomed_ratio - 0.015) > 1.0) {
						cl_Zoomed_ratio -= 0.015;
						cl_additionalWrap.addClass(cl_hideAdditional);
						cl_scale = "scale(" + cl_Zoomed_ratio + ")";
						cl_image.css({
							"transform" : cl_scale
						});
					} else {
						cl_enteredZoom = false;
						cl_image.removeAttr("style");
						cl_Zoomed_ratio = 1;
						cl_additionalWrap.removeClass(cl_hideAdditional);
					}
				}
			}
		}
	}

	cl_move_coord_x = cl_image.offset().left;
	cl_move_coord_y = cl_image.offset().top;

	/* *** move image *** */
	function func_move_image(cl_move_direction, cl_alternative_move) {	
		var cl_scale;
		if(cl_image.css("transition").indexOf("transform") !== -1) {
			cl_image.css("transition", "");
		}
		
		switch(cl_move_direction) {
			case "left":
				if((cl_move_coord_x - cl_fix_px_move) > -(((cl_image_client_width * cl_Zoomed_ratio - cl_window_width) / 2) + 150)) {
					switch(cl_alternative_move) {
						case "up":
							cl_move_coord_x -= cl_fix_px_move;
							cl_move_coord_y -= cl_fix_px_move;
							cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
							cl_image.css({
								"transform" : cl_scale
							});	
							break;
						case "down":
							cl_move_coord_x -= cl_fix_px_move;
							cl_move_coord_y += cl_fix_px_move;
							cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
							cl_image.css({
								"transform" : cl_scale
							});	
							break;
						default:
							cl_move_coord_x -= cl_fix_px_move;
							cl_move_coord_y = cl_move_coord_y;
							cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
							cl_image.css({
								"transform" : cl_scale
							});	
							break;
					}
				}
				break;
			case "right":
				if((cl_move_coord_x + cl_fix_px_move) < (((cl_image_client_width * cl_Zoomed_ratio - cl_window_width) / 2) + 150)) {
					switch(cl_alternative_move) {
						case "up":
							cl_move_coord_x += cl_fix_px_move;
							cl_move_coord_y -= cl_fix_px_move;
							cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
							cl_image.css({
								"transform" : cl_scale
							});	
							break;
						case "down":
							cl_move_coord_x += cl_fix_px_move;
							cl_move_coord_y += cl_fix_px_move;
							cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
							cl_image.css({
								"transform" : cl_scale
							});	
							break;
						default:
							cl_move_coord_x += cl_fix_px_move;
							cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
							cl_image.css({
								"transform" : cl_scale
							});	
							break;
					}
				}
				break;
			case "up":
				if(cl_window_height > (cl_image_client_height * cl_Zoomed_ratio)) {
					if((cl_move_coord_y - cl_fix_px_move) > -130) {
						switch(cl_alternative_move) {
							case "left":
								cl_move_coord_x -= cl_fix_px_move;
								cl_move_coord_y -= cl_fix_px_move;
								cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
								cl_image.css({
									"transform" : cl_scale
								});
								break;
							case "right":
								cl_move_coord_x += cl_fix_px_move;
								cl_move_coord_y -= cl_fix_px_move;
								cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
								cl_image.css({
									"transform" : cl_scale
								});
								break;
							default:
								cl_move_coord_y -= cl_fix_px_move;
								cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
								cl_image.css({
									"transform" : cl_scale
								});
								break;
						}
					}
				} else {
					if((cl_move_coord_y - cl_fix_px_move) > -((((cl_Zoomed_ratio * cl_image_client_height) - cl_image_client_height) / 2) + 50)) {
						switch(cl_alternative_move) {
							case "left":
								cl_move_coord_x -= cl_fix_px_move;
								cl_move_coord_y -= cl_fix_px_move;
								cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
								cl_image.css({
									"transform" : cl_scale
								});
								break;
							case "right":
								cl_move_coord_x += cl_fix_px_move;
								cl_move_coord_y -= cl_fix_px_move;
								cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
								cl_image.css({
									"transform" : cl_scale
								});
								break;
							default:
								cl_move_coord_y -= cl_fix_px_move;
								cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
								cl_image.css({
									"transform" : cl_scale
								});
								break;
						}
					}
				}
				break;
			default:
				if(cl_window_height > (cl_image_client_height * cl_Zoomed_ratio)) {
					if(cl_move_coord_y + cl_fix_px_move < 130) {
						switch(cl_alternative_move) {
							case "left":
								cl_move_coord_x -= cl_fix_px_move;
								cl_move_coord_y += cl_fix_px_move;
								cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
								cl_image.css({
									"transform" : cl_scale
								});
								break;
							case "right":
								cl_move_coord_x += cl_fix_px_move;
								cl_move_coord_y += cl_fix_px_move;
								cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
								cl_image.css({
									"transform" : cl_scale
								});
								break;
							default:
								cl_move_coord_y += cl_fix_px_move;
								cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
								cl_image.css({
									"transform" : cl_scale
								});
								break;
						}
					}
				} else {
					if(cl_move_coord_y + cl_fix_px_move < (((cl_Zoomed_ratio * cl_image_client_height) - cl_image_client_height) / 2) + 130) {
						switch(cl_alternative_move) {
							case "left":
								cl_move_coord_x -= cl_fix_px_move;
								cl_move_coord_y += cl_fix_px_move;
								cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
								cl_image.css({
									"transform" : cl_scale
								});
								break;
							case "right":
								cl_move_coord_x += cl_fix_px_move;
								cl_move_coord_y += cl_fix_px_move;
								cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
								cl_image.css({
									"transform" : cl_scale
								});
								break;
							default:
								cl_move_coord_y += cl_fix_px_move;
								cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
								cl_image.css({
									"transform" : cl_scale
								});
								break;
						}
					}
				}
		}	

		if(Math.abs(cl_move_coord_x) > (((cl_image_client_width * cl_Zoomed_ratio) - cl_window_width) / 3) || Math.abs(cl_move_coord_y) > Math.abs(((cl_image_client_height * cl_Zoomed_ratio) - cl_window_height) / 4)) {
			cl_fix_px_move = 3;
		} else {
			cl_fix_px_move = 2;
		}
	}
	
	if(func_check_full_screen() !== true) {
		cl_fullScreenBtn.remove();
		cl_exitFullBtn.remove();
	}
	
	cl_overlay.click(function(ev) {
		if(cl_overlay.is(ev.target)) {
			func_closeCustomLightbox();
		}
	});
	cl_previousBtn.click(function() {
		func_nextPrev("previous");
	});
	cl_nextBtn.click(function() {
		func_nextPrev("next");
	});
	cl_closeLighbox.click(function() {
		func_closeCustomLightbox();
	});

	var scaling = false,
		enterPinch = false,
		enterMove = false,
		touchEndCoordinates = [],
		firstDistance = 0,
		lastDistance = 0;
		
	function pinchZoom(e) {
		var dist = Math.sqrt((e[0].pageX-e[1].pageX) * (e[0].pageX-e[1].pageX) + (e[0].pageY-e[1].pageY) * (e[0].pageY-e[1].pageY)),
			direction;
		if(scaling) {
			if((lastDistance + 0.5) < dist) {
				direction = "in";
				lastDistance = dist;
			} 
			if((lastDistance - 0.5) > dist) {
				direction = "out";
				lastDistance = dist;
			}
			
			func_zoomPhoto("pinch", dist, direction);
		}
	}

	function moveMove(touchX, touchY) {
		if(cl_Zoomed_ratio > 1) {
			if((cl_previous_coordinates[0] + 1) < touchX) { // right move
				if((cl_previous_coordinates[1] + 1) < touchY) { 
					func_move_image("right", "down"); // right down
				} else if((cl_previous_coordinates[1] - 1) > touchY) { 
					func_move_image("right", "up");	// right up
				} else { 
					func_move_image("right", "none");  // right only
				}
				cl_move_entered = true;		
				cl_previous_coordinates[0] = touchX;
				cl_previous_coordinates[1] = touchY;
			} 
			if((cl_previous_coordinates[0] - 1) > touchX) { // left move
				if((cl_previous_coordinates[1] + 1) < touchY) { 
					func_move_image("left", "down"); // left down
				} else if((cl_previous_coordinates[1] - 1) > touchY) { // left up
					func_move_image("left", "up"); // left up	
				} else { 	
					func_move_image("left", "none"); // left only			
				}
				cl_move_entered = true;
				cl_previous_coordinates[0] = touchX;
				cl_previous_coordinates[1] = touchY;
			}
			if((cl_previous_coordinates[1] - 1) > touchY) { // up move
				if((cl_previous_coordinates[0] - 1) > touchX) { 		
					func_move_image("up", "left"); // up left				
				} else if((cl_previous_coordinates[0] + 1) < touchX) { 	
					func_move_image("up", "right");  // up right	
				} else { 
					func_move_image("up", "none"); // up only				
				}
				cl_move_entered = true;		
				cl_previous_coordinates[0] = touchX;
				cl_previous_coordinates[1] = touchY;
			} 
			if((cl_previous_coordinates[1] + 1) < touchY) { // down
				if((cl_previous_coordinates[0] - 1) > touchX) { 		
					func_move_image("down", "left");	// down left
				} else if((cl_previous_coordinates[0] + 1) < touchX) { 
					func_move_image("down", "right");	// down right				
				} else {
					func_move_image("down", "none"); // down only	
				}
				cl_move_entered = true;			
				cl_previous_coordinates[0] = touchX;
				cl_previous_coordinates[1] = touchY;
			}
		}
	}

	var detectOneTouch = false,
		startTime = 0,
		endTime = 0,
		doubleTapTime = 0,
		allowedTime = 300,
		threshold = 60,
		restraint = 100,
		coordinatesStartSwipe = [];

	function detectSwipe(touchStart, touchEnd, timeStart, timeEnd) {
		var swipedir,
			distance,
			distX = touchStart[0] - touchEnd[0],
			distY = touchStart[1] - touchEnd[1];
	    if ((timeEnd - timeStart) <= allowedTime){
	        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
	        	distance = Math.abs(distX);
	            swipedir = (distX < 0) ? 'right' : 'left'
	            
	            if(cl_currentSlides.length > 1) {	
	            	swipedir === "left" ? func_nextPrev("next") : func_nextPrev("previous")	
	            }
	        }
	        else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
	        	distance = Math.abs(distY);
	            swipedir = (distY < 0) ? 'down' : 'up'
	        }
	    }
	}

	cl_image.on("touchstart", function(e) {
		startTime = new Date().getTime();
		if(cl_checked_mobile) {
			var touch = e.originalEvent.touches || e.originalEvent.changedTouches;
			if(touch.length === 1) {
				if((Date.now() - doubleTapTime) < 250) {
					func_zoomPhoto("doubletap", touch);
				}
				doubleTapTime = Date.now();
			    cl_previous_coordinates[0] = coordinatesStartSwipe[0] = touchEndCoordinates[0] = touch[0].pageX;
				cl_previous_coordinates[1] = coordinatesStartSwipe[1] = touchEndCoordinates[1] = touch[0].pageY;
			} else if(touch.length === 2) {
			    scaling = true;
			}
		}
	});

	cl_image.on("touchmove", function(e) {
		if(cl_checked_mobile) {
			e.preventDefault();
		    var touch = e.originalEvent.touches || e.originalEvent.changedTouches;	    
			if(touch.length === 1) {
				moveMove(touch[0].pageX, touch[0].pageY);
				touchEndCoordinates[0] = touch[0].pageX;
				touchEndCoordinates[1] = touch[0].pageY;
				detectOneTouch = true;
			} else if(touch.length === 2) {
				pinchZoom(touch);
				detectOneTouch = false;
			}
		}
	});

	cl_image.on("touchend", function(e) {
		var cl_coordX,
			cl_coordY,
			cl_scale;
		endTime = new Date().getTime();
		if(cl_checked_mobile) {
			var winWidth = $(window).innerWidth(),
				winHeight = $(window).innerHeight(),
				cl_flag_x = false,
				cl_flag_y = false,
				touchEnd = e.originalEvent.touches || e.originalEvent.changedTouches;
			
			if(cl_move_entered && (cl_Zoomed_ratio > 1.1)) {
				cl_coordX = (((cl_image.prop("clientWidth") * cl_Zoomed_ratio) - winWidth) / 2) + 2;			
				cl_coordY = ((cl_Zoomed_ratio * cl_image.prop("clientHeight")) - cl_image.prop("clientHeight")) / 2;
				
				if(cl_move_coord_x < (-cl_coordX)) {
					cl_move_coord_x = -cl_coordX;
					cl_flag_x = true;
				} else if(cl_move_coord_x > cl_coordX) {
					cl_move_coord_x = cl_coordX;
					cl_flag_x = true;
				}
				
				if((cl_image.prop("clientHeight") * cl_Zoomed_ratio) > winHeight) {
					if(cl_move_coord_y > (cl_coordY - cl_top_position)) {
						cl_move_coord_y = cl_coordY - cl_top_position;
						cl_flag_y = true;
					} else if(cl_move_coord_y < (-(cl_coordY - cl_top_position - 40))) {
						cl_move_coord_y = -(cl_coordY - cl_top_position - 40);
						cl_flag_y = true;
					}
				} else {
					cl_move_coord_y = 20;
					cl_flag_y = true;
				}
				
				if(cl_flag_x || cl_flag_y) {
					cl_scale = "translate3d(" + cl_move_coord_x + "px," + cl_move_coord_y + "px,0)" + "scale(" + cl_Zoomed_ratio + "," + cl_Zoomed_ratio + ")";
					cl_image.css({
						"transition" : "transform 0.3s ease-in-out",
						"transform" : cl_scale
					});				
				}
				
				if(scaling) {
				    scaling = false;
				}
				
				if(cl_move_entered) {
					cl_move_entered = false;
				}
			} else if(detectOneTouch) {
				detectSwipe(coordinatesStartSwipe, touchEndCoordinates, startTime, endTime);
			}
		}
	});

	$(document).bind('keyup', function(e) {
		if (cl_lightbox.hasClass(cl_activeCustomBox)) {
			var cl_code = e.keyCode || e.which;
			if (cl_code === 27 && cl_escapeEnter) {
				func_closeCustomLightbox();
				cl_escapeEnter = false;
			}
			if (cl_code === 37 && !cl_onlyOneSlide) {
				func_nextPrev("previous");
			}
			if (cl_code === 39 && !cl_onlyOneSlide) {
				func_nextPrev("next");
			}
		}
	});

	$(window).on('orientationchange', function() {
		if(cl_lightbox.hasClass(cl_activeCustomBox)) {
			if(cl_image.css("transform").indexOf("scale") !== -1){
				cl_image.removeAttr("style");
			}
			
			cl_window_width = $(window).innerWidth();
			cl_window_height = $(window).innerHeight();
		}
	});

	$(window).on('resize', function() {
		if(cl_lightbox.hasClass(cl_activeCustomBox)) {
			var cl_dimensions = func_calculate_dimensions_return(cl_image.prop("naturalWidth"), cl_image.prop("naturalHeight"));
			cl_lightboxWrap.css({
				"top" : cl_dimensions[2]
			});
			cl_imageWrap.css({
				"width" : cl_dimensions[0],
				"height" : cl_dimensions[1]
			});	
		}
	});

	cl_fullScreenBtn.click(function() {
		$(this).addClass(cl_hideClass);
		cl_exitFullBtn.removeClass(cl_hideClass);
		func_enterFullScreen(document.getElementById(cl_lightbox.attr("id")));
	});
	cl_exitFullBtn.click(function() {
		$(this).addClass(cl_hideClass);
		cl_fullScreenBtn.removeClass(cl_hideClass);
		func_exitFullScreen();
	});
}


$(document).ready(function(){	
	
	Init_customLightbox();
	
	/*
 	CL_CustomLightbox({
 		cl_lightbox: $("#Goran"),
 		cl_fixedBodyOverflow: "cl_overflow_bod"
 	});
	*/
});