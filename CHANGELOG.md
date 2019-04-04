
# Change Log
All notable changes to this project will be documented in this file.

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
