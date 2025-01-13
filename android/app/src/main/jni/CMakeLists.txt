cmake_minimum_required(VERSION 3.13)
# Define the library name here.
project(salmonwallet_appmodules)
# This file includes all the necessary to let you build your application with the New Architecture.
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

set(REACT_ANDROID_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../../../../node_modules/react-native/ReactAndroid)
set(REACT_ANDROID_BUILD_DIR ${REACT_ANDROID_DIR}/build)
set(REACT_ANDROID_DIR_CONFIG "${REACT_ANDROID_DIR}/cmake-config")

list(APPEND CMAKE_PREFIX_PATH "${REACT_ANDROID_DIR_CONFIG}/cmake-utils")