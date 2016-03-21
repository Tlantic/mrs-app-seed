MRS.App.Core release notes
==============================================

## v1.1.5
### Fix
* Web-proxy: caches all requests that use ONLINE policy

## v1.1.4
### Features
* Bootstrap: throw an error and show message when bootstrap fail

### Fix
* ServiceHelper: don't need _default endpoint anymore

## v1.1.3
### Fix
* ServiceHelper: default endpoint is no longer needed in ServiceHelper builder
* ServiceHelper: merge default adapter with custom adapter when available

## v1.1.2
* Fix: compilation problem that don't include Helper services.

## v1.1.1
* Fix: v1.1.0 release problems.

## v1.1.0
This version includes a new module MRS.App.Helper, that contains some utilities to build services in AngularJS.

It also fixes some methods in WebProxy.

## Changes
* WebProxy: URL may have @param path to replace by dynamic parameters
* WebProxy: Support for baseUrl when url is not absolute
* WebProxy: Add validation to method and url
* WebProxy: Now support headers in request, to send to server
* Helper: added qservice helper to create services with default convention


## v1.0.0
This release changes the version numeration method to start in 1.

Also, it adds a new module settings for kernel.

### Changes
* Changed version to 1.x.x
* Added settings module to kernel


## v0.6.0
This release includes a new module *kernel* to bootstrap apps.

*Kernel* module is written in pure JavaScript, so it can run without AngularJS.
 
### Changes
* Added banner to minified files
* Code tree changes (core and kernel folder)
* Added default configuration to MRS.App.Core module

### New Features
* Kernel module, available using window.tlantic

## v0.5.0
This release introduces strategic changes to MRS.App products and some improvments.

### Breaking changes
* Rename MRS.Core package to MRS.App.Core

## v0.4.3
This release contains some fixes and framework udpates for development.

## v0.4.2
This release contains some fixes and framework udpates for development.

### Breaking changes
* Unknown

### Fixed issues
* problem when cancelling requests: [#28](https://github.com/Tlantic/TlanJS/pull/28)

### New Features / Improvements
Some frameworks were updated. Please check the list below:
* karma-chrome-launcher: updated from 0.1.3 to 0.1.4;
* phantomjs: updated from 1.9.7-6 to 1.9.7-8

## v0.4.1
This release contains some improvements regarding Webproxy service and several "deprecate" services removal. If your application uses loggerDispatcher, PhonegapBridge, JobScheduler or liveCacheBinder, please move those services to your aplication because they were discontinued from TlanJS plans. Looking forwared, the intention is to implement similar services to provide some of those features in an optmized way, after considering the mobile world perspective properly.

### Breaking changes
* logger dispatcher has been removed: [#19](https://github.com/Tlantic/TlanJS/issues/19)
* phonegap bridge has been removed: [#20](https://github.com/Tlantic/TlanJS/issues/20)
* job scheduler has been removed: [#21](https://github.com/Tlantic/TlanJS/21)
* live cache binder was removed: [#23](https://github.com/Tlantic/TlanJS/issues/23)

### Fixed issues
* Stack dependencies update: Ready for NodeJS 0.10.28, and all dependencies has been updated. Please check package.json and issue [#17](https://github.com/Tlantic/TlanJS/issues/17)

### New features / Improvements
* Webproxy request canceller: [@fde10f0b](https://github.com/Tlantic/TlanJS/commit/fde10f0b0e392222c5afa5e0f0f9abd358536fb7, [#18](https://github.com/Tlantic/TlanJS/pull/18) and [#16](https://github.com/Tlantic/TlanJS/issues/16)