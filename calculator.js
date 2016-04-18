// // // // // // // // //
//  CALCULATOR (by HE)  //
// // // // // // // // //

$(document).ready(function() {
	// Remove the 300ms delay in mobile
	$(function() {
		FastClick.attach(document.body);
	});

	// Layout
	$(window).resize(function() {
		var calcTop = ($(window).height() - $("#calculator").height()) / 2;
		var calcLeft = ($(window).width() - $("#calculator").width()) / 2;
		if (calcTop >= 0) {
			$("#calculator").css("top", calcTop);
		} else {
			$("#calculator").css("top", "5%");
		}
		if (calcLeft > 0) {
			$("#calculator").css("left", calcLeft);
		}
	});

	$(window).resize();

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

	// Validators
	function validate(keyCode, type) {
		var validators;
		if (type === "number")
			validators = "0123456789.";
		else if (type === "operator")
			validators = "+-*/";
		if (validators.indexOf(String.fromCharCode(keyCode)) != -1)
			return true;
	}

	// Logic functions
	function numberPressed(number) {
		process.push(number);
		printExp();
		printAns("");
		isNumber = true;
	}

	function operatorPressed(operator) {
		if (!isNumber && process.length !== 0)
			process.pop();
		if (process.length !== 0 || operator == '-') {
			process.push(" " + operator + " ");
			printExp();
			$("#answer p").html("");
			isNumber = false;
		}
	}

	function equalPressed() {
		ans = eval(process.join("").replace(/x/g, "*"));
		var ansLength = ans.toString().length;
		if (ansLength > 12)
			ans = ans.toExponential(7);
		process = [];
		printAns(ans);
		printExp();
	}

	function erasePressed() {
		process.pop();
		isNumber = (typeof parseInt(process[process.length - 1]) === "number");
		printExp();
		printAns("");
	}

	function ansPressed() {
		if (ans && !isNaN(ans)) {
			process.push(" " + ans + " ");
			printExp();
			$("#answer p").html("");
			isNumber = true;
		}
	}

	// When clicked
	$(".number").click(function() {
		numberPressed($(this).html());
	});

	$(".operator").click(function() {
		operatorPressed($(this).html());
	});

	$("#equal").click(function() {
		equalPressed();
	});

	$("#erase").click(function() {
		erasePressed();
	});

	$("#clear").click(function() {
		process = [];
		printExp();
		printAns("");
	});

	$("#ansSaver").click(function() {
		ansPressed();
	});

	// When keyboard pressed
	$(window).keypress(function(e) {
		var charPressed = String.fromCharCode(e.which);
		if (validate(e.which, "number"))
			numberPressed(charPressed);
		else if (validate(e.which, "operator")) {
			if (charPressed === "*")
				charPressed = "x";
			operatorPressed(charPressed);
			e.preventDefault();
		}
		else if (charPressed === "=" || e.which === 13)
			equalPressed(charPressed);
		else if (charPressed === "a" || charPressed === "A")
			ansPressed();
	});

	// Use keydown for erase (non-printable)
	$(window).keydown(function(e) {
		if (e.which === 8) {
			erasePressed();
			e.preventDefault();
		}
	});

}); // <<< ready
