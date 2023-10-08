#!/bin/sh
# This scripts creates an ISO image from a MacOS install app
# Takes about 8 minutes to run 3 minute image create, 5 minute copy

APP_PATH="/Volumes/software/osx/13.4.1-Install macOS Ventura.app"
CREATED_LABEL="Install macOS Ventura"
OUT_PATH="/Volumes/ztmp"
ISO_NAME=ventura13_4_1
VOL_NAME=Ventura

# Create temporary disk image
time hdiutil create -o $OUT_PATH/tmpmacos -size 16G -volname $VOL_NAME -layout SPUD -fs HFS+J -type UDTO -attach

sleep 2

# Create install media
time "$APP_PATH/Contents/Resources/createinstallmedia" --volume /Volumes/$VOL_NAME --nointeraction

sleep 2
# Unmount disk image
hdiutil detach "/Volumes/$CREATED_LABEL"

sleep 1
mv $OUT_PATH/tmpmacos.cdr $OUT_PATH/$ISO_NAME.iso
