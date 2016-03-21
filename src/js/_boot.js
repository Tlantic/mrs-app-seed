(function AppBoot(window, document, navigator, boot) {
    var _TAG = "AppBoot",
        _settings = {
            name: 'App'
        };

    function AppBoot() {
        'use strict';
        
        this.name = _settings.name;
    }
    
    /**
        Application Constructor.
        Just bind events.
    **/
    AppBoot.prototype.init = function() {
        bindEvents();
    }
    
    /**
        Bind Event Listeners.
        Events are from PhoneGap framework.
        @method bindEvents
    **/
    function bindEvents() {
        document.addEventListener('deviceready', onDeviceReady, false);
        document.addEventListener('backbutton', onBackButton, false);
        document.addEventListener('resume', onResume, false);
        //document.addEventListener('load', this.onLoad, false);
        //document.addEventListener('online', this.onOnline, false);
        //document.addEventListener('offline', this.onOffline, false);
        // It this is not an webview, fire deviceready
        if (!window.cordova && !window.PhoneGap && !window.phonegap && !window.forge) {
            onDeviceReady();
        }
    }
    
    /**
        Just print this event...
        @method receivedEvent
        @param {String} id
    **/
    function receivedEvent(id) {
        console.log(_TAG, 'Received Event', id);
    }        
		
    /**
        deviceready Event Handler.
        Setup plugins.
        Boot AJS App.
        @method onDeviceReady
        @param {Function} event
    **/
    function onDeviceReady(event) {
        receivedEvent('deviceready');
        setupApp();
        bootApp();
    }
    /**
        backbutton Event Handler.
        Dispatch a new event to AJS.
        @method onBackButton
        @param {Function} event
    **/
    function onBackButton(event) {
        receivedEvent('backbutton');
        event.preventDefault();
        event.stopPropagation();
        //utils.fireEvent(events.device.backButtonPressed);
    }
    /**
        resume Event Handler.
        Dispatch a new event to AJS.
        @method onResume
    **/
    function onResume() {
        receivedEvent('resume');
        //utils.fireEvent(events.app.resume);
    }

    /**
        Setup and config plugins.
        @method setupPlugins
    **/
    function setupApp() {
        console.log(_TAG, "setup", "starting");

        console.log(_TAG, "setup", "OK");
    }

    /**
        Boot AJS App, using MRS Boot Kernel.
        @method bootAJSApp
    **/
    function bootApp() {
        console.log(_TAG, "boot AJS", "starting");

        var successCallback = function onBootSuccess() {
            console.log(_TAG, "boot AJS", "OK");
        };

        var errorCallback = function onBootError() {
            console.error(_TAG, "boot AJS", "FAIL");
        };

        boot.loadAngApp(_settings.name, "app.conf.json", true, successCallback, errorCallback);

        console.log(_TAG, "boot AJS", "pending");
    }
    
    
    window.app = new AppBoot();
        
}(window, document, window.navigator, window.tlantic.boot));