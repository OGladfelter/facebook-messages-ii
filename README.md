# facebook-messages-ii

Code behind http://cultureplot.com/message-times

-----------------

facebook-message-data-prep.ipynb: facebook's data (https://www.facebook.com/help/212802592074644) comes in json files stored in 100-1000s of folders. This notebook pulls and organizes data of interest into a csv

facebook-message-analysis.ipynb: takes csv from previous notebook, subsets data into distinct time periods, counts number of messages sent per minute

----------------------

index.html: the article

css/style.css: styling for article

js/d3-scale-radial.js: d3 library used for radial charts

js/timeline.js: javascript for intro graph

js/timeline-animated.js: javascript for second graph
