module.exports = {
	var Infinite_loops, class_privacy_check, commenting, fsCson, global_namespace, goto_check, infinite_count, lineOfCode, loc, multi_header, multi_returns, multiple_header, multiple_returns, namespace_count, number_of_goto, number_of_uncomments, operators, operators_misuse, read_file, tips;

	tips = [];

	read_file: function(filename) {
		var error, fs, input, read;
		try {
			fs = require('fs');
			input = filename;
			read = fs.readFileSync(input, 'utf-8');
			return read;
		} catch (error1) {
			error = error1;
			return console.log("Cant open file");
		}
	},

	Infinite_loops: function(read) {
		var a, error, first1, first2, first_close, infinite_loop_condition_greater, infinite_loop_condition_less, infinite_loop_greater_length, infinite_loop_less_length, infinite_non_count, infinite_non_impro, j, k, last1, last2, len1, len2, num1, num2, read, string, temp, total;
		try {
			//read = read_file(filename);
			infinite_non_impro = read.match(/for(\s)*(\t)*(\n)*\(((int)?(\s)*(\t)*(\n)*[a-zA-Z0-9_$]+(\s)*(\t)*(\n)*=[0-9a-zA-Z]+|(\s)*(\t)*(\n)*|,)*;(\s)*(\t)*(\n)*(true|[\-0-9]+|(\s)*(\t)*(\n)*)(\s)*(\t)*(\n)*;(\s)*(\t)*(\n)*([a-zA-Z0-9_$\+\-\*\/=]+|(\s)*(\t)*(\n)*)\)(\n)*(\t)*(\s)*\{(\n)*(\t)*(\s)*[a-zA-Z0-9_$\+;<>=\n\t\s]*\}/g);
			infinite_non_count = infinite_non_impro.length;
			infinite_loop_condition_less = read.match(/for(\s)*(\t)*(\n)*\(((int)?(\s)*(\t)*(\n)*[a-zA-Z0-9_$]+(\s)*(\t)*(\n)*=[0-9a-zA-Z]+|(\s)*(\t)*(\n)*|,)*;(\s)*(\t)*(\n)*[a-zA-Z]+<[0-9]+(\s)*(\t)*(\n)*;(\s)*(\t)*(\n)*([a-zA-Z0-9_$\-\/=]+|(\s)*(\t)*(\n)*)\)(\n)*(\t)*(\s)*\{(\n)*(\t)*(\s)*[a-zA-Z0-9_$\+;<>=\n\t\s]*\}/g);
			infinite_loop_condition_greater = read.match(/for(\s)*(\t)*(\n)*\(((int)?(\s)*(\t)*(\n)*[a-zA-Z0-9_$]+(\s)*(\t)*(\n)*=[0-9a-zA-Z]+|(\s)*(\t)*(\n)*|,)*;(\s)*(\t)*(\n)*[a-zA-Z]+>[0-9]+(\s)*(\t)*(\n)*;(\s)*(\t)*(\n)*([a-zA-Z0-9_$\+\*\=]+|(\s)*(\t)*(\n)*)\)(\n)*(\t)*(\s)*\{(\n)*(\t)*(\s)*[a-zA-Z0-9_$\+;<>=\n\t\s]*\}/g);
			infinite_loop_less_length = infinite_loop_condition_less.length;
			infinite_loop_greater_length = infinite_loop_condition_greater.length;
			total = infinite_loop_less_length + infinite_loop_greater_length + infinite_non_count;
			if (infinite_loop_less_length > 0) {
				for (j = 0, len1 = infinite_loop_condition_less.length; j < len1; j++) {
					a = infinite_loop_condition_less[j];
					first1 = a.indexOf("=");
					last1 = a.indexOf(";");
					first_close = a.indexOf(")");
					temp = a.substr(first1, first_close - first1);
					first2 = temp.indexOf("<");
					last2 = temp.lastIndexOf(";");
					num1 = a.substr(first1 + 1, last1 - first1 - 1);
					num2 = temp.substr(first2 + 1, last2 - first2 - 1);
					if (parseInt(num1) < parseInt(num2)) {
						console.log("Infinite loop less");
						tips.push("Infinite loop since " + num1 + " is less than " + num2);
					} else {
						console.log("Nope");
					}
				}
			}
			if (infinite_loop_greater_length > 0) {
				for (k = 0, len2 = infinite_loop_condition_greater.length; k < len2; k++) {
					a = infinite_loop_condition_greater[k];
					string = a;
					first1 = a.indexOf("=");
					last1 = a.indexOf(";");
					first_close = a.indexOf(")");
					temp = a.substr(first1, first_close - first1);
					first2 = temp.indexOf(">");
					last2 = temp.lastIndexOf(";");
					num1 = a.substr(first1 + 1, last1 - first1 - 1);
					num2 = temp.substr(first2 + 1, last2 - first2 - 1);
					if (parseInt(num1) > parseInt(num2)) {
						console.log("Infinite loop");
						tips.push("Infinite loop since " + num1 + " is greater than " + num2);
					} else {
						console.log("Nope");
					}
				}
			}
			if (total > 0) {
				tips.push("Seems you have some problem with ur code touching infinity");
			}
			return total;
		} catch (error1) {
			error = error1;
			return console.log("Error");
		}
	},

	lineOfCode: function(filename) {
		var array, error, flag, fun1, i, j, len1, read, temp, value, x;
		try {
			read = read_file(filename);
			fun1 = read.match(/(int|void|double|float)(\s)*(\t)*[a-zA-Z]*(\s)*(\t)*(\n)*\((\s)*(\t)*[a-zA-Z\s\t\n,:]*(\s)*(\t)*(\n)*\)(\s)*(\t)*(\n)*\{(\s)*(\t)*(\n)*[a-zA-Z0-9\+\-\*\/=<>;:\s\t\n]*\}/g);
			flag = 0;
			if (fun1.length > 0) {
				array = [];
				x = 0;
				for (j = 0, len1 = fun1.length; j < len1; j++) {
					i = fun1[j];
					temp = i.split(";", i.length);
					array[x] = temp.length - 1;
					value = temp.length - 1;
					if (value > 5) {
						flag = flag + 1;
					}
					x = x + 1;
				}
			}
			if (flag >= 2) {
				tips.push("The number of statements present in a single functions should not exceed 30");
			}
			return flag;
		} catch (error1) {
			error = error1;
			return console.log("Error");
		}
	},

	global_namespace: function(filename) {
		var count, error, fun1, read;
		try {
			read = read_file(filename);
			fun1 = read.match(/std(\s)*(\n)*(\t)*::(\s)*(\n)*(\t)*(cout|cin)(\s)*(\n)*(\t)*/g);
			count = fun1.length;
			if (count > 1) {
				tips.push("It is recommended to declare a global namespace");
			}
			return count;
		} catch (error1) {
			error = error1;
			return console.log("Error");
		}
	},

	operators_misuse: function(filename) {
		var count, error, fun1, read;
		try {
			read = read_file(filename);
			fun1 = read.match(/([a-zA-Z0-9_$]+(\s)*(\t)*(\n)*(\+|\-)(\s)*(\t)*(\n)*1|1(\s)*(\t)*(\n)*(\+|\-)(\s)*(\t)*(\n)*[a-zA-Z0-9_$\s\n\t]+)/g);
			count = fun1.length;
			if (count > 0) {
				tips.push("using the increment(++) and decrement(--) operator is more efficient than + and - respectively.");
			}
			return count;
		} catch (error1) {
			error = error1;
			return console.log("Error");
		}
	},

	multiple_returns: function(filename) {
		var a, error, fun1, i, j, len, len1, numbers, read, single;
		try {
			read = read_file(filename);
			fun1 = read.match(/(int|void)*(\s)*(\t)*(\n)*[a-zA-Z0-9_]+(\s)*(\t)*(\n)*\([a-zA-Z0-9_\s\t\n,]*\)(\s)*(\t)*(\n)*\{[a-zA-Z0-9_$\+\-\(\)\*\s\t\n;<>]*(\s)*(\t)*(\n)*return(\s)*(\t)*(\n)*[a-zA-Z0-9_$;,\+\-\*\/]+(\s)*(\t)*(\n)*\}(\s)*(\t)*(\n)*[a-zA-Z]*(\s)*(\t)*(\n)*(\{)*[a-zA-Z0-9\+\-\*_;<>\(\)\n\t\s]*(\})*/g);
			console.log(fun1);
			numbers = [];
			a = 0;
			for (j = 0, len1 = fun1.length; j < len1; j++) {
				i = fun1[j];
				single = i.match(/return(\s)*(\t)*(\n)*[a-zA-Z0-9_]+(\s)*(\t)*(\n)*;/g);
				len = single.length;
				console.log(len);
				if (len > 1) {
					numbers[a] = len;
					a = a + 1;
				}
			}
			if (numbers.len > 0) {
				tips.push("Using multiple return statements is a bad practice, instead create flag and then return only once");
			}
			return numbers;
		} catch (error1) {
			error = error1;
			return console.log("Error");
		}
	},

	multiple_header: function(filename) {
		var a, array, count, error, flag, fun1, i, j, k, key, keys, len1, len2, number_headers, read, same_headers, value;
		try {
			flag = 0;
			read = read_file(filename);
			fun1 = read.match(/#include(\s)*(\t)*(\n)*<[a-zA-Z0-9.]+(\s)*(\t)*(\n)*>/g);
			number_headers = fun1.length;
			fun1.sort();
			count = 0;
			same_headers = 0;
			keys = [];
			array = [];
			for (j = 0, len1 = fun1.length; j < len1; j++) {
				value = fun1[j];
				if (keys[value] == null) {
					keys[value] = 0;
				}
				keys[value]++;
			}
			a = (function() {
				var results;
				results = [];
				for (key in keys) {
					count = keys[key];
					if (count > 1) {
						results.push(count);
					}
				}
				return results;
			})();
			for (k = 0, len2 = a.length; k < len2; k++) {
				i = a[k];
				if (i > 1) {
					flag = flag + 1;
				}
			}
			if (flag > 1) {
				tips.push("Multiple declaration of the same header should be avoided ");
			}
			return (function() {
				var results;
				results = [];
				for (key in keys) {
					count = keys[key];
					if (count > 1) {
						results.push(count);
					}
				}
				return results;
			})();
		} catch (error1) {
			error = error1;
			return console.log("Error");
		}
	},

	commenting: function(filename) {
		var a, error, fun_count, functions, i, j, len1, matches, number_of_proper_comments, read;
		try {
			read = read_file(filename);
			matches = read.match(/\/\*[a-zA-Z0-9_$\t\s\n\+\-\*\/<>;,.:]+(\s)*(\t)*(\n)*\*\//g);
			functions = read.match(/(int|void|double|float)(\s)*(\t)*[a-zA-Z]*(\s)*(\t)*(\n)*\((\s)*(\t)*[a-zA-Z\s\t\n,:]*(\s)*(\t)*(\n)*\)(\s)*(\t)*(\n)*\{(\s)*(\t)*(\n)*[a-zA-Z0-9\+\-\*\/=<>;:\s\t\n]*\}/g);
			fun_count = functions.length;
			number_of_proper_comments = 0;
			for (j = 0, len1 = matches.length; j < len1; j++) {
				i = matches[j];
				a = i.match(/input(\s)*(\t)*(\n)*[:>\(\)\{\}\s\t\n]+(\s)*(\t)*(\n)*[a-zA-Z0-9_$\(\)\{\}.\+\-\*;<>\s\t\n]+(\s)*(\t)*(\n)*output(\s)*(\t)*(\n)*[:>\(\)\{\}\s\t\n]+(\s)*(\t)*(\n)*[a-zA-Z0-9_$\(\)\{\}.\+\-\*;<>\s\t\n]+(\s)*(\t)*(\n)*(description|explanation)(\s)*(\t)*(\n)*[:>\(\)\{\}\s\t\n]+(\s)*(\t)*(\n)*[a-zA-Z0-9_$\(\)\{\}.\+\-\*\/;<>\s\t\n]+(\s)*(\t)*(\n)*\*\//ig);
				if (a.length >= 1) {
					number_of_proper_comments = number_of_proper_comments + 1;
				}
			}
			if (number_of_proper_comments < fun_count) {
				tips.push("You should have a proper commenting for each function include input,output and description about function");
				return fun_count - number_of_proper_comments;
			}
		} catch (error1) {
			error = error1;
			return console.log("Error");
		}
	},

	goto_check: function(filename) {
		var error, matches, matches_length, read;
		try {
			read = read_file(filename);
			matches = read.match(/goto(\s)*(\n)*(\t)*[a-zA-Z0-9_$]*(\s)*(\n)*(\t)*;/g);
			matches_length = matches.length;
			if (matches_length > 0) {
				tips.push("goto statements should be avoided since it makes a code clumsy for review and understanding");
			}
			return matches_length;
		} catch (error1) {
			error = error1;
			return console.log("Error");
		}
	},

	class_privacy_check: function(filename) {
		var a, count, error, i, j, len1, matches, read, results;
		try {
			read = read_file("abc.cpp");
			matches = read.match(/class(\s)*(\n)*(\t)*[a-zA-Z0-9_]+(\s)*(\n)*(\t)*\{[a-zA-Z0-9\s\t\n;,\(\)\{\}:]*\}/g);
			if (matches.length > 0) {
				results = [];
				for (j = 0, len1 = matches.length; j < len1; j++) {
					i = matches[j];
					a = i.match(/public(\s)*(\n)*(\t)*:(\s)*(\n)*(\t)*[a-zA-Z\s\t\n]+(\s)*(\n)*(\t)*[a-zA-Z0-9_$\s\t\n,]+(\s)*(\n)*(\t)*;/g);
					count = a.length;
					if (count > 0) {
						console.log("Data in class should be private(recommended)");
						results.push(tips.push("Data in class should be private(recommended)"));
					} else {
						results.push(void 0);
					}
				}
				return results;
			} else {
				return console.log("No class present");
			}
		} catch (error1) {
			error = error1;
			return console.log("Error");
		}
	}
};

// class_privacy_check("abc.cpp");
//
// loc = lineOfCode("abc.cpp");
//
// infinite_count = Infinite_loops("abc.cpp");
//
// namespace_count = global_namespace("abc.cpp");
//
// operators = operators_misuse("abc.cpp");
//
// multi_header = multiple_header("abc.cpp");
//
// multi_returns = multiple_returns("abc.cpp");
//
// number_of_uncomments = commenting("abc.cpp");
//
// number_of_goto = goto_check("abc.cpp");
//
// console.log(tips);

// var js_result = {
// 	"lines Of Code": loc,
// 	"infinite loop": infinite_count,
// 	"Namespace-count": namespace_count,
// 	"Operation with 1": operators,
// 	"Multiple different headers": multi_header,
// 	"Multiple return present": multi_returns,
// 	"Number of functions uncommented": number_of_uncomments,
// 	"Number of goto used": number_of_goto,
// 	"Tips for the programmer": tips
// };
console.log(js_result);
var fs = require('fs');
fs.readFile("output.json", 'utf8', function callback(err, data) {
	if (err) {
		console.log(err);
	} else {
		var obj_result = JSON.parse(data);
		console.log(obj_result.list);
		obj_result.list.push(js_result);
		var json = JSON.stringify(obj_result);
		fs.writeFile("output.json", json, 'utf8', function(err) {
			if (err) {
				console.log(err);
			}
		});
	}
});


// fsCson.writeFile('sample.cson', {
// 	"lines Of Code": loc,
// 	"infinite loop": infinite_count,
// 	"Namespace-count": namespace_count,
// 	"Operation with 1": operators,
// 	"Multiple different headers": multi_header,
// 	"Multiple return present": multi_returns,
// 	"Number of functions uncommented": number_of_uncomments,
// 	"Number of goto used": number_of_goto,
// 	"Tips for the programmer": tips
// }, function(err) {});
