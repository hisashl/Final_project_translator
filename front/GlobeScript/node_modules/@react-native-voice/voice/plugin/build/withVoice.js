"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const pkg = require('@react-native-voice/voice/package.json');
const MICROPHONE = 'Allow $(PRODUCT_NAME) to access the microphone';
const SPEECH_RECOGNITION = 'Allow $(PRODUCT_NAME) to securely recognize user speech';
/**
 * Adds `NSMicrophoneUsageDescription` and `NSSpeechRecognitionUsageDescription` to the `Info.plist`.
 *
 * @param props.speechRecognitionPermission speech recognition message
 * @param props.microphonePermission microphone permission message
 * @returns
 */
const withIosPermissions = (c, { microphonePermission, speechRecognitionPermission } = {}) => {
    return config_plugins_1.withInfoPlist(c, config => {
        if (microphonePermission !== false) {
            config.modResults.NSMicrophoneUsageDescription =
                microphonePermission ||
                    config.modResults.NSMicrophoneUsageDescription ||
                    MICROPHONE;
        }
        if (speechRecognitionPermission !== false) {
            config.modResults.NSSpeechRecognitionUsageDescription =
                speechRecognitionPermission ||
                    config.modResults.NSSpeechRecognitionUsageDescription ||
                    SPEECH_RECOGNITION;
        }
        return config;
    });
};
/**
 * Adds the following to the `AndroidManifest.xml`: `<uses-permission android:name="android.permission.RECORD_AUDIO" />`
 */
const withAndroidPermissions = config => {
    return config_plugins_1.AndroidConfig.Permissions.withPermissions(config, [
        'android.permission.RECORD_AUDIO',
    ]);
};
const withVoice = (config, props = {}) => {
    const _props = props ? props : {};
    config = withIosPermissions(config, _props);
    if (_props.microphonePermission !== false) {
        config = withAndroidPermissions(config);
    }
    return config;
};
exports.default = config_plugins_1.createRunOncePlugin(withVoice, pkg.name, pkg.version);
