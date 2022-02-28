
# Change Log
All notable changes to this project will be documented in this file.

## [2.1.0] = 2022-02-??

### Added

- The start of Code Completion (i.e., Intellisense) capabilities to enhance creating scene files. Begin with declared colors from colors.inc if library path is provided.

## [2.0.1] - 2022-02-27

## Changed

- Minor cosmetic change to the Marketplace Extension title to reduce confusion between the two extensions.
- Added a snippet for simple texture/pigment (in addition to the larger texture snippet).

## [2.0.0] - 2022-02-21

### Major

- Forked from: https://github.com/jmaxwilson/vscode-povray 

### Fixed

- Updated extension to handle the backend changes that VSCode made which broke the ability to trigger a render.
- Updated default output path to handle the changes POV-Ray made where it will only write out to certain folders unless you make allowances in a POV-Ray INI file.
- Updated paths-with-spaces handling so that the render can run more predicatably.

### Added

- Extra settings:
  POV-Ray Engine path - Specifiy the path to the POV-Ray executable instead of using environment path info.
  Win32 Only, Win32 Terminal - Specify which terminal is being used, since the autodetection was broken with a VSCode update.

### Removed

- Docker support removed pending further testing.
- Legacy settings values that were scheduled to be retired.

## [0.0.11] - 2019-06-13

## Changed

- Updated the js-yaml package to address potential security vulnerabilities. See: https://github.com/nodeca/js-yaml/pull/480
- Updated the vscode package to keep code up to date
- Reformatting package.json for more standard json format

## [0.0.10] - 2019-05-11

### Fixed

- The extension now properly handles spaces in paths and filenames for most cases. Thanks to Galbi3000 for identifying this bug and helping to fix it. 

    Known Issue: On Windows using **Powershell** as the integrated terminal, if the `outputPath` setting has a path with a space in one of the path names ("`./out put`", "`C:\pov\my scenes\output`"), POV-Ray fails to honor the output path or fails to render. Spaces in path names work properly on all other supported platforms and terminals.

## [0.0.9] - 2019-04-27

### Added

- Feature: Created a new Custom Commandline Options setting. Not every commandline option supported by POV-Ray will have a corresponding setting in VS Code. You can use this setting to append any additional commandline options to POV-Ray when it is called to render the scene.

## [0.0.8] - 2019-04-22

### Added

- Feature: There is now a setting to toggle displaying the image while it is being rendered if the OS platform and version of POV-Ray support displaying images while rendering.

### Changed

- Excluded README images from extension build to significantly decrease the size of the extension package (since the images in the README when it is displayed within VS Code are served from GitHub anyway).

## [0.0.7] - 2019-04-15

### Added

- Feature: Change the output image format POV-Ray will use when rendering scenes. Supports .png, .jpg, .bmp, .tga, .exr, .hdr, .ppm

### Changed

- Refactored to make unit testing easier. Added more unit tests.
- Simplifed title of settings section

### Fixed

- Fixed a bug with the naming of output files when rendering from .ini source files

## [0.0.6] - 2019-04-10

### Added

- Feature: POV-Ray Snippets for common scene elements
- language-configuration.json so that comments hot keys and braces, brackets, etc  matching will work properly.

### Changed

- Slight tweak to syntax hilighting for camera and light_source

### Fixed

- ctrl + / now toggles comments off and on correctly.

## [0.0.5] - 2019-04-04

### Changed

- The output path diectory will now be created if it doesn't already exist

### Fixed

- Fixed bug when the VS Code root directory was different than the source path

## [0.0.4] - 2019-04-03

### Added

- Feature: Run POV-Ray via Docker
  Settings to enable running POV-Ray as a docker container and configuring which docker image to use
- Unit Test & Travis CI integration

### Changed

- Refactored to pull shell command generation into functions that can be unit tested
- Refactored to pass a ShellContext to functions so they can be unit tested for various
  platforms, terminals, and settings regarless of which platform we are actually running on
- Renamed some settings and added code to handle transitioning users who customized renamed
  settings to transition to new settings

### Fixed

- Fixed bugs related to path normalization across different platforms
  
## [0.0.3] - 2019-03-30
 
### Added

- Feature: Open Image After Render
  Settings to toggle automatically opening image when rendering is completed

### Changed

- Significant Refactor to better retrieve and work with settings
- Refactor to move reusable code into helper functions

### Fixed

- Better handling of file paths for different integrated terminals to avoid bugs caused by the differences in slashes in different terminals and on different systems

## [0.0.2] - 2019-03-29
  
### Added

- Better install instructions for Mac, Windows
- Added setting to specify Library Path (required for Mac)
- Working on Mac OS X
  
## [0.0.1] - 2019-03-28
 
### Initial Release

- Syntax Highlighting for Scene Description Language
- Build Task: Render Scene that runs POV-Ray render in the VS Code itegrated terminal
- Title Button to invole Build Task
- Settings to manage default image dimensions and output folder
