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

        let outFilePath = "c:\\pov\\teapot\\out\\teapot.png";

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

        let outFilePath = "c:\\pov\\teapot\\out\\teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker --host tcp://127.0.0.1:2375 run -v /c/pov/teapot/:/source -v /c/pov/teapot/out:/output jmaxwilson/povray");
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
        assert.equal(outFilePath, "c:\\pov\\teapot\\output\\teapot.png");
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

        let outFilePath = "c:\\pov\\teapot\\out\\teapot.png";

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

        let outFilePath = "c:\\pov\\teapot\\out\\teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker run -v c:\\pov\\teapot\\:/source -v c:\\pov\\teapot\\out:/output jmaxwilson/povray");
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
        assert.equal(outFilePath, "c:\\pov\\teapot\\output\\teapot.png");
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

        let outFilePath = "c:\\pov\\teapot\\out\\teapot.png";

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

        let outFilePath = "c:\\pov\\teapot\\out\\teapot.png";

        let povrayExe = povrayExtension.buildShellPOVExe(settings, fileInfo, outFilePath, context);
        assert.equal(povrayExe, "docker run -v c:\\pov\\teapot\\:/source -v c:\\pov\\teapot\\out:/output jmaxwilson/povray");
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
        assert.equal(outFilePath, "c:\\pov\\teapot\\output\\teapot.png");
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
        assert.equal(outFilePath, "/pov/teapot/output/teapot.png");
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
        assert.equal(outFilePath, "/pov/teapot/output/teapot.png");
    });

});