import { Observable, Frame } from '@nativescript/core';

export class BaseViewModel extends Observable {
    onGoHome() {
        Frame.topmost().navigate({
            moduleName: 'views/home/home-page',
            clearHistory: true,
            transition: {
                name: 'fade',
                duration: 200
            }
        });
    }
}