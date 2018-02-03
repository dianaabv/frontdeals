DG.then(function() {
    var map;

    map = DG.map('mapSearchProduct', {
        center: [54.98, 82.89],
        zoom: 13
    });

    map.locate({setView: true, watch: true})
        .on('locationfound', function(e) {
            DG.marker([e.latitude, e.longitude]).addTo(map);
        })
        .on('locationerror', function(e) {
            DG.popup()
                .setLatLng(map.getCenter())
                .setContent('Доступ к определению местоположения отключён')
                .openOn(map);
        });
});