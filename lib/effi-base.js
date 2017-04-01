'use babel';
import { CompositeDisposable } from 'atom';
import {dirname, extname } from 'path';


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

  provideLinter(){
    var activeEditor = atom.workspace.getActiveTextEditor();
    var file = activeEditor.getBuffer().getPath();
    return {
      name: 'clang',
      grammarScopes: ['source.c', 'source.cpp', 'source.objc', 'source.objcpp'],
      scope: 'file',
      lintOnFly: false,
      lint: this.helpfun(activeEditor)
    }
  },

  helpfun(activeEditor){
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
      '-Wunreachable-code'];
    var grammer = activeEditor.getGrammar().name;

    if(/^C\+\+/.test(grammer)){
      args.push('-xc++');
      args.push('-std=c++11');
    }
    // args.push('-ferror-limit='+atom.config.get('effi-base.cclangErrorLimit'));
    args.push('-ferror-limit=0');

    if(atom.config.get('effi-base.clangSuppressWarnings')){
      args.push('-w');
      atom.config.get('effi-base.clangIncludePaths').forEach(path => args.push('-I'+path));
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
    return helpers.exec(command, args, execOpts).then(output => this.helper_parsing(output)
    );
  },

  helper_parsing(output){
    const regex = '(?<file>.+):(?<line>\\d+):(?<col>\\d+):({(?<lineStart>\\d+):(?<colStart>\\d+)-(?<lineEnd>\\d+):(?<colEnd>\\d+)}.*:)? (?<type>[\\w \\-]+): (?<message>.*)';
    const helpers = require('atom-linter');
    console.log("this is in final helper parsing function");
    var clang_message = helpers.parse(output.toString(), regex);
    console.log(clang_message);
    // clang_message.forEach(entry => this.push_to_json(entry));
    this.push_to_json(clang_message);
  },

  push_to_json(clang_message){
    var fs = require('fs');
    fs.readFile("/home/farzicoder/EffiTesting/temp.json", 'utf8', function readFileCallback(err, data){
  if(err){
    console.log(err);
  }else{
    obj = JSON.parse(data);
    console.log(obj.table);
    clang_message.forEach(entry => obj.table.push({"filePath": entry.filePath, "type": entry.type, "text": entry.text}));

    json = JSON.stringify(obj);
    fs.writeFile("/home/farzicoder/EffiTesting/temp.json", json, 'utf8', function(err){
      if (err){
        console.log(err);
      }
    })
    }
  });
  }

  //
  //     lint: (activeEditor) => {
  //       const command = atom.config.get('linter-clang.execPath');
        // const args = ['-fsyntax-only',
        //   '-fno-caret-diagnostics',
        //   '-fno-diagnostics-fixit-info',
        //   '-fdiagnostics-print-source-range-info',
        //   '-fexceptions'];
  //       const grammar = activeEditor.getGrammar().name;

        // if (/^C\+\+/.test(grammar)) {
        //     // const language = "c++";
        //   args.push('-xc++');
        //   args.push(...atom.config.get('linter-clang.clangDefaultCppFlags').split(/\s+/));
        // }
  //       if (grammar === 'C') {
  //         // const language = "c";
  //         args.push('-xc');
  //         args.push(...atom.config.get('linter-clang.clangDefaultCFlags').split(/\s+/));
  //       }
  //
  //       args.push(`-ferror-limit=${atom.config.get('linter-clang.clangErrorLimit')}`);
  //
  //       if (atom.config.get('linter-clang.clangSuppressWarnings')) {
  //         args.push('-w');
  //       }
        // if (atom.config.get('linter-clang.verboseDebug')) {
        //   args.push('--verbose');
        // }
  //
  //       atom.config.get('linter-clang.clangIncludePaths').forEach(path =>
  //         args.push(`-I${path}`),
  //       );
  //
        // try {
        //   const flags = clangFlags.getClangFlags(activeEditor.getPath());
        //   if (flags) {
        //     args.push(...flags);
        //   }
        // } catch (error) {
        //   if (atom.config.get('linter-clang.verboseDebug')) {
        //     // eslint-disable-next-line no-console
        //     console.log(error);
        //   }
        // }
  //
  //       args.push(file);
  //       const execOpts = {
  //         stream: 'stderr',
  //         allowEmptyStderr: true,
  //       };
        // return helpers.exec(command, args, execOpts).then(output => {
        //   helpers.parse(output.tostring(), regex));
        // }
        // );
  //     },
  //   };
  // },

};
