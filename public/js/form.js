/* 
Orginal Page: http://thecodeplayer.com/walkthrough/jquery-multi-step-form-with-progress-bar 
 */

$(document).ready(function() {
//jQuery time
var current_fs = 1; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

    function xa_animate (i, d) {
        if(animating) return false;
	animating = true;
        var j = i + d;

        console.log ('i', i, 'j', j)
	//activate next step on progressbar using the index of dest
	$("#progressbar li").eq(j - 1).addClass("active");
        $("#progressbar li").eq(j).removeClass("active");

        var dest = $('.fieldset-' + j);
        var orig = $('.fieldset-' + i);

	//show the next fieldset
	dest.show();
	//hide the current fieldset with style
	orig.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of orig reduces to 0 - stored in "now"
			//1. scale orig down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring dest from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of dest to 1 as it moves in
			opacity = 1 - now;
			orig.css({'transform': 'scale('+scale+')'});
			dest.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			orig.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});

        current_fs += d;
        return true;
    }

    window.next = function next () {
        return xa_animate (current_fs, 1);
    };

    function previous () {
        return xa_animate (current_fs, -1);
    };

    $(".next").click(next);
    $(".previous").click(previous);

    $('#email-button').click(function() {
        // Setup html5 version
        $("#uploader").pluploadQueue({
	// General settings
        runtimes : 'html5,flash,silverlight,html4',

            url: 'upload/' + $("#email").val(),
//            url: 'upload',

	max_file_size : '10mb',
	chunks : {
	    size: '1mb',
	    send_chunk_number: false // set this to true, to send chunk and total chunk numbers instead of offset and total bytes
	},
	rename : true,
   	dragdrop: true,
	filters : [
	    {title : "Image files", extensions : "jpg,gif,png,jpeg"},
	    {title : "Zip files", extensions : "zip"}
	],

	// Resize images on clientside if we can
	// resize : {width : 320, height : 240, quality : 90},

	flash_swf_url : 'http://rawgithub.com/moxiecode/moxie/master/bin/flash/Moxie.cdn.swf',
	silverlight_xap_url : 'http://rawgithub.com/moxiecode/moxie/master/bin/silverlight/Moxie.cdn.xap'
    });

    // for the life of me I don't understand why this is needed, but it
    // doesn't work otherwise, oh js dev…
    var uploader = $("#uploader").pluploadQueue();

    $(".upload-button").click(function() {
        uploader.start();
    });

    uploader.bind('UploadComplete', function() {
        window.next();
    });

    uploader.bind('Error', function() {
        alert ("error");
    });

    window.next();
    });

});
