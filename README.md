# POV-Ray Extension for Visual Studio Code

The Persistence of Vision Raytracer is a high-quality, free software tool for creating three-dimensional graphics by using a Scene Description Language.

This extension allows you to use Visual Studio Code to edit POV-Ray Scene Description files and render them using POV-Ray in the integrated terminal.

## Features

![Screenshot of POV-Ray in Visual Studio Code](https://raw.githubusercontent.com/jmaxwilson/vscode-povray/master/images/vscode-povray-demo.gif)

* Syntax Highlighting for POV-Ray Scene Description Language

* Render the current .pov or .ini scene file by running POV-Ray in the integrated terminal

* Configuration Settings to control the output folder and image dimensions.

## Requirements

This extension does not install POV-Ray. You will need to install it yourself and make sure that it is accessible from your terminal.

### Install POV-Ray

#### Ubuntu

    sudo apt install povray

#### Windows

Download and run the POV-Ray installer for Windows

http://www.povray.org/download/

Make sure the path to pvengine.exe is added to your PATH Environment Variable so that it can be run from Powershell or the Windows command line.

#### Mac (Experimental)

Download and run the POV-Ray installer for Windows

http://megapov.inetart.net/povrayunofficial_mac/

## Links

[POV-Ray Official Website](http://povray.org)

[POV-Ray on GitHub](https://github.com/POV-Ray/povray)

[POV-Ray for VS Code Extension on GitHub](https://github.com/jmaxwilson/vscode-povray)

[POV-Ray for VS Code Extension in the VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=jmaxwilson.vscode-povray)

## Attributions

POV-Ray Scene Description Language syntax highlighting adapted from the [atom-language-povray](https://github.com/h-a-n-n-e-s/atom-language-povray) project by 羽洲.

[POV-Ray Logo](https://commons.wikimedia.org/wiki/File:Povray_logo_sphere.png) by SharkD.
