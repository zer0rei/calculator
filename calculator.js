$(document).ready(function() {
	// Remove the 300ms delay in mobile
	$(function() {
	    FastClick.attach(document.body);
	});
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
	var process = [];
	var isNumber = false;
	var ans = "";
	// printers
	function printExp() {
		var textarea = $("#expression textarea");
		textarea.val(process.join(""));
		textarea.scrollTop(textarea[0].scrollHeight);
	}
	function printAns(answer) {
		$("#answer p").html(answer);
	}

	// When clicked
	$(".number").click(function() {
		process.push($(this).html());
		printExp();
		printAns("");
		isNumber = true;
	});

	$(".operator").click(function() {
		if (!isNumber && process.length !== 0)
			process.pop();
		if (process.length !== 0 || $(this).html() == '-') {
			process.push(" " + $(this).html() + " ");
			printExp();
			$("#answer p").html("");
			isNumber = false;
		}
	});

	$("#erase").click(function() {
		process.pop();
		printExp();
		printAns("");
	});

	$("#clear").click(function() {
		process = [];
		printExp();
		printAns("");
	});

	$("#equal").click(function() {
		ans = eval(process.join("").replace(/x/g, "*"));
		var ansLength = ans.toString().length;
		if (ansLength > 12)
			ans = ans.toExponential(7);
		process = [];
		printAns(ans);
		printExp();
	});

	$("#ansSaver").click(function() {
		if (ans && ans !== NaN) {
			process.push(" " + ans + " ");
			printExp();
			isNumber = true;
		}
	});
});
