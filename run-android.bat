@echo off
rem Windows helper to run the Android build using npm.cmd
cd /d %~dp0
echo Running Android build via npm.cmd...
npm.cmd run android
