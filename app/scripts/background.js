'use strict';

// Tabs service
var tabs = {

    // Snoozed tabs
    snooze: {

        // Necessities
        current: null,

        // Initialize
        init: function init() {

            // Set up a loop to get snoozed tabs
            window.setInterval(tabs.snooze.get, 10000);

            // Create the listener for the evitable sounding alarms
            chrome.alarms.onAlarm.addListener(function (alarm) {

                // Loop through the current snoozed tabs to find the one that matches the alarm name
                angular.forEach(tabs.snooze.current, function (snooze) {
                    if (alarm.name === snooze.alarmName) {
                        tabs.snooze.open(alarm, snooze);
                    }
                });
            });
        },

        // Get snoozed tabs
        get: function get() {

            // Get the currently snoozed tabs from chrome storage
            chrome.storage.sync.get('tmSnoozeCurrentTabs', function (data) {
                if (data.tmSnoozeCurrentTabs.length > 0) {

                    // Set current snoozed tabs
                    tabs.snooze.current = angular.copy(data.tmSnoozeCurrentTabs);

                    // Create the alarms for the snoozed tabs
                    tabs.snooze.alarms.create();
                } else {

                    // Set current snoozed tabs
                    tabs.snooze.current = null;

                    // Set extension badge text to nothing
                    chrome.browserAction.setBadgeText({ text: '' });
                }
            });
        },

        // Open snoozed tab and show notification
        open: function open(alarm, snooze) {

            // Show notification of alarm
            tabs.snooze.notifications.show(alarm, snooze);

            // Open tab by creating new tab with its information
            chrome.tabs.create({ url: snooze.tab.url });

            // Clean up
            tabs.snooze.cleanUp(alarm, snooze);
        },

        // Clean up after opening snoozed tab
        cleanUp: function cleanUp(alarm, snooze) {

            // Clear the alarm
            chrome.alarms.clear(alarm.name);

            // If NOT a periodically snoozed tab
            if ('periodically' !== snooze.type) {

                // Remove the tab from the current list
                tabs.snooze.current.splice(tabs.snooze.current.indexOf(snooze), 1);
            }
            // If a periodically snoozed tab, reset the nextSnoozedToDate
            else {

                    // If periodicallySetting.type is DAILY
                    if ('daily' === snooze.periodicallySetting.type) {

                        // Add one day to the nextSnoozedToDate
                        snooze.nextSnoozedToDate = moment(snooze.nextSnoozedToDate).add(1, 'days').format();
                    }
                    // If periodicallySetting.type is WEEKLY
                    else if ('weekly' === snooze.periodicallySetting.type) {

                            // Necessities
                            var startingDate,
                                futureDate = null;
                            var currentNextSnoozedToDate = moment(snooze.nextSnoozedToDate);

                            // Loop through the daysOfWeek
                            angular.forEach(snooze.periodicallySetting.daysOfWeek, function (dayIndex) {

                                // Set startingDate
                                startingDate = moment(snooze.nextSnoozedToDate).day(dayIndex);

                                // If current date is AFTER the date with that option selected, add 1 week to that date
                                if (moment().diff(startingDate) > 0 && !futureDate) {
                                    futureDate = startingDate.add(1, 'weeks');
                                }
                                // If current date is BEFORE the date with that option selected, then set nextSnoozedToDate
                                else if (moment().diff(startingDate) < 0) {
                                        snooze.nextSnoozedToDate = startingDate.format();
                                    }
                            });

                            // If nextSnoozedToDate has not been set
                            if (currentNextSnoozedToDate.isSame(moment(snooze.nextSnoozedToDate))) {
                                snooze.nextSnoozedToDate = futureDate.format();
                            }
                        }
                        // If periodicallySetting.type is MONTHLY
                        else if ('monthly' === snooze.periodicallySetting.type) {

                                // Add one month to the nextSnoozedToDate
                                snooze.nextSnoozedToDate = moment(snooze.nextSnoozedToDate).add(1, 'months').format();
                            }
                            // If periodicallySetting.type is YEARLY
                            else if ('yearly' === snooze.periodicallySetting.type) {

                                    // Add one year to the nextSnoozedToDate
                                    snooze.nextSnoozedToDate = moment(snooze.nextSnoozedToDate).add(1, 'years').format();
                                }
                }

            // Store the current snoozed tabs list
            var store = { tmSnoozeCurrentTabs: tabs.snooze.current };
            chrome.storage.sync.set(store);

            // Set extension badge text to current snoozed tabs length
            if (tabs.snooze.current.length > 0) {
                chrome.browserAction.setBadgeText({ text: tabs.snooze.current.length.toString() });
            } else {
                chrome.browserAction.setBadgeText({ text: '' });
            }
        },

        // Alarms
        alarms: {

            // Create
            create: function create() {

                // Necessities
                var alarmName = null;
                var alarmParams = {};

                // Loop through each snoozed tab
                angular.forEach(tabs.snooze.current, function (snooze, index) {

                    // Set name
                    alarmName = snooze.type + index.toString() + 'Alarm';
                    snooze.alarmName = alarmName;

                    // Set when param
                    alarmParams.when = moment(snooze.nextSnoozedToDate).valueOf();

                    // Create the alarm for opening the snoozed tab
                    chrome.alarms.create(alarmName, alarmParams);
                });
            }

        },

        // Notifications
        notifications: {

            // Show notification of snoozed tab
            show: function show(alarm, snooze) {

                // Necessities
                var notifName = null;
                var notifOptions = {};

                // Set necessities
                notifName = alarm.name + 'Notif';
                notifOptions = {
                    type: 'basic',
                    priority: 1,
                    title: 'TabMagic',
                    message: snooze.tab.title,
                    contextMessage: 'has been reopened from snooze',
                    iconUrl: chrome.extension.getURL('images/icon-128.png')
                };

                // Create alarm
                chrome.notifications.create(notifName, notifOptions);
            }

        }

    }

};

// Initializes the extension
function init() {

    // Provide extension details to console
    chrome.runtime.onInstalled.addListener(function (details) {
        console.log('TabMagic version', details.previousVersion, 'loaded on', moment().format('dddd, MMMM Do YYYY, h:mm:ss a'));
    });

    // Initialize tabs snooze
    tabs.snooze.init();
}

// Initialize the extension
init();
//# sourceMappingURL=background.js.map
