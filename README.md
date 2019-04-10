# POV-Ray Extension for Visual Studio Code

[![Build Status](https://travis-ci.org/jmaxwilson/vscode-povray.svg?branch=master)](https://travis-ci.org/jmaxwilson/vscode-povray)

The Persistence of Vision Raytracer is a high-quality, free software tool for creating three-dimensional graphics by using a Scene Description Language.

This extension allows you to use Visual Studio Code to edit POV-Ray Scene Description files and render them using POV-Ray in the integrated terminal.

## Features

![Screenshot of POV-Ray in Visual Studio Code](https://raw.githubusercontent.com/jmaxwilson/vscode-povray/master/images/vscode-povray-demo.gif)

* Syntax Highlighting for POV-Ray Scene Description Language

* Render the current .pov or .ini scene file by running POV-Ray in the integrated terminal

* Configuration Settings to control the output folder and image dimensions.

* Settings to toggle automatically opening the image when rendering is complete

* **NEW**: Snippets for common scene elements

[View the Change Log](./CHANGELOG.md)

## Requirements

This extension does not install POV-Ray. You can either install it yourself or run it using Docker.

## Running POV-Ray using Docker

If you have [Docker](https://www.docker.com/products/docker-desktop) installed, you can easily run POV-Ray on any platform by selecting the **Docker** > **Enable Docker** option in the VS Code POV-Ray settings.

By default, the **jmaxwilson/povray:latest** docker image will be used. Additional [povray docker images](https://hub.docker.com/r/jmaxwilson/povray) are available and you can set the image you want to use in the settings.

Note: if you are using WSL Bash as your integrated terminal on Windows, you will need some [addtional setup](https://github.com/jmaxwilson/wsl-docker-git-setup) to make Docker for Windows work with WSL Bash.

## Installing POV-Ray

If you are not using Docker, you will need to install POV-Ray for your specific OS and you will need to make sure that it can be run via the commandline from your terminal.

#### Ubuntu Linux

    sudo apt install povray

#### Windows 10 with WSL

For the best experience on Windows, install the [Windows Subsystem for Linux (WSL)](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide) and **Ubuntu for Windows**. Then [configure VS Code](https://code.visualstudio.com/docs/editor/integrated-terminal#_configuration) to use `C:\\Windows\\System32\\bash.exe` as the integrated shell. Once you have WSL and Ubuntu working, you can install the povray package for Ubuntu exactly the same as above.

#### Windows 
Download and run the POV-Ray installer for Windows:

http://www.povray.org/download/

Make sure the full path to `pvengine.exe` is added to your `PATH` Environment Variable so that it can be run from Powershell or the Windows command line.

#### Mac

Download the unofficial **Command line POV-Ray 3.7.0 final** for Mac:

http://megapov.inetart.net/povrayunofficial_mac/finalpov.html

Using the terminal, unzip the downloaded file and move the extracted files into `~/povray` :

    unzip PovrayCommandLineMacV2.zip && mv PovrayCommandLineMacV2 ~/povray

Create a `povray` symlink in `/usr/local/bin` to run `Povray37UnofficialMacCmd` :

    ln -s ~/povray/Povray37UnofficialMacCmd /usr/local/bin/povray

Modify the POV-Ray Extension Settings in VS Code to set the Library Path to `~/povray/include`

## Links

[POV-Ray Official Website](http://povray.org)

[POV-Ray on GitHub](https://github.com/POV-Ray/povray)

[POV-Ray for VS Code Extension on GitHub](https://github.com/jmaxwilson/vscode-povray)

[POV-Ray for VS Code Extension in the VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=jmaxwilson.vscode-povray)

## Attributions

POV-Ray Scene Description Language syntax highlighting adapted from the [atom-language-povray](https://github.com/h-a-n-n-e-s/atom-language-povray) project by 羽洲.

[POV-Ray Logo](https://commons.wikimedia.org/wiki/File:Povray_logo_sphere.png) by SharkD.
