# bHaptics Firebot Script

This script allows Firebot to trigger the bHaptics gear.

### What is bHaptics?
bHaptics is a set of tactile suit with vibro-tactile motors and has lag-free wireless connectivity to bring the best possible haptics experience. This includes a vest (both 16 and 40), gloves, arm, feed, and face (for VR).

### Script SDK
This script uses a modified version of tact-js (bHaptics TypeScript/Javascript SDK; https://github.com/bhaptics/tact-js/tree/main). The modifications were nessary to work well with Firebot and allow remote connection.

### Status
The basic function of the script are working, but there are still some functions that are still being worked on. See below:

| Status | Item |
| --- | --- |
| :heavy_check_mark: | Register TACT File (File or RAW) |
| :heavy_check_mark: | Submit Registrated Key |
| :heavy_check_mark: | Submit Scaled Registrated Key |
| :heavy_check_mark: | Submit Rotation Registrated Key |
| :x: | Submit Dot |
| :x: | Submit Path |
| :heavy_check_mark: | Stop Active Registrated |
| :heavy_check_mark: | Stop All Active |
| :heavy_check_mark: | Connection Event |
| :heavy_check_mark: | Disconnect Event |
| :x: | Position Connection Event |
| :heavy_check_mark: | Submitted Registration Event |
| :x: | Active Registration Event |

Items with :x: are still being worked on and future features might be added (within the limits of Firebot, bHaptics API, and the Equipement). I have reached out to bHaptics about an API guide as there is currently no way to remove a registered keys. Currently, restarting Firebot or bHaptics Player will reset all registered items.

Head over to the Wiki for more information about how to use this Firebot Script. Please Report any issues.

# Compile

### Setup
1. Pull down a copy of the Repo
2. `npm install`

### Building
1. `npm run build`
2. Copy .js from `/dist`