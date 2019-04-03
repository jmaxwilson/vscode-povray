//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as assert from 'assert';
import * as vscode from 'vscode';
import * as povrayExtension from '../extension';

suite("VSCode-POVRay extension Tests", function () {

    // Windows WSL Bash Tests
    test("buildShellPOVExe_win32_bash", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "povray");
    });

    test("buildShellPOVExe_win32_bash_docker", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker --host tcp://127.0.0.1:2375 run -v /c/pov/teapot/:/source -v /c/pov/teapot/output:/output jmaxwilson/povray");
    });

    test("buildOutFilePath_win32_bash", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "c:\\pov\\teapot\\.\\output\\teapot.png");
    });

    test("buildRenderOptions_win32_bash", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "c:\\Users\\myuser\\Documents\\POVRay\\include\\",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=$(wslpath \'c:\\pov\\teapot\\output\\teapot.png\') Library_Path=$(wslpath 'c:\\Users\\myuser\\Documents\\POVRay\\include\\')");
    });

    test("buildRenderOptions_win32_bash_docker", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "c:\\Users\\myuser\\Documents\\POVRay\\include\\",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/");
    });

    // Windows Powershell Tests
    test("buildShellPOVExe_win32_powershell", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "pvengine /EXIT /RENDER");
    });

    test("buildShellPOVExe_win32_powershell_docker", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker run -v c:\\pov\\teapot\\:/source -v c:\\pov\\teapot\\output:/output jmaxwilson/povray");
    });

    test("buildOutFilePath_win32_powershell", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "c:\\pov\\teapot\\.\\output\\teapot.png");
    });

    test("buildRenderOptions_win32_powershell", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "c:\\Users\\myuser\\Documents\\POVRay\\include\\",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=c:\\pov\\teapot\\output\\teapot.png\ Library_Path=c:\\Users\\myuser\\Documents\\POVRay\\include\\ | Out-Null");
    });

    test("buildRenderOptions_win32_powershell_docker", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "c:\\Users\\myuser\\Documents\\POVRay\\include\\",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/");
    });

    // Windows CMD tests
    test("buildShellPOVExe_win32_cmd", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "pvengine /EXIT /RENDER");
    });

    test("buildShellPOVExe_win32_cmd_docker", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker run -v c:\\pov\\teapot\\:/source -v c:\\pov\\teapot\\output:/output jmaxwilson/povray");
    });

    test("buildOutFilePath_win32_cmd", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "c:\\pov\\teapot\\.\\output\\teapot.png");
    });

    test("buildRenderOptions_win32_cmd", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "c:\\Users\\myuser\\Documents\\POVRay\\include\\",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=c:\\pov\\teapot\\output\\teapot.png\ Library_Path=c:\\Users\\myuser\\Documents\\POVRay\\include\\");
    });

    test("buildRenderOptions_win32_cmd_docker", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "c:\\Users\\myuser\\Documents\\POVRay\\include\\",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/");
    });

    // Linux Tests
    test("buildShellPOVExe_linux", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "povray");
    });

    test("buildShellPOVExe_linux_docker", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker run -v /pov/teapot/:/source -v /pov/teapot/out:/output jmaxwilson/povray");
    });

    test("buildOutFilePath_linux", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "/pov/teapot/./output/teapot.png");
    });

    test("buildRenderOptions_linux", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/pov/teapot/out/teapot.png Library_Path=/Users/myuser/Documents/POVRay/include/");
    });

    test("buildRenderOptions_linux_docker", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/");
    });

    // Mac Tests
    test("buildShellPOVExe_darwin", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "povray");
    });

    test("buildShellPOVExe_darwin_docker", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker run -v /pov/teapot/:/source -v /pov/teapot/out:/output jmaxwilson/povray");
    });

    test("buildOutFilePath_darwin", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "/pov/teapot/./output/teapot.png");
    });

    test("buildRenderOptions_darwin", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/pov/teapot/out/teapot.png Library_Path=/Users/myuser/Documents/POVRay/include/");
    });

    test("buildRenderOptions_darwin_docker", function() {

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
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "/Users/myuser/Documents/POVRay/include/",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/");
    });

});