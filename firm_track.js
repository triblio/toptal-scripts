(function(window) {
  function _getNamesFromIds(data) {
    var firmTrackProvider = "custom";

    /*currently there is no click tracking on assets for ga, so get out of here!*/
    if (firmTrackProvider === 'ga' && data.action === 'click') return [];

    var lookup = {
      "personalizations": {},
      "campaigns": {},
      "contentHubs": {},
      "audiences": {}
    };
    if (!lookup || !Object.keys(lookup).length) {
      lookup = {
        personalizations: {},
        contentHubs: {},
        audiences: {},
        campaigns: {}
      };
    }

    var names = [];
    var isTypeBoardAndHasData = data.hubId && lookup.contentHubs[data.hubId];

    if (isTypeBoardAndHasData) {
      if (firmTrackProvider === "ga") {
        names.push({
          metricsLabel: 'TR Content Board',
          name: lookup.contentHubs[data.hubId],
          hitType: 'event'
        });
      }
    } else if (data.type !== "board" && data.personalizationId && data.audienceSegmentId && data.campaignId) {
      var personalizationIds = data.personalizationId.split(",");
      var audienceSegmentIds = data.audienceSegmentId.split(",");
      var campaignIds = data.campaignId.split(",");

      personalizationIds.forEach(function(pId, index) {
        var hasPersonalization = (personalizationIds[index] && lookup.personalizations[personalizationIds[index]]) ? true : false;
        var hasAudience = (audienceSegmentIds[index] && lookup.audiences[audienceSegmentIds[index]]) ? true : false;
        var hasCampaign = (campaignIds[index] && lookup.campaigns[campaignIds[index]]) ? true : false;

        if (hasPersonalization && hasAudience && hasCampaign) {
          if (firmTrackProvider === "ga") {
            names.push({
              metricsLabel: 'TR Personalization',
              name: lookup.personalizations[personalizationIds[index]],
              hitType: 'event'
            });

            names.push({
              metricsLabel: 'TR Campaign',
              name: lookup.campaigns[campaignIds[index]],
              hitType: 'event'
            });

            names.push({
              metricsLabel: 'TR Audience',
              name: lookup.audiences[audienceSegmentIds[index]],
              hitType: 'event'
            });
          } else if (firmTrackProvider === "aa") {
            names.push({
              campaign: lookup.campaigns[campaignIds[index]],
              audience: lookup.audiences[audienceSegmentIds[index]],
              personalization: lookup.personalizations[personalizationIds[index]],
              action: data.action //impression or click
            });
          }
        }
      });
    }
    return names;
  }

  function _postFirmographicData() {
    var data = {
      "name": "Triblio",
      "sicCode": 7372,
      "isIsp": false,
      "employees": "10 to 50",
      "revenue": "$1,000,000 to $5,000,000",
      "country": "United States",
      "domain": "triblio.com",
      "naicCode": 511210,
      "employeesCode": 2,
      "revenueCode": 2,
      "region": "Virginia",
      "subIndustry": "Software Publishers",
      "industry": "Newspaper Publishers"
    };
    console.log('Triblio initiated');
    var count = 0;

    function waitForGA(hadToAppendGAScript) {
      var wait = setInterval(function() {
        var type = typeofGA();
        if (type) {
          checkAndPostToGA(type);
          clearInterval(wait);
        } else if (count > 15 && !hadToAppendGAScript) {
          (function(i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function() {
              (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o), m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
          })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
          count = 0;
          clearInterval(wait);
          waitForGA(true);
        } else if (count > 15 && hadToAppendGAScript) {
          clearInterval(wait);
        }
        count++;
      }, 100);
    }

    function typeofGA() {
      if (typeof ga === 'function') {
        return "ga";
      } else if (typeof __gaTracker === 'function') {
        return "_gaTracker";
      } else return null;
    }

    function checkAndPostToGA(type) {
      var trackingId = "UA-45657726-2";
      if (type === "ga") {
        console.log('ga method found');
        ga(function(tracker) {
          ga('create', trackingId, 'auto', 'triblio');
          console.log(trackingId + ' created');
          ga('triblio.set', 'dimension1', data.name);
          ga('triblio.set', 'dimension2', data.revenue);
          ga('triblio.set', 'dimension3', data.naicCode);
          ga('triblio.set', 'dimension4', data.employees);
          ga('triblio.set', 'dimension5', data.domain);
          ga('triblio.send', 'pageview');
          console.log('data posted for ' + data.name);
          console.log('Triblio finished');
        });
      } else if (type === "_gaTracker") {
        __gaTracker('create', trackingId, 'auto', 'triblio');
        console.log(trackingId + ' created');
        __gaTracker('triblio.set', 'dimension1', data.name);
        __gaTracker('triblio.set', 'dimension2', data.revenue);
        __gaTracker('triblio.set', 'dimension3', data.naicCode);
        __gaTracker('triblio.set', 'dimension4', data.employees);
        __gaTracker('triblio.set', 'dimension5', data.domain);
        __gaTracker('triblio.send', 'pageview');
        console.log('data posted for ' + data.name);
        console.log('Triblio finished');
      }
    }
    waitForGA();
  }

  function _postOrgAssetNames(data) {
    data.forEach(function(d) {
      ga("send", {
        "hitType": d.hitType,
        "eventCategory": d.metricsLabel,
        "eventLabel": d.name
      });
    });

  }

  function postAssetNames(data) {
    if (false) {
      var names = _getNamesFromIds(data);
      _postOrgAssetNames(names);
    }
  }

  function postHeroPersonalizationNames() {
    var analyticsObject = {
      action: "impression",
      campaignId: window.TRPersonalizationConfig.campaignId,
      audienceSegmentId: window.TRPersonalizationConfig.audienceSegmentId,
      personalizationId: window.TRPersonalizationConfig.personalizationId
    };

    postAssetNames(analyticsObject);
  }

  function runFirmTracking(callback) {
    var type = "custom";
    /*this is needed because ga scripts might not be above the firm track script, sometimes ga is in the body too*/
    if (type === "custom") {
      callback();
    } else if (type === "ga") {
      if (typeof ga === "undefined") {
        /*wait for ga to load*/
        setTimeout(function() {
          runFirmTracking(callback);
        }, 5);
      } else callback();
    } else if (type === "aa") {
      if (typeof s_gi === "undefined" || typeof s === "undefined") {
        /*wait for aa to load*/
        setTimeout(function() {
          runFirmTracking(callback);
        }, 5);
      } else callback();
    }
  }

  /*run firm tracking!*/
  runFirmTracking(function() {
    /*if no triblio properties then run, if its not a content board or overlay then run*/
    if (!window.TriblioAnalyticsObject || (!window.TriblioAnalyticsObject.isContentBoard || !window.TriblioAnalyticsObject.isOverlay)) {
      _postFirmographicData();

      if (window.TRPersonalizationConfig && Object.keys(window.TRPersonalizationConfig)) {
        postHeroPersonalizationNames();
      } else {
        /*this is hacky, if the hero personalizations arent on the page yet wait a second and see if they loaded*/
        setTimeout(function() {
          if (window.TRPersonalizationConfig && Object.keys(window.TRPersonalizationConfig)) {
            postHeroPersonalizationNames();
          }
        }, 1000);
      }

      //TODO: we should check if theres a contnt hub, overlay, or cardset on the page before exposing theres funcs
      //maybe we should expose these at all which may make this more difficult.
      if (!window.TriblioAssetNameTracking) window.TriblioAssetNameTracking = {};
      window.TriblioAssetNameTracking.postAssetNames = postAssetNames;
    }
  });
}(window));
