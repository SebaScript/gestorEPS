window.initMap = function() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: 6.2313, lng: -75.6106 }
    });

    let markers = [];
    let currentLocationMarker = null; // Marker for current location

    function setCurrentPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    if (currentLocationMarker) {
                        currentLocationMarker.setMap(null);
                    }

                    currentLocationMarker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        title: "Tu ubicación actual",
                    });

                    map.setCenter(pos);
                },
                () => {
                    manejarErrorDeUbicación(true, map.getCenter(), map);
                }
            );
        } else {
            manejarErrorDeUbicación(false, map.getCenter(), map);
        }
    }

    setCurrentPosition();

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
        "sisben-btn": "sura",
        "nuevaeps-btn": "Nueva EPS",
        "saludtotal-btn": "Salud Total",
        "coomeva-btn": "Coomeva",
        "hospital-btn": "Hospital"
    };

    for (const [id, nombreUbicacion] of Object.entries(ubicaciones)) {
        document.getElementById(id).addEventListener("click", () => {
            input.value = nombreUbicacion;
            const placesService = new google.maps.places.PlacesService(map);
            placesService.textSearch({ query: nombreUbicacion }, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    markers.forEach((marker) => marker.setMap(null));
                    markers = [];

                    const bounds = new google.maps.LatLngBounds();

                    results.forEach((place) => {
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
                }
            });
        });
    }

    const currentLocationButton = document.createElement("button");
    currentLocationButton.textContent = "Mi Ubicación";
    currentLocationButton.className = "custom-map-control-button";
    currentLocationButton.addEventListener("click", setCurrentPosition);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(currentLocationButton);
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
