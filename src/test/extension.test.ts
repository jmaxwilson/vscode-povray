//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as assert from 'assert';
import * as vscode from 'vscode';
import * as povrayExtension from '../extension';

suite("VSCode-POVRay Extension Unit Tests", function () {

    // buildShellPOVExe() unit tests

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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker --host tcp://127.0.0.1:2375 run -v \"/c/pov/teapot/:/source\" -v \"/c/pov/teapot/output:/output\" jmaxwilson/povray");
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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker run -v 'c:\\pov\\teapot\\:/source' -v 'c:\\pov\\teapot\\output:/output' jmaxwilson/povray");
    });

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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker run -v \"c:\\pov\\teapot\\:/source\" -v \"c:\\pov\\teapot\\output:/output\" jmaxwilson/povray");
    });

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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker run -v \"/pov/teapot/:/source\" -v \"/pov/teapot/out:/output\" jmaxwilson/povray");
    });

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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "/pov/teapot/output/teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker run -v \"/pov/teapot/:/source\" -v \"/pov/teapot/output:/output\" jmaxwilson/povray");
    });

    // buildOutFilePath() unit tests

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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "c:\\pov\\teapot\\output\\teapot.png");
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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "c:\\pov\\teapot\\output\\teapot.png");
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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "c:\\pov\\teapot\\output\\teapot.png");
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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "/pov/teapot/output/teapot.png");
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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = povrayExtension.buildOutFilePath(settings, fileInfo, context);
        assert.equal(outFilePath, "/pov/teapot/output/teapot.png");
    });

    // buildRenderOptions() unit tests

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
            customCommandlineOptions:           "Dither=on",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=$(wslpath \'c:\\pov\\teapot\\output\\teapot.png\') Library_Path=$(wslpath 'c:\\Users\\myuser\\Documents\\POVRay\\include\\') Dither=on");
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
            customCommandlineOptions:           "Dither=on",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/ Dither=on");
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
            customCommandlineOptions:           "Dither=on",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=c:\\pov\\teapot\\output\\teapot.png\ Library_Path=c:\\Users\\myuser\\Documents\\POVRay\\include\\ Dither=on | Out-Null");
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
            customCommandlineOptions:           "Dither=on",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/ Dither=on");
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
            customCommandlineOptions:           "Dither=on",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=c:\\pov\\teapot\\output\\teapot.png\ Library_Path=c:\\Users\\myuser\\Documents\\POVRay\\include\\ Dither=on");
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
            customCommandlineOptions:           "Dither=on",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "c:\\pov\\teapot\\output\\teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/ Dither=on");
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
            customCommandlineOptions:           "Dither=on",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/pov/teapot/out/teapot.png Library_Path=/Users/myuser/Documents/POVRay/include/ Dither=on");
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
            customCommandlineOptions:           "Dither=on",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "/pov/teapot/output/teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/ Dither=on");
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
            customCommandlineOptions:           "Dither=on",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/pov/teapot/out/teapot.png Library_Path=/Users/myuser/Documents/POVRay/include/ Dither=on");
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
            customCommandlineOptions:           "Dither=on",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.buildRenderOptions(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, " ${fileBasename} -D Width=1024 Height=768 Output_File_Name=/output/ Dither=on");
    });

    // getDimensionOptions() unit tests

    test("getDimensonOptions_ext_pov", function() {

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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let povrayExe = povrayExtension.getDimensionOptions(settings, fileInfo);
        assert.equal(povrayExe, " Width=1024 Height=768");
    });

    test("getDimensonOptions_ext_ini", function() {

        let fileInfo = {
            filePath: "/pov/teapot/teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".ini",
            fileDir: "/pov/teapot/"
        };

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "/Users/myuser/Documents/POVRay/include/",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let povrayExe = povrayExtension.getDimensionOptions(settings, fileInfo);
        assert.equal(povrayExe, "");
    });

    test("getDimensonOptions_800_600", function() {

        let fileInfo = {
            filePath: "/pov/teapot/teapot.pov",
            fileName: "teapot.pov",
            fileExt: ".pov",
            fileDir: "/pov/teapot/"
        };

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "800",
            defaultRenderHeight:                "600",
            libraryPath:                        "/Users/myuser/Documents/POVRay/include/",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let povrayExe = povrayExtension.getDimensionOptions(settings, fileInfo);
        assert.equal(povrayExe, " Width=800 Height=600");
    });

    // getOutputPathOption() unit tests

    test("getOutputPathOption_win32_bash", function() {

        let context = {
            platform: "win32",
            isWindowsBash: true,
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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.getOutputPathOption(settings, outFilePath, context);
        assert.equal(povrayExe, " Output_File_Name=$(wslpath \'/pov/teapot/out/teapot.png\')");
    });

    test("getOutputPathOption_docker", function() {

        let context = {
            platform: "win32",
            isWindowsBash: true,
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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               true,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.getOutputPathOption(settings, outFilePath, context);
        assert.equal(povrayExe, " Output_File_Name=/output/");
    });

    test("getOutputPathOption_win32_powershell", function() {

        let context = {
            platform: "win32",
            isWindowsBash: false,
            isWindowsPowershell: true
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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.getOutputPathOption(settings, outFilePath, context);
        assert.equal(povrayExe, " Output_File_Name=/pov/teapot/out/teapot.png");
    });

    test("getOutputPathOption_linux", function() {

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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.getOutputPathOption(settings, outFilePath, context);
        assert.equal(povrayExe, " Output_File_Name=/pov/teapot/out/teapot.png");
    });

    test("getOutputPathOption_darwin", function() {

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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outFilePath = "/pov/teapot/out/teapot.png";

        let povrayExe = povrayExtension.getOutputPathOption(settings, outFilePath, context);
        assert.equal(povrayExe, " Output_File_Name=/pov/teapot/out/teapot.png");
    });

    // getLibraryPathOption() unit tests

    test("getLibraryPathOption_win32_bash", function() {

        let context = {
            platform: "win32",
            isWindowsBash: true,
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
            libraryPath:                        "c:\\Users\\myuser\\Documents\\POVRay\\include\\",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let povrayExe = povrayExtension.getLibraryPathOption(settings, context);
        assert.equal(povrayExe, " Library_Path=$(wslpath 'c:\\Users\\myuser\\Documents\\POVRay\\include\\')");
    });

    test("getLibraryPathOption_win32_powershell", function() {

        let context = {
            platform: "win32",
            isWindowsBash: false,
            isWindowsPowershell: true
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
            libraryPath:                        "c:\\Users\\myuser\\Documents\\POVRay\\include\\",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let povrayExe = povrayExtension.getLibraryPathOption(settings, context);
        assert.equal(povrayExe, " Library_Path=c:\\Users\\myuser\\Documents\\POVRay\\include\\");
    });

    test("getLibraryPathOption_darwin", function() {

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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let povrayExe = povrayExtension.getLibraryPathOption(settings, context);
        assert.equal(povrayExe, " Library_Path=/Users/myuser/Documents/POVRay/include/");
    });

    test("getLibraryPathOption_linux", function() {

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
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let povrayExe = povrayExtension.getLibraryPathOption(settings, context);
        assert.equal(povrayExe, " Library_Path=/Users/myuser/Documents/POVRay/include/");
    });

    // getOutputFileExtension() unit tests

    test("getOutputFileExtension_png", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".png");
    });

    test("getOutputFileExtension_jpg", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "jpg - JPEG (lossy)"
        };

        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".jpg");
    });

    test("getOutputFileExtension_bmp", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "bmp - Bitmap"
        };

        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".bmp");
    });

    test("getOutputFileExtension_tga", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "tga - Targa-24"
        };

        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".tga");
    });

    test("getOutputFileExtension_tga_compressed", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "tga - Targa-24 (compressed)"
        };

        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".tga");
    });

    test("getOutputFileExtension_exr", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "exr - OpenEXR High Dynamic-Range"
        };

        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".exr");
    });

    test("getOutputFileExtension_hdr", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "hdr - Radiance High Dynamic-Range"
        };

        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".hdr");
    });

    test("getOutputFileExtension_ppm", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "ppm - Portable Pixmap"
        };

        let outExt = povrayExtension.getOutputFileExtension(settings);
        assert.equal(outExt, ".ppm");
    });

    // getOutputFormatOption() unit tests

    test("getOutputFormatOption_png", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, "");
    });

    test("getOutputFormatOption_jpg", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "jpg - JPEG (lossy)"
        };

        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, " Output_File_Type=J");
    });

    test("getOutputFormatOption_bmp", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "bmp - Bitmap"
        };

        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, " Output_File_Type=B");
    });

    test("getOutputFormatOption_tga", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "tga - Targa-24"
        };

        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, " Output_File_Type=T");
    });

    test("getOutputFormatOption_tga_compressed", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "tga - Targa-24 (compressed)"
        };

        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, " Output_File_Type=C");
    });

    test("getOutputFormatOption_exr", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "exr - OpenEXR High Dynamic-Range"
        };

        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, " Output_File_Type=E");
    });

    test("getOutputFormatOption_hdr", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "hdr - Radiance High Dynamic-Range"
        };

        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, " Output_File_Type=H");
    });

    test("getOutputFormatOption_ppm", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "ppm - Portable Pixmap"
        };

        let renderOption = povrayExtension.getOutputFormatOption(settings);
        assert.equal(renderOption, " Output_File_Type=P");
    });

    // getOutputFormatOption() unit tests

    test("getCustomCommandlineOptions", function() {

        let settings = {
            outputPath:                         "./output/",
            defaultRenderWidth:                 "1024",
            defaultRenderHeight:                "768",
            libraryPath:                        "",
            customCommandlineOptions:           "Dither=on Quality=5",
            openImageAfterRender:               true,
            openImageAfterRenderInNewColumn:    true,
            useDockerToRunPovray:               false,
            useDockerImage:                     "jmaxwilson/povray",
            outputFormat:                       "png - Portable Network Graphics"
        };

        let customOptions = povrayExtension.getCustomCommandlineOptions(settings);
        assert.equal(customOptions," " + settings.customCommandlineOptions.trim());
    });

});