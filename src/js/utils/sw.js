import adderall from "cache.adderall";
import { CACHE_NAME, IMMUTABLE_FILES, MUTABLE_FILES } from "../utils/constants";


function enabled_service_worker(self) {

    // Cache resources
    self.addEventListener("install", event => {
        event.waitUntil(
            caches.open(CACHE_NAME).then(cache =>
                adderall.addAll(cache, IMMUTABLE_FILES, MUTABLE_FILES)
            )
        );
    });
    
    // Respond with cached resources
    self.addEventListener('fetch', function(event) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return cache.match(event.request).then(function (response) {
                    return response || fetch(event.request).then(function(response) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
    });
}

module.exports = {
    enabled_service_worker: enabled_service_worker
};