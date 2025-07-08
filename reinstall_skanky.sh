#!/bin/bash

# Path to your Xcode project
PROJECT_PATH="/Users/ben/Apps/skanky/SkankyReminders/SkankyReminders.xcodeproj"

# Controlled Derived Data Path for cleaner builds
DERIVED_PATH="/tmp/skanky_build"

# Bundle Identifier of your app (used for ios-deploy -id if UDID not found, though UDID is preferred)
BUNDLE_ID="com.jaminjar.SkankyReminders"

# Get the connected device UDID dynamically
# This assumes only one iOS device is connected via USB
DEVICE_ID=$(system_profiler SPUSBDataType | awk '/Serial Number:/{print $3; exit}')

if [ -z "$DEVICE_ID" ]; then
    echo "Error: No iOS device UDID found. Ensure your iPhone is connected via USB, unlocked, and trusted."
    echo "Falling back to using Bundle ID for ios-deploy, which may not work as reliably."
    DEVICE_ID="$BUNDLE_ID"
fi

echo "Cleaning and creating build directory: $DERIVED_PATH"
rm -rf "$DERIVED_PATH"
mkdir -p "$DERIVED_PATH"

echo "Building SkankyReminders app..."
# Clean and build the project for a generic iOS device, using a controlled derived data path
xcodebuild -project "$PROJECT_PATH" \
  -scheme "SkankyReminders" \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -derivedDataPath "$DERIVED_PATH" \
  clean build

if [ $? -ne 0 ]; then
    echo "Xcode build failed. Exiting."
    exit 1
fi

# Define the path to the built .app file using the controlled derived data path
BUILT_APP="$DERIVED_PATH/Build/Products/Release-iphoneos/SkankyReminders.app"

if [ ! -d "$BUILT_APP" ]; then
    echo "Could not find SkankyReminders.app at $BUILT_APP. Please check build logs."
    exit 1
fi

echo "Installing $BUILT_APP to connected iPhone (UDID: $DEVICE_ID)..."
# Install the app using ios-deploy, using the dynamically found UDID
ios-deploy --bundle "$BUILT_APP" --id "$DEVICE_ID" --no-wifi -L

if [ $? -ne 0 ]; then
    echo "ios-deploy failed. Ensure your iPhone is connected, unlocked, and trusted."
    exit 1
fi

echo "SkankyReminders re-installed successfully!"
