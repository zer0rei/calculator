// // // // // // // // //
//  CALCULATOR (by HE)  //
// // // // // // // // //

$(document).ready(function() {
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
	var ansPrinted = false;
	var haltOperatorPressing = false;
	var ans = "";

	// Process to string
	function stringify(process) {
		var string = "";
		for (var i = 0; i < process.length; i++) {
			if (process[i].type === "operator")
				string += " " + process[i].val + " ";
			else if (process[i].type === "unaryOperator")
				string += " " + process[i].val;
			else
				string += process[i].val;
		}
		return string;
	}

	// Printers
	function printExp() {
		var textarea = $("#expression textarea");
		textarea.val(stringify(process));
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
		if (validators.indexOf(String.fromCharCode(keyCode)) !== -1)
			return true;
	}

	// Logic functions
	function pressNumber(number) {
		var lastProcess = null;
		if (process.length > 0) {
			lastProcess = process[process.length - 1];
			if (lastProcess.type === "answer")
				return;
		}

		var secondLastProcess = (process.length > 1) ? process[process.length - 2] : null;

		// Return if more than one preceding zero
		// Or pop the preceding zero if next press is another number
		if (lastProcess && lastProcess.val === "0" &&
				(!secondLastProcess || (secondLastProcess && !(/^(number|dot)$/.test(secondLastProcess.type)))))
			if (number === "0")
				return;
			else
				process.pop();

		process.push({
			"val" : number,
			"type" : "number"
		});

		printExp();
		printAns("");
	}

	function pressDot() {
		var lastProcess = null;
		if (process.length > 0) {
			lastProcess = process[process.length - 1];
			if (lastProcess.type === "answer")
				return;
		}

		var dotPressed = false;
		for (var i = process.length - 1; (i >= 0 && /^(number|dot)$/.test(process[i].type)); i--) {
			if (process[i].type === "dot") {
				dotPressed = true;
				break;
			}
		}

		if (dotPressed)
			return;

		if (!lastProcess || lastProcess.type !== "number")
			process.push({
				"val" : "0",
				"type" : "number"
			});

		process.push({
			"val" : ".",
			"type" : "dot"
		});

		printExp();
		printAns("");
	}

	function pressOperator(operator) {
		if (ansPrinted)
			pressAns();

		var lastProcess = (process.length > 0) ? process[process.length - 1] : null;

		// Process empty (accept only unary minus)
		if (!lastProcess && operator === "-")
			process.push({
				"val" : operator,
				"type" : "unaryOperator"
			});

		// Process not empty
		if (lastProcess) {
			// After an operator
			if (lastProcess.type === "operator") {
				if (operator === "-" && "+-".indexOf(lastProcess.val) === -1)
					process.push({
						"val" : operator,
						"type" : "unaryOperator"
					});
				else {
					process.pop();
					process.push({
						"val" : operator,
						"type" : "operator"
					});
				}
			// After a number, dot, of the answer
			} else if (/^(number|dot|answer)$/.test(lastProcess.type))
				process.push({
					"val" : operator,
					"type" : "operator"
				});
		}

		printExp();
		printAns("");
	}

	function pressEqual() {
		var lastProcess = (process.length > 0) ? process[process.length - 1] : null;
		if (!lastProcess || /^(operator|unaryOperator)$/.test(lastProcess.type))
			return;

		var ansNumber = eval(stringify(process).replace(/x/g, "*"));

		// Output the number as a string
		ans = ansNumber.toString();

		// Larger than screen
		if (ans.length > 13)
			ans = ansNumber.toPrecision(ans < 0 ? 11 : 12).replace(/\.?0+$/, "");
		// Still larger than screen (Exponential notation)
		if (ans.length > 13)
			ans = ansNumber.toExponential(ans < 0 ? 6 : 7).replace(/\.?0+(e|E)/, "$1");

		process = [];
		printExp();
		printAns(ans);
	}

	function pressErase() {
		process.pop();
		printExp();
		printAns("");
	}

	function pressClear() {
		process = [];
		printExp();
		printAns("");
	}

	function pressAns() {
		var lastProcess = (process.length > 0) ? process[process.length - 1] : null;
		// Case of NaN or answer after a non-operator
		if (!ans || isNaN(ans) || (lastProcess && !(/^(operator|unaryOperator)$/.test(lastProcess.type))))
			return;

		var answer = ans;

		// Case of negative answer after a unary minus
		if (lastProcess && Number(ans) < 0 && lastProcess.type === "unaryOperator" && lastProcess.val === "-") {
			process.pop();
			answer = ans.substr(1);
		}

		process.push({
			"val" : answer,
			"type" : "answer"
		});

		printExp();
		printAns("");
	}

	// When clicked
	$(".number, #erase").on("mousedown touchstart", function(e) {
		if ((e.type === "mousedown" && e.which === 1) ||
			(e.type === "touchstart" && e.originalEvent.touches.length === 1)) {

			var that = this;
			var timeout, interval;

			if (this.id === "erase")
				pressErase();
			else if ($(that).hasClass("number"))
				pressNumber($(this).html());

			timeout = setTimeout(function() {
				interval = setInterval(function() {
					if (that.id === "erase")
						pressErase();
					else if ($(that).hasClass("number"))
						pressNumber($(that).html());
				}, 100);
			}, 300);

			e.preventDefault();

			$(window).on("mouseup touchend", function() {
				clearTimeout(timeout);
				clearInterval(interval);
			});
		}
	});

	$(".operator, #dot, #equal, #clear, #ansSaver").on("mousedown touchstart", function(e) {
		if ((e.type === "mousedown" && e.which === 1) ||
			(e.type === "touchstart" && e.originalEvent.touches.length === 1)) {

			if (this.id === "dot")
				pressDot();
			else if (this.id === "equal")
				pressEqual();
			else if (this.id === "clear")
				pressClear();
			else if (this.id === "ansSaver")
				pressAns();
			else if ($(this).hasClass("operator"))
				pressOperator($(this).html());

			e.preventDefault();
		}
	});

	// When keyboard pressed

	// Use keypress for printables
	$(window).keypress(function(e) {
		var charPressed = String.fromCharCode(e.which);

		// Case number
		if (validate(e.which, "number"))
			pressNumber(charPressed);

		// Case dot
		else if (charPressed === ".")
			pressDot();

		// Case operator
		else if (validate(e.which, "operator")) {
			if (charPressed === "*")
				charPressed = "x";
			pressOperator(charPressed);
			e.preventDefault();
		}

		// Case equal
		else if (charPressed === "=" || e.which === 13)
			pressEqual(charPressed);

		// Case ans
		else if (charPressed === "a" || charPressed === "A")
			pressAns();
	});

	// Use keydown for erase (non-printable)
	$(window).keydown(function(e) {
		if (e.which === 8) {
			pressErase();
			e.preventDefault();
		}
	});

}); // <<< ready
