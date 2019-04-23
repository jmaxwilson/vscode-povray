# POV-Ray Extension for Visual Studio Code

[![Build Status](https://travis-ci.org/jmaxwilson/vscode-povray.svg?branch=master)](https://travis-ci.org/jmaxwilson/vscode-povray)

The [Persistence of Vision Raytracer](http://povray.org) is a high-quality, free software tool for creating three-dimensional graphics by using a Scene Description Language.

This extension allows you to use [Visual Studio Code](https://code.visualstudio.com) to edit POV-Ray Scene Description files and render them using POV-Ray in the integrated terminal.

### What's New

#### Version 0.0.8

* There is now a setting to toggle whether to show the image while it is being rendered if the OS platform and version of POV-Ray support showing the image while it is rendering

#### Version 0.0.7
* You can now select the output image format in the settings:  `.png`, `.jpg`, `.bmp`, `.tga`, `.exr`, `.hdr`, `.ppm`

* Fixed a bug with the naming of output files when rendering from `.ini` source files

    [View the Change Log](./CHANGELOG.md)

## Features

* Render the current .pov or .ini scene file by clicking the **POV-Ray render icon** in the editor menu or by using the VS Code build task key combination **`ctrl-shift-b`**.

    ![Animated GIF of POV-Ray in Visual Studio Code](https://raw.githubusercontent.com/jmaxwilson/vscode-povray/master/images/vscode-povray-demo.gif)

* Includes **Syntax Highlighting** and **Snippets** for common POV-Ray scene elements

    ![Animated GIF of POV-Ray Snippets](https://raw.githubusercontent.com/jmaxwilson/vscode-povray/master/images/vscode-povray-snippets-demo.gif)

* Control **output image format** and **output path** through User and Workspace settings

    ![Animated GIF of POV-Ray Output Options](https://raw.githubusercontent.com/jmaxwilson/vscode-povray/master/images/vscode-povray-output-image-format.gif)

* Set **default image dimensions** for rendered images

    ![Screenshot of POV-Ray Default Dimensions Options](https://raw.githubusercontent.com/jmaxwilson/vscode-povray/master/images/vscode-povray-settings-render-dimensions.png)

* Option to open the rendered image when rendering completes.

    ![Screenshot of POV-Ray Post-Render Options](https://raw.githubusercontent.com/jmaxwilson/vscode-povray/master/images/vscode-povray-settings-open-after-render.png)

* Enjoy built in VS Code features like *bracket matching*, *code folding*, and *comment toggling*

    ![Screenshot of VS Code features with POV-Ray scene language](https://raw.githubusercontent.com/jmaxwilson/vscode-povray/master/images/vscode-features.gif)

## Requirements

*This extension does not install POV-Ray*. You can either install it yourself or run it using Docker.

### **Running POV-Ray using Docker**

If you have [Docker](https://www.docker.com/products/docker-desktop) installed, you can easily run POV-Ray on any platform by selecting the **Docker** > **Enable Docker** option in the VS Code POV-Ray settings.

![Screenshot of POV-Ray Docker Options](https://raw.githubusercontent.com/jmaxwilson/vscode-povray/master/images/vscode-povray-settings-docker.png)

By default, the **jmaxwilson/povray:latest** docker image will be used. Additional [povray docker images](https://hub.docker.com/r/jmaxwilson/povray) are available and you can set the image you want to use in the settings.

Note: if you are using WSL Bash as your integrated terminal on Windows, you will need some [addtional setup](https://github.com/jmaxwilson/wsl-docker-git-setup) to make Docker for Windows work with WSL Bash.

### **Installing POV-Ray**

If you are not using Docker, you will need to install POV-Ray for your specific OS and you will need to make sure that it can be run via the commandline from your terminal.

#### Ubuntu Linux

    sudo apt install povray

#### Windows 10 with WSL

For the best experience on Windows, install the [Windows Subsystem for Linux (WSL)](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide) and **Ubuntu for Windows**. Then [configure VS Code](https://code.visualstudio.com/docs/editor/integrated-terminal#_configuration) to use `C:\\Windows\\System32\\bash.exe` as the integrated shell. Once you have WSL and Ubuntu working, you can install the povray package for Ubuntu exactly the same as above.

#### Windows 
Download and run the POV-Ray installer for Windows:

http://www.povray.org/download/

Make sure the full path to `pvengine.exe` is added to your `PATH` Environment Variable so that it can be run from Powershell or the Windows command line.

You may also have to turn off `Script I/O Restrictions` in the POV-Ray Options.

#### Mac

Download the unofficial **Command line POV-Ray 3.7.0 final** for Mac:

http://megapov.inetart.net/povrayunofficial_mac/finalpov.html

Using the terminal, unzip the downloaded file and move the extracted files into `~/povray` :

    unzip PovrayCommandLineMacV2.zip && mv PovrayCommandLineMacV2 ~/povray

Create a `povray` symlink in `/usr/local/bin` to run `Povray37UnofficialMacCmd` :

    ln -s ~/povray/Povray37UnofficialMacCmd /usr/local/bin/povray

Modify the POV-Ray Extension Settings in VS Code to set the Library Path to `~/povray/include`

![Screenshot of POV-Ray Library Path Option](https://raw.githubusercontent.com/jmaxwilson/vscode-povray/master/images/vscode-povray-settings-library-path.png)

## Links

[POV-Ray Official Website](http://povray.org)

[POV-Ray on GitHub](https://github.com/POV-Ray/povray)

[POV-Ray for VS Code Extension on GitHub](https://github.com/jmaxwilson/vscode-povray)

[POV-Ray for VS Code Extension in the VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=jmaxwilson.vscode-povray)

## Attributions

POV-Ray Scene Description Language syntax highlighting adapted from the [atom-language-povray](https://github.com/h-a-n-n-e-s/atom-language-povray) project by 羽洲.

[POV-Ray Logo](https://commons.wikimedia.org/wiki/File:Povray_logo_sphere.png) by SharkD.
