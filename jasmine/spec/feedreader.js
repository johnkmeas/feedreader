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