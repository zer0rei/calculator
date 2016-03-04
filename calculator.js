$(document).ready(function() {
	// Layout
	var calcTop = ($(window).height() - $("#calculator").height()) / 2;
	var calcLeft = ($(window).width() - $("#calculator").width()) / 2;
	if (calcTop > 0) {
		$("#calculator").css("top", calcTop);
	}
	if (calcLeft > 0) {
		$("#calculator").css("left", calcLeft);
	}

	// Logic
});
