'use babel';
import {
	CompositeDisposable
} from 'atom';
import {
	dirname,
	extname
} from 'path';

var tips = ["adf"];
export default {
	subscriptions: null,

	config: {
		// It should be noted that I, Kepler, hate these Config names. However these
		//  are the names in use by many people. Changing them for the sake of clean
		//  of clean code would cause a mess for our users. Because of this we
		//  override the titles the editor gives them in the settings pane.
		execPath: {
			type: 'string',
			default: 'clang',
		},
		clangIncludePaths: {
			type: 'array',
			default: ['.'],
		},
		clangSuppressWarnings: {
			type: 'boolean',
			default: false,
		},
		clangDefaultCFlags: {
			type: 'string',
			default: '-Wall',
		},
		clangDefaultCppFlags: {
			type: 'string',
			default: '-Wall -std=c++11',
		},
		clangDefaultObjCFlags: {
			type: 'string',
			default: '',
		},
		clangDefaultObjCppFlags: {
			type: 'string',
			default: '',
		},
		clangErrorLimit: {
			type: 'integer',
			default: 0,
		},
		verboseDebug: {
			type: 'boolean',
			default: false,
		},
	},

	activate(state) {
		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		console.log((new Date()).getDate());
		this.subscriptions = new CompositeDisposable();

		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'effi-base:toggle': () => this.toggle()
		}));
	},

	deactivate() {
		this.subscriptions.dispose();
	},

	toggle() {
		console.log('EffiBase was toggled!');
		this.provideLinter()
	},


	provideLinter() {
		//var analysis_helper = require("./analysis_helper");
		var activeEditor = atom.workspace.getActiveTextEditor();
		var file = activeEditor.getBuffer().getPath().toString();

		var read = require('fs').readFileSync(file, 'utf-8');
		var loc = this.lineOfCode(read);
		var infinite_count = this.Infinite_loops(read);
		namespace_count = this.global_namespace(read);
		operators = this.operators_misuse(read);
		multi_header = this.multiple_header(read);
		multi_returns = this.multiple_returns(read);
		number_of_uncomments = this.commenting(read);
		number_of_goto = this.goto_check(read);

		var js_result = {
			"lines Of Code": loc,
			"infinite loop": infinite_count,
			"Namespace-count": namespace_count,
			"Operation with 1": operators,
			"Multiple different headers": multi_header,
			"Multiple return present": multi_returns,
			"Number of functions uncommented": number_of_uncomments,
			"Number of goto used": number_of_goto,
			"Tips for the programmer": tips
		};

		this.push_semantic_report(js_result);

		console.log(js_result);
		return {
			name: 'clang',
			grammarScopes: ['source.c', 'source.cpp', 'source.objc', 'source.objcpp'],
			scope: 'file',
			lintOnFly: false,
			lint: this.helpfun(activeEditor)
		}
	},

	push_semantic_report(js_result) {
		var fs = require('fs');
		var current = new Date();
		curr_date = current.getDate() + "/" + current.getMonth() + "/" + current.getFullYear();
		console.log(curr_date);
		curr_time = current.getHours() + ":" + current.getMinutes();
		console.log(curr_time);
		fs.readFile("/home/farzicoder/EffiTesting/sessions_sem_analysis.json", 'utf8', function callback(err, data) {
			if (err) {
				console.log(err);
			} else {
				var obj_result = JSON.parse(data);
				console.log(obj_result.list);


				var num_of_table_entries = obj_result.list.length;
				var recent_date_of_analysis;
				if (num_of_table_entries !== 0) {
					recent_date_of_analysis = obj_result.list[num_of_table_entries - 1];
					if (recent_date_of_analysis.date !== curr_date) {
						obj_result.list.push({
							"date": curr_date,
							"sessions": []
						});
						recent_date_of_analysis = obj_result.list[num_of_table_entries];
					}
				} else {
					obj_result.list.push({
						"date": curr_date,
						"sessions": []
					});
					recent_date_of_analysis = obj_result.list[0];
				}

				recent_date_of_analysis.sessions.push({
					"time": curr_time,
					"table": js_result
				});
				var json = JSON.stringify(obj_result);
				fs.writeFile("/home/farzicoder/EffiTesting/sessions_sem_analysis.json", json, 'utf8', function(err) {
					if (err) {
						console.log(err);
					}
				});
			}
		});
	},

	helpfun(activeEditor) {
		const helpers = require('atom-linter');
		const clangFlags = require('clang-flags');
		const command = atom.config.get('effi-base.execPath');
		var file = activeEditor.getBuffer().getPath();
		console.log('This is the path of file ' + file);
		const args = ['-fsyntax-only',
            '-fno-caret-diagnostics',
            '-fno-diagnostics-fixit-info',
            '-fdiagnostics-print-source-range-info',
            '-fexceptions',
            '-Weverything',
            '-Wunreachable-code'
        ];
		var grammer = activeEditor.getGrammar().name;

		if (/^C\+\+/.test(grammer)) {
			args.push('-xc++');
			args.push('-std=c++11');
		}
		// args.push('-ferror-limit='+atom.config.get('effi-base.cclangErrorLimit'));
		args.push('-ferror-limit=0');

		if (atom.config.get('effi-base.clangSuppressWarnings')) {
			args.push('-w');
			atom.config.get('effi-base.clangIncludePaths').forEach(path => args.push('-I' + path));
		}
		if (atom.config.get('linter-clang.verboseDebug')) {
			args.push('--verbose');
		}
		try {
			const flags = clangFlags.getClangFlags(activeEditor.getPath());
			if (flags) {
				args.push(...flags);
			}
		} catch (error) {
			if (atom.config.get('linter-clang.verboseDebug')) {
				// eslint-disable-next-line no-console
				console.log(error);
			}
		}

		const regex = '(?<file>.+):(?<line>\\d+):(?<col>\\d+):({(?<lineStart>\\d+):(?<colStart>\\d+)-(?<lineEnd>\\d+):(?<colEnd>\\d+)}.*:)? (?<type>[\\w \\-]+): (?<message>.*)';

		args.push(file);
		execOpts = {
			stream: 'stderr',
			allowEmptyStderr: true,
		};
		//helpers = require('atom-linter');
		return helpers.exec(command, args, execOpts).then(output => this.helper_parsing(output));
	},

	helper_parsing(output) {
		const regex = '(?<file>.+):(?<line>\\d+):(?<col>\\d+):({(?<lineStart>\\d+):(?<colStart>\\d+)-(?<lineEnd>\\d+):(?<colEnd>\\d+)}.*:)? (?<type>[\\w \\-]+): (?<message>.*)';
		const helpers = require('atom-linter');
		console.log("this is in final helper parsing function");
		var clang_message = helpers.parse(output.toString(), regex);
		console.log(clang_message);
		// clang_message.forEach(entry => this.push_to_json(entry));
		this.push_to_json(clang_message);
	},

	push_to_json(clang_message) {
		var current = new Date();
		curr_date = current.getDate() + "/" + current.getMonth() + "/" + current.getFullYear();
		console.log(curr_date);
		curr_time = current.getHours() + ":" + current.getMinutes();
		console.log(curr_time);
		var warnings = 0;
		var errors = 0;
		var notes = 0;
		var fs = require('fs');

		fs.readFile("/home/farzicoder/EffiTesting/session_dump.json", 'utf8', function readFileCallback(err, data) {
			if (err) {
				console.log(err);
			} else {
				obj = JSON.parse(data);
				console.log(obj.table);
				var current_session;
				// obj.table.forEach(day_session => {
				//     if (day_session.date == curr_date) {
				//         var list_of_err = []
				//         clang_message.forEach(entry => {
				//             list_of_err.push({
				//                 "filePath": entry.filePath,
				//                 "type": entry.type,
				//                 "text": entry.text
				//             });
				//             if (entry.type == "warning") {
				//                 warnings = warnings + 1;
				//             }
				//             if (entry.type == "error") {
				//                 errors = errors + 1;
				//             }
				//             if (entry.type == "note") {
				//                 notes = notes + 1;
				//             }
				//         });
				//         day_session.sessions.push({
				//             "time": curr_time,
				//             "table_of_errors": list_of_err
				//         });
				//     }
				// });
				// var num_of_table_entries = obj.table.length;
				// var recent_date_of_analysis = obj.table[num_of_table_entries - 1];
				// if (recent_date_of_analysis.date == curr_date) {
				// 	var list_of_err = [];
				// 	clang_message.forEach(entry => {
				// 		list_of_err.push({
				// 			"filePath": entry.filePath,
				// 			"type": entry.type,
				// 			"text": entry.text
				// 		});
				// 		if (entry.type == "warning") {
				// 			warnings = warnings + 1;
				// 		} else if (entry.type == "error") {
				// 			errors = errors + 1;
				// 		} else if (entry.type == "note") {
				// 			notes = notes + 1;
				// 		}
				// 	});
				//
				// 	recent_date_of_analysis.sessions.push({
				// 		"time": curr_time,
				// 		"table_of_errors": list_of_err
				// 	});
				// }
				var num_of_table_entries = obj.table.length;
				var recent_date_of_analysis = obj.table[num_of_table_entries - 1];
				if (recent_date_of_analysis.date !== curr_date) {
					obj.table.push({
						"date": curr_date,
						"sessions": []
					});
					recent_date_of_analysis = obj.table[num_of_table_entries];
				}
				var list_of_err = [];
				clang_message.forEach(entry => {
					list_of_err.push({
						"filePath": entry.filePath,
						"type": entry.type,
						"text": entry.text
					});
					if (entry.type == "warning") {
						warnings = warnings + 1;
					} else if (entry.type == "error" || entry.type == "fatal error") {
						errors = errors + 1;
					} else if (entry.type == "note") {
						notes = notes + 1;
					}
				});
				console.log("error : " + errors);
				recent_date_of_analysis.sessions.push({
					"time": curr_time,
					"table_of_errors": list_of_err
				});

				console.log("num of warnings : " + warnings);
				json = JSON.stringify(obj);
				fs.writeFile("/home/farzicoder/EffiTesting/session_dump.json", json, 'utf8', function(err) {
					if (err) {
						console.log(err);
					}
				});
			}
		});
		fs.readFile("/home/farzicoder/EffiTesting/session_result.json", 'utf8', function callback(err, data) {
			if (err) {
				console.log(err);
			} else {
				obj_result = JSON.parse(data);
				console.log(obj_result.session_result);
				//
				// obj_result.sessions_result.forEach(day => {
				// 	if (day.Date == curr_date) {
				// 		day.sessions.push({
				// 			"time": curr_time,
				// 			"num_of_warnings": warnings,
				// 			"num_of_errors": errors,
				// 			"num_of_notes": notes
				// 		});
				// 	}
				// });
				console.log("error : " + errors);

				var length_of_sessions_result = obj_result.sessions_result.length;
				var recent_date_of_analysis = obj_result.sessions_result[length_of_sessions_result - 1];
				// if (recent_date_of_analysis.Date == curr_date) {
				// 	recent_date_of_analysis.sessions.push({
				// 		"time": curr_time,
				// 		"num_of_warnings": warnings,
				// 		"num_of_errors": errors,
				// 		"num_of_notes": notes
				// 	});
				// }
				if (recent_date_of_analysis.Date !== curr_date) {
					obj_result.sessions_result.push({
						"Date": curr_date,
						"sessions": []
					});
					recent_date_of_analysis = obj_result.sessions_result[length_of_sessions_result];
				}
				console.log("error 1234: " + errors);

				recent_date_of_analysis.sessions.push({
					"time": curr_time,
					"num_of_warnings": warnings,
					"num_of_errors": errors,
					"num_of_notes": notes
				});
				json_result = JSON.stringify(obj_result);
				fs.writeFile("/home/farzicoder/EffiTesting/session_result.json", json_result, 'utf8', function(err) {
					if (err) {
						console.log(err);
					}
				})
			}

		});
		fs.readFile("/home/farzicoder/EffiTesting/session_list_overall.json", 'utf8', function readFileCallback(err, data) {
			if (err) {
				console.log(err);
			} else {
				obj = JSON.parse(data);
				console.log(obj.sessions_result);

				var length_of_sessions_result = obj.list.length;
				var recent_date_of_analysis = obj.list[length_of_sessions_result - 1];
				if (recent_date_of_analysis.date !== curr_date) {
					obj.list.push({
						"date": curr_date,
						"sessions": []
					});
					recent_date_of_analysis = obj.list[length_of_sessions_result];
				}

				recent_date_of_analysis.sessions.push({
					"time": curr_time,
					"num_of_corrections": errors + warnings + notes
				});
				// obj_result.sessions_result.forEach(date_entry => {
				// 	var list_sessions = [];
				// 	date_entry.sessions.forEach(sess => {
				// 		list_sessions.push({
				// 			"time": sess.time,
				// 			"num_of_corrections": sess.num_of_notes + sess.num_of_errors + sess.num_of_warnings
				// 		});
				// 	});
				// 	obj.list.push({
				// 		"date": date_entry.Date,
				// 		"sessions": list_sessions
				// 	});
				// });
				json = JSON.stringify(obj);
				fs.writeFile("/home/farzicoder/EffiTesting/session_list_overall.json", json, 'utf8', function(err) {
					if (err) {
						console.log(err);
					}
				});
			}
		});

	},

	analysis() {

		//require("./analysis_helper").class_privacy_check(file);
		var read = require('fs').readFileSync(file, 'utf-8');
		loc = this.lineOfCode(read);

		infinite_count = this.Infinite_loops(read);

		namespace_count = this.global_namespace(read);

		operators = this.operators_misuse(read);

		multi_header = this.multiple_header(read);

		multi_returns = this.multiple_returns(read);

		number_of_uncomments = this.commenting(read);

		number_of_goto = this.goto_check(read);

		console.log(tips);

		var js_result = {
			"lines Of Code": loc,
			"infinite loop": infinite_count,
			"Namespace-count": namespace_count,
			"Operation with 1": operators,
			"Multiple different headers": multi_header,
			"Multiple return present": multi_returns,
			"Number of functions uncommented": number_of_uncomments,
			"Number of goto used": number_of_goto,
			"Tips for the programmer": tips
		};
		console.log(js_result);
	},

	lineOfCode: function(read) {
		var array, error, flag, fun1, i, j, len1, read, temp, value, x;
		try {
			//read = require('./analysis_helper').read_file(filename);
			fun1 = read.match(/(int|void|double|float)(\s)*(\t)*(\n)*[a-zA-Z:_$]*(\s)*(\t)*(\n)*\((\s)*(\t)*[a-zA-Z\s\t\n,:_$]*(\s)*(\t)*(\n)*\)(\s)*(\t)*(\n)*\{(\s)*(\t)*(\n)*[a-zA-Z0-9\+\-\*\/=<>;:\s\t\n"\(\)]*(\s)*(\t)*(\n)*\}/g);
			flag = 0;
			console.log(" read from loc " + fun1);
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
			console.log(read);
			return console.log(" form loc Error");
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

	global_namespace: function(read) {
		var count, error, fun1, read;
		try {
			//read = read_file(filename);
			fun1 = read.match(/std(\s)*(\n)*(\t)*::(\s)*(\n)*(\t)*(cout|cin)(\s)*(\n)*(\t)*/g);
			console.log(fun1);
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

	operators_misuse: function(read) {
		var count, error, fun1, read;
		try {
			//read = read_file(filename);
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

	multiple_returns: function(read) {
		var a, error, fun1, i, j, len, len1, numbers, read, single;
		try {
			//	read = read_file(filename);
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

	multiple_header: function(read) {
		var a, array, count, error, flag, fun1, i, j, k, key, keys, len1, len2, number_headers, read, same_headers, value;
		try {
			flag = 0;
			//read = read_file(filename);
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

	commenting: function(read) {
		var a, error, fun_count, functions, i, j, len1, matches, number_of_proper_comments, read;
		try {
			//read = read_file(filename);
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

	goto_check: function(read) {
		var error, matches, matches_length, read;
		try {
			//read = read_file(filename);
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

	class_privacy_check: function(read) {
		var a, count, error, i, j, len1, matches, read, results;
		try {
			//	read = read_file("abc.cpp");
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
