import { SpeechEvents, SpeechRecognizedEvent, SpeechErrorEvent, SpeechResultsEvent, SpeechStartEvent, SpeechEndEvent, SpeechVolumeChangeEvent } from './VoiceModuleTypes';
declare class RCTVoice {
    _loaded: boolean;
    _listeners: any[] | null;
    _events: Required<SpeechEvents>;
    constructor();
    removeAllListeners(): void;
    destroy(): Promise<unknown>;
    start(locale: any, options?: {}): Promise<unknown>;
    stop(): Promise<unknown>;
    cancel(): Promise<unknown>;
    isAvailable(): Promise<0 | 1>;
    /**
     * (Android) Get a list of the speech recognition engines available on the device
     * */
    getSpeechRecognitionServices(): void | Promise<string[]>;
    isRecognizing(): Promise<0 | 1>;
    set onSpeechStart(fn: (e: SpeechStartEvent) => void);
    set onSpeechRecognized(fn: (e: SpeechRecognizedEvent) => void);
    set onSpeechEnd(fn: (e: SpeechEndEvent) => void);
    set onSpeechError(fn: (e: SpeechErrorEvent) => void);
    set onSpeechResults(fn: (e: SpeechResultsEvent) => void);
    set onSpeechPartialResults(fn: (e: SpeechResultsEvent) => void);
    set onSpeechVolumeChanged(fn: (e: SpeechVolumeChangeEvent) => void);
}
export { SpeechEndEvent, SpeechErrorEvent, SpeechEvents, SpeechStartEvent, SpeechRecognizedEvent, SpeechResultsEvent, SpeechVolumeChangeEvent, };
declare const _default: RCTVoice;
export default _default;
//# sourceMappingURL=index.d.ts.map