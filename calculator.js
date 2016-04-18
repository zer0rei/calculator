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
	var headIsNumber = false;
	var ansPrinted = false;
	var ans = "";

	// printers
	function printExp() {
		var textarea = $("#expression textarea");
		textarea.val(process.join(""));
		textarea.scrollTop(textarea[0].scrollHeight);
	}

	function printAns(answer) {
		$("#answer p").html(answer);
		ansPrinted = (answer !== "");
	}

	// Validators
	function validate(keyCode, type) {
		var validators;
		if (type === "number")
			validators = "0123456789";
		else if (type === "operator")
			validators = "+-*/";
		if (validators.indexOf(String.fromCharCode(keyCode)) != -1)
			return true;
	}

	// Logic functions
	function numberPressed(number) {
		if (process[process.length - 1] !== ans) {
			process.push(number);

			// Pop preceding zero
			if (!headIsNumber && number === "0")
				process.pop();
			else
				headIsNumber = true;

			printExp();
			printAns("");
		}
	}

	function dotPressed() {
		if (process[process.length - 1] !== ans) {
			var dotPressed = false;
			for (var i = process.length - 1; (i >= 0 && process[i] !== " "); i--) {
				if (process[i] === ".")
					dotPressed = true;
			}

			if (!dotPressed) {
				process.push(".");
				printExp();
				headIsNumber = true;
			}
		}
	}

	function operatorPressed(operator) {
		if (ansPrinted)
			ansPressed();
		if (!headIsNumber && process.length !== 0)
			erasePressed();
		if (process.length !== 0 || operator == '-') {
			process.push(" ");
			process.push(operator);
			process.push(" ");
			printExp();
			$("#answer p").html("");
			headIsNumber = false;
		}
	}

	function equalPressed() {
		if (process.length > 1) {
			var ansNumber = eval(process.join("").replace(/x/g, "*"));

			// Output the number as a string
			ans = ansNumber.toString();
			if (ans.length > 13)
				ans = ansNumber.toPrecision(12);
			if (ans.length > 13)
				ans = ansNumber.toExponential(7);

			process = [];
			headIsNumber = false;

			printAns(ans);
			printExp();
		}
	}

	function erasePressed() {
		// Pop the following soace
		if (!headIsNumber)
			process.pop();

		process.pop();

		// Pop the preceding soace
		if (!headIsNumber)
			process.pop();

		var lastProcess = process[process.length - 1];
		headIsNumber = (lastProcess === ans || /\d|\./.test(lastProcess));
		printExp();
		printAns("");
	}

	function ansPressed() {
		if (ans && !isNaN(ans) && !headIsNumber) {
			process.push(ans);
			printExp();
			printAns("");
			headIsNumber = true;
		}
	}

	// When clicked
	$(".number").click(function() {
		numberPressed($(this).html());
	});

	$("#dot").click(function() {
		dotPressed();
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
		headIsNumber = false;
	});

	$("#ansSaver").click(function() {
		ansPressed();
	});

	// When keyboard pressed
	$(window).keypress(function(e) {
		var charPressed = String.fromCharCode(e.which);

		// Case number
		if (validate(e.which, "number"))
			numberPressed(charPressed);

		// Case dot
		else if (charPressed === ".")
			dotPressed();

		// Case operator
		else if (validate(e.which, "operator")) {
			if (charPressed === "*")
				charPressed = "x";
			operatorPressed(charPressed);
			e.preventDefault();
		}

		// Case equal
		else if (charPressed === "=" || e.which === 13)
			equalPressed(charPressed);

		// Case ans
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
