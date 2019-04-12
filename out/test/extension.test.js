"use strict";
//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const povrayExtension = require("../extension");
suite("VSCode-POVRay extension Tests", function () {
    // Windows WSL Bash Tests
    test("buildShellPOVExe_win32_bash", function () {
        let context = {
            platform: "win32",
            isWindowsBash: true,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";
        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "povray");
    });
    test("buildShellPOVExe_win32_bash_docker", function () {
        let context = {
            platform: "win32",
            isWindowsBash: true,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: true,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";
        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker --host tcp://127.0.0.1:2375 run -v /c/pov/teapot/:/source -v /c/pov/teapot/output:/output jmaxwilson/povray");
    });
    test("buildOutFilePath_win32_bash", function () {
        let context = {
            platform: "win32",
            isWindowsBash: true,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "c:\\pov\\teapot\\output\\teapot.png");
    });
    test("buildRenderOptions_win32_bash", function () {
        let context = {
            platform: "win32",
            isWindowsBash: true,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "c:\\Users\\myuser\\Documents\\POVRay\\include\\",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";
        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=$(wslpath \'c:\\pov\\teapot\\output\\teapot.png\') Library_Path=$(wslpath 'c:\\Users\\myuser\\Documents\\POVRay\\include\\')");
    });
    test("buildRenderOptions_win32_bash_docker", function () {
        let context = {
            platform: "win32",
            isWindowsBash: true,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "c:\\Users\\myuser\\Documents\\POVRay\\include\\",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: true,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";
        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/");
    });
    // Windows Powershell Tests
    test("buildShellPOVExe_win32_powershell", function () {
        let context = {
            platform: "win32",
            isWindowsBash: false,
            isWindowsPowershell: true
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";
        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "pvengine /EXIT /RENDER");
    });
    test("buildShellPOVExe_win32_powershell_docker", function () {
        let context = {
            platform: "win32",
            isWindowsBash: false,
            isWindowsPowershell: true
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: true,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";
        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker run -v c:\\pov\\teapot\\:/source -v c:\\pov\\teapot\\output:/output jmaxwilson/povray");
    });
    test("buildOutFilePath_win32_powershell", function () {
        let context = {
            platform: "win32",
            isWindowsBash: false,
            isWindowsPowershell: true
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "c:\\pov\\teapot\\output\\teapot.png");
    });
    test("buildRenderOptions_win32_powershell", function () {
        let context = {
            platform: "win32",
            isWindowsBash: false,
            isWindowsPowershell: true
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "c:\\Users\\myuser\\Documents\\POVRay\\include\\",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";
        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=c:\\pov\\teapot\\output\\teapot.png\ Library_Path=c:\\Users\\myuser\\Documents\\POVRay\\include\\ | Out-Null");
    });
    test("buildRenderOptions_win32_powershell_docker", function () {
        let context = {
            platform: "win32",
            isWindowsBash: false,
            isWindowsPowershell: true
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "c:\\Users\\myuser\\Documents\\POVRay\\include\\",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: true,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";
        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/");
    });
    // Windows CMD tests
    test("buildShellPOVExe_win32_cmd", function () {
        let context = {
            platform: "win32",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";
        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "pvengine /EXIT /RENDER");
    });
    test("buildShellPOVExe_win32_cmd_docker", function () {
        let context = {
            platform: "win32",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: true,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";
        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker run -v c:\\pov\\teapot\\:/source -v c:\\pov\\teapot\\output:/output jmaxwilson/povray");
    });
    test("buildOutFilePath_win32_cmd", function () {
        let context = {
            platform: "win32",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "c:\\pov\\teapot\\output\\teapot.png");
    });
    test("buildRenderOptions_win32_cmd", function () {
        let context = {
            platform: "win32",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "c:\\Users\\myuser\\Documents\\POVRay\\include\\",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";
        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=c:\\pov\\teapot\\output\\teapot.png\ Library_Path=c:\\Users\\myuser\\Documents\\POVRay\\include\\");
    });
    test("buildRenderOptions_win32_cmd_docker", function () {
        let context = {
            platform: "win32",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "c:\\pov\\teapot\\teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "c:\\pov\\teapot\\"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "c:\\Users\\myuser\\Documents\\POVRay\\include\\",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: true,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";
        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/");
    });
    // Linux Tests
    test("buildShellPOVExe_linux", function () {
        let context = {
            platform: "linux",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "/pov/teapot/teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "/pov/teapot/"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "/pov/teapot/out/teapot.png";
        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "povray");
    });
    test("buildShellPOVExe_linux_docker", function () {
        let context = {
            platform: "linux",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "/pov/teapot/teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "/pov/teapot/"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: true,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "/pov/teapot/out/teapot.png";
        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker run -v /pov/teapot/:/source -v /pov/teapot/out:/output jmaxwilson/povray");
    });
    test("buildOutFilePath_linux", function () {
        let context = {
            platform: "linux",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "/pov/teapot/teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "/pov/teapot/"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "/pov/teapot/output/teapot.png");
    });
    test("buildRenderOptions_linux", function () {
        let context = {
            platform: "linux",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "/pov/teapot/teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "/pov/teapot/"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "/pov/teapot/out/teapot.png";
        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/pov/teapot/out/teapot.png Library_Path=/Users/myuser/Documents/POVRay/include/");
    });
    test("buildRenderOptions_linux_docker", function () {
        let context = {
            platform: "linux",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "/pov/teapot/teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "/pov/teapot/"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: true,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "/pov/teapot/output/teapot.png";
        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/");
    });
    // Mac Tests
    test("buildShellPOVExe_darwin", function () {
        let context = {
            platform: "darwin",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "/pov/teapot/teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "/pov/teapot/"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "/pov/teapot/out/teapot.png";
        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "povray");
    });
    test("buildShellPOVExe_darwin_docker", function () {
        let context = {
            platform: "darwin",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "/pov/teapot/teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "/pov/teapot/"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: true,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "/pov/teapot/output/teapot.png";
        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker run -v /pov/teapot/:/source -v /pov/teapot/output:/output jmaxwilson/povray");
    });
    test("buildOutFilePath_darwin", function () {
        let context = {
            platform: "darwin",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "/pov/teapot/teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "/pov/teapot/"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "/pov/teapot/output/teapot.png");
    });
    test("buildRenderOptions_darwin", function () {
        let context = {
            platform: "darwin",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "/pov/teapot/teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "/pov/teapot/"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "/pov/teapot/out/teapot.png";
        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/pov/teapot/out/teapot.png Library_Path=/Users/myuser/Documents/POVRay/include/");
    });
    test("buildRenderOptions_darwin_docker", function () {
        let context = {
            platform: "darwin",
            isWindowsBash: false,
            isWindowsPowershell: false
        };
        let fileInfo = {
            filePath: "/pov/teapot/teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "/pov/teapot/"
        };
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: true,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outFilePath = "/pov/teapot/out/teapot.png";
        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/");
    });
    test("getOutputFileExtension_png", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".png");
    });
    test("getOutputFileExtension_jpg", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "jpg - JPEG (lossy)"
        };
        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".jpg");
    });
    test("getOutputFileExtension_bmp", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "bmp - Bitmap"
        };
        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".bmp");
    });
    test("getOutputFileExtension_tga", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "tga - Targa-24"
        };
        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".tga");
    });
    test("getOutputFileExtension_tga_compressed", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "tga - Targa-24 (compressed)"
        };
        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".tga");
    });
    test("getOutputFileExtension_exr", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "exr - OpenEXR High Dynamic-Range"
        };
        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".exr");
    });
    test("getOutputFileExtension_hdr", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "hdr - Radiance High Dynamic-Range"
        };
        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".hdr");
    });
    test("getOutputFileExtension_ppm", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "ppm - Portable Pixmap"
        };
        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".ppm");
    });
    test("getOutputFormatOption_png", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "png - Portable Network Graphics"
        };
        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, "");
    });
    test("getOutputFormatOption_jpg", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "jpg - JPEG (lossy)"
        };
        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, " Output_File_Type=J");
    });
    test("getOutputFormatOption_bmp", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "bmp - Bitmap"
        };
        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, " Output_File_Type=B");
    });
    test("getOutputFormatOption_tga", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "tga - Targa-24"
        };
        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, " Output_File_Type=T");
    });
    test("getOutputFormatOption_tga_compressed", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "tga - Targa-24 (compressed)"
        };
        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, " Output_File_Type=C");
    });
    test("getOutputFormatOption_exr", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "exr - OpenEXR High Dynamic-Range"
        };
        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, " Output_File_Type=E");
    });
    test("getOutputFormatOption_hdr", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "hdr - Radiance High Dynamic-Range"
        };
        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, " Output_File_Type=H");
    });
    test("getOutputFormatOption_ppm", function () {
        let settings = {
            outputPath: "./output/",
            defaultRenderWidth: "1024",
            defaultRenderHeight: "768",
            libraryPath: "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender: true,
            openImageAfterRenderInNewColumn: true,
            useDockerToRunPovray: false,
            useDockerImage: "jmaxwilson/povray",
            outputFormat: "ppm - Portable Pixmap"
        };
        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, " Output_File_Type=P");
    });
});
//# sourceMappingURL=extension.test.js.map