/* app.js
 *
 * This is our RSS feed reader application. It uses the Google
 * Feed Reader API to grab RSS feeds as JSON object we can make
 * use of. It also uses the Handlebars templating library and
 * jQuery.
 */

// The names and URLs to all of the feeds we'd like available.
var allFeeds = [
    {
        name: 'Udacity Blog',
        url: 'http://blog.udacity.com/feed'
    }, {
        name: 'CSS Tricks',
        url: 'http://css-tricks.com/feed'
    }, {
        name: 'HTML5 Rocks',
        url: 'http://feeds.feedburner.com/html5rocks'
    }, {
        name: 'Linear Digressions',
        url: 'http://feeds.feedburner.com/udacity-linear-digressions'
    }
];

/* This function starts up our application. The Google Feed
 * Reader API is loaded asynchonously and will then call this
 * function when the API is loaded.
 */
function init() {
    // Load the first feed we've defined (index of 0).
    loadFeed(0);
}

/* This function performs everything necessary to load a
 * feed using the Google Feed Reader API. It will then
 * perform all of the DOM operations required to display
 * feed entries on the page. Feeds are referenced by their
 * index position within the allFeeds array.
 * This function all supports a callback as the second parameter
 * which will be called after everything has run successfully.
 */
 function loadFeed(id, cb) {
     var feedUrl = allFeeds[id].url,
         feedName = allFeeds[id].name;

     $.ajax({
       type: "POST",
       url: 'https://rsstojson.udacity.com/parseFeed',
       data: JSON.stringify({url: feedUrl}),
       contentType:"application/json",
       success: function (result, status){

                 var container = $('.feed'),
                     title = $('.header-title'),
                     entries = result.feed.entries,
                     entriesLen = entries.length,
                     entryTemplate = Handlebars.compile($('.tpl-entry').html());

                 title.html(feedName);   // Set the header text
                 container.empty();      // Empty out all previous entries

                 /* Loop through the entries we just loaded via the Google
                  * Feed Reader API. We'll then parse that entry against the
                  * entryTemplate (created above using Handlebars) and append
                  * the resulting HTML to the list of entries on the page.
                  */
                 entries.forEach(function(entry) {
                     container.append(entryTemplate(entry));
                 });

                 if (cb) {
                     cb();
                 }
               },
       error: function (result, status, err){
                 //run only the callback without attempting to parse result due to error
                 if (cb) {
                     cb();
                 }
               },
       dataType: "json"
     });
 }

/* Google API: Loads the Feed Reader API and defines what function
 * to call when the Feed Reader API is done loading.
 */
google.load('feeds', '1');
google.setOnLoadCallback(init);

/* All of this functionality is heavily reliant upon the DOM, so we
 * place our code in the $() function to ensure it doesn't execute
 * until the DOM is ready.
 */
$(function() {
    var container = $('.feed'),
        feedList = $('.feed-list'),
        feedItemTemplate = Handlebars.compile($('.tpl-feed-list-item').html()),
        feedId = 0,
        menuIcon = $('.menu-icon-link');

    /* Loop through all of our feeds, assigning an id property to
     * each of the feeds based upon its index within the array.
     * Then parse that feed against the feedItemTemplate (created
     * above using Handlebars) and append it to the list of all
     * available feeds within the menu.
     */
    allFeeds.forEach(function(feed) {
        feed.id = feedId;
        feedList.append(feedItemTemplate(feed));

        feedId++;
    });

    /* When a link in our feedList is clicked on, we want to hide
     * the menu, load the feed, and prevent the default action
     * (following the link) from occurring.
     */
    feedList.on('click', 'a', function() {
        var item = $(this);

        $('body').addClass('menu-hidden');
        loadFeed(item.data('id'));
        return false;
    });

    /* When the menu icon is clicked on, we need to toggle a class
     * on the body to perform the hiding/showing of our menu.
     */
    menuIcon.on('click', function() {
        $('body').toggleClass('menu-hidden');
    });
}());

$(function() {

    // This is the first test to check if feeds
    // contains URL and name
    'use strict';
    describe('RSS Feeds', function() {

        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        // Loops through allFeeds array and checks if the url
        // is defined and not empty.
        it('URL defined', function() {
            for(var i = 0; i < allFeeds.length; i++){
                expect(allFeeds[i].url).toBeDefined();
                expect(allFeeds[i].url.length).not.toBe(0);
            }
        });

        // Loops through allFeeds array and checks if the name
        // is defined and not empty.
        it('names defined', function() {
            for(var i = 0; i < allFeeds.length; i++){
                expect(allFeeds[i].name).toBeDefined();
                expect(allFeeds[i].name.length).not.toBe(0);
            }
         });
    });

    // This test suite determines if the menu is working as expected.
    describe('The menu', function() {

        var body = $('body');

        // This spec expects the body element to contain
        // the class 'menu-hidden'.
        // If true than we know that the menu is hidden by default.
        it('menu hidden by default', function() {
            expect(body.hasClass('menu-hidden')).toBeTruthy();
        });

        // This spec will trigger a click
        // on the menu icon and then if the body no longer
        // contains the class 'menu-hidden', than
        // we know that the menu is no longer hidden.
        it('show menu when clicked', function() {
           $('.menu-icon-link').trigger('click');
            expect(body.hasClass('menu-hidden')).toBeFalsy();
        });

        // This spec will follow with a click and
        // than check if the body now contains the
        // class 'menu-hidden'.
        it('hide menu when clicked', function() {
            $('.menu-icon-link').trigger('click');
            expect(body.hasClass('menu-hidden')).toBeTruthy();
        });
    });

    // This test suite determines if there are entry elements
    // present when loadFeed is called.
    describe('Initial Entries', function() {

        // This works asynchronously to load the feed
        // before any specs are run.
        beforeEach(function(done) {
            loadFeed(0, done);
        });

        // This spec will check if there is atleast one
        // entry loaded by seeing if the amount of entries is
        // greater than 0.
        it('loads atleast one entry', function(){
            var entries = $('.feed .entry').length;
            expect(entries).toBeGreaterThan(0);
        });
    });

    // This test suite determines if the different feeds
    // actually load their own unique content.
    describe('New Feed Selection', function() {

        var feed0;
        var feed1;

        // Before we run the specs lets load feed 1 and 2,
        // for each .feed we get the html and assign it to
        // a unique variable that we declared in the outer scope.
        beforeEach(function(done){
            loadFeed(0, function(){
                feed0 = $('.feed').html();
                done();
            });
        });

        beforeEach(function(done){
            loadFeed(1, function(){
                feed1 = $('.feed').html();
                done();
            });             
        });

        // After specs are run we will load the default feed.
        afterAll(function(done) {
            loadFeed(0, done);
        });

        // This spec checks if a second feed will actually
        // load different content than the previous feed.
        // By comparing the 2 feeds we can determine that
        // the second feed truly changes the content
        // if the first feed is not equal to the second feed.
        it('new feed changes content', function(){
            console.log('typeof feed0 ===' + typeof feed0);
            console.log('typeof feed1 ===' + typeof feed1);
            console.log(feed0);
            console.log(feed1);

            expect(feed0).not.toEqual(feed1);
        });
    });
}());