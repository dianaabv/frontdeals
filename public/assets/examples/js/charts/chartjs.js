/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2017 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();
  });

  Chart.defaults.global.responsive = true;


  // Example Chartjs Pie
  // -------------------
  (function() {
    var pieData = {
      labels: [
        "Хлеб",
        "Масло",
        "Молоко",
          "другие товары"
      ],
      datasets: [{
        data: [300, 50, 100, 2000],
        backgroundColor: [
          Config.colors("red", 400),
          Config.colors("green", 400),
          Config.colors("yellow", 400),
            Config.colors("blue", 400)
        ],
        hoverBackgroundColor: [
          Config.colors("red", 600),
          Config.colors("green", 600),
          Config.colors("yellow", 600),
            Config.colors("blue", 600)
        ]
      }]
    };

    var myPie = new Chart(document.getElementById("exampleChartjsPie").getContext("2d"), {
      type: 'pie',
      data: pieData,
      options: {
        responsive: true
      }
    });
  })();
})(document, window, jQuery);
