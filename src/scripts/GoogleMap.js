window.initMap = function() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: -34.397, lng: 150.644 },
    });

    let markers = [];

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                const userMarker = new google.maps.Marker({
                    position: pos,
                    map: map,
                });

                markers.push(userMarker);
                map.setCenter(pos);
            },
            () => {
                manejarErrorDeUbicación(true, map.getCenter(), map);
            }
        );
    } else {
        manejarErrorDeUbicación(false, map.getCenter(), map);
    }

    const input = document.createElement("input");
    input.id = "pac-input";
    input.className = "controls";
    input.type = "text";
    input.placeholder = "Buscar lugares";

    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }

        markers.forEach((marker) => marker.setMap(null));
        markers = [];

        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
            if (!place.geometry || !place.geometry.location) {
                console.log("El lugar devuelto no contiene geometría");
                return;
            }

            const newMarker = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location,
            });

            markers.push(newMarker);

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    const ubicaciones = {
        sura: "Sura",
        nuevaeps: "Nueva EPS",
        saludtotal: "Salud Total",
        coomeva: "Coomeva",
        hospital: "Hospital"
    };

    for (const [id, nombreUbicacion] of Object.entries(ubicaciones)) {
        document.getElementById(id).addEventListener("click", () => {
            input.value = nombreUbicacion;
            google.maps.event.trigger(searchBox, 'places_changed');
        });
    }
};

function manejarErrorDeUbicación(browserHasGeolocation, pos, map) {
    const infoWindow = new google.maps.InfoWindow({
        position: pos,
        content: browserHasGeolocation
            ? "Error: El servicio de geolocalización falló."
            : "Error: Tu navegador no soporta geolocalización.",
    });
    infoWindow.open(map);
}

const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

console.log('Google API Key:', googleApiKey);

const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initMap&libraries=places`;
script.async = true;
script.defer = true;
script.onerror = () => {
    console.error('Error al cargar el script de Google Maps');
};
document.head.appendChild(script);
