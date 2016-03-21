MRS App Google Analytics
=========

MRS App Google Analytics Module

This module helps you to track your pages, events and user behaviours directly on Google Analytics.
You can use it in default mode or custom mode.

How to use
=========

1. Download this package
2. Include in your code in index.html
```JavaScript
		<script type="text/javascript" src="mrs-app-ga.min.js"></script>
```
3. Include angular dependency
```JavaScript
		angular.module("MyApp", ["MRS.App.GoogleAnalytics"]);
```
4. Customize your configuration file
```JavaScript
		angular.module("MRS.App.GoogleAnalytics").constant("$mrsappgoogleanalyticsConfig", {
	    	"trackRoutes": true,
			"accountId": "",
			"trackPrefix": "",
			"pageEvents": ["$routeChangeSuccess", "$stateChangeSuccess"],
			"ecommerce": {
				"active": false,
				"currency": "USD"
				},
			"enhancedLinkAttribution": false,
			"ignoreFirstPageLoad": true,
			"scriptPath": ""
		});
```
5. Init script with basic config
```JavaScript
		app.run(["MRSAppGA",
        function myAppRun($ga) {

            $ga.init({
                "storage": "none", // This is very important for PhoneGap/Cordova Apps!
                "clientId": device.uuid // You can use device.uuid for unique device id
            });	

        }
```
Done!

By default this plugin tracks routeChange (default AngularJS behaviour) and stateChange (router-ui behaviour) and uses page path for page id.

Pages, Events and Dimensions
=========
You can set dimensions that are constant for all pages and events
You must set your page before you use events.


Custom handling
=========

You can handle your events for custom behaviour.
```JavaScript
		app.run(["MRSAppGA",
        function myAppRun($ga) {
			
			// Init script and configuration
			$ga.init({
                "storage": "none",
                "clientId": device.uuid
            });

			// Set your user session id for multi-session tracking
            $ga.set('&uid', $session.userID);

			// Set some dimensions
            $ga.setDimension("dimension1", value1);
            $ga.setDimension("dimension2", value2);

            $rootScope.$on("pageChange", function stateChangeSuccess() {
                
                // Do your stuff here
                // ...

                // Remove or add dimensions
                // ...

                // Change settings
                // ...

                // Set current page if you need custom urls
                $ga.setPage(options.page);

				// Then track event page
                $ga.trackPage();
            });

        });
```